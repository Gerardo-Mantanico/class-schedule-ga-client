import type { Metadata } from "next";
import HorarioTable from "@/components/tables/HorarioTable";

export const metadata: Metadata = {
  title: "Horarios",
  description: "Modificación manual de horarios generados",
};

export default function HorariosPage() {
  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="min-w-0">
        <HorarioTable />
      </div>
    </div>
  );
}
