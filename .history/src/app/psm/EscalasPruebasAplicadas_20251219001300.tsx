"use client";

import React, { useState, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";

interface EscalaPruebaAplicada {
  id: string;
  pruebaSeleccionada: string;
  fechaAplicacion: string;
  resultado: string;
  interpretacion: string;
  archivoNombre?: string;
  archivoUrl?: string;
}

interface EscalasPruebasAplicadasProps {
  pruebas?: EscalaPruebaAplicada[];
  onChange?: (data: EscalaPruebaAplicada[]) => void;
  disabled?: boolean;
}

const pruebasOptions = [
  { value: "bdi", label: "BDI (Inventario de Depresión de Beck)" },
  { value: "bai", label: "BAI (Inventario de Ansiedad de Beck)" },
  { value: "mmpi", label: "MMPI (Inventario Multifásico de Personalidad de Minnesota)" },
  { value: "wais", label: "WAIS (Escala de Inteligencia de Wechsler para Adultos)" },
  { value: "otro", label: "Otro" },
];

export default function EscalasPruebasAplicadas({
  pruebas = [],
  onChange,
  disabled = false,
}: EscalasPruebasAplicadasProps) {
  const [listaPruebas, setListaPruebas] = useState<EscalaPruebaAplicada[]>(pruebas);
  const [pruebaEditando, setPruebaEditando] = useState<string | null>(null);

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onChange) {
      onChange(listaPruebas);
    }
  }, [listaPruebas, onChange]);

  const agregarNuevaPrueba = () => {
    const nuevaPrueba: EscalaPruebaAplicada = {
      id: `prueba-${Date.now()}`,
      pruebaSeleccionada: "",
      fechaAplicacion: "",
      resultado: "",
      interpretacion: "",
    };
    setListaPruebas([...listaPruebas, nuevaPrueba]);
    setPruebaEditando(nuevaPrueba.id);
  };

  const eliminarPrueba = (id: string) => {
    setListaPruebas(listaPruebas.filter((p) => p.id !== id));
    if (pruebaEditando === id) {
      setPruebaEditando(null);
    }
  };

  const actualizarPrueba = (id: string, campo: keyof EscalaPruebaAplicada, valor: string) => {
    setListaPruebas(
      listaPruebas.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  const handleFileUpload = async (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Solo se permiten archivos PDF o imágenes (PNG, JPG, JPEG)");
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("El archivo es demasiado grande. Tamaño máximo: 5MB");
      return;
    }

    // En una aplicación real, aquí se subiría el archivo a un servidor
    // Por ahora, solo guardamos el nombre del archivo
    setListaPruebas(
      listaPruebas.map((p) =>
        p.id === id
          ? {
              ...p,
              archivoNombre: file.name,
              archivoUrl: URL.createObjectURL(file), // URL temporal para previsualización
            }
          : p
      )
    );
  };

  const obtenerNombrePrueba = (valor: string): string => {
    return pruebasOptions.find((opt) => opt.value === valor)?.label || valor;
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Escalas o Pruebas Aplicadas
        </h2>
        <Button
          onClick={agregarNuevaPrueba}
          disabled={disabled}
          variant="primary"
          size="sm"
        >
          + Agregar Prueba
        </Button>
      </div>

      {listaPruebas.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            No se han aplicado pruebas aún. Haga clic en "Agregar Prueba" para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {listaPruebas.map((prueba, index) => (
            <div
              key={prueba.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  Prueba #{index + 1}
                  {prueba.pruebaSeleccionada && (
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      - {obtenerNombrePrueba(prueba.pruebaSeleccionada)}
                    </span>
                  )}
                </h3>
                <Button
                  onClick={() => eliminarPrueba(prueba.id)}
                  disabled={disabled}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  Eliminar
                </Button>
              </div>

              <div className="space-y-4">
                {/* Prueba Seleccionada */}
                <div>
                  <Label htmlFor={`prueba-${prueba.id}`}>
                    Prueba Seleccionada
                  </Label>
                  <Select
                    options={pruebasOptions}
                    placeholder="Seleccione una prueba"
                    onChange={(value) =>
                      actualizarPrueba(prueba.id, "pruebaSeleccionada", value)
                    }
                    defaultValue={prueba.pruebaSeleccionada}
                    className="max-w-full"
                  />
                </div>

                {/* Fecha de Aplicación */}
                {prueba.pruebaSeleccionada && (
                  <div>
                    <DatePicker
                      id={`fecha-${prueba.id}`}
                      label="Fecha de Aplicación"
                      placeholder="Seleccione la fecha"
                      defaultDate={prueba.fechaAplicacion || undefined}
                      onChange={(selectedDates) => {
                        if (selectedDates && selectedDates.length > 0) {
                          const date = selectedDates[0];
                          const formattedDate = date.toISOString().split("T")[0];
                          actualizarPrueba(
                            prueba.id,
                            "fechaAplicacion",
                            formattedDate
                          );
                        }
                      }}
                    />
                  </div>
                )}

                {/* Resultado */}
                <div>
                  <Label htmlFor={`resultado-${prueba.id}`}>
                    Resultado (Puntaje)
                  </Label>
                  <Input
                    type="number"
                    id={`resultado-${prueba.id}`}
                    name="resultado"
                    placeholder="Ingrese el puntaje obtenido"
                    value={prueba.resultado}
                    onChange={(e) =>
                      actualizarPrueba(prueba.id, "resultado", e.target.value)
                    }
                    disabled={disabled}
                    step={0.01}
                    className="max-w-full"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Ingrese el puntaje numérico (hasta 2 decimales)
                  </p>
                </div>

                {/* Interpretación */}
                <div>
                  <Label htmlFor={`interpretacion-${prueba.id}`}>
                    Interpretación
                  </Label>
                  <TextArea
                    id={`interpretacion-${prueba.id}`}
                    name="interpretacion"
                    placeholder="Describa la interpretación de los resultados"
                    value={prueba.interpretacion}
                    onChange={(e) =>
                      actualizarPrueba(
                        prueba.id,
                        "interpretacion",
                        e.target.value
                      )
                    }
                    disabled={disabled}
                    className="max-w-full"
                    rows={4}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Incluya el análisis e interpretación de los resultados
                  </p>
                </div>

                {/* Archivo Adjunto */}
                <div>
                  <Label htmlFor={`archivo-${prueba.id}`}>
                    Archivo Adjunto (PDF/Imagen)
                  </Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      id={`archivo-${prueba.id}`}
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileUpload(prueba.id, e)}
                      disabled={disabled}
                      className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-white text-sm text-gray-900 file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Formatos permitidos: PDF, PNG, JPG, JPEG (máx. 5MB)
                    </p>
                  </div>

                  {/* Mostrar archivo adjunto si existe */}
                  {prueba.archivoNombre && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
                      <svg
                        className="h-5 w-5 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="flex-1 text-sm text-green-800 dark:text-green-300">
                        {prueba.archivoNombre}
                      </span>
                      <button
                        onClick={() =>
                          setListaPruebas(
                            listaPruebas.map((p) =>
                              p.id === prueba.id
                                ? {
                                    ...p,
                                    archivoNombre: undefined,
                                    archivoUrl: undefined,
                                  }
                                : p
                            )
                          )
                        }
                        disabled={disabled}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen */}
      {listaPruebas.length > 0 && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
          <h3 className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-300">
            Resumen de Pruebas Aplicadas
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Total de pruebas registradas: <strong>{listaPruebas.length}</strong>
          </p>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
            Pruebas con resultados:{" "}
            <strong>
              {listaPruebas.filter((p) => p.resultado).length}
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
