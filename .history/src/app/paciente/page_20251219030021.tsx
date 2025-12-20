import type { Metadata } from "next";
import ServicesSection from "@/components/home/ServicesSection";

export const metadata: Metadata = {
  title:
    "PsiFirm",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
       <ServicesSection/>
      </div>
  );
}
