"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  MdCampaign,
  MdCalendarMonth,
  MdCalendarToday,
  MdLocationOn,
  MdSchool,
} from "react-icons/md";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextCongreso from "@/components/form/input/TextArea";
import ImageUploader from "@/components/form/input/ImageUploader";
import { Modal } from "@/components/ui/modal";
import { useConvocatoria, type Convocatoria } from "@/hooks/useConvocatoria";
import { useActividad } from "@/hooks/useActividad";

type TipoActividad = "TALLER" | "PONENCIA";

type PropuestaForm = {
  nombre: string;
  descripcion: string;
  tipo: TipoActividad;
  capacidadMaxima: number;
  horaInicio: string;
  horaFin: string;
};

const initialForm: PropuestaForm = {
  nombre: "",
  descripcion: "",
  tipo: "TALLER",
  capacidadMaxima: 1,
  horaInicio: "",
  horaFin: "",
};

type InstitucionResumen = {
  nombre?: string;
};

type CongresoResumen = {
  id?: number;
  titulo?: string;
  ubicacion?: string;
  precioInscripcion?: number;
  fotoUrl?: string;
  institucionId?: InstitucionResumen | number | null;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("es-GT", { dateStyle: "medium", timeStyle: "short" });
};

const toIsoDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString();
};

const getCongresoResumen = (congresoId: unknown): CongresoResumen | null => {
  if (!congresoId || typeof congresoId !== "object") return null;
  return congresoId as CongresoResumen;
};

