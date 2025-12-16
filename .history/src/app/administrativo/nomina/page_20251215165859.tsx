"use client";

import React, { useState, useEffect } from "react";
import { BoltIcon, GroupIcon, PageIcon } from "@/icons";
import useNomina, { NominaDetail } from "@/hooks/useNomina";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { NominaSection } from "@/components/administrativo/NominaSection";
import GenericModal from "@/components/ui/modal/GenericModal";
import Select from "@/components/form/Select";

export default function NominaPage() {
  const { nominas, retenciones, bonos, descuentos } = useNomina();

  const [emailSearch, setEmailSearch] = useState("webbank404@gmail.com");
  
  // Estados para modal único
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"retencion" | "bono" | "descuento" | null>(null);
  
  const [opLoading, setOpLoading] = useState(false);
  
  // Estados para el formulario
  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [monto, setMonto] = useState<string>("");

  // Cargar opciones de retenciones, bonos y descuentos al montar el componente
  useEffect(() => {
    retenciones.fetchItems();
    bonos.fetchItems();
    descuentos.fetchItems();
  }, []);

  /* =====================
     Buscar nómina
  ====================== */
  const handleSearch = () => {
    if (!emailSearch) return;
    // Usamos getItem porque el backend espera el email como parte de la URL, no como query param.
    nominas.getItem(emailSearch);
  };

  /* =====================
     Obtener nómina actual
  ====================== */
  // El resultado de getItem se almacena en la propiedad 'item' (singular)
  const nomina: NominaDetail | null = nominas.item;

  /* =====================
     Contenido principal
  ====================== */
  let mainContent: React.ReactNode;

  if (nominas.loading) {
    mainContent = (
      <div className="bg-white rounded-xl shadow p-6 text-center">
        Buscando nómina...
      </div>
    );
  } else if (nominas.error) {
    mainContent = (
      <div className="bg-red-50 rounded-xl shadow p-6 text-red-700">
        Error: {nominas.error}
      </div>
    );
  } else if (!nomina) {
    mainContent = (
      <div className="bg-yellow-50 rounded-xl shadow p-6 text-center">
        No se ha encontrado una nómina para el correo proporcionado.
      </div>
    );
  } else {
    mainContent = (
      <div className="space-y-4">
        {/* =====================
            RESUMEN
        ====================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border-4 border-brand-500 rounded-xl shadow p-6 flex flex-col items-center justify-center">
            <h3 className="text-xl font-medium mb-2">
              Salario Neto Adeudado
            </h3>
            <p className="text-6xl font-bold text-red-700">
              GTQ{" "}
              {Math.abs(
                Number(nomina.salarioNetoAdeudado ?? 0)
              ).toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold border-b pb-2 mb-3">
              Detalles de Nómina
            </h3>
            <div className="text-sm space-y-1">
              <p><b>ID:</b> {nomina.id}</p>
              <p><b>Periodo:</b> {nomina.periodo}</p>
              <p><b>Fecha cierre:</b> {nomina.fechaCierre}</p>
              {nomina.user && (
                <p>
                  <b>Empleado:</b>{" "}
                  {nomina.user.firstname} {nomina.user.lastname}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* =====================
            RETENCIONES / BONOS / DESCUENTOS
        ====================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <NominaSection
            title="Retenciones"
            icon={<BoltIcon className="w-6 h-6" />}
            items={nomina.retenciones || []}
            colorClass="bg-yellow-100"
            itemColorClass="bg-yellow-50"
            emptyMessage="Sin retenciones."
            opLoading={opLoading}
            onItemDelete={async (id) => {
              setOpLoading(true);
              await retenciones.deleteItem(id.toString());
              await nominas.getItem(emailSearch);
              setOpLoading(false);
            }}
            onItemAdd={() => {
              setModalType("retencion");
              setShowModal(true);
            }}
          />

          <NominaSection
            title="Bonos"
            icon={<GroupIcon className="w-6 h-6" />}
            items={nomina.bonos || []}
            colorClass="bg-green-200"
            itemColorClass="bg-green-100"
            emptyMessage="Sin bonos."
            onItemAdd={() => {
              setModalType("bono");
              setShowModal(true);
            }}
            onItemDelete={async (id) => {
              setOpLoading(true);
              await bonos.deleteItem(id.toString());
              await nominas.getItem(emailSearch);
              setOpLoading(false);
            }}
          />

          <NominaSection
            title="Descuentos"
            icon={<PageIcon className="w-6 h-6" />}
            items={nomina.descuentos || []}
            colorClass="bg-red-200"
            itemColorClass="bg-red-100"
            emptyMessage="Sin descuentos."
            onItemAdd={() => {
              setModalType("descuento");
              setShowModal(true);
            }}
            onItemDelete={async (id) => {
              setOpLoading(true);
              await descuentos.deleteItem(id.toString());
              await nominas.getItem(emailSearch);
              setOpLoading(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Nómina</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Correo del empleado"
            value={emailSearch} 
            onChange={(e) => setEmailSearch(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={nominas.loading}>
            Buscar
          </Button>
        </div>
      </div>

      {mainContent}

      {/* Modal unificado para Retenciones, Bonos y Descuentos */}
      <GenericModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setModalType(null);
          setSelectedTipo("");
          setMonto("");
        }}
        title={
          modalType === "retencion"
            ? "Agregar Retención"
            : modalType === "bono"
              ? "Agregar Bono"
              : "Agregar Descuento"
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {modalType === "retencion"
                ? "Tipo de Retención"
                : modalType === "bono"
                  ? "Tipo de Bono"
                  : "Tipo de Descuento"}
            </label>
            <Select
              options={
                modalType === "retencion"
                  ? retenciones.items.map((item: any) => ({
                      value: item.id?.toString() || "",
                      label: item.tipo || item.nombre || "",
                    }))
                  : modalType === "bono"
                    ? bonos.items.map((item: any) => ({
                        value: item.id?.toString() || "",
                        label: item.tipo || item.nombre || "",
                      }))
                    : descuentos.items.map((item: any) => ({
                        value: item.id?.toString() || "",
                        label: item.tipo || item.nombre || "",
                      }))
              }
              placeholder="Seleccione un tipo"
              defaultValue={selectedTipo}
              onChange={(value) => setSelectedTipo(value)}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Monto (GTQ)
            </label>
            <Input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
              step={0.01}
              min="0"
            />
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                setModalType(null);
                setSelectedTipo("");
                setMonto("");
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                try {
                  const data = {
                    tipo: selectedTipo,
                    monto: parseFloat(monto),
                  };

                  if (modalType === "retencion") {
                    await retenciones.createItem(data);
                  } else if (modalType === "bono") {
                    await bonos.createItem(data);
                  } else {
                    await descuentos.createItem(data);
                  }

                  setShowModal(false);
                  setModalType(null);
                  setSelectedTipo("");
                  setMonto("");
                } catch (error) {
                  console.error("Error al guardar:", error);
                }
              }}
            >
              Guardar
            </Button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
}
