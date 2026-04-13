// src/pages/FileDetails.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
    ArrowLeft,
    Copy,
    ExternalLink,
    FileDown,
    FileText,
    ShieldCheck,
    Info,
} from "lucide-react";

import { downloadCertificate, downloadOts, getFileDetails } from "../api/files";

function downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}

function badgeClasses(status) {
    const st = (status || "").toUpperCase();
    if (st === "SEALED") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200";
    if (st === "ERROR") return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200";
    if (st === "ANCHORING") return "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200";
    return "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200";
}

function statusLabel(status) {
    const st = (status || "").toUpperCase();
    if (st === "SEALED") return "Sellado";
    if (st === "ANCHORING") return "Anclando";
    if (st === "ERROR") return "Error";
    return "Pendiente";
}

function safeDate(v) {
    try {
        if (!v) return "—";
        return format(new Date(v), "yyyy-MM-dd HH:mm");
    } catch {
        return "—";
    }
}

async function copyText(text) {
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
    }
}

export default function FileDetails() {
    const { fileHashId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Preparado para verificación (próximamente)
    const [verifyFile, setVerifyFile] = useState(null);
    const [verifyOts, setVerifyOts] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError("");

        getFileDetails(fileHashId)
            .then((d) => setData(d))
            .catch((e) => {
                console.error(e);
                setError("No se pudo cargar el detalle del sello");
            })
            .finally(() => setLoading(false));
    }, [fileHashId]);

    const mempoolUrl = useMemo(() => {
        const txid = data?.txid;
        if (!txid) return null;
        return `https://mempool.space/tx/${txid}`;
    }, [data?.txid]);

    const onBack = () => {
        const from = location.state?.from;
        if (from) navigate(from);
        else navigate(-1);
    };

    const onDownloadOts = async () => {
        if (!data?.id) return;
        try {
            const res = await downloadOts(data.id);
            const cd = res.headers?.["content-disposition"] || res.headers?.get?.("content-disposition");
            const filenameFromHeader = typeof cd === "string" ? (cd.match(/filename="?([^";]+)"?/i)?.[1] || null) : null;
            const name = filenameFromHeader || `${(data.originalFilename || "proof")}.ots`;
            downloadBlob(res.data, name);
        } catch (e) {
            console.error(e);
            alert("No se pudo descargar el .ots (¿todavía no está generado?)");
        }
    };

    const onDownloadPdf = async () => {
        if (!data?.id) return;
        try {
            const res = await downloadCertificate(data.id);
            const cd = res.headers?.["content-disposition"] || res.headers?.get?.("content-disposition");
            const filenameFromHeader = typeof cd === "string" ? (cd.match(/filename="?([^";]+)"?/i)?.[1] || null) : null;
            const name = filenameFromHeader || `${(data.originalFilename || "certificate")}-certificate.pdf`;
            downloadBlob(res.data, name);
        } catch (e) {
            console.error(e);
            alert("No se pudo descargar el certificado PDF");
        }
    };

    const canDownload = Boolean(
        data?.id &&
        data?.stampId &&
        String(data?.stampStatus || "").toUpperCase() === "SEALED"
    );

    const downloadDisabledTitle = "La descarga estará disponible cuando se complete el sellado";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white"
                        title="Volver"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </button>

                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detalle del sello</h2>
                        {data?.stampStatus && (
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClasses(data.stampStatus)}`}>
                                {statusLabel(data.stampStatus)}
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Aquí tienes toda la información disponible del hash, el estado de sellado y sus evidencias descargables.
                    </p>
                </div>
            </div>

            {loading && (
                <div className="h-48 flex items-center justify-center text-gray-500 dark:text-neutral-400">
                    Cargando detalle...
                </div>
            )}

            {!loading && error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200 p-3">
                    {error}
                </div>
            )}

            {!loading && !error && data && (
                <>
                    {/* Info principal */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Columna izquierda (2/3): datos completos */}
                        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm">
                            <div className="p-5 md:p-6 border-b border-gray-200 dark:border-neutral-800">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-gray-500 dark:text-neutral-400">Archivo</div>
                                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {data.originalFilename || "(sin nombre)"}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                                            Subido: <span className="font-medium">{safeDate(data.createdAt)}</span>
                                            {data.ownerUsername ? (
                                                <>
                                                    {" "}· Usuario: <span className="font-medium">{data.ownerUsername}</span>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-xs text-gray-500 dark:text-neutral-400">
                                            Stamp ID: <span className="font-semibold text-gray-900 dark:text-white">{data.stampId ?? "—"}</span>
                                        </div>
                                        {data.otsAvailable ? (
                                            <div className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                                                <ShieldCheck className="w-4 h-4" />
                                                Proof disponible ({data.otsBytes} bytes)
                                            </div>
                                        ) : (
                                            <div className="text-xs inline-flex items-center gap-2 px-2 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
                                                <Info className="w-4 h-4" />
                                                Proof aún no disponible
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 md:p-6 space-y-5">
                                {/* SHA256 */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">SHA-256</div>
                                        <button
                                            onClick={() => copyText(data.sha256)}
                                            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline"
                                            title="Copiar SHA-256"
                                        >
                                            <Copy className="w-4 h-4" />
                                            Copiar
                                        </button>
                                    </div>
                                    <div className="font-mono text-xs break-all rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 p-3 text-gray-800 dark:text-neutral-200">
                                        {data.sha256}
                                    </div>
                                </div>

                                {/* TXID */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">TXID (Bitcoin)</div>
                                        <div className="flex items-center gap-3">
                                            {data.txid && (
                                                <button
                                                    onClick={() => copyText(data.txid)}
                                                    className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline"
                                                    title="Copiar TXID"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                    Copiar
                                                </button>
                                            )}
                                            {mempoolUrl && (
                                                <a
                                                    href={mempoolUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white"
                                                    title="Abrir en mempool.space"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    mempool.space
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {data.txid ? (
                                        <div className="font-mono text-xs break-all rounded-lg border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 p-3 text-gray-800 dark:text-neutral-200">
                                            {data.txid}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 dark:text-neutral-400">
                                            Aún no hay TXID. Cuando el proof se ancla en una transacción, aparecerá aquí.
                                        </div>
                                    )}
                                </div>

                                {/* Estado técnico */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">Estado técnico</div>
                                        <div className="mt-2 text-sm text-gray-600 dark:text-neutral-300 space-y-1">
                                            <div>
                                                <span className="text-gray-500 dark:text-neutral-400">Estado:</span>{" "}
                                                <span className="font-medium">{data.stampStatus ? data.stampStatus : "—"}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-neutral-400">Creado:</span>{" "}
                                                <span className="font-medium">{safeDate(data.stampCreatedAt)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-neutral-400">Sellado:</span>{" "}
                                                <span className="font-medium">{safeDate(data.sealedAt)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
                                        <div className="text-sm font-semibold text-gray-900 dark:text-white">Reintentos y polling</div>
                                        <div className="mt-2 text-sm text-gray-600 dark:text-neutral-300 space-y-1">
                                            <div>
                                                <span className="text-gray-500 dark:text-neutral-400">Intentos:</span>{" "}
                                                <span className="font-medium">{data.attempts ?? "—"}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-neutral-400">Última comprobación:</span>{" "}
                                                <span className="font-medium">{safeDate(data.lastCheckedAt)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 dark:text-neutral-400">Siguiente comprobación:</span>{" "}
                                                <span className="font-medium">{safeDate(data.nextCheckAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Último error si existe */}
                                {data.lastError && (
                                    <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200 p-4">
                                        <div className="text-sm font-semibold">Último error</div>
                                        <div className="mt-2 text-sm whitespace-pre-wrap break-words">{data.lastError}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Columna derecha (1/3): acciones */}
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm">
                                <div className="p-5 md:p-6">
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">Evidencias</div>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                                        Descarga el proof (.ots) y el certificado PDF para compartir o archivar.
                                    </p>

                                    <div className="mt-4 space-y-3">
                                        <button
                                            onClick={onDownloadOts}
                                            disabled={!canDownload}
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-orange-500 text-white text-sm font-semibold"
                                            title={canDownload ? "Descargar proof .ots" : downloadDisabledTitle}
                                        >
                                            <FileDown className="w-4 h-4" />
                                            Descargar .ots
                                        </button>

                                        <button
                                            onClick={onDownloadPdf}
                                            disabled={!canDownload}
                                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-40 text-gray-900 dark:text-white text-sm font-semibold"
                                            title={canDownload ? "Descargar certificado" : downloadDisabledTitle}
                                        >
                                            <FileText className="w-4 h-4" />
                                            Descargar certificado (PDF)
                                        </button>
                                    </div>

                                    <div className="mt-4 text-xs text-gray-500 dark:text-neutral-400">
                                        Consejo: guarda el <span className="font-semibold">.ots</span> junto al archivo original.
                                        Es la prueba mínima para verificarlo de forma independiente.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Navegación rápida */}
                    <div className="text-xs text-gray-500 dark:text-neutral-400">
                        ¿Quieres volver al historial?{" "}
                        <Link to="/history" className="text-orange-600 dark:text-orange-400 hover:underline">Ir al historial</Link>
                    </div>
                </>
            )}
        </div>
    );
}