"use client";

import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import SearchableSelect from "@/components/form/SearchableSelect";
import { useImpresionDiagnostica, useTipoImpresionDiagnosticoC11, useTipoImpresionDiagnosticoD5 } from "../../../hooks/historaClinica/useImpresionDiagnostica";
import type { ImpresionDiagnostica } from "@/interfaces/historiaClinica/ImpresionDiagnostica";


// Devuelve una clase de color según el nivel de funcionamiento
function getNivelFuncionamientoColor(nivel: number) {
  if (nivel >= 4) return "text-green-600";
  if (nivel === 3) return "text-yellow-600";
  if (nivel > 0) return "text-red-600";
  return "";
}

export default function ImpresionDiagnostica(props: ImpresionDiagnosticaProps) {
  // Obtener hcId de localStorage
  const hcId = typeof window !== "undefined" ? localStorage.getItem("HistoriClinica") : null;
  // Hooks para API
  const { getItem, createItem } = useImpresionDiagnostica();
  // Estado para saber si ya existen datos y para bloquear el formulario
  const [diagnosticoExistente, setDiagnosticoExistente] = useState<ImpresionDiagnostica | null>(null);
  const [loadingConsulta, setLoadingConsulta] = useState(true);

  // Consulta si existe registro al montar
  useEffect(() => {
    if (!hcId) {
      setLoadingConsulta(false);
      return;
    }
    getItem(hcId)
      .then((data) => {
        if (data && data.id && data.id !== 0) {
          setDiagnosticoExistente(data);
        }
      })
      .finally(() => setLoadingConsulta(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hcId]);
  // Hook y mapeo de diagnósticos CIE-11
  const { items: tiposCIE11 = [] } = useTipoImpresionDiagnosticoC11();
  const diagnosticosCIE11 = tiposCIE11.map((item: any) => ({
    value: item.id,
    label: `${item.codigo} - ${item.nombre}`,
  }));

  // Hook y mapeo de diagnósticos DSM-5 (DM11)
  const { items: tiposDM11 = [] } = useTipoImpresionDiagnosticoD5();
  const diagnosticosDM11 = tiposDM11.map((item: any) => ({
    value: item.id,
    label: `${item.codigo} - ${item.nombre}`,
  }));

  // Extraer props con valores por defecto
  const {
    diagnosticoPrincipal = "",
    descripcionDiagnostico = "",
    diagnosticoSecundario = "",
    factoresPredisponentes = "",
    factoresPrecipitantes = "",
    factoresMantenedores = "",
    nivelFuncionamiento = 50,
    onChange,
    disabled = false,
  } = props;
  const [formData, setFormData] = useState<ImpresionDiagnosticaData>({
    diagnosticoPrincipal,
    descripcionDiagnostico,
    diagnosticoSecundario,
    factoresPredisponentes,
    factoresPrecipitantes,
    factoresMantenedores,
    nivelFuncionamiento,
  });

  const [diagnosticoManual, setDiagnosticoManual] = useState("");
  const [usarDiagnosticoManual, setUsarDiagnosticoManual] = useState(false);

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleInputChange = (
    field: keyof ImpresionDiagnosticaData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getNivelFuncionamientoLabel = (nivel: number): string => {
    if (nivel >= 81) return "Funcionamiento Excelente";
    if (nivel >= 61) return "Funcionamiento Bueno";
            <SearchableSelect
              options={diagnosticosCIE11}
              placeholder="Buscar diagnóstico CIE-11"
              onChange={(value) => {
                const selected = diagnosticosCIE11.find((d) => d.value === value);
                handleInputChange("diagnosticoPrincipal", selected ? { id: selected.value, label: selected.label } : value);
                setUsarDiagnosticoManual(value === "OTRO");
              }}
              value={typeof formData.diagnosticoPrincipal === "object" ? formData.diagnosticoPrincipal.id : formData.diagnosticoPrincipal}
              searchPlaceholder="Buscar por código o nombre..."
              className="max-w-full"
            />
  };


  // Si está cargando la consulta, muestra un loader
  if (loadingConsulta) {
    return <div className="p-6">Cargando...</div>;
  }



  // Función para guardar la información
  const handleGuardar = async () => {
    if (!hcId) {
      alert("No se encontró el id de la historia clínica");
      return;
    }
    try {
      await createItem({ ...formData, hcId: Number(hcId) });
      alert("Información guardada correctamente");
    } catch (error: any) {
      alert(error?.message || "Error al guardar la información");
    }
  };

  // Si no existe, mostrar formulario normalmente
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Impresión Diagnóstica
      </h2>

      <div className="space-y-6">
        {/* Diagnóstico Principal (CIE-11) */}
        <div>
          <Label htmlFor="diagnosticoPrincipal">
            Diagnóstico Principal (CIE-11)
            <span className="text-error-500">*</span>
          </Label>

          <div className="mt-2 space-y-3">
            <SearchableSelect
              options={diagnosticosCIE11}
              placeholder="Buscar diagnóstico CIE-11"
              onChange={(value) => {
                handleInputChange("diagnosticoPrincipalCie11", value);
                setUsarDiagnosticoManual(value === "OTRO");
              }}
              value={formData.diagnosticoPrincipalCie11}
              searchPlaceholder="Buscar por código o nombre..."
              className="max-w-full"
            />

            {/* Input manual si selecciona "Otro" */}
            {(usarDiagnosticoManual || formData.diagnosticoPrincipal === "OTRO") && (
              <div>
                <Label htmlFor="diagnosticoManual">
                  Especifique el Diagnóstico
                </Label>
                <Input
                  type="text"
                  id="diagnosticoManual"
                  name="diagnosticoManual"
                  placeholder="Ingrese el código y nombre del diagnóstico"
                  value={diagnosticoManual}
                  onChange={(v) => {
                    setDiagnosticoManual(v);
                    handleInputChange("diagnosticoPrincipal", v);
                  }}
                  disabled={disabled}
                  className="max-w-full"
                />
              </div>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Seleccione el diagnóstico principal según CIE-11
          </p>
        </div>

        {/* Descripción del Diagnóstico */}
        <div>
          <Label htmlFor="descripcionDiagnostico">
            Descripción del Diagnóstico
            <span className="text-error-500">*</span>
          </Label>
          <TextArea
            id="descripcionDiagnostico"
            name="descripcionDiagnostico"
            placeholder="Describa detalladamente el diagnóstico, justificación clínica y sintomatología observada"
            value={formData.descripcionDiagnostico}
            onChange={(v) =>
              handleInputChange("descripcionDiagnostico", v)
            }
            disabled={disabled}
            required
            className="max-w-full"
            rows={6}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Incluya justificación clínica, sintomatología y criterios diagnósticos
          </p>
        </div>

        {/* Diagnóstico Secundario (DSM-5 / DM11) */}
        <div>
          <Label htmlFor="diagnosticoSecundario">
            Diagnóstico Secundario (DSM-5 / DM11)
          </Label>
          <SearchableSelect
            options={diagnosticosDM11}
            placeholder="Buscar diagnóstico secundario (opcional)"
            onChange={(value) =>
              handleInputChange("diagnosticoPrincipalDsm5", value)
            }
            value={formData.diagnosticoSecundario}
            searchPlaceholder="Buscar por código o nombre..."
            className="max-w-full"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Si existe, seleccione un diagnóstico secundario o comorbilidad DSM-5
          </p>
        </div>

        {/* Sección de Factores */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-medium text-gray-800 dark:text-white">
            Análisis de Factores
          </h3>

          <div className="space-y-6">
            {/* Factores Predisponentes */}
            <div>
              <Label htmlFor="factoresPredisponentes">
                Factores Predisponentes
              </Label>
              <TextArea
                id="factoresPredisponentes"
                name="factoresPredisponentes"
                placeholder="Describa los factores de vulnerabilidad o riesgo previos (genéticos, familiares, temperamentales, experiencias tempranas, etc.)"
                value={formData.factoresPredisponentes}
                onChange={(v =>
                  handleInputChange("factoresPredisponentes", v))
                }
                disabled={disabled}
                className="max-w-full"
                rows={4}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Factores que aumentaron la vulnerabilidad a desarrollar el
                trastorno
              </p>
            </div>

            {/* Factores Precipitantes */}
            <div>
              <Label htmlFor="factoresPrecipitantes">
                Factores Precipitantes
              </Label>
              <TextArea
                id="factoresPrecipitantes"
                name="factoresPrecipitantes"
                placeholder="Describa los eventos o situaciones que desencadenaron el inicio del trastorno (pérdidas, traumas, cambios vitales, etc.)"
                value={formData.factoresPrecipitantes}
                onChange={(v) =>
                  handleInputChange("factoresPrecipitantes", v)
                }
                disabled={disabled}
                className="max-w-full"
                rows={4}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Eventos o situaciones que desencadenaron el inicio del trastorno
              </p>
            </div>

            {/* Factores Mantenedores */}
            <div>
              <Label htmlFor="factoresMantenedores">
                Factores Mantenedores
              </Label>
              <TextArea
                id="factoresMantenedores"
                name="factoresMantenedores"
                placeholder="Describa los factores que perpetúan el problema actual (conductas de evitación, reforzadores, dinámicas familiares, etc.)"
                value={formData.factoresMantenedores}
                onChange={(v) =>
                  handleInputChange("factoresMantenedores", v)
                }
                disabled={disabled}
                className="max-w-full"
                rows={4}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Factores que mantienen o perpetúan el problema en la actualidad
              </p>
            </div>
          </div>
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
              disabled={disabled}
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

        {/* Resumen Diagnóstico */}
        {formData.diagnosticoPrincipal && (
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
                  {diagnosticosCIE11.find(
                    (d) => d.value === formData.diagnosticoPrincipal
                  )?.label || formData.diagnosticoPrincipal}
                </span>
              </div>
              {formData.diagnosticoSecundario && (
                <div>
                  <span className="font-medium text-purple-700 dark:text-purple-400">
                    Diagnóstico Secundario:{" "}
                  </span>
                  <span className="text-purple-900 dark:text-purple-200">
                    {diagnosticosCIE11.find(
                      (d) => d.value === formData.diagnosticoSecundario
                    )?.label || formData.diagnosticoSecundario}
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
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
          onClick={handleGuardar}
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
