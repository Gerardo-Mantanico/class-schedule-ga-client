import type { Metadata } from "next";
import ServicesSection from "@/components/home/ServicesSection";

export const metadata: Metadata = {
  title:
    "PsiFirm",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
      <div className="col-span-12 space-y-6 xl:col-span-7">
       <ServicesSection/>
    </div>
  );
}
