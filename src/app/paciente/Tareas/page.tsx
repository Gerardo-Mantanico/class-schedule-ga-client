"use client";
import { useState } from "react";
import { MdQuestionAnswer, MdSend } from "react-icons/md";
import Button from "@/components/ui/button/Button";

export default function FormularioPregunta() {
  const [pregunta, setPregunta] = useState("");
  const [error, setError] = useState("");
  const [enviada, setEnviada] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEnviada(null);

    if (!pregunta.trim()) {
      setError("Por favor, escribe tu pregunta.");
      return;
    }

    // Aquí podrías enviar la pregunta al backend
    setEnviada(pregunta);
    setPregunta("");
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
        <MdQuestionAnswer size={28} /> Haz una pregunta
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="border rounded p-2 w-full"
          rows={4}
          placeholder="Escribe tu pregunta aquí..."
          value={pregunta}
          onChange={e => setPregunta(e.target.value)}
          maxLength={300}
        />
        {error && <div className="text-red-600">{error}</div>}
        <Button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1"
        >
          <MdSend size={18} /> Enviar pregunta
        </Button>
      </form>
      {enviada && (
        <div className="mt-4 p-3 bg-green-50 rounded text-green-700">
          <strong>Pregunta enviada:</strong>
          <div>{enviada}</div>
        </div>
      )}
    </div>
  );
}