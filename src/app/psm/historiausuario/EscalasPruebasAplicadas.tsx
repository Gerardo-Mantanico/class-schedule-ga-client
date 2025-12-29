"use client";

import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import { EscalaPruebaAplicada } from "@/interfaces/historiaClinica/EscalaPrueba";
import { useEscalaPrueba } from "../../../hooks/useEscalaPrueba";
import {
  AiOutlineFileText,
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineMessage,
  AiOutlinePaperClip,
} from "react-icons/ai";
import { toast } from "react-hot-toast";

interface EscalasPruebasAplicadasProps {
  pruebas?: EscalaPruebaAplicada[];
  onChange?: (data: EscalaPruebaAplicada[]) => void;
  disabled?: boolean;
}

const pruebasOptions = [
  { value: "1", label: "BDI (Inventario de Depresión de Beck)" },
  { value: "2", label: "BAI (Inventario de Ansiedad de Beck)" },
  { value: "3", label: "MMPI (Inventario Multifásico de Personalidad de Minnesota)" },
  { value: "4", label: "WAIS (Escala de Inteligencia de Wechsler para Adultos)" },
  { value: "5", label: "Otro" },
];

export default function EscalasPruebasAplicadas({
  pruebas = [],
  onChange,
  disabled = false,
}: EscalasPruebasAplicadasProps) {
  const [listaPruebas, setListaPruebas] =
    useState<EscalaPruebaAplicada[]>(pruebas);
  const [pruebaEditando, setPruebaEditando] = useState<number | null>(null);
  const [agregando, setAgregando] = useState(false);

  const { list } = useEscalaPrueba();

  const hcId =
    typeof window !== "undefined"
      ? Number(localStorage.getItem("HistoriClinica"))
      : 0;

  /* =========================
     Cargar pruebas del backend
     ========================= */
  useEffect(() => {
    const cargarPruebas = async () => {
      if (!hcId) return;
      try {
        const pruebasBackend = await list(hcId);
        if (Array.isArray(pruebasBackend)) {
          setListaPruebas(pruebasBackend);
        }
      } catch (error) {
        console.error("Error al cargar pruebas:", error);
      }
    };
    cargarPruebas();
  }, [hcId]);

  /* =========================
     Notificar al componente padre
     ========================= */
  useEffect(() => {
    onChange?.(listaPruebas);
  }, [listaPruebas, onChange]);

  /* =========================
     Acciones
     ========================= */
  const agregarNuevaPrueba = () => {
    const nuevaPrueba: EscalaPruebaAplicada = {
      id: Date.now(),
      hcId,
      prueba: 0,
      fechaAplicacion: "",
      resultado: 0,
      interpretacion: "",
      archivo: undefined,
      archivoFile: undefined,
    };

    setListaPruebas((prev) => [...prev, nuevaPrueba]);
    setPruebaEditando(nuevaPrueba.id);
    setAgregando(true);
  };

  const actualizarPrueba = <K extends keyof EscalaPruebaAplicada>(
    id: number,
    campo: K,
    valor: EscalaPruebaAplicada[K]
  ) => {
    setListaPruebas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  const handleFileUpload = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    actualizarPrueba(id, "archivoFile", file);
  };

  const obtenerNombrePrueba = (valor: number) =>
    pruebasOptions.find((opt) => Number(opt.value) === valor)?.label ??
    "No especificada";

  const handleGuardarPrueba = async (prueba: EscalaPruebaAplicada) => {
    try {
      const formData = new FormData();

      const body = {
        id: prueba.id,
        hcId,
        prueba: Number(prueba.prueba),
        fechaAplicacion: prueba.fechaAplicacion,
        resultado: Number(prueba.resultado),
        interpretacion: prueba.interpretacion,
      };

      formData.append(
        "body",
        new Blob([JSON.stringify(body)], { type: "application/json" })
      );

      if (prueba.archivoFile) {
        formData.append("file", prueba.archivoFile);
      }

      const response = await fetch(
        "http://alb-mi-app-1501020194.us-east-2.elb.amazonaws.com/api/v1/escala-pruebas",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Error al guardar");

      toast.success('Información guardada correctamente');
      setAgregando(false);
      setPruebaEditando(null);
    } catch (error) {
       toast.error('Error al guardar la información');
      console.error(error);
      alert("Error al guardar la prueba");
    }
  };

  const handleCancelar = () => {
    if (agregando && pruebaEditando) {
      setListaPruebas((prev) =>
        prev.filter((p) => p.id !== pruebaEditando)
      );
    }
    setAgregando(false);
    setPruebaEditando(null);
  };

  /* =========================
     Render
     ========================= */
  return (
    <div className="rounded-lg border p-6 bg-white dark:bg-gray-900">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Escalas o Pruebas Aplicadas</h2>
        <Button onClick={agregarNuevaPrueba} disabled={disabled}>
          + Agregar Prueba
        </Button>
      </div>

      {!agregando &&
        listaPruebas.map((prueba, index) => (
        <div
  key={prueba.id}
  className="border rounded-lg p-5 mb-4 bg-gray-50 dark:bg-gray-800"
>
  <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
    Prueba #{index + 1}: {obtenerNombrePrueba(prueba.prueba)}
  </h3>

  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
    {/* Fecha */}
    <div className="flex items-center gap-3">
      <AiOutlineCalendar className="w-5 h-5 text-blue-600 shrink-0" />
      <span className="font-medium">Fecha:</span>
      <span>{prueba.fechaAplicacion || "Sin fecha"}</span>
    </div>

    {/* Resultado */}
    <div className="flex items-center gap-3">
      <AiOutlineCheckCircle className="w-5 h-5 text-green-600 shrink-0" />
      <span className="font-medium">Resultado:</span>
      <span>{prueba.resultado ?? "N/A"}</span>
    </div>

    {/* Interpretación */}
    <div className="flex items-start gap-3">
      <AiOutlineMessage className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
      <span className="font-medium">Interpretación:</span>
      <span className="flex-1">
        {prueba.interpretacion || "Sin interpretación"}
      </span>
    </div>

    {/* Archivo */}
    {prueba.archivo && (
      <div className="flex items-center gap-3">
        <AiOutlinePaperClip className="w-5 h-5 text-blue-600 shrink-0" />
        <span className="font-medium">Archivo:</span>
        <a
          href={`${prueba.archivo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Ver archivo
        </a>
      </div>
    )}
  </div>
</div>

        ))}

      {agregando && pruebaEditando && (
        <div className=" rounded p-4 ">
          {(() => {
            const prueba = listaPruebas.find(
              (p) => p.id === pruebaEditando
            );
            if (!prueba) return null;

            return (
              <>
                <Label>Prueba</Label>
                <Select
                  options={pruebasOptions}
                  defaultValue={String(prueba.prueba)}
                  onChange={(v) =>
                    actualizarPrueba(prueba.id, "prueba", Number(v))
                  }
                />

                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={prueba.fechaAplicacion}
                  onChange={(e) =>
                    actualizarPrueba(
                      prueba.id,
                      "fechaAplicacion",
                      e.target.value
                    )
                  }
                />

                <Label>Resultado</Label>
                <Input
                  type="number"
                  value={prueba.resultado}
                  onChange={(e) =>
                    actualizarPrueba(
                      prueba.id,
                      "resultado",
                      Number(e.target.value)
                    )
                  }
                />

                <Label>Interpretación</Label>
                <TextArea
                  value={prueba.interpretacion}
                  onChange={(v) =>
                    actualizarPrueba(
                      prueba.id,
                      "interpretacion",
                      v
                    )
                  }
                />

                <Label>Archivo</Label>
                <Input type="file" onChange={(e) => handleFileUpload(prueba.id, e)} />

                <div className="flex gap-2 mt-4">
                  <Button onClick={() => handleGuardarPrueba(prueba)}>
                    Guardar
                  </Button>
                  <Button  className="bg-red-500 hover:bg-red-700" onClick={handleCancelar}>
                    Cancelar
                  </Button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
