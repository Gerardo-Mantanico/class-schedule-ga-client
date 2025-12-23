"use client";

import React, { useRef } from "react";
import Button from "@/components/ui/button/Button";
import { MdPictureAsPdf, MdImage, MdTableChart, MdBarChart } from "react-icons/md";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Datos de ejemplo
const reportes = {
  financieros: [
    { periodo: "Enero 2025", ingresos: 12000, ganancias: 4000, nomina: 3000 },
    { periodo: "Febrero 2025", ingresos: 15000, ganancias: 5000, nomina: 3200 },
  ],
  inventario: [
    { medicamento: "Paracetamol", stock: 15, minimo: 10, ventas: 120 },
    { medicamento: "Ibuprofeno", stock: 8, minimo: 10, ventas: 95 },
  ],
  recursosHumanos: [
    { empleado: "Ana Pérez", pagos: 2000, bonos: 200, retenciones: 150 },
    { empleado: "Luis Gómez", pagos: 2200, bonos: 150, retenciones: 180 },
  ],
};

function exportar(ref: React.RefObject<HTMLDivElement>, nombre: string, tipo: "pdf" | "img") {
  if (!ref.current) return;
  html2canvas(ref.current).then(canvas => {
    if (tipo === "pdf") {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${nombre}.pdf`);
    } else {
      canvas.toBlob(blob => {
        if (blob) saveAs(blob, `${nombre}.png`);
      });
    }
  });
}

function exportarExcel(datos: any[], nombre: string) {
  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reporte");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, `${nombre}.xlsx`);
}

export default function Reportes() {
  const refFinancieros = useRef<HTMLDivElement>(null);
  const refInventario = useRef<HTMLDivElement>(null);
  const refRH = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <MdBarChart className="text-blue-600 dark:text-blue-400" size={28} />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reportes</h1>
      </div>

      {/* Reporte Financiero */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Financieros: Ingresos, Ganancias y Nómina</h2>
          <div className="flex gap-1">
            <Button onClick={() => exportar(refFinancieros, "financieros", "pdf")} className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdPictureAsPdf size={14}/>PDF</Button>
            <Button onClick={() => exportar(refFinancieros, "financieros", "img")} className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdImage size={14}/>Imagen</Button>
            <Button onClick={() => exportarExcel(reportes.financieros, "financieros")} className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdTableChart size={14}/>Excel</Button>
          </div>
        </div>
        <div ref={refFinancieros} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b py-1 px-2">Período</th>
                <th className="border-b py-1 px-2">Ingresos</th>
                <th className="border-b py-1 px-2">Ganancias</th>
                <th className="border-b py-1 px-2">Costo Nómina</th>
              </tr>
            </thead>
            <tbody>
              {reportes.financieros.map((item, idx) => (
                <tr key={item.periodo} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-700"}>
                  <td className="py-1 px-2">{item.periodo}</td>
                  <td className="py-1 px-2">${item.ingresos}</td>
                  <td className="py-1 px-2">${item.ganancias}</td>
                  <td className="py-1 px-2">${item.nomina}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reporte Inventario */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Inventario: Medicamentos y Ventas</h2>
          <div className="flex gap-1">
            <Button onClick={() => exportar(refInventario, "inventario", "pdf")} className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdPictureAsPdf size={14}/>PDF</Button>
            <Button onClick={() => exportar(refInventario, "inventario", "img")} className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdImage size={14}/>Imagen</Button>
            <Button onClick={() => exportarExcel(reportes.inventario, "inventario")} className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdTableChart size={14}/>Excel</Button>
          </div>
        </div>
        <div ref={refInventario} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b py-1 px-2">Medicamento</th>
                <th className="border-b py-1 px-2">Stock</th>
                <th className="border-b py-1 px-2">Mínimo</th>
                <th className="border-b py-1 px-2">Ventas</th>
              </tr>
            </thead>
            <tbody>
              {reportes.inventario.map((item, idx) => (
                <tr key={item.medicamento} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-700"}>
                  <td className="py-1 px-2">{item.medicamento}</td>
                  <td className="py-1 px-2">{item.stock}</td>
                  <td className="py-1 px-2">{item.minimo}</td>
                  <td className="py-1 px-2">{item.ventas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reporte Recursos Humanos */}
      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Recursos Humanos: Pagos, Bonos y Retenciones</h2>
          <div className="flex gap-1">
            <Button onClick={() => exportar(refRH, "recursos_humanos", "pdf")} className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdPictureAsPdf size={14}/>PDF</Button>
            <Button onClick={() => exportar(refRH, "recursos_humanos", "img")} className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdImage size={14}/>Imagen</Button>
            <Button onClick={() => exportarExcel(reportes.recursosHumanos, "recursos_humanos")} className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"><MdTableChart size={14}/>Excel</Button>
          </div>
        </div>
        <div ref={refRH} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b py-1 px-2">Empleado</th>
                <th className="border-b py-1 px-2">Pagos</th>
                <th className="border-b py-1 px-2">Bonos</th>
                <th className="border-b py-1 px-2">Retenciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.recursosHumanos.map((item, idx) => (
                <tr key={item.empleado} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-700"}>
                  <td className="py-1 px-2">{item.empleado}</td>
                  <td className="py-1 px-2">${item.pagos}</td>
                  <td className="py-1 px-2">${item.bonos}</td>
                  <td className="py-1 px-2">${item.retenciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}