"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdCalendarMonth, MdEmojiEvents, MdImage, MdPictureAsPdf } from "react-icons/md";
import { toast } from "react-hot-toast";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import api from "@/service/api.service";
import { useAuth } from "@/context/AuthContext";

type UserResumen = {
  id?: number;
  firstname?: string;
  lastname?: string;
};

type CongresoResumen = {
  id?: number;
  titulo?: string;
  fechaFin?: string;
};

type Actividad = {
  id: number;
  nombre: string;
  tipo: string;
  estadoId?: string;
  horaInicio?: string;
  horaFin?: string;
  createdAt?: string;
  userId?: number | UserResumen;
  congresoId?: number | CongresoResumen;
};

type PaginatedResponse<T> = {
  content?: T[];
  data?: T[] | PaginatedResponse<T>;
  items?: T[];
  totalPages?: number;
  totalElements?: number;
  total?: number;
  totalItems?: number;
};

type DiplomaPayload = {
  fullName: string;
  actividadName: string;
  congresoName: string;
  dateLabel: string;
};

const pageSize = 20;

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("es-GT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const resolveContent = (response: PaginatedResponse<Actividad> | Actividad[]) => {
  if (Array.isArray(response)) {
    return {
      content: response,
      totalPages: 1,
      totalItems: response.length,
    };
  }

  let nestedData: PaginatedResponse<Actividad> | null = null;
  if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
    nestedData = response.data;
  }

  let content: Actividad[] = [];
  if (Array.isArray(response.content)) content = response.content;
  else if (Array.isArray(response.items)) content = response.items;
  else if (Array.isArray(response.data)) content = response.data;
  else if (Array.isArray(nestedData?.content)) content = nestedData.content;

  const totalPages = Number(response.totalPages ?? nestedData?.totalPages ?? 1);
  const totalItems = Number(
    response.totalElements ??
      response.totalItems ??
      response.total ??
      nestedData?.totalElements ??
      nestedData?.totalItems ??
      nestedData?.total ??
      content.length
  );

  return {
    content,
    totalPages: Number.isNaN(totalPages) ? 1 : Math.max(1, totalPages),
    totalItems: Number.isNaN(totalItems) ? content.length : totalItems,
  };
};

