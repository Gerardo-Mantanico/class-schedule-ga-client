"use client";

import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import SearchableSelect from "@/components/form/SearchableSelect";
import { ImpresionDiagnostica } from "@/interfaces/historiaClinica/ImpresionDiagnostica";
import { useImpresionDiagnostica } from "@/hooks/historaClinica/useImpresionDiagnostica";

interface ImpresionDiagnosticaProps extends Partial<ImpresionDiagnostica> {
  onChange?: (data: ImpresionDiagnostica) => void;
  disabled?: boolean;
}

// Muestra de diagnósticos CIE-11 más comunes en salud mental
const diagnosticosCIE11 = [
  { value: "6A70", label: "6A70 - Trastorno de ansiedad generalizada" },
  { value: "6A71", label: "6A71 - Trastorno de pánico" },
  { value: "6A72", label: "6A72 - Agorafobia" },
  { value: "6A73", label: "6A73 - Fobia específica" },
  { value: "6A74", label: "6A74 - Trastorno de ansiedad social" },
  { value: "6B00", label: "6B00 - Trastorno de estrés postraumático" },
  { value: "6B20", label: "6B20 - Episodio depresivo único" },
  { value: "6B21", label: "6B21 - Trastorno depresivo recurrente" },
  { value: "6B22", label: "6B22 - Trastorno distímico" },
  { value: "6A60", label: "6A60 - Trastorno obsesivo-compulsivo" },
  { value: "6A80", label: "6A80 - Trastorno de síntomas somáticos" },
  { value: "6B40", label: "6B40 - Trastorno bipolar tipo I" },
  { value: "6B41", label: "6B41 - Trastorno bipolar tipo II" },
  { value: "6A00", label: "6A00 - Esquizofrenia" },
  { value: "6A01", label: "6A01 - Trastorno esquizoafectivo" },
  { value: "6C40", label: "6C40 - Trastorno por déficit de atención e hiperactividad" },
  { value: "6C90", label: "6C90 - Trastorno del espectro autista" },
  { value: "6E20", label: "6E20 - Anorexia nerviosa" },
  { value: "6E21", label: "6E21 - Bulimia nerviosa" },
  { value: "6E22", label: "6E22 - Trastorno por atracón" },
  { value: "6C40", label: "6C40 - TDAH" },
  { value: "6D10", label: "6D10 - Trastorno de personalidad límite" },
  { value: "6D11", label: "6D11 - Trastorno de personalidad antisocial" },
  { value: "MB23", label: "MB23 - Insomnio crónico" },
  { value: "6C51", label: "6C51 - Trastorno por uso de alcohol" },
  { value: "6C52", label: "6C52 - Trastorno por uso de cannabis" },
  { value: "OTRO", label: "Otro diagnóstico" },
];

export default function ImpresionDiagnostica({
  diagnosticoPrincipalCie11 = { codigo: "", nombre: "" },
  diagnosticoPrincipalDsm5 = { codigo: "", nombre: "" },
  factoresPredisponentes = "",
  factoresPrecipiantes = "",
  factoresMantenedores = "",
  nivelFuncionamiento = 50,
  hcId = 0,
  id = 0,
  onChange,
  disabled = false,
}: ImpresionDiagnosticaProps) {
  const [formData, setFormData] = useState<ImpresionDiagnostica>({
    id,
    hcId,
    diagnosticoPrincipalCie11,
    diagnosticoPrincipalDsm5,
    factoresPredisponentes,
    factoresPrecipiantes,
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
    field: keyof ImpresionDiagnostica,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

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
                handleInputChange("diagnosticoPrincipal", value);
                setUsarDiagnosticoManual(value === "OTRO");
              }}
              value={formData.diagnosticoPrincipal}
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
                  onChange={(e) => {
                    setDiagnosticoManual(e.target.value);
                    handleInputChange("diagnosticoPrincipal", e.target.value);
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
            onChange={(e) =>
              handleInputChange("descripcionDiagnostico", e.target.value)
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

        {/* Diagnóstico Secundario */}
        <div>
          <Label htmlFor="diagnosticoSecundario">
            Diagnóstico Secundario (CIE-11)
          </Label>
          <SearchableSelect
            options={diagnosticosCIE11}
            placeholder="Buscar diagnóstico secundario (opcional)"
            onChange={(value) =>
              handleInputChange("diagnosticoSecundario", value)
            }
            value={formData.diagnosticoSecundario}
            searchPlaceholder="Buscar por código o nombre..."
            className="max-w-full"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Si existe, seleccione un diagnóstico secundario o comorbilidad
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
                onChange={(e) =>
                  handleInputChange("factoresPredisponentes", e.target.value)
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
                onChange={(e) =>
                  handleInputChange("factoresPrecipitantes", e.target.value)
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
                onChange={(e) =>
                  handleInputChange("factoresMantenedores", e.target.value)
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
    </div>
  );
}
