"use client";

import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import SearchableSelect from "@/components/form/SearchableSelect";
import Button from "@/components/ui/button/Button";

import {
  useImpresionDiagnostica,
  useTipoImpresionDiagnosticoC11,
  useTipoImpresionDiagnosticoD5,
} from "../../../hooks/historaClinica/useImpresionDiagnostica";

import type { ImpresionDiagnostica as ImpresionDiagnosticaApi } from "@/interfaces/historiaClinica/ImpresionDiagnostica";

/* =======================
   TIPOS
======================= */

interface DiagnosticoSelect {
  id: number;
  label: string;
}

interface ImpresionDiagnosticaData {
  diagnosticoPrincipal: DiagnosticoSelect | string;
  descripcionDiagnostico: string;
  diagnosticoSecundario: DiagnosticoSelect | string;
  factoresPredisponentes: string;
  factoresPrecipitantes: string;
  factoresMantenedores: string;
  nivelFuncionamiento: number;
}

interface ImpresionDiagnosticaProps {
  onChange?: (data: ImpresionDiagnosticaData) => void;
  disabled?: boolean;
}

/* =======================
   HELPERS
======================= */

function getNivelFuncionamientoColor(nivel: number) {
  if (nivel >= 81) return "text-green-600";
  if (nivel >= 61) return "text-blue-600";
  if (nivel >= 41) return "text-yellow-600";
  if (nivel >= 21) return "text-orange-600";
  return "text-red-600";
}

function getNivelFuncionamientoLabel(nivel: number): string {
  if (nivel >= 81) return "Funcionamiento Excelente";
  if (nivel >= 61) return "Funcionamiento Bueno";
  if (nivel >= 41) return "Funcionamiento Moderado";
  if (nivel >= 21) return "Funcionamiento Bajo";
  return "Funcionamiento Muy Bajo";
}

/* =======================
   COMPONENTE
======================= */

export default function ImpresionDiagnostica({
  onChange,
  disabled = false,
}: ImpresionDiagnosticaProps) {
  const { getItem, createItem } = useImpresionDiagnostica();

  const hcId =
    typeof window !== "undefined"
      ? localStorage.getItem("HistoriClinica")
      : null;

  const [loadingConsulta, setLoadingConsulta] = useState(true);
  const [diagnosticoExistente, setDiagnosticoExistente] =
    useState<ImpresionDiagnosticaApi | null>(null);

  const [formData, setFormData] = useState<ImpresionDiagnosticaData>({
    diagnosticoPrincipal: "",
    descripcionDiagnostico: "",
    diagnosticoSecundario: "",
    factoresPredisponentes: "",
    factoresPrecipitantes: "",
    factoresMantenedores: "",
    nivelFuncionamiento: 50,
  });

  const [usarDiagnosticoManual, setUsarDiagnosticoManual] = useState(false);
  const [diagnosticoManual, setDiagnosticoManual] = useState("");

  /* =======================
     CARGA INICIAL
  ======================= */

  useEffect(() => {
    if (!hcId) {
      setLoadingConsulta(false);
      return;
    }

    getItem(hcId)
      .then((data) => {
        if (data?.id) {
          setDiagnosticoExistente(data);
          setFormData({
            diagnosticoPrincipal: data.diagnosticoPrincipal ?? "",
            descripcionDiagnostico: data.descripcionDiagnostico ?? "",
            diagnosticoSecundario: data.diagnosticoSecundario ?? "",
            factoresPredisponentes: data.factoresPredisponentes ?? "",
            factoresPrecipitantes: data.factoresPrecipitantes ?? "",
            factoresMantenedores: data.factoresMantenedores ?? "",
            nivelFuncionamiento: data.nivelFuncionamiento ?? 50,
          });
        }
      })
      .finally(() => setLoadingConsulta(false));
  }, [hcId]);

  /* =======================
     NOTIFICAR CAMBIOS
  ======================= */

  useEffect(() => {
    onChange?.(formData);
  }, [formData, onChange]);

  const handleInputChange = <K extends keyof ImpresionDiagnosticaData>(
    field: K,
    value: ImpresionDiagnosticaData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* =======================
     SELECT OPTIONS
  ======================= */

  const { items: tiposCIE11 = [] } = useTipoImpresionDiagnosticoC11();
  const { items: tiposDSM5 = [] } = useTipoImpresionDiagnosticoD5();

  const diagnosticosCIE11 = tiposCIE11.map((item: any) => ({
    value: item.id,
    label: `${item.codigo} - ${item.nombre}`,
  }));

  const diagnosticosDSM5 = tiposDSM5.map((item: any) => ({
    value: item.id,
    label: `${item.codigo} - ${item.nombre}`,
  }));

  /* =======================
     GUARDAR
  ======================= */

  const handleGuardar = async () => {
    if (!hcId) return alert("No se encontró la historia clínica");

    try {
      await createItem({ ...formData, hcId: Number(hcId) });
      alert("Información guardada correctamente");
    } catch {
      alert("Error al guardar la información");
    }
  };

  if (loadingConsulta) {
    return <div className="p-6">Cargando...</div>;
  }

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="rounded-lg border bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-semibold">
        Impresión Diagnóstica
      </h2>

      <div className="space-y-6">
        {/* Diagnóstico principal */}
        <div>
          <Label>Diagnóstico Principal (CIE-11)</Label>
          <SearchableSelect
            options={diagnosticosCIE11}
            value={
              typeof formData.diagnosticoPrincipal === "object"
                ? formData.diagnosticoPrincipal.id
                : formData.diagnosticoPrincipal
            }
            onChange={(value) => {
              const selected = diagnosticosCIE11.find(
                (d) => d.value === value
              );
              if (selected) {
                handleInputChange("diagnosticoPrincipal", {
                  id: selected.value,
                  label: selected.label,
                });
              } else {
                setUsarDiagnosticoManual(true);
              }
            }}
          />
        </div>

        {usarDiagnosticoManual && (
          <Input
            placeholder="Especifique diagnóstico"
            value={diagnosticoManual}
            onChange={(v) => {
              setDiagnosticoManual(v);
              handleInputChange("diagnosticoPrincipal", v);
            }}
          />
        )}

        {/* Descripción */}
        <TextArea
          label="Descripción del Diagnóstico"
          value={formData.descripcionDiagnostico}
          onChange={(v) =>
            handleInputChange("descripcionDiagnostico", v)
          }
        />

        {/* Nivel funcionamiento */}
        <div>
          <Label>Nivel de Funcionamiento</Label>
          <input
            type="range"
            min={0}
            max={100}
            value={formData.nivelFuncionamiento}
            onChange={(e) =>
              handleInputChange(
                "nivelFuncionamiento",
                Number(e.target.value)
              )
            }
          />
          <p
            className={`font-semibold ${getNivelFuncionamientoColor(
              formData.nivelFuncionamiento
            )}`}
          >
            {formData.nivelFuncionamiento}% —{" "}
            {getNivelFuncionamientoLabel(
              formData.nivelFuncionamiento
            )}
          </p>
        </div>
      </div>

      {!diagnosticoExistente && (
        <div className="mt-6 flex justify-end">
          <Button onClick={handleGuardar} disabled={disabled}>
            Guardar información
          </Button>
        </div>
      )}
    </div>
  );
}
