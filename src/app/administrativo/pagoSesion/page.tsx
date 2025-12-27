"use client";

import React, { useState, useRef } from "react";
import Button from "@/components/ui/button/Button";
import { MdPayment } from "react-icons/md";
import Input from "@/components/form/input/InputField";
import { usePagoSesion } from "@/hooks/usePagoSesion";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";

export default function PagoSesion() {
  const { pagos, loading, error, createPago, fetchPagos } = usePagoSesion();
  const [selectedPago, setSelectedPago] = useState<number | null>(null);
  const [monto, setMonto] = useState("");
  const [nota, setNota] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Mostrar lista de pagos pendientes
  const pagosPendientes = pagos.filter(p => !p.pagado);

  const handlePagoSelect = (id: number) => {
    setSelectedPago(id);
    setMonto("");
    setNota("");
    setMensaje("");
    setShowTicket(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPago) return;
    if (!monto || !nota) {
      setMensaje("Todos los campos son obligatorios.");
      return;
    }
    setSubmitting(true);
    setShowTicket(true); // Mostrar el ticket visual
    setTimeout(async () => {
      try {
        // Generar imagen del ticket
        let comprobanteImg = "";
        if (ticketRef.current) {
          const canvas = await html2canvas(ticketRef.current);
          comprobanteImg = canvas.toDataURL("image/png");
        }
        // Enviar monto, nota y comprobante al servidor
        await createPago({
          id: selectedPago,
          monto: Number(monto),
          nota: nota,
          comprobante: comprobanteImg
        });
        toast.success("Pago registrado correctamente");
        setMensaje("Pago registrado correctamente");
        fetchPagos();
      } catch (err) {
        console.error("Error al registrar el pago:", err);
        setMensaje("Error al registrar el pago.");
      }
      setSubmitting(false);
    }, 100); // Espera breve para renderizar el ticket antes de capturarlo
  };

  const pagoSeleccionado = pagos.find(p => p.id === selectedPago);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-8">
      <div className="flex items-center gap-3 mb-6">
        <MdPayment className="text-green-600 dark:text-green-400" size={28} />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pagos de Sesiones</h1>
      </div>
      <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Pagos pendientes</h2>
      {loading ? (
        <div>Cargando pagos...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : pagosPendientes.length === 0 ? (
        <div className="text-gray-500 mb-6">No hay pagos pendientes.</div>
      ) : (
        <ul className="mb-6 space-y-2">
          {pagosPendientes.map(p => (
            <li key={p.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded p-3">
              <span>
                <span className="font-semibold">{p.pacienteId}</span> | Sesión #{p.sessionId} | Monto: <span className="font-bold">${p.monto}</span>
              </span>
              <Button
                className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                onClick={() => handlePagoSelect(p.id)}
              >
                Ver y pagar
              </Button>
            </li>
          ))}
        </ul>
      )}

      {selectedPago && !showTicket && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-800 rounded p-4 mb-4">
          <h3 className="font-bold mb-2 text-blue-700">Registrar pago de sesión</h3>
          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Monto ($)</label>
            <Input
              type="number"
              min="0"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Nota</label>
            <Input
              type="text"
              value={nota}
              onChange={e => setNota(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              disabled={submitting}
            >
              Marcar como pagado
            </Button>
            <Button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => setSelectedPago(null)}
            >
              Cancelar
            </Button>
          </div>
          {mensaje && <div className="mt-2 text-green-600 font-semibold">{mensaje}</div>}
        </form>
      )}

      {selectedPago && showTicket && (
        <div
          ref={ticketRef}
          className="mx-auto w-96 rounded-xl shadow-lg p-6 mb-6 font-mono text-left"
          style={{
            maxWidth: 400,
            fontFamily: "monospace",
            letterSpacing: "0.02em",
            background: "linear-gradient(135deg, #ffffff 0%, #f3f4f6 60%, #e5e7eb 100%)", // solo colores soportados
            border: "1px solid #d1d5db",
            color: "#111827"
          }}
        >
          <div className="mb-4">
            <span style={{ color: "#2563eb" }} className="text-2xl font-extrabold tracking-wide mb-1 block">PsiFirm</span>
            <span className="text-xs" style={{ color: "#6b7280" }}>Comprobante de Pago</span>
            <span className="w-full border-b border-dashed my-2 block" style={{ borderColor: "#d1d5db" }}></span>
          </div>
          <div className="space-y-2 text-sm mb-4">
            <div><span className="font-semibold" style={{ color: "#374151" }}>Código:</span> <span>{pagoSeleccionado?.codigo}</span></div>
            <div><span className="font-semibold" style={{ color: "#374151" }}>Paciente:</span> <span>{pagoSeleccionado?.pacienteId}</span></div>
            <div><span className="font-semibold" style={{ color: "#374151" }}>Sesión:</span> <span>#{pagoSeleccionado?.sessionId}</span></div>
            <div><span className="font-semibold" style={{ color: "#374151" }}>Monto:</span> <span style={{ color: "#059669", fontWeight: "bold" }}>${monto}</span></div>
            <div><span className="font-semibold" style={{ color: "#374151" }}>Pagado:</span> <span>Sí</span></div>
            <div><span className="font-semibold" style={{ color: "#374151" }}>Fecha de pago:</span> <span>{new Date().toLocaleString()}</span></div>
            <div><span className="font-semibold" style={{ color: "#374151" }}>Notas:</span> <span>{nota}</span></div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs" style={{ color: "#6b7280" }}>Generado: {new Date().toLocaleString()}</span>
            <span className="text-xs" style={{ color: "#9ca3af" }}>Ticket #{pagoSeleccionado?.id}</span>
          </div>
          {mensaje && <div className="mt-2 font-semibold" style={{ color: "#059669" }}>{mensaje}</div>}
        </div>
      )}
    </div>
  );
}