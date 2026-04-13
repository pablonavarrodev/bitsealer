import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileDown, FileText, ShieldCheck } from "lucide-react";
import { downloadCertificate, downloadOts } from "../api/files";

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

function badge(estado) {
    const st = (estado || "").toUpperCase();
    if (st === "SEALED") return "bg-emerald-100 text-emerald-800";
    if (st === "ERROR") return "bg-rose-100 text-rose-800";
    return "bg-amber-100 text-amber-900";
}

function label(estado) {
    const st = (estado || "").toUpperCase();
    if (st === "SEALED") return "Sellado";
    if (st === "ERROR") return "Error";
    return "Pendiente";
}

function shortHash(h) {
    if (!h) return "";
    if (h.length <= 20) return h;
    return `${h.slice(0, 10)}...${h.slice(-6)}`;
}

export default function RecentTable({ rows = [], title = "Últimos Sellos", showViewAll = true }) {
    const [openIndex, setOpenIndex] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const openMenuRef = useRef(null);

    useEffect(() => {
        if (openIndex === null) return;

        const handleMouseDown = (e) => {
            if (openMenuRef.current && !openMenuRef.current.contains(e.target)) {
                setOpenIndex(null);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") setOpenIndex(null);
        };

        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [openIndex]);

    const safeRows = useMemo(
        () =>
            rows.map((r) => ({
                ...r,
                id: r.id,
                stampId: r.stampId,
            })),
        [rows]
    );

    const goDetails = (r) => {
        if (!r?.id) return;
        navigate(`/history/${r.id}`, { state: { from: location.pathname + location.search } });
    };

    const onDownloadOts = async (e, r) => {
        e?.stopPropagation?.();
        try {
            const res = await downloadOts(r.id);
            const cd = res.headers?.["content-disposition"] || res.headers?.get?.("content-disposition");
            const filenameFromHeader =
                typeof cd === "string" ? cd.match(/filename="?([^";]+)"?/i)?.[1] || null : null;

            const name = filenameFromHeader || `${r.nombre || "proof"}.ots`;
            downloadBlob(res.data, name);
        } catch (err) {
            console.error(err);
            alert("No se pudo descargar el .ots (¿todavía no está generado?)");
        } finally {
            setOpenIndex(null);
        }
    };

    const onDownloadPdf = async (e, r) => {
        e?.stopPropagation?.();
        try {
            const res = await downloadCertificate(r.id);
            const cd = res.headers?.["content-disposition"] || res.headers?.get?.("content-disposition");
            const filenameFromHeader =
                typeof cd === "string" ? cd.match(/filename="?([^";]+)"?/i)?.[1] || null : null;

            const name = filenameFromHeader || `${r.nombre || "certificate"}-certificate.pdf`;
            downloadBlob(res.data, name);
        } catch (err) {
            console.error(err);
            alert("No se pudo descargar el certificado PDF");
        } finally {
            setOpenIndex(null);
        }
    };

    return (
        <div className="card overflow-visible">
            <div className="card-pad overflow-visible">
                <div className="flex items-center justify-between gap-3">
                    <div className="text-base font-semibold">{title}</div>
                    {showViewAll && (
                        <Link to="/history" className="text-sm text-orange-600 hover:underline shrink-0">
                            Ver todas
                        </Link>
                    )}
                </div>
            </div>

            {/* Vista móvil */}
            <div className="md:hidden px-4 pb-4 space-y-3 overflow-visible">
                {safeRows.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 dark:border-neutral-800 p-4 text-sm text-gray-500 dark:text-neutral-400">
                        No hay sellos recientes todavía.
                    </div>
                ) : (
                    safeRows.map((r, i) => (
                        <div
                            key={i}
                            onClick={() => goDetails(r)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    goDetails(r);
                                }
                            }}
                            tabIndex={0}
                            role="button"
                            className="rounded-xl border border-black/5 dark:border-white/5 p-4 cursor-pointer transition hover:bg-orange-50/70 dark:hover:bg-orange-500/10 focus:outline-none focus:ring-2 focus:ring-orange-400/40 overflow-visible"
                            title="Abrir detalle del sello"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="font-medium text-sm text-gray-900 dark:text-white break-words">
                                        {r.nombre}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                                        {r.fecha}
                                    </div>
                                </div>

                                <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium shrink-0 ${badge(r.estado)}`}>
                                    {label(r.estado)}
                                </span>
                            </div>

                            <div className="mt-3">
                                <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                                    Hash
                                </div>
                                <div
                                    className="mt-1 text-xs font-mono text-slate-700 dark:text-slate-300 break-all"
                                    title={r.hash}
                                >
                                    {r.hash}
                                </div>
                            </div>

                            <div className="mt-4 relative overflow-visible" onClick={(e) => e.stopPropagation()}>
                                <div className="inline-block w-full" ref={openIndex === i ? openMenuRef : null}>
                                    <button
                                        disabled={!r.id || !r.stampId}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenIndex(openIndex === i ? null : i);
                                        }}
                                        className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-orange-500 text-white text-sm font-medium"
                                        title={!r.stampId ? "Aún no hay sello asociado" : "Descargar"}
                                    >
                                        <FileDown className="w-4 h-4" />
                                        Descargar
                                    </button>

                                    {openIndex === i && (
                                        <div
                                            className="absolute left-0 right-0 z-50 mt-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={(e) => onDownloadOts(e, r)}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-neutral-800"
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                                Descargar .ots
                                            </button>

                                            <button
                                                onClick={(e) => onDownloadPdf(e, r)}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-neutral-800"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Descargar certificado (PDF)
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Vista desktop */}
            <div className="hidden md:block overflow-x-auto overflow-y-visible">
                <table className="min-w-full text-sm overflow-visible">
                    <thead className="bg-gray-50 dark:bg-neutral-800/60 text-gray-600 dark:text-neutral-300">
                        <tr>
                            <th className="text-left font-semibold px-5 py-3">Nombre archivo</th>
                            <th className="text-left font-semibold px-5 py-3">Fecha</th>
                            <th className="text-left font-semibold px-5 py-3">Hash</th>
                            <th className="text-left font-semibold px-5 py-3">Estado</th>
                            <th className="text-left font-semibold px-5 py-3">Descargar</th>
                        </tr>
                    </thead>

                    <tbody className="overflow-visible">
                        {safeRows.map((r, i) => (
                            <tr
                                key={i}
                                onClick={() => goDetails(r)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        goDetails(r);
                                    }
                                }}
                                tabIndex={0}
                                role="button"
                                className="
                                    border-t border-black/5 dark:border-white/5
                                    cursor-pointer
                                    transition-all duration-150
                                    hover:bg-orange-50/70
                                    dark:hover:bg-orange-500/10
                                    hover:shadow-sm
                                    hover:pl-[2px]
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-orange-400/40
                                "
                                title="Abrir detalle del sello"
                            >
                                <td className="px-5 py-3">{r.nombre}</td>
                                <td className="px-5 py-3">{r.fecha}</td>

                                <td className="px-5 py-3 text-xs font-mono text-slate-700 dark:text-slate-300" title={r.hash}>
                                    {shortHash(r.hash)}
                                </td>

                                <td className="px-5 py-3">
                                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${badge(r.estado)}`}>
                                        {label(r.estado)}
                                    </span>
                                </td>

                                <td className="px-5 py-3 relative overflow-visible">
                                    <div className="inline-block relative overflow-visible" ref={openIndex === i ? openMenuRef : null}>
                                        <button
                                            disabled={!r.id || !r.stampId}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenIndex(openIndex === i ? null : i);
                                            }}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-orange-500 text-white text-xs font-medium"
                                            title={!r.stampId ? "Aún no hay sello asociado" : "Descargar"}
                                        >
                                            <FileDown className="w-4 h-4" />
                                            Descargar
                                        </button>

                                        {openIndex === i && (
                                            <div
                                                className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={(e) => onDownloadOts(e, r)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-neutral-800"
                                                >
                                                    <ShieldCheck className="w-4 h-4" />
                                                    Descargar .ots
                                                </button>

                                                <button
                                                    onClick={(e) => onDownloadPdf(e, r)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-neutral-800"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Descargar certificado (PDF)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}