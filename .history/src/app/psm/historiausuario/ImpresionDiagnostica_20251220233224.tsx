"use client";

import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import SearchableSelect from "@/components/form/SearchableSelect";
import { ImpresionDiagnostica } from "@/interfaces/historiaClinica/ImpresionDiagnostica";
import { useImpresionDiagnostica, useTipoImpresionDiagnosticoC11, useTipoImpresionDiagnosticoD5 } from "@/hooks/historaClinica/useImpresionDiagnostica";

export default function ImpresionDiagnostica({
  onChange,
  disabled = false,
}: { hcId: number; onChange?: (data: ImpresionDiagnostica) => void; disabled?: boolean }) {
  const { getItem, createItem } = useImpresionDiagnostica();
  const { items: diagnosticosCIE11 } = useTipoImpresionDiagnosticoC11();
  const { items: diagnosticosDSM5 } = useTipoImpresionDiagnosticoD5();

  const [formData, setFormData] = useState<ImpresionDiagnostica>({
    id: 0,
    hcId: hcId,
    diagnosticoPrincipalCie11: { id: 0, nombre: "", codigo: "", description: "" },
    diagnosticoPrincipalDsm5: { id: 0, nombre: "", codigo: "", description: "" },
    factoresPredisponentes: "",
    factoresPrecipiantes: "",
    factoresMantenedores: "",
    nivelFuncionamiento: 50,
  });

  const [impresionExistente, setImpresionExistente] = useState<ImpresionDiagnostica | null>(null);
  const [loading, setLoading] = useState(true);

  
    // Obtener el id de la historia clínica (ajusta la clave si es diferente)
  const hcId = typeof window !== "undefined" ? localStorage.getItem("HistoriClinica") : null;


seEffect(() => {
    if (!hcId) return setLoading(false);
    getItem(hcId)
      .then((data) => {
        if (data && data.id && data.id !== 0) {
          setImpresionExistente(data);
          setFormData({ ...data });
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hcId]);
  // Notificar cambios al padre
  useEffect(() => {
    if (onChange) onChange(formData);
  }, [formData, onChange]);

  const handleInputChange = <K extends keyof ImpresionDiagnostica>(
    field: K,
    value: ImpresionDiagnostica[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      hcId: hcId, // Siempre actualiza hcId
    }));
  };

  const getNivelFuncionamientoLabel = (nivel: number): string => {
    if (nivel >= 81) return "Funcionamiento Excelente";
    if (nivel >= 61) return "Funcionamiento Bueno";
    if (nivel >= 41) return "Funcionamiento Moderado";
    if (nivel >= 21) return "Funcionamiento Bajo";
    return "Funcionamiento Muy Bajo";
  };

  const getNivelFuncionamientoColor = (nivel: number): string => {
    if (nivel >= 81) return "text-green-600 dark:text-green-400";
    if (nivel >= 61) return "text-blue-600 dark:text-blue-400";
    if (nivel >= 41) return "text-yellow-600 dark:text-yellow-400";
    if (nivel >= 21) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };


   const handleGuardar = async () => {
      try {
        if (!hcId) throw new Error("No se encontró el id de la historia clínica");
        const payload: ImpresionDiagnostica = {
          ...formData,
          hcId: Number(hcId),
        };
        await createItem(payload);
        alert("Información guardada correctamente");
        setImpresionExistente(payload);
      } catch (error) {
        alert("Error al guardar la información");
      }
    };

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Impresión Diagnóstica
      </h2>

      {isReadOnly && (
        <div className="mb-4 p-3 text-sm bg-yellow-100 rounded">
          Modo solo lectura: impresión diagnóstica ya registrada
        </div>
      )}

      <div className="space-y-6">
        {/* Diagnóstico Principal (CIE-11) */}
        <div>
          <Label htmlFor="diagnosticoPrincipalCie11">
            Diagnóstico Principal (CIE-11)
            <span className="text-error-500">*</span>
          </Label>
          <SearchableSelect
            options={diagnosticosCIE11?.map((d) => ({
              value: d.id,
              label: `${d.codigo} - ${d.nombre}`,
            })) || []}
            placeholder="Buscar diagnóstico CIE-11"
            onChange={(id) => {
              const diag = diagnosticosCIE11?.find((d) => d.id === id);
              handleInputChange("diagnosticoPrincipalCie11", diag || { id: 0, nombre: "", codigo: "", description: "" });
            }}
            value={formData.diagnosticoPrincipalCie11.id}
            disabled={isReadOnly}
            searchPlaceholder="Buscar por código o nombre..."
            className="max-w-full"
          />
        </div>

        {/* Diagnóstico Principal (DSM-5) */}
        <div>
          <Label htmlFor="diagnosticoPrincipalDsm5">
            Diagnóstico Principal (DSM-5)
          </Label>
          <SearchableSelect
            options={diagnosticosDSM5?.map((d) => ({
              value: d.id,
              label: `${d.codigo} - ${d.nombre}`,
            })) || []}
            placeholder="Buscar diagnóstico DSM-5"
            onChange={(id) => {
              const diag = diagnosticosDSM5?.find((d) => d.id === id);
              handleInputChange("diagnosticoPrincipalDsm5", diag || { id: 0, nombre: "", codigo: "", description: "" });
            }}
            value={formData.diagnosticoPrincipalDsm5.id}
            disabled={isReadOnly}
            searchPlaceholder="Buscar por código o nombre..."
            className="max-w-full"
          />
        </div>

        {/* Factores Predisponentes */}
        <div>
          <Label htmlFor="factoresPredisponentes">
            Factores Predisponentes
          </Label>
          <TextArea
            id="factoresPredisponentes"
            name="factoresPredisponentes"
            placeholder="Describa los factores predisponentes"
            value={formData.factoresPredisponentes}
            onChange={(v) =>
              handleInputChange("factoresPredisponentes", v)
            }
            disabled={isReadOnly}
            className="max-w-full"
            rows={4}
          />
        </div>

        {/* Factores Precipiantes */}
        <div>
          <Label htmlFor="factoresPrecipiantes">
            Factores Precipiantes
          </Label>
          <TextArea
            id="factoresPrecipiantes"
            name="factoresPrecipiantes"
            placeholder="Describa los factores precipiantes"
            value={formData.factoresPrecipiantes}
            onChange={(v) =>
              handleInputChange("factoresPrecipiantes", v)
            }
            disabled={isReadOnly}
            className="max-w-full"
            rows={4}
          />
        </div>

        {/* Factores Mantenedores */}
        <div>
          <Label htmlFor="factoresMantenedores">
            Factores Mantenedores
          </Label>
          <TextArea
            id="factoresMantenedores"
            name="factoresMantenedores"
            placeholder="Describa los factores mantenedores"
            value={formData.factoresMantenedores}
            onChange={(v) =>
              handleInputChange("factoresMantenedores", v)
            }
            disabled={isReadOnly}
            className="max-w-full"
            rows={4}
          />
        </div>

        {/* Nivel de Funcionamiento */}
        <div>
          <Label htmlFor="nivelFuncionamiento">
            Nivel de Funcionamiento Global
            <span className="text-error-500">*</span>
          </Label>
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                0% - Muy Bajo
              </span>
              <span
                className={`text-2xl font-bold ${getNivelFuncionamientoColor(
                  formData.nivelFuncionamiento
                )}`}
              >
                {formData.nivelFuncionamiento}%
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                100% - Excelente
              </span>
            </div>

            <input
              type="range"
              id="nivelFuncionamiento"
              min="0"
              max="100"
              step="1"
              value={formData.nivelFuncionamiento}
              onChange={(e) =>
                handleInputChange(
                  "nivelFuncionamiento",
                  parseInt(e.target.value)
                )
              }
              disabled={isReadOnly}
              className="h-3 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
              style={{
                background: `linear-gradient(to right, 
                  #ef4444 0%, 
                  #f97316 20%, 
                  #eab308 40%, 
                  #3b82f6 60%, 
                  #22c55e 80%, 
                  #22c55e 100%)`,
              }}
            />

            <div className="mt-3 rounded-lg border border-gray-300 bg-white p-3 text-center dark:border-gray-600 dark:bg-gray-800">
              <p
                className={`text-lg font-semibold ${getNivelFuncionamientoColor(
                  formData.nivelFuncionamiento
                )}`}
              >
                {getNivelFuncionamientoLabel(formData.nivelFuncionamiento)}
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>Guía de Evaluación:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-xs text-blue-700 dark:text-blue-400">
              <li>• 81-100: Funcionamiento superior, sin síntomas</li>
              <li>• 61-80: Algunos síntomas leves, buen funcionamiento general</li>
              <li>• 41-60: Síntomas moderados o dificultades moderadas</li>
              <li>• 21-40: Síntomas graves o deterioro importante</li>
              <li>• 0-20: Incapacidad persistente o peligro grave</li>
            </ul>
          </div>
        </div>

        {/* Botón Guardar solo si no existe registro */}
        {!isReadOnly && (
          <div>
            <button
              type="button"
              className="mt-4 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              onClick={handleGuardar}
              disabled={loading}
            >
              Guardar
            </button>
          </div>
        )}

        {/* Resumen Diagnóstico */}
        {formData.diagnosticoPrincipalCie11?.id !== 0 && (
          <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950">
            <h3 className="mb-3 text-sm font-semibold text-purple-800 dark:text-purple-300">
              Resumen Diagnóstico
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-purple-700 dark:text-purple-400">
                  Diagnóstico Principal:{" "}
                </span>
                <span className="text-purple-900 dark:text-purple-200">
                  {diagnosticosCIE11?.find(
                    (d) => d.id === formData.diagnosticoPrincipalCie11.id
                  )?.label ||
                    `${formData.diagnosticoPrincipalCie11.codigo} - ${formData.diagnosticoPrincipalCie11.nombre}`}
                </span>
              </div>
              {formData.diagnosticoPrincipalDsm5?.id !== 0 && (
                <div>
                  <span className="font-medium text-purple-700 dark:text-purple-400">
                    Diagnóstico DSM-5:{" "}
                  </span>
                  <span className="text-purple-900 dark:text-purple-200">
                    {diagnosticosDSM5?.find(
                      (d) => d.id === formData.diagnosticoPrincipalDsm5.id
                    )?.label ||
                      `${formData.diagnosticoPrincipalDsm5.codigo} - ${formData.diagnosticoPrincipalDsm5.nombre}`}
                  </span>
                </div>
              )}
              <div>
                <span className="font-medium text-purple-700 dark:text-purple-400">
                  Nivel de Funcionamiento:{" "}
                </span>
                <span
                  className={`font-semibold ${getNivelFuncionamientoColor(
                    formData.nivelFuncionamiento
                  )}`}
                >
                  {formData.nivelFuncionamiento}% -{" "}
                  {getNivelFuncionamientoLabel(formData.nivelFuncionamiento)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}