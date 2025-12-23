"use client";

import React, { useState, useRef } from "react";
import Button from "@/components/ui/button/Button";
import { MdPayment, MdPictureAsPdf } from "react-icons/md";
import Input from "@/components/form/input/InputField";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const pacientes = [
  { id: 1, nombre: "Ana Pérez" },
  { id: 2, nombre: "Luis Gómez" },
];

export default function PagoSesion() {
  const [paciente, setPaciente] = useState("");
  const [fecha, setFecha] = useState("");
  const [monto, setMonto] = useState("");
  const [metodo, setMetodo] = useState("efectivo");
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mostrarTicket, setMostrarTicket] = useState(false);

  const ticketRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("¡Pago registrado correctamente!");
    setMostrarTicket(true);
    setTimeout(() => setMensaje(""), 3000);
  };

  const handleDescargarPDF = async () => {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [300, 420],
    });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = 260;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 20, 20, pdfWidth, pdfHeight);
    pdf.save(`ticket_pago_${paciente}_${fecha}.pdf`);
  };

  const handleNuevoPago = () => {
    setPaciente("");
    setFecha("");
    setMonto("");
    setMetodo("efectivo");
    setComentario("");
    setMostrarTicket(false);
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-8">
      <div className="flex items-center gap-3 mb-6">
        <MdPayment className="text-green-600 dark:text-green-400" size={28} />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pago de Sesión</h1>
      </div>
      {!mostrarTicket ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Paciente</label>
            <select
              value={paciente}
              onChange={e => setPaciente(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Selecciona un paciente</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.nombre}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Fecha de sesión</label>
            <Input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Monto ($)</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Método de pago</label>
            <select
              value={metodo}
              onChange={e => setMetodo(e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-200">Comentario (opcional)</label>
            <textarea
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              rows={2}
            />
          </div>
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Registrar Pago
          </Button>
          {mensaje && <div className="mt-2 text-green-600 font-semibold">{mensaje}</div>}
        </form>
      ) : (
        <div>
          <div ref={ticketRef} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-sm w-[270px] mx-auto border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-2 font-bold text-lg text-gray-800 dark:text-white">Ticket de Pago</div>
            <div className="mb-1 text-gray-700 dark:text-gray-200">Paciente: <span className="font-semibold">{paciente}</span></div>
            <div className="mb-1 text-gray-700 dark:text-gray-200">Fecha: <span className="font-semibold">{fecha}</span></div>
            <div className="mb-1 text-gray-700 dark:text-gray-200">Monto: <span className="font-semibold">${monto}</span></div>
            <div className="mb-1 text-gray-700 dark:text-gray-200">Método: <span className="font-semibold capitalize">{metodo}</span></div>
            {comentario && (
              <div className="mb-1 text-gray-700 dark:text-gray-200">Comentario: <span className="font-semibold">{comentario}</span></div>
            )}
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">Gracias por su pago</div>
          </div>
          <div className="flex gap-2 justify-center mt-4">
            <Button onClick={handleDescargarPDF} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-xs">
              <MdPictureAsPdf size={16} /> Descargar PDF
            </Button>
            <Button onClick={handleNuevoPago} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs">
              Nuevo Pago
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}