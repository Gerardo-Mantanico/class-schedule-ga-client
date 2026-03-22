import type { Metadata } from "next";
import HorarioTable from "@/components/tables/HorarioTable";

export const metadata: Metadata = {
  title: "Horario embebido",
  description: "Vista pública para mostrar un horario generado por ID",
};

interface EmbeddedHorarioPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmbeddedHorarioPage({ params }: Readonly<EmbeddedHorarioPageProps>) {
  const resolvedParams = await params;
  const parsedId = Number(resolvedParams.id);
  const generatedScheduleId = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : undefined;

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6">
      <HorarioTable initialGeneratedScheduleId={generatedScheduleId} hideGeneratedList readOnly />
    </div>
  );
}