const getCongresoId = (congresoId: unknown): number => {
  if (typeof congresoId === "number") return congresoId;
  if (congresoId && typeof congresoId === "object" && "id" in congresoId) {
    const parsed = Number((congresoId as { id?: unknown }).id);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const getInstitucionNombre = (institucionId: unknown): string => {
  if (institucionId && typeof institucionId === "object" && "nombre" in institucionId) {
    return String((institucionId as { nombre?: string }).nombre || "-");
  }
  return "-";
};

const fallbackConvocatoriaImage = "/images/carousel/vitaly-gariev-iyeUwItlIPk-unsplash.jpg";

export default function ConvocatoriasParticipantePage() {
  const { convocatorias, loading, error } = useConvocatoria();
  const { createActividad, loading: savingPropuesta } = useActividad();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState<Convocatoria | null>(null);
  const [form, setForm] = useState<PropuestaForm>(initialForm);
  const [adjuntos, setAdjuntos] = useState<string[]>([]);

  const convocatoriasDisponibles = useMemo(() => {
    return convocatorias.filter((convocatoria) => {
      const estado = String(convocatoria.estado ?? "").toUpperCase();
      return estado !== "INACTIVO";
    });
  }, [convocatorias]);

  const openPropuestaModal = (convocatoria: Convocatoria) => {
    setConvocatoriaSeleccionada(convocatoria);
    setForm(initialForm);
    setAdjuntos([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setConvocatoriaSeleccionada(null);
    setAdjuntos([]);
  };

  const validateForm = () => {
    if (!form.nombre.trim()) {
      toast.error("El nombre de la propuesta es obligatorio.");
      return false;
    }

    if (!form.descripcion.trim()) {
      toast.error("La descripción de la propuesta es obligatoria.");
      return false;
    }

    if (!form.horaInicio || !form.horaFin) {
      toast.error("Debes ingresar hora de inicio y hora de finalización.");
      return false;
    }

    const inicio = new Date(form.horaInicio);
    const fin = new Date(form.horaFin);

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
      toast.error("Las fechas u horas no son válidas.");
      return false;
    }

    if (inicio > fin) {
      toast.error("La hora de inicio no puede ser posterior a la hora de finalización.");
      return false;
    }

    if (form.tipo === "TALLER" && form.capacidadMaxima <= 0) {
      toast.error("Para talleres, el cupo limitado debe ser mayor a 0.");
      return false;
    }

    if (form.capacidadMaxima < 0) {
      toast.error("El cupo no puede ser negativo.");
      return false;
    }

    return true;
  };

  const submitPropuesta = async () => {
    if (!convocatoriaSeleccionada) {
      toast.error("No se encontró la convocatoria seleccionada.");
      return;
    }

    if (!validateForm()) return;

    const convocatoriaCongresoId = getCongresoId(convocatoriaSeleccionada.congresoId as unknown);

    if (!convocatoriaCongresoId) {
      toast.error("No fue posible identificar el congreso de la convocatoria.");
      return;
    }

    const payloadBase = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      tipo: form.tipo,
      horaInicio: toIsoDate(form.horaInicio),
      horaFin: toIsoDate(form.horaFin),
      capacidadMaxima: Number(form.capacidadMaxima || 0),
      congresoId: convocatoriaCongresoId,
      convocatoriaId: Number(convocatoriaSeleccionada.id || 0),
      archivoUrl: adjuntos[0] || "",
    };

    const saved = await createActividad(payloadBase);

    if (!saved) {
      toast.error("No se pudo registrar la propuesta. Inténtalo nuevamente.");
      return;
    }

    toast.success("Propuesta enviada correctamente.");
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Convocatorias disponibles</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Revisa las convocatorias y agrega tu propuesta como taller o ponencia.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/3 dark:text-gray-300">
          Cargando convocatorias...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-error-200 bg-error-50 p-5 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
          No se pudieron cargar las convocatorias: {error}
        </div>
      )}

      {!loading && !error && convocatoriasDisponibles.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 dark:border-gray-800 dark:bg-white/3 dark:text-gray-300">
          No hay convocatorias disponibles en este momento.
        </div>
      )}

      {!loading && !error && convocatoriasDisponibles.length > 0 && (
        <div className="grid gap-5 lg:grid-cols-2">
          {convocatoriasDisponibles.map((convocatoria) => {
            const estadoNormalizado = String(convocatoria.estado ?? "ACTIVO").toUpperCase();
            const congreso = getCongresoResumen(convocatoria.congresoId as unknown);
            const institucionNombre = getInstitucionNombre(congreso?.institucionId);
            const congresoImagen = congreso?.fotoUrl?.trim() ? congreso.fotoUrl : fallbackConvocatoriaImage;

            return (
              <article
                key={convocatoria.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs transition hover:border-brand-300 hover:shadow-theme-sm dark:border-gray-800 dark:bg-white/3"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{convocatoria.nombre}</h3>
                  <Badge
                    color={estadoNormalizado === "ACTIVO" ? "success" : "warning"}
                    size="sm"
                  >
                    {estadoNormalizado || "ACTIVO"}
                  </Badge>
                </div>

                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{convocatoria.descripcion}</p>

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-700">
                    <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                      <img
                        src={congresoImagen}
                        alt={congreso?.titulo || convocatoria.nombre}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.src = fallbackConvocatoriaImage;
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-gray-800 dark:text-white/90">
                        {congreso?.titulo || "Congreso"}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                        <MdSchool className="h-4 w-4 text-brand-500" />
                        {institucionNombre}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-2 lg:grid-cols-1">
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1.5 text-xs dark:bg-gray-800/60">
                      <MdCalendarToday className="h-4 w-4 text-brand-500" />
                      <span>{formatDate(convocatoria.fechaInicio)}</span>
                    </p>
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1.5 text-xs dark:bg-gray-800/60">
                      <MdCalendarMonth className="h-4 w-4 text-brand-500" />
                      <span>{formatDate(convocatoria.fechaFin)}</span>
                    </p>
                    <p className="flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1.5 text-xs dark:bg-gray-800/60 sm:col-span-2 lg:col-span-1">
                      <MdLocationOn className="h-4 w-4 text-brand-500" />
                      <span>{congreso?.ubicacion || "Ubicación por confirmar"}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-300">
                    <MdCampaign className="h-4 w-4" />
                    Participa con tu propuesta
                  </p>
                  <Button onClick={() => openPropuestaModal(convocatoria)}>Agregar propuesta</Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-175 m-4">
        <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <div className="mb-4 px-2">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">Agregar propuesta</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Convocatoria: {convocatoriaSeleccionada?.nombre || "-"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-4 px-2 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Nombre</Label>
              <Input
                type="text"
                placeholder="Título de tu taller o ponencia"
                value={form.nombre}
                onChange={(event) => setForm({ ...form, nombre: event.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Descripción</Label>
              <TextCongreso
                placeholder="Detalle de lo que tratará tu propuesta"
                value={form.descripcion}
                onChange={(value) => setForm({ ...form, descripcion: value })}
                rows={4}
              />
            </div>

            <div>
              <Label>Tipo de actividad</Label>
              <select
                value={form.tipo}
                onChange={(event) =>
                  setForm((current) => {
                    const nextTipo = event.target.value as TipoActividad;
                    return {
                      ...current,
                      tipo: nextTipo,
                      capacidadMaxima: nextTipo === "PONENCIA" ? 0 : Math.max(current.capacidadMaxima, 1),
                    };
                  })
                }
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                <option value="TALLER">TALLER</option>
                <option value="PONENCIA">PONENCIA</option>
              </select>
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                Importante: el tipo no debe modificarse una vez creada la actividad.
              </p>
            </div>

            {form.tipo === "TALLER" && (
              <div>
                <Label>Cupo limitado</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.capacidadMaxima}
                  onChange={(event) => setForm({ ...form, capacidadMaxima: Number(event.target.value || 0) })}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Para talleres debe ser mayor a 0.
                </p>
              </div>
            )}

            <div>
              <Label>Hora de inicio</Label>
              <Input
                type="datetime-local"
                value={form.horaInicio}
                onChange={(event) => setForm({ ...form, horaInicio: event.target.value })}
              />
            </div>

            <div>
              <Label>Hora de finalización</Label>
              <Input
                type="datetime-local"
                value={form.horaFin}
                onChange={(event) => setForm({ ...form, horaFin: event.target.value })}
              />
            </div>
             <div className="md:col-span-2">
              <Label>Archivos adjuntos (imágenes o PDF)</Label>
              <ImageUploader
                images={adjuntos}
                onChange={setAdjuntos}
                multiple
                accept="image/*,.pdf"
                buttonText="Seleccionar archivos"
                helperText="Sube imágenes o documentos PDF para respaldar tu propuesta"
                emptyText="Aún no has seleccionado archivos"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 px-2">
            <Button variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button onClick={submitPropuesta} disabled={savingPropuesta}>
              {savingPropuesta ? "Enviando..." : "Guardar propuesta"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
