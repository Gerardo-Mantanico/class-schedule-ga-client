"use client";

import React, { useState } from "react";
import { BoltIcon, GroupIcon, PageIcon } from "@/icons";
import useNomina, { NominaDetail } from "@/hooks/useNomina";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { NominaSection } from "@/components/administrativo/NominaSection";

export default function NominaPage() {
  const { nominas, retenciones } = useNomina();

  const [emailSearch, setEmailSearch] = useState("webbank404@gmail.com");
  const [showModal, setShowModal] = useState(false);
  const [opLoading, setOpLoading] = useState(false);
  const [opError, setOpError] = useState<string | null>(null);

  const [retencionesDraft, setRetencionesDraft] = useState<
    Array<{
      tipoId: number;
      tipoDescripcion: string;
      monto: number;
      selected: boolean;
    }>
  >([]);

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
          {/* RETENCIONES */}
          <div className="bg-yellow-100 rounded-xl shadow p-4">
            <div className="flex items-center gap-3 mb-4">
              <BoltIcon className="w-6 h-6" />
              <h3 className="font-medium">Retenciones</h3>
            </div>

            {nomina.retenciones?.length ? (
              nomina.retenciones.map((r) => (
                <div
                  key={r.id}
                  className="bg-yellow-50 rounded-xl p-3 flex justify-between"
                >
                  <div>
                    <p className="font-medium">{r.tipoDescripcion}</p>
                    <p>GTQ {Number(r.monto).toFixed(2)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                    onClick={async () => {
                      setOpLoading(true);
                      await retenciones.deleteItem(r.id.toString());
                      await nominas.fetchItems({ email: emailSearch });
                      setOpLoading(false);
                    }}
                  >
                    -
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm">Sin retenciones.</p>
            )}
          </div>

          {/* BONOS */}
          <div className="bg-green-200 rounded-xl shadow p-4">
            <div className="flex items-center gap-3 mb-4">
              <GroupIcon className="w-6 h-6" />
              <h3 className="font-medium">Bonos</h3>
            </div>
            {nomina.bonos?.length ? (
              nomina.bonos.map((b) => (
                <div key={b.id} className="bg-green-100 p-3 rounded-xl">
                  <p>{b.tipoDescripcion}</p>
                  <p>GTQ {Number(b.monto).toFixed(2)}</p>
                </div>
                
              ))
            ) : (
              <p className="text-sm">Sin bonos.</p>
            )}
          </div>

          {/* DESCUENTOS */}
          <div className="bg-red-200 rounded-xl shadow p-4">
            <div className="flex items-center gap-3 mb-4">
              <PageIcon className="w-6 h-6" />
              <h3 className="font-medium">Descuentos</h3>
            </div>
            {nomina.descuentos?.length ? (
              nomina.descuentos.map((d) => (
                <div key={d.id} className="bg-red-100 p-3 rounded-xl">
                  <p>{d.tipoDescripcion}</p>
                  <p>GTQ {Number(d.monto).toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm">Sin descuentos.</p>
            )}
          </div>
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
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={nominas.loading}>
            Buscar
          </Button>
        </div>
      </div>

      {mainContent}
    </div>
  );
}
