"use client";

import React, { useEffect, useState } from "react";
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

import type { ImpresionDiagnostica as ImpresionDiagnosticaAPI } from "@/interfaces/historiaClinica/ImpresionDiagnostica";

/* =========================
   TIPOS
========================= */

interface DiagnosticoOption {
  id: number;
  label: string;
}

interface ImpresionDiagnosticaData {
  diagnosticoPrincipal: DiagnosticoOption | string;
  descripcionDiagnostico: string;
  diagnosticoSecundario: DiagnosticoOption | string;
  factoresPredisponentes: string;
  factoresPrecipitantes: string;
  factoresMantenedores: string;
  nivelFuncionamiento: number;
}

interface ImpresionDiagnosticaProps {
  onChange?: (data: ImpresionDiagnosticaData) => void;
  disabled?: boolean;
}

/* =========================
   HELPERS
========================= */

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

/* =========================
   COMPONENTE
========================= */

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
    useState<ImpresionDiagnosticaAPI | null>(null);

  const [usarDiagnosticoManual, setUsarDiagnosticoManual] = useState(false);
  const [diagnosticoManual, setDiagnosticoManual] = useState("");

  const [formData, setFormData] = useState<ImpresionDiagnosticaData>({
    diagnosticoPrincipal: "",
    descripcionDiagnostico: "",
    diagnosticoSecundario: "",
    factoresPredisponentes: "",
    factoresPrecipitantes: "",
    factoresMantenedores: "",
    nivelFuncionamiento: 50,
  });

  /* =========================
     CARGA INICIAL
  ========================= */

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
  }, [hcId, getItem]);

  /* =========================
     NOTIFICAR CAMBIOS
  ========================= */

  useEffect(() => {
    onChange?.(formData);
  }, [formData, onChange]);

  const handleInputChange = <K extends keyof ImpresionDiagnosticaData>(
    field: K,
    value: ImpresionDiagnosticaData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* =========================
     OPTIONS SELECT
  ========================= */

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

  /* =========================
     GUARDAR
  ========================= */

  const handleGuardar = async () => {
    if (!hcId) {
      alert("No se encontró el id de la historia clínica");
      return;
    }

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

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="rounded-lg border bg-white p-6 shadow">
      <h2 className="mb-6 text-xl font-semibold">
        Impresión Diagnóstica
      </h2>

      {diagnosticoExistente && (
        <div className="mb-4 rounded bg-yellow-100 p-3 text-sm">
          Modo solo lectura: impresión diagnóstica ya registrada
        </div>
      )}

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
                setUsarDiagnosticoManual(false);
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
        <div>
          <Label>Descripción del Diagnóstico</Label>
          <TextArea
            value={formData.descripcionDiagnostico}
            onChange={(v) =>
              handleInputChange("descripcionDiagnostico", v)
            }
            rows={5}
          />
        </div>

        {/* Diagnóstico secundario */}
        <div>
          <Label>Diagnóstico Secundario (DSM-5)</Label>
          <SearchableSelect
            options={diagnosticosDSM5}
            value={
              typeof formData.diagnosticoSecundario === "object"
                ? formData.diagnosticoSecundario.id
                : formData.diagnosticoSecundario
            }
            onChange={(value) => {
              const selected = diagnosticosDSM5.find(
                (d) => d.value === value
              );
              if (selected) {
                handleInputChange("diagnosticoSecundario", {
                  id: selected.value,
                  label: selected.label,
                });
              }
            }}
          />
        </div>

        {/* Factores */}
        <TextArea
          label="Factores Predisponentes"
          value={formData.factoresPredisponentes}
          onChange={(v) =>
            handleInputChange("factoresPredisponentes", v)
          }
        />

        <TextArea
          label="Factores Precipitantes"
          value={formData.factoresPrecipitantes}
          onChange={(v) =>
            handleInputChange("factoresPrecipitantes", v)
          }
        />

        <TextArea
          label="Factores Mantenedores"
          value={formData.factoresMantenedores}
          onChange={(v) =>
            handleInputChange("factoresMantenedores", v)
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
            className={`mt-2 font-semibold ${getNivelFuncionamientoColor(
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
        <div className="mt-8 flex justify-end">
          <Button onClick={handleGuardar} disabled={disabled}>
            Guardar información
          </Button>
        </div>
      )}
    </div>
  );
}
