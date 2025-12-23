"use client";

import React, { useRef } from "react";
import Button from "@/components/ui/button/Button";
import { MdPictureAsPdf, MdImage, MdTableChart, MdBarChart } from "react-icons/md";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Datos de ejemplo
const estadisticas = [
  { area: "Psicología Infantil", sesiones: 24 },
  { area: "Psicología Adultos", sesiones: 31 },
  { area: "Terapia Familiar", sesiones: 12 },
  { area: "Psicopedagogía", sesiones: 8 },
];

export default function ReporteClinico() {
  const refReporte = useRef<HTMLDivElement>(null);

  // Descargar como PDF
  const handleDescargarPDF = async () => {
    if (!refReporte.current) return;
    const canvas = await html2canvas(refReporte.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("reporte_clinico.pdf");
  };

  // Descargar como Imagen
  const handleDescargarImagen = async () => {
    if (!refReporte.current) return;
    const canvas = await html2canvas(refReporte.current);
    canvas.toBlob(blob => {
      if (blob) saveAs(blob, "reporte_clinico.png");
    });
  };

  // Descargar como Excel
  const handleDescargarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(estadisticas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "reporte_clinico.xlsx");
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <MdBarChart className="text-blue-600 dark:text-blue-400" size={32} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reportes Clínicos</h1>
      </div>
      <div className="flex gap-3 mb-6">
        <Button onClick={handleDescargarPDF} className="flex items-center bg-red-500 gap-2">
          <MdPictureAsPdf size={20} /> PDF
        </Button>
        <Button onClick={handleDescargarImagen} className="flex items-center gap-2">
          <MdImage size={20} /> Imagen
        </Button>
        <Button onClick={handleDescargarExcel} className="flex items-center gap-2">
          <MdTableChart size={20} /> Excel
        </Button>
      </div>
      <div ref={refReporte} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Estadísticas de atención por área</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2 px-4 text-gray-700 dark:text-gray-300">Área</th>
              <th className="border-b py-2 px-4 text-gray-700 dark:text-gray-300">Número de sesiones</th>
            </tr>
          </thead>
          <tbody>
            {estadisticas.map((item, idx) => (
              <tr key={item.area} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-100 dark:bg-gray-700"}>
                <td className="py-2 px-4">{item.area}</td>
                <td className="py-2 px-4">{item.sesiones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}