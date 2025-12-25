
"use client";

import React, { useState, useEffect } from "react";
import type { AntecedentesFamiliares } from "@/interfaces/historiaClinica/AntecedentesFamiliares";
import { useAntecedentesFamiliares } from "@/hooks/historaClinica/useAntecedentesFamiliares";
import toast from 'react-hot-toast'

import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Checkbox from "@/components/form/input/Checkbox";



interface AntecedentesFamiliaresProps {
  estructuraFamiliar?: string;
  hayTrastornosFamiliares?: boolean;
  detallesTrastornosFamiliares?: string;
  eventosFamiliaresRelevantes?: string;
  motivoConsulta?: string;
  onChange?: (data: AntecedentesFamiliaresFormData) => void;
  disabled?: boolean;
}

// Tipo local para el formulario
type AntecedentesFamiliaresFormData = {
  estructuraFamiliar: string;
  hayTrastornosFamiliares: boolean;
  detallesTrastornosFamiliares: string;
  eventosFamiliaresRelevantes: string;
  motivoConsulta: string;
};


export default function AntecedentesFamiliares({
  onChange,
  disabled = false,
}: AntecedentesFamiliaresProps) {
  const { getItem, createItem } = useAntecedentesFamiliares();

  const [formData, setFormData] = useState<AntecedentesFamiliaresFormData>({
    estructuraFamiliar: "",
    hayTrastornosFamiliares: false,
    detallesTrastornosFamiliares: "",
    eventosFamiliaresRelevantes: "",
    motivoConsulta: "",
  });
  const [antecedenteExistente, setAntecedenteExistente] = useState<AntecedentesFamiliares | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener el id de la historia clínica (puedes ajustar la clave si es diferente)
  const hcId = typeof window !== "undefined" ? localStorage.getItem("HistoriClinica") : null;

  // Cargar antecedentes familiares si existen
  useEffect(() => {
    if (!hcId) return setLoading(false);
    getItem(hcId)
      .then((data) => {
        if (data && data.id && data.id !== 0) {
          setAntecedenteExistente(data);
          setFormData({
            estructuraFamiliar: data.estructuraFa || "",
            hayTrastornosFamiliares: data.trastornos || false,
            detallesTrastornosFamiliares: data.trastornoDetalles || "",
            eventosFamiliaresRelevantes: data.eventosFr || "",
            motivoConsulta: "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [hcId]);

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleInputChange = <K extends keyof AntecedentesFamiliaresFormData>(
    field: K,
    value: AntecedentesFamiliaresFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      hayTrastornosFamiliares: checked,
      detallesTrastornosFamiliares: checked ? prev.detallesTrastornosFamiliares : "",
    }));
  };

  const handleGuardar = async () => {
    try {
      if (!hcId) throw new Error("No se encontró el id de la historia clínica");
      const payload: AntecedentesFamiliares = {
        id: 0,
        hcId: Number(hcId),
        estructuraFa: formData.estructuraFamiliar,
        trastornos: formData.hayTrastornosFamiliares,
        trastornoDetalles: formData.detallesTrastornosFamiliares,
        eventosFr: formData.eventosFamiliaresRelevantes,
      };
      await createItem(payload);
      toast.success('Información guardada correctamente');
      setAntecedenteExistente(payload);
    } catch (error) {
      toast.error('Error al guardar la información');
    }
  };

  if (loading) return <p>Cargando datos...</p>;

  const readOnly = !!antecedenteExistente || disabled;

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Antecedentes Familiares
      </h2>

      {antecedenteExistente && (
        <div className="mb-4 p-3 text-sm bg-yellow-100 rounded">
          Modo solo lectura: antecedentes familiares ya registrados
        </div>
      )}

      <div className="space-y-6">
        {/* Estructura Familiar Actual */}
        <div>
          <Label htmlFor="estructuraFamiliar">
            Estructura Familiar Actual
          </Label>
          <TextArea
            placeholder="Describa la estructura familiar actual (miembros del núcleo familiar, dinámica familiar, etc.)"
            value={formData.estructuraFamiliar}
            onChange={(v) => handleInputChange("estructuraFamiliar", v)}
            disabled={readOnly}
            className="max-w-full"
            rows={5}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Incluya información sobre miembros de la familia, relaciones y
            dinámica familiar
          </p>
        </div>

        {/* Historia de Trastornos Familiares */}
        <div>
          <Label>Historia de Trastornos Familiares</Label>

          <div className="mt-3">
            <Checkbox
              id="hayTrastornosFamiliares"
              label="¿Hay antecedentes de trastornos mentales o enfermedades relevantes en la familia?"
              checked={formData.hayTrastornosFamiliares}
              onChange={handleCheckboxChange}
              disabled={readOnly}
            />
          </div>

          {/* TextArea condicional - se muestra solo si está marcado el checkbox */}
          {formData.hayTrastornosFamiliares && (
            <div className="mt-4">
              <Label htmlFor="detallesTrastornosFamiliares">
                Detalles de los Antecedentes
              </Label>
              <TextArea
                placeholder="Describa los antecedentes de trastornos mentales o enfermedades en la familia (tipo de trastorno, familiar afectado, tratamiento recibido, etc.)"
                value={formData.detallesTrastornosFamiliares}
                onChange={(v) => handleInputChange("detallesTrastornosFamiliares", v)}
                disabled={readOnly}
                className="max-w-full"
                rows={5}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Especifique el tipo de trastorno, qué familiar lo padece, y
                cualquier tratamiento recibido
              </p>
            </div>
          )}
        </div>

        {/* Eventos Familiares Relevantes */}
        <div>
          <Label htmlFor="eventosFamiliaresRelevantes">
            Eventos Familiares Relevantes
          </Label>
          <TextArea
            placeholder="Describa eventos familiares significativos que puedan ser relevantes (pérdidas, divorcios, migraciones, traumas, logros importantes, etc.)"
            value={formData.eventosFamiliaresRelevantes}
            onChange={(v) => handleInputChange("eventosFamiliaresRelevantes", v)}
            disabled={readOnly}
            className="max-w-full"
            rows={5}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Incluya cualquier evento familiar que haya tenido un impacto
            significativo en el paciente
          </p>
        </div>
      </div>

      {/* Botón para guardar solo si NO existe el registro */}
      {!antecedenteExistente && (
        <div className="mt-8 flex justify-end">
          <Button onClick={handleGuardar} disabled={readOnly}>
            Guardar información
          </Button>
        </div>
      )}
    </div>
  );
}
