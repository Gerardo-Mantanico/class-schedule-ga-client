import type { Metadata } from "next";
import KanbanBoard from "@/components/task-kanban/task-Kanban";

export const metadata: Metadata = {
  title:
    "PsiFirm",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Psm() {
  return (
      <div className="col-span-12 space-y-6 xl:col-span-7">
       <KanbanBoard/>
    </div>
  );
}
