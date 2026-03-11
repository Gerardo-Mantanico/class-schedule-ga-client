"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { MdCampaign, MdCheckCircle, MdClose, MdEvent } from "react-icons/md";
import { useCongreso } from "@/hooks/useCongreso";
import { useConvocatoria, type Convocatoria } from "@/hooks/useConvocatoria";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextCongreso from "@/components/form/input/TextArea";
import { GenericTable, type Column } from "@/components/ui/table/GenericTable";

type FormData = {
	nombre: string;
	descripcion: string;
	fechaInicio: string;
	fechaFin: string;
};

const formatDateTime = (value?: string) => {
	if (!value) return "N/A";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("es-MX", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
};

const formatCurrency = (value?: number) => {
	if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
	return new Intl.NumberFormat("es-MX", {
		style: "currency",
		currency: "MXN",
		maximumFractionDigits: 2,
	}).format(value);
};

const toDateTimeLocal = (value?: string) => {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	const timezoneOffset = date.getTimezoneOffset() * 60_000;
	return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const fallbackCongresoImage = "/images/carousel/vitaly-gariev-iyeUwItlIPk-unsplash.jpg";

const getInstitucionNombre = (institucionId: unknown) => {
	if (typeof institucionId === "object" && institucionId !== null && "nombre" in institucionId) {
		return String((institucionId as { nombre?: string }).nombre ?? "N/A");
	}
	return "N/A";
};

const normalizeEstado = (estado?: boolean | string) => {
	if (typeof estado === "boolean") {
		return estado ? "ACTIVO" : "INACTIVO";
	}

	if (typeof estado === "string") {
		return estado.trim().toUpperCase();
	}

	return "N/A";
};

const estadoBadgeClass = (estado?: boolean | string) => {
	const normalizedEstado = normalizeEstado(estado);

	if (normalizedEstado === "ACTIVO") {
		return "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-300";
	}

	if (normalizedEstado === "INACTIVO") {
		return "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-300";
	}

	return "bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300";
};

const estadoLabel = (estado?: boolean | string) => {
	const normalizedEstado = normalizeEstado(estado);
	if (normalizedEstado === "ACTIVO") return "ACTIVO";
	if (normalizedEstado === "INACTIVO") return "INACTIVO";
	return normalizedEstado;
};

const renderConvocatoriaCell = (convocatoria: Convocatoria) => (
	<div>
		<p className="font-medium text-gray-800 dark:text-white/90">{convocatoria.nombre}</p>
	</div>
);

const renderEstadoCell = (convocatoria: Convocatoria) => (
	<span className={`rounded-full px-2.5 py-1 text-xs font-medium ${estadoBadgeClass(convocatoria.estado)}`}>
		{estadoLabel(convocatoria.estado)}
	</span>
);

const convocatoriaColumns: Column<Convocatoria>[] = [
	{
		header: "Convocatoria",
		cell: renderConvocatoriaCell,
	},
	{
		header: "Inicio",
		cell: (convocatoria) => new Date(convocatoria.fechaInicio).toLocaleString(),
	},
	{
		header: "Fin",
		cell: (convocatoria) => new Date(convocatoria.fechaFin).toLocaleString(),
	},
	{
		header: "Estado",
		cell: renderEstadoCell,
	},
];

const renderConvocatoriaActions = (selectedCongresoId: number | null, convocatoria: Convocatoria) => {
	if (!selectedCongresoId) return null;

	return (
		<Link
			href={`/administrativo/congreso/${selectedCongresoId}/convocatorias/${convocatoria.id}/propuestas`}
			className="inline-flex items-center rounded-lg border border-brand-200 px-2 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-50 dark:border-brand-500/30 dark:text-brand-300 dark:hover:bg-brand-500/10"
			onClick={(event) => event.stopPropagation()}
		>
			Ver propuestas
		</Link>
	);
};

export default function ConvocatoriasPage() {
	const searchParams = useSearchParams();
	const { congresos, fetchCongresos } = useCongreso();
	const {
		convocatorias,
		loading,
		error,
		totalItems,
		fetchConvocatoriasByCongreso,
		createConvocatoria,
		updateConvocatoria,
		deleteConvocatoria,
	} = useConvocatoria();
	const { isOpen, openModal, closeModal } = useModal();
	const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);

	const [selectedConvocatoria, setSelectedConvocatoria] = useState<Convocatoria | null>(null);
	const [selectedDetalleConvocatoria, setSelectedDetalleConvocatoria] = useState<Convocatoria | null>(null);
	const [formSubmitError, setFormSubmitError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;
	const [formData, setFormData] = useState<FormData>({
		nombre: "",
		descripcion: "",
		fechaInicio: "",
		fechaFin: "",
	});

	useEffect(() => {
		fetchCongresos();
	}, [fetchCongresos]);

	const selectedCongresoId = useMemo(() => {
		const queryValue = Number(searchParams.get("id"));
		if (Number.isNaN(queryValue) || queryValue <= 0) return null;
		return queryValue;
	}, [searchParams]);

	useEffect(() => {
		if (!selectedCongresoId) return;
		void fetchConvocatoriasByCongreso(selectedCongresoId, currentPage - 1, pageSize);
	}, [selectedCongresoId, currentPage, pageSize, fetchConvocatoriasByCongreso]);

	useEffect(() => {
		setCurrentPage(1);
	}, [selectedCongresoId]);

	const selectedCongreso = useMemo(
		() => congresos.find((congreso) => congreso.id === selectedCongresoId),
		[congresos, selectedCongresoId]
	);

	const institucionNombre = selectedCongreso ? getInstitucionNombre((selectedCongreso as { institucionId: unknown }).institucionId) : "N/A";

	const handleAdd = () => {
		setSelectedConvocatoria(null);
		setFormSubmitError(null);
		setFormData({
			nombre: "",
			descripcion: "",
			fechaInicio: "",
			fechaFin: "",
		});
		openModal();
	};

	const handleDelete = async (convocatoria: Convocatoria) => {
		const success = await deleteConvocatoria(convocatoria.id);
		if (success) {
			toast.success("Convocatoria eliminada con éxito");
			if (selectedCongresoId) {
				await fetchConvocatoriasByCongreso(selectedCongresoId, currentPage - 1, pageSize);
			}
			return;
		}

		toast.error("No fue posible eliminar la convocatoria");
	};

	const handleEdit = (convocatoria: Convocatoria) => {
		setSelectedConvocatoria(convocatoria);
		setFormSubmitError(null);
		setFormData({
			nombre: convocatoria.nombre || "",
			descripcion: convocatoria.descripcion || "",
			fechaInicio: toDateTimeLocal(convocatoria.fechaInicio),
			fechaFin: toDateTimeLocal(convocatoria.fechaFin),
		});
		openModal();
	};

	const handleRowClick = (convocatoria: Convocatoria) => {
		setSelectedDetalleConvocatoria(convocatoria);
		setIsDetalleModalOpen(true);
	};

	const handleResolvePropuesta = async (convocatoria: Convocatoria, accepted: boolean) => {
		const nextEstado = accepted ? "Activo" : "Inactivo";
		const payload = {
			nombre: convocatoria.nombre,
			descripcion: convocatoria.descripcion,
			fechaInicio: convocatoria.fechaInicio,
			fechaFin: convocatoria.fechaFin,
			congresoId: convocatoria.congresoId,
			estado: nextEstado,
		};

		const success = await updateConvocatoria(convocatoria.id, payload);

		if (!success) {
			toast.error(`No fue posible ${accepted ? "aceptar" : "rechazar"} la propuesta`);
			return;
		}

		toast.success(`Propuesta ${accepted ? "aceptada" : "rechazada"} con éxito`);
		if (selectedDetalleConvocatoria?.id === convocatoria.id) {
			setSelectedDetalleConvocatoria({ ...selectedDetalleConvocatoria, estado: nextEstado });
		}
		if (selectedCongresoId) {
			await fetchConvocatoriasByCongreso(selectedCongresoId, currentPage - 1, pageSize);
		}
	};

	const handleSave = async (event: React.SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFormSubmitError(null);

		if (!selectedCongresoId) {
			const message = "Selecciona un congreso";
			setFormSubmitError(message);
			toast.error(message);
			return;
		}

		if (!formData.nombre.trim() || !formData.descripcion.trim()) {
			const message = "Completa nombre y descripción";
			setFormSubmitError(message);
			toast.error(message);
			return;
		}

		if (!formData.fechaInicio || !formData.fechaFin) {
			const message = "Selecciona fecha de inicio y fin";
			setFormSubmitError(message);
			toast.error(message);
			return;
		}

		const payload = {
			nombre: formData.nombre.trim(),
			descripcion: formData.descripcion.trim(),
			congresoId: selectedCongresoId,
			fechaInicio: new Date(formData.fechaInicio).toISOString(),
			fechaFin: new Date(formData.fechaFin).toISOString(),
		};

		const success = selectedConvocatoria
			? await updateConvocatoria(selectedConvocatoria.id, payload)
			: await createConvocatoria(payload);

		if (!success) {
			const message = error || "No fue posible guardar la convocatoria";
			setFormSubmitError(message);
			toast.error(message);
			return;
		}

		setFormSubmitError(null);
		toast.success(`Convocatoria ${selectedConvocatoria ? "actualizada" : "creada"} con éxito`);
		closeModal();
		await fetchConvocatoriasByCongreso(selectedCongresoId, currentPage - 1, pageSize);
	};

	const totalPages = Math.max(1, Math.ceil((totalItems ?? convocatorias.length) / pageSize));

	let convocatoriasContent: React.ReactNode = null;

	if (loading && convocatorias.length === 0) {
		convocatoriasContent = <div className="p-6 text-sm text-gray-500 dark:text-gray-400">Cargando convocatorias...</div>;
	} else if (convocatorias.length === 0) {
		convocatoriasContent = (
			<div className="p-6 text-sm text-gray-500 dark:text-gray-400">No hay convocatorias registradas para este congreso.</div>
		);
	} else {
		convocatoriasContent = (
			<GenericTable
				data={convocatorias}
				columns={convocatoriaColumns}
				onRowClick={handleRowClick}
				onEdit={handleEdit}
				onDelete={(convocatoria) => void handleDelete(convocatoria)}
				actions={(convocatoria) => renderConvocatoriaActions(selectedCongresoId, convocatoria)}
				pagination={{
					currentPage,
					totalPages,
					onPageChange: setCurrentPage,
				}}
			/>
		);
	}

	const hasSelectedCongreso = Boolean(selectedCongresoId);
	let congresoDetailContent: React.ReactNode;

	if (!hasSelectedCongreso) {
		congresoDetailContent = (
			<div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500 dark:border-white/10 dark:bg-white/3 dark:text-gray-400">
				No se recibió un congreso válido. Vuelve al panel y usa el botón Ir al congreso de una tarjeta.
			</div>
		);
	} else if (selectedCongreso) {
		congresoDetailContent = (
			<div className="rounded-xl border border-gray-200 dark:border-white/10">
				<div className="flex flex-col gap-4 border-b border-gray-200 p-4 dark:border-white/10 md:flex-row md:items-center">
					<div className="w-full shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5 sm:w-56 md:w-44">
						<Image
							src={selectedCongreso.fotoUrl?.trim() ? selectedCongreso.fotoUrl : fallbackCongresoImage}
							alt={selectedCongreso.titulo}
							width={320}
							height={240}
							unoptimized
							className="aspect-4/3 h-full w-full object-cover"
							onError={(event) => {
								event.currentTarget.src = fallbackCongresoImage;
							}}
						/>
					</div>

					<div className="min-w-0 flex-1">
						<div className="flex items-start justify-between gap-3">
							<h3 className="text-xl font-bold text-gray-800 dark:text-white/90">{selectedCongreso.titulo}</h3>
							<span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${selectedCongreso.activo ? "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-300"}`}>
								{selectedCongreso.activo ? "ACTIVO" : "INACTIVO"}
							</span>
						</div>
						<p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{selectedCongreso.descripcion || "N/A"}</p>
						<div className="mt-3 grid gap-2 text-xs text-gray-600 dark:text-gray-300 md:grid-cols-2">
							<p><span className="font-medium">Inicio:</span> {formatDateTime(selectedCongreso.fechaInicio)}</p>
							<p><span className="font-medium">Fin:</span> {formatDateTime(selectedCongreso.fechaFin)}</p>
							<p><span className="font-medium">Ubicación:</span> {selectedCongreso.ubicacion || "N/A"}</p>
							<p><span className="font-medium">Precio:</span> {formatCurrency(selectedCongreso.precioInscripcion)}</p>
							<p><span className="font-medium">Institución:</span> {institucionNombre}</p>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
					<h4 className="text-base font-semibold text-gray-800 dark:text-white/90">Convocatorias</h4>
					<div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
						<span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
							<MdEvent className="h-4 w-4" />
							{convocatorias.length} convocatorias
						</span>
						{selectedCongresoId ? (
							<Link
								href={`/administrativo/congreso/${selectedCongresoId}/actividades/aprobadas`}
								className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5 sm:w-auto"
							>
								Actividades aceptadas
							</Link>
						) : null}
						<Button size="sm" onClick={handleAdd} className="w-full sm:w-auto">
							Crear convocatoria
						</Button>
					</div>
				</div>

				{error && (
					<div className="mx-4 mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
						{error}
					</div>
				)}

				{convocatoriasContent}
			</div>
		);
	} else {
		congresoDetailContent = (
			<div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500 dark:border-white/10 dark:bg-white/3 dark:text-gray-400">
				Cargando información del congreso...
			</div>
		);
	}


	return (
		<div className="space-y-6">
			<div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-xs dark:border-white/5 dark:bg-white/3 sm:p-5">
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-3">
						<div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
							<MdCampaign className="h-6 w-6" />
						</div>
						<div>
							<h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">Gestión de convocatorias</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400">Congreso seleccionado desde el panel administrativo.</p>
						</div>
					</div>
					<Link
						href="/administrativo"
						className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5 sm:w-auto"
					>
						Volver
					</Link>
				</div>

				{congresoDetailContent}
			</div>

			<Modal isOpen={isOpen} onClose={closeModal} className="m-4 w-[calc(100%-2rem)] max-w-175">
				<div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
					<div className="px-2 pr-10 sm:pr-14">
						<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
							{selectedConvocatoria ? "Editar convocatoria" : "Crear convocatoria"}
						</h4>
						<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
							Configura nombre, fechas y contenido de la convocatoria.
						</p>
					</div>

					<form className="flex flex-col" onSubmit={handleSave}>
						<div className="custom-scrollbar h-[58vh] overflow-y-auto px-2 pb-3 sm:h-120">
							{formSubmitError ? (
								<div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-300">
									{formSubmitError}
								</div>
							) : null}
							<div className="flex min-h-full flex-col gap-y-5">
								<div>
									<Label>Nombre</Label>
									<Input
										type="text"
										placeholder="Ej. Convocatoria de ponentes"
										value={formData.nombre}
										onChange={(event) => setFormData({ ...formData, nombre: event.target.value })}
									/>
								</div>

								<div>
									<div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
										<div>
											<Label>Fecha inicio</Label>
											<Input
												type="datetime-local"
												value={formData.fechaInicio}
												onChange={(event) => setFormData({ ...formData, fechaInicio: event.target.value })}
											/>
										</div>

										<div>
											<Label>Fecha fin</Label>
											<Input
												type="datetime-local"
												value={formData.fechaFin}
												onChange={(event) => setFormData({ ...formData, fechaFin: event.target.value })}
											/>
										</div>
									</div>
								</div>

								<div className="flex min-h-0 flex-1 flex-col">
									<Label>Descripción</Label>
									<TextCongreso
										placeholder="Describe los requisitos y detalles de la convocatoria..."
										value={formData.descripcion}
										onChange={(value) => setFormData({ ...formData, descripcion: value })}
										fillHeight
										className="min-h-40"
									/>
								</div>
							</div>
						</div>

						<div className="mt-6 flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-end">
							<Button size="sm" variant="outline" onClick={closeModal} type="button" className="w-full sm:w-auto">
								Cancelar
							</Button>
							<Button size="sm" type="submit" className="w-full sm:w-auto">
								{selectedConvocatoria ? "Guardar cambios" : "Crear convocatoria"}
							</Button>
						</div>
					</form>
				</div>
			</Modal>

			<Modal
				isOpen={isDetalleModalOpen}
				onClose={() => setIsDetalleModalOpen(false)}
				className="m-4 w-[calc(100%-2rem)] max-w-175"
			>
				<div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
					<div className="mb-4 px-2">
						<h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
							Detalle de propuesta
						</h4>
						<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
							Visualiza la información y aprueba o rechaza esta propuesta.
						</p>
					</div>

					{selectedDetalleConvocatoria ? (
						<div className="space-y-4 px-2">
							<div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
								<p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
								<p className="font-semibold text-gray-800 dark:text-white/90">{selectedDetalleConvocatoria.nombre}</p>
							</div>
							<div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
								<p className="text-sm text-gray-500 dark:text-gray-400">Descripción</p>
								<p className="text-sm text-gray-700 dark:text-gray-300">{selectedDetalleConvocatoria.descripcion}</p>
							</div>
							<div className="grid gap-3 md:grid-cols-2">
								<div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
									<p className="text-sm text-gray-500 dark:text-gray-400">Fecha inicio</p>
									<p className="text-sm font-medium text-gray-800 dark:text-white/90">
										{new Date(selectedDetalleConvocatoria.fechaInicio).toLocaleString()}
									</p>
								</div>
								<div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
									<p className="text-sm text-gray-500 dark:text-gray-400">Fecha fin</p>
									<p className="text-sm font-medium text-gray-800 dark:text-white/90">
										{new Date(selectedDetalleConvocatoria.fechaFin).toLocaleString()}
									</p>
								</div>
							</div>
							<div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-white/10">
								<span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${estadoBadgeClass(selectedDetalleConvocatoria.estado)}`}>
									{estadoLabel(selectedDetalleConvocatoria.estado)}
								</span>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => void handleResolvePropuesta(selectedDetalleConvocatoria, true)}
										className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-green-200 text-green-600 transition hover:bg-green-50 dark:border-green-500/30 dark:text-green-300 dark:hover:bg-green-500/10"
										title="Aceptar propuesta"
									>
										<MdCheckCircle className="h-5 w-5" />
									</button>
									<button
										type="button"
										onClick={() => void handleResolvePropuesta(selectedDetalleConvocatoria, false)}
										className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
										title="Rechazar propuesta"
									>
										<MdClose className="h-5 w-5" />
									</button>
								</div>
							</div>
						</div>
					) : null}

					<div className="mt-6 flex justify-end px-2">
						<Button size="sm" variant="outline" onClick={() => setIsDetalleModalOpen(false)} type="button" className="w-full sm:w-auto">
							Cerrar
						</Button>
					</div>
				</div>
			</Modal>

		</div>
	);
}