const resolveUserId = (value: Actividad["userId"]) => {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "id" in value) {
    const parsed = Number((value as { id?: unknown }).id);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const resolveCongreso = (value: Actividad["congresoId"]) => {
  if (!value || typeof value !== "object") return null;
  return value;
};

const isAccepted = (status?: string) => {
  const normalized = (status || "").toUpperCase();
  return normalized === "ACEPTADA" || normalized === "APROBADA";
};

const isFinishedCongreso = (congreso: CongresoResumen | null) => {
  if (!congreso?.fechaFin) return false;
  const end = new Date(congreso.fechaFin);
  if (Number.isNaN(end.getTime())) return false;
  return end.getTime() <= Date.now();
};

function DiplomaHtmlTemplate({
  payload,
  compact = false,
  templateRef,
}: Readonly<{ payload: DiplomaPayload; compact?: boolean; templateRef?: React.RefObject<HTMLDivElement | null> }>) {
  const sizeStyle = compact ? undefined : { width: 1200, height: 850 };
  const titleClass = compact ? "text-4xl" : "text-7xl";
  const subtitleClass = compact ? "text-xl" : "text-4xl";
  const bodyClass = compact ? "text-sm" : "text-2xl";
  const nameClass = compact ? "text-5xl" : "text-8xl";
  const activityClass = compact ? "text-lg" : "text-3xl";
  const congresoClass = compact ? "text-sm" : "text-2xl";
  const paddingClass = compact ? "px-6 py-10" : "px-16 py-14";
  const badgeSizeClass = compact ? "h-16 w-16 text-[10px]" : "h-22 w-22 text-sm";

  return (
    <div
      ref={templateRef}
      style={sizeStyle}
      className={`${compact ? "w-full" : ""} relative overflow-hidden border-4 border-slate-700 bg-white`}
    >
      <div className="absolute inset-x-0 top-0 h-6 bg-slate-700" />
      <div className="absolute inset-x-0 bottom-0 h-6 bg-slate-700" />

      <div className="absolute -right-10 -top-10 h-44 w-72 rotate-12 bg-brand-700/95" />
      <div className="absolute -right-8 -top-8 h-40 w-72 rotate-12 bg-brand-500/85" />
      <div className="absolute -right-6 -top-6 h-36 w-72 rotate-12 bg-cyan-400/80" />

      <div className="absolute -left-12 -bottom-10 h-44 w-80 -rotate-12 bg-brand-700/95" />
      <div className="absolute -left-10 -bottom-8 h-40 w-80 -rotate-12 bg-brand-500/85" />
      <div className="absolute -left-8 -bottom-6 h-36 w-80 -rotate-12 bg-cyan-400/80" />

      <div className="absolute right-20 top-24 h-[74%] w-22 skew-x-[-14deg] bg-slate-200/35" />

      <div className={`${paddingClass} relative z-10 text-center`}>
        <div className="mx-auto mb-5 flex items-center justify-center gap-4">
          <div className={`flex items-center justify-center rounded-full border-4 border-amber-300 bg-amber-500 font-bold uppercase tracking-wide text-amber-100 shadow-sm ${badgeSizeClass}`}>
            Award
          </div>
          <div>
            <p className={`${titleClass} font-serif leading-none text-slate-900`}>CERTIFICATE</p>
            <p className={`${subtitleClass} font-serif text-slate-700`}>Of Achievement</p>
          </div>
        </div>

        <p className={`${bodyClass} text-slate-600`}>This certificate is awarded to:</p>
        <p className={`${nameClass} mt-3 font-serif italic leading-tight text-cyan-700`}>{payload.fullName}</p>

        <p className={`${compact ? "mt-5 text-sm" : "mt-8 text-xl"} text-slate-600`}>por su participación en la actividad</p>
        <p className={`${activityClass} mt-2 font-semibold text-slate-900`}>{payload.actividadName}</p>
        <p className={`${congresoClass} mt-2 text-slate-700`}>del congreso {payload.congresoName}</p>

        <div className={`${compact ? "mt-8" : "mt-16"} grid grid-cols-2 gap-8 text-slate-600`}>
          <div>
            <div className={`mx-auto mb-1 h-px ${compact ? "w-28" : "w-40"} bg-slate-400`} />
            <p className={`${compact ? "text-[11px]" : "text-sm"}`}>Signature</p>
          </div>
          <div>
            <div className={`mx-auto mb-1 h-px ${compact ? "w-28" : "w-40"} bg-slate-400`} />
            <p className={`${compact ? "text-[11px]" : "text-sm"}`}>Date</p>
            <p className={`${compact ? "text-[11px]" : "text-sm"}`}>{payload.dateLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParticipanteDiplomasPage() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadingExample, setDownloadingExample] = useState(false);
  const [exportPayload, setExportPayload] = useState<DiplomaPayload | null>(null);

  const exportPreviewRef = useRef<HTMLDivElement | null>(null);

  const fullName = `${currentUser?.firstname || ""} ${currentUser?.lastname || ""}`.trim() || "Participante";
  const today = formatDate(new Date().toISOString());

  const examplePayload: DiplomaPayload = {
    fullName,
    actividadName: "Ponencia magistral: Innovación en Terapia Cognitiva",
    congresoName: "Congreso Internacional de Salud Mental 2026",
    dateLabel: today,
  };

  const waitForRender = () =>
    new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 0);
    });

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = (await api.get("/actividades", {
        params: {
          page: currentPage - 1,
          size: pageSize,
        },
      })) as PaginatedResponse<Actividad> | Actividad[];

      const parsed = resolveContent(response);

      const filtered = parsed.content.filter((item) => {
        const ownerMatch = currentUser?.id ? resolveUserId(item.userId) === currentUser.id : true;
        const accepted = isAccepted(item.estadoId);
        const finished = isFinishedCongreso(resolveCongreso(item.congresoId));
        return ownerMatch && accepted && finished;
      });

      setItems(filtered);
      setTotalPages(parsed.totalPages);
      setTotalItems(filtered.length);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Error al cargar diplomas";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentUser?.id]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const hasItems = useMemo(() => items.length > 0, [items.length]);
  const getPreviewDataUrl = async (payload: DiplomaPayload) => {
    if (!exportPreviewRef.current) {
      throw new Error("No se pudo preparar el diploma.");
    }

    setExportPayload(payload);
    await waitForRender();
    return toPng(exportPreviewRef.current, { pixelRatio: 2, cacheBust: true });
  };

  const exportImage = async (payload: DiplomaPayload, fileBase: string) => {
    try {
      const dataUrl = await getPreviewDataUrl(payload);
      const blob = await (await fetch(dataUrl)).blob();
      saveAs(blob, `${fileBase}.png`);
      toast.success("Diploma descargado como imagen");
    } catch (requestError) {
      console.error(requestError);
      toast.error("No fue posible descargar la imagen del diploma.");
    }
  };

  const exportPdf = async (payload: DiplomaPayload, fileBase: string) => {
    try {
      const dataUrl = await getPreviewDataUrl(payload);
      const pdfDoc = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });
      const pageWidth = pdfDoc.internal.pageSize.getWidth();
      const pageHeight = pdfDoc.internal.pageSize.getHeight();
      pdfDoc.addImage(dataUrl, "PNG", 0, 0, pageWidth, pageHeight);
      const blob = pdfDoc.output("blob");
      saveAs(blob, `${fileBase}.pdf`);
      toast.success("Diploma descargado en PDF");
    } catch (requestError) {
      console.error(requestError);
      toast.error("No fue posible descargar el PDF del diploma.");
    }
  };

  const buildPayloadFromItem = (item: Actividad): DiplomaPayload => {
    const congreso = resolveCongreso(item.congresoId);
    return {
      fullName,
      actividadName: item.nombre,
      congresoName: congreso?.titulo || "Congreso",
      dateLabel: today,
    };
  };

  const downloadExample = async (format: "pdf" | "image") => {
    setDownloadingExample(true);
    if (format === "pdf") {
      await exportPdf(examplePayload, "diploma-ejemplo");
    } else {
      await exportImage(examplePayload, "diploma-ejemplo");
    }
    setDownloadingExample(false);
  };

  const downloadItem = async (item: Actividad, format: "pdf" | "image") => {
    setDownloadingId(item.id);
    const payload = buildPayloadFromItem(item);

    if (format === "pdf") {
      await exportPdf(payload, `diploma-${item.id}`);
    } else {
      await exportImage(payload, `diploma-${item.id}`);
    }

    setDownloadingId(null);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Mis diplomas</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Aquí verás tus diplomas cuando el congreso haya finalizado y tu actividad esté aprobada.
        </p>
      </section>

      <section className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-5 dark:border-brand-500/30 dark:bg-brand-500/10 lg:p-6">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">Vista previa de diploma (ejemplo)</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Puedes descargar este ejemplo para ver cómo se entregará el diploma final.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={downloadingExample}
            onClick={() => void downloadExample("pdf")}
            className="inline-flex items-center gap-2"
          >
            <MdPictureAsPdf className="h-4 w-4" />
            {downloadingExample ? "Generando..." : "Descargar ejemplo PDF"}
          </Button>
          <Button
            variant="outline"
            disabled={downloadingExample}
            onClick={() => void downloadExample("image")}
            className="inline-flex items-center gap-2"
          >
            <MdImage className="h-4 w-4" />
            Descargar ejemplo imagen
          </Button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-theme-xs dark:border-brand-500/30 dark:bg-gray-900">
          <div className="border-b border-brand-100 bg-brand-50/60 px-4 py-2 text-xs font-medium text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
            Previsualización del diploma
          </div>
          <div className="p-4">
            <div className="mx-auto w-full sm:w-[70%] md:w-[50%] lg:w-[30%]">
              <DiplomaHtmlTemplate compact payload={examplePayload} />
            </div>
          </div>
        </div>

        <div style={{ position: "fixed", left: -9999, top: -9999 }}>
          <DiplomaHtmlTemplate payload={exportPayload || examplePayload} templateRef={exportPreviewRef} />
        </div>
      </section>

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/3 dark:text-gray-300">
          Cargando diplomas...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-error-200 bg-error-50 p-5 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          {error}
        </div>
      )}

      {!loading && !error && !hasItems && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/3 dark:text-gray-300">
          Aún no tienes diplomas disponibles.
        </div>
      )}

      {!loading && !error && hasItems && (
        <div className="grid gap-4">
          {items.map((item) => {
            const congreso = resolveCongreso(item.congresoId);
            const thisDownloading = downloadingId === item.id;

            return (
              <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Diploma - {item.nombre}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Congreso: {congreso?.titulo || "Congreso"}</p>
                  </div>
                  <Badge color="success" size="sm">Disponible</Badge>
                </div>

                <div className="mt-4 grid gap-2 text-xs text-gray-700 dark:text-gray-300 sm:grid-cols-2 lg:grid-cols-3">
                  <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">
                    <MdEmojiEvents className="h-4 w-4 text-brand-500" />
                    Tipo: {item.tipo || "-"}
                  </p>
                  <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">
                    <MdCalendarMonth className="h-4 w-4 text-brand-500" />
                    Inicio: {formatDate(item.horaInicio)}
                  </p>
                  <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-2 dark:bg-gray-800/60">
                    <MdCalendarMonth className="h-4 w-4 text-brand-500" />
                    Fin: {formatDate(item.horaFin)}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={thisDownloading}
                    onClick={() => void downloadItem(item, "pdf")}
                    className="inline-flex items-center gap-2"
                  >
                    <MdPictureAsPdf className="h-4 w-4" />
                    {thisDownloading ? "Generando..." : "Descargar PDF"}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={thisDownloading}
                    onClick={() => void downloadItem(item, "image")}
                    className="inline-flex items-center gap-2"
                  >
                    <MdImage className="h-4 w-4" />
                    Descargar imagen
                  </Button>
                </div>
              </article>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
            <p className="text-sm text-gray-600 dark:text-gray-300">Total diplomas: {totalItems}</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage <= 1 || loading}>
                Anterior
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-200">Página {currentPage} de {totalPages}</span>
              <Button variant="outline" onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage >= totalPages || loading}>
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
