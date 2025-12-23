"use client";

import React, { useRef } from "react";
import Button from "@/components/ui/button/Button";
import Tabla from "@/components/ui/tabla/Tabla"; // Ajusta la ruta si es necesario
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

const columnas = [
  { Header: "Área", accessor: "area" },
  { Header: "Número de sesiones", accessor: "sesiones" },
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
        <MdBarChart className="text-blue-600 dark:text-blue-400" size={28} />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reportes Clínicos</h1>
      </div>
      <div className="flex justify-end gap-2 mb-4">
        <Button
          onClick={handleDescargarPDF}
          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-md"
        >
          <MdPictureAsPdf size={16} /> PDF
        </Button>
        <Button
          onClick={handleDescargarImagen}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded-md"
        >
          <MdImage size={16} /> Imagen
        </Button>
        <Button
          onClick={handleDescargarExcel}
          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-sm py-1 px-3 rounded-md"
        >
          <MdTableChart size={16} /> Excel
        </Button>
      </div>
      <div ref={refReporte} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h2 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">Estadísticas de atención por área</h2>
        <Tabla columns={columnas} data={estadisticas} size="sm" />
      </div>
    </div>
  );
}