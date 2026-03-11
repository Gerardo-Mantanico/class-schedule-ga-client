"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ParticipanteCitaPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/participante/diplomas");
  }, [router]);

  return null;
}