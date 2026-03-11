"use client";

import { useEffect, useMemo, useState } from "react";
import { MdAccountBalanceWallet, MdRefresh, MdAddCard, MdReceiptLong } from "react-icons/md";
import toast from "react-hot-toast";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { useCuentaDigital } from "@/hooks/useCuentaDigital";
import { useRecarga } from "@/hooks/useRecarga";

const MEDIOS_PAGO = [
  { value: "TRANSFERENCIA", label: "Transferencia" },
  { value: "TARJETA", label: "Tarjeta" },
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "OTRO", label: "Otro" },
];

const MONEDAS = ["GTQ", "USD"];

const formatDate = (isoDate: string) => {
  if (!isoDate) {
    return "-";
  }

  return new Date(isoDate).toLocaleString("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function CuentaDigitalPacientePage() {
  const { cuentaDigital, loading, error, fetchCuentaDigital } = useCuentaDigital();
  const {
    recargas,
    loading: loadingRecargas,
    saving,
    error: recargaError,
    fetchRecargasByCuentaId,
    createRecarga,
  } = useRecarga();

  const [showRechargeForm, setShowRechargeForm] = useState(false);
  const [rechargeForm, setRechargeForm] = useState({
    cuentaDigitalId: "",
    monto: 0,
    moneda: "GTQ",
    referencia: "",
    medioPago: "TRANSFERENCIA",
    operadorId: 0,
  });

  const saldoFormateado = useMemo(() => {
    if (!cuentaDigital) {
      return "-";
    }

    const currency = /^[A-Z]{3}$/.test(cuentaDigital.moneda || "")
      ? cuentaDigital.moneda
      : "USD";

    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(cuentaDigital.saldo);
  }, [cuentaDigital]);

  const cuentaIdActiva = useMemo(
    () => cuentaDigital?.id ?? 0,
    [cuentaDigital?.id]
  );

  useEffect(() => {
    if (cuentaDigital) {
      setRechargeForm((current) => ({
        ...current,
        cuentaDigitalId: String(cuentaDigital.numeroCuenta || current.cuentaDigitalId || ""),
        moneda: MONEDAS.includes(cuentaDigital.moneda) ? cuentaDigital.moneda : current.moneda,
      }));
    }

    if (cuentaDigital?.id) {
      fetchRecargasByCuentaId(cuentaDigital.id);
    }
  }, [cuentaDigital, fetchRecargasByCuentaId]);

  const onChangeRechargeField = (field: string, value: string | number) => {
    setRechargeForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submitRecarga = async () => {
    const cuentaDigitalId = String(rechargeForm.cuentaDigitalId || cuentaDigital?.numeroCuenta || "").trim();

    if (!cuentaDigitalId) {
      toast.error("Debes enviar el número de cuenta en cuentaDigitalId.");
      return;
    }

    if (!rechargeForm.monto || rechargeForm.monto <= 0) {
      toast.error("El monto debe ser mayor a cero.");
      return;
    }
    if (!rechargeForm.moneda.trim()) {
      toast.error("Debes indicar la moneda.");
      return;
    }
    if (!rechargeForm.medioPago.trim()) {
      toast.error("Debes seleccionar el medio de pago.");
      return;
    }

    const referencia = rechargeForm.referencia.trim() || `REC-${Date.now()}`;

    try {
      await createRecarga({
        cuentaDigitalId,
        monto: Number(rechargeForm.monto),
        moneda: rechargeForm.moneda.trim(),
        referencia,
        medioPago: rechargeForm.medioPago.trim(),
        operadorId: Number(rechargeForm.operadorId || 0),
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "No se pudo registrar la recarga.");
      } else {
        toast.error("No se pudo registrar la recarga.");
      }
      return;
    }

    toast.success("Recarga registrada correctamente.");
    await fetchCuentaDigital();
    if (cuentaIdActiva > 0) {
      await fetchRecargasByCuentaId(cuentaIdActiva);
    }

    setRechargeForm((current) => ({
      ...current,
      cuentaDigitalId,
      monto: 0,
      referencia: "",
      medioPago: "TRANSFERENCIA",
      operadorId: 0,
    }));
  };

  const recargasContent = (() => {
    if (loadingRecargas) {
      return <p className="p-4 text-sm text-gray-500 dark:text-gray-400">Cargando historial de recargas...</p>;
    }

    if (recargas.length === 0) {
      return <p className="p-4 text-sm text-gray-500 dark:text-gray-400">No hay recargas registradas para esta cuenta.</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/40">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Monto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Referencia</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Medio</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
            {recargas.map((recarga) => (
              <tr key={recarga.id}>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{formatDate(recarga.fechaRecarga)}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                  {new Intl.NumberFormat("es-GT", {
                    style: "currency",
                    currency: recarga.moneda || "GTQ",
                    minimumFractionDigits: 2,
                  }).format(recarga.monto)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{recarga.referencia}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">{recarga.medioPago}</td>
                <td className="px-4 py-3 text-sm">
                  <Badge color={recarga.estado?.toUpperCase() === "APROBADA" ? "success" : "warning"} size="sm">
                    {recarga.estado}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  })();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Cuenta digital</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Consulta el saldo disponible y estado de tu cuenta.
            </p>
          </div>
          <Button
            variant="outline"
            startIcon={<MdRefresh className="h-4 w-4" />}
            onClick={async () => {
              await fetchCuentaDigital();
              if (cuentaIdActiva > 0) {
                await fetchRecargasByCuentaId(cuentaIdActiva);
              }
            }}
            disabled={loading}
          >
            Actualizar
          </Button>
        </div>

        {loading && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
            Cargando información de cuenta digital...
          </div>
        )}

        {!loading && error && (
          <div className="mt-6 rounded-xl border border-error-200 bg-error-50 p-4 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            No se pudo cargar la cuenta digital: {error}
          </div>
        )}

        {!loading && !error && cuentaDigital && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60 md:col-span-2">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Saldo disponible</p>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
                  <MdAccountBalanceWallet className="h-6 w-6" />
                </span>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{saldoFormateado}</h3>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Estado</p>
              <Badge color={cuentaDigital.activa ? "success" : "warning"} size="md">
                {cuentaDigital.activa ? "Activa" : "Inactiva"}
              </Badge>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">Moneda: {cuentaDigital.moneda}</p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Número de cuenta: {cuentaDigital.numeroCuenta || "No disponible"}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Creada</p>
              <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">{formatDate(cuentaDigital.createdAt)}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/40 md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Última actualización</p>
              <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-200">{formatDate(cuentaDigital.updatedAt)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recargar crédito</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Registra una recarga para aumentar el saldo de tu cuenta digital.
            </p>
          </div>
          <Button
            startIcon={<MdAddCard className="h-4 w-4" />}
            onClick={() => setShowRechargeForm((current) => !current)}
          >
            Recargar crédito
          </Button>
        </div>

        {showRechargeForm && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Cuenta digital ID (usar número de cuenta)</p>
              <Input
                type="text"
                value={rechargeForm.cuentaDigitalId}
                onChange={(event) => onChangeRechargeField("cuentaDigitalId", event.target.value)}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Monto</p>
              <Input
                type="number"
                min="0"
                step={0.01}
                value={rechargeForm.monto}
                onChange={(event) => onChangeRechargeField("monto", Number(event.target.value || 0))}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Moneda</p>
              <select
                value={rechargeForm.moneda}
                onChange={(event) => onChangeRechargeField("moneda", event.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                {MONEDAS.map((moneda) => (
                  <option key={moneda} value={moneda}>
                    {moneda}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Referencia</p>
              <Input
                type="text"
                value={rechargeForm.referencia}
                onChange={(event) => onChangeRechargeField("referencia", event.target.value)}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Medio de pago</p>
              <select
                value={rechargeForm.medioPago}
                onChange={(event) => onChangeRechargeField("medioPago", event.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                {MEDIOS_PAGO.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Operador ID</p>
              <Input
                type="number"
                min="0"
                value={rechargeForm.operadorId}
                onChange={(event) => onChangeRechargeField("operadorId", Number(event.target.value || 0))}
              />
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="button" disabled={saving} onClick={() => void submitRecarga()}>
                {saving ? "Registrando..." : "Registrar recarga"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={loadingRecargas || cuentaIdActiva <= 0}
                onClick={() => fetchRecargasByCuentaId(cuentaIdActiva)}
              >
                Cargar historial
              </Button>
            </div>
          </div>
        )}

        {recargaError && (
          <div className="mt-4 rounded-xl border border-error-200 bg-error-50 p-4 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            {recargaError}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <MdReceiptLong className="h-5 w-5 text-brand-500" />
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">Historial de recargas</h4>
          </div>

          {recargasContent}
        </div>
      </div>
    </div>
  );
}
