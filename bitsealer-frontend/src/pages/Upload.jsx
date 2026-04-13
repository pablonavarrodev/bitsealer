import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadFile } from '../api/files';
import { trackEvent } from '../utils/analytics';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | hashing | ready | loading | success | error
  const [error, setError] = useState('');
  const [hash, setHash] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const prettySize = useMemo(() => {
    if (!file) return '';
    const kb = file.size / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  }, [file]);

  // Cálculo local de SHA-256 (no rompe backend)
  useEffect(() => {
    if (!file) {
      setHash('');
      return;
    }

    let cancelled = false;

    async function computeHash() {
      try {
        setStatus('hashing');
        const buf = await file.arrayBuffer();
        const digest = await crypto.subtle.digest('SHA-256', buf);
        const hex = [...new Uint8Array(digest)]
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        if (!cancelled) {
          setHash(hex);
          setStatus('ready');
        }
      } catch {
        if (!cancelled) {
          setHash('');
          setStatus('ready');
        }
      }
    }

    computeHash();
    return () => { cancelled = true; };
  }, [file]);

  const handleFilePick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFile(f);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor selecciona un archivo.');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      await uploadFile(file);

      trackEvent('upload_file', {
        file_extension: file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() || 'unknown' : 'no_extension',
        file_size_bucket:
          file.size < 1024 * 1024
            ? 'lt_1mb'
            : file.size < 5 * 1024 * 1024
              ? '1mb_to_5mb'
              : 'gte_5mb',
      });

      setStatus('success');

      // Pequeña pausa visual y redirección al historial
      setTimeout(() => navigate('/history'), 600);
    } catch (err) {
      console.error(err);
      setStatus('error');
      if (err?.response?.status === 400) {
        setError('Debes seleccionar un archivo válido.');
      } else {
        setError('Error al subir archivo. Intenta de nuevo.');
      }
    }
  };

  const copyHash = async () => {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
    } catch {}
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Card principal */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
            Sellar Archivo
          </h2>
          {status === 'loading' && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-300">
              <Spinner />
              Subiendo…
            </div>
          )}
          {status === 'hashing' && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-300">
              <Spinner />
              Calculando SHA-256…
            </div>
          )}
          {status === 'success' && (
            <div className="text-sm text-emerald-600">✔ Sellado correcto</div>
          )}
          {status === 'error' && (
            <div className="text-sm text-rose-600">✖ Error al subir</div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={[
              'relative rounded-xl border-2 border-dashed p-6 transition-all',
              'bg-gray-50 dark:bg-neutral-950',
              dragOver
                ? 'border-orange-500/70 bg-orange-50/40 dark:bg-orange-500/10'
                : 'border-gray-300 dark:border-neutral-700'
            ].join(' ')}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 grid place-content-center shadow-sm">
                <svg className="w-6 h-6 text-gray-700 dark:text-neutral-200" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V8m0 0l-3 3m3-3l3 3M6 16a6 6 0 1112 0v3H6v-3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-sm text-gray-700 dark:text-neutral-200">
                Arrastra y suelta tu archivo aquí
              </div>
              <div className="text-xs text-gray-500 dark:text-neutral-400">
                o
              </div>
              <button
                onClick={() => inputRef.current?.click()}
                type="button"
                className="px-3 py-1.5 rounded-lg text-sm bg-gray-900 text-white dark:bg-white dark:text-black shadow-sm"
              >
                Seleccionar archivo
              </button>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleFilePick}
              />
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/0 hover:ring-black/5 transition-all" />
          </div>

          {/* Detalles del archivo */}
          {file && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{file.name}</div>
                  <div className="text-xs text-gray-500 dark:text-neutral-400">
                    {prettySize} · {file.type || 'tipo desconocido'}
                  </div>
                  {!!hash && (
                    <div className="mt-2">
                      <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-400">SHA-256 (local preview)</div>
                      <code className="block mt-1 text-xs md:text-[11px] font-mono break-all text-gray-800 dark:text-neutral-200">
                        {hash}
                      </code>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={copyHash}
                          className="px-2.5 py-1 rounded-md text-xs bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-700 transition"
                        >
                          Copiar hash
                        </button>
                        <button
                          type="button"
                          onClick={() => { setFile(null); setHash(''); setStatus('idle'); setError(''); }}
                          className="px-2.5 py-1 rounded-md text-xs bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                        >
                          Quitar archivo
                        </button>
                      </div>
                    </div>
                  )}
                  {status === 'hashing' && (
                    <div className="mt-3">
                      <IndeterminateBar />
                    </div>
                  )}
                </div>

                <div className="shrink-0 px-2 py-1 rounded-md text-xs bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                  Listo para sellar
                </div>
              </div>
            </div>
          )}

          {/* Errores */}
          {error && (
            <div className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Botón de acción */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleUpload}
              disabled={!file || status === 'loading' || status === 'hashing'}
              className={[
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition',
                (status === 'loading' || status === 'hashing')
                  ? 'opacity-70 cursor-not-allowed bg-gray-900 text-white dark:bg-white dark:text-black'
                  : 'bg-gray-900 text-white hover:translate-y-[1px] dark:bg-white dark:text-black'
              ].join(' ')}
            >
              {status === 'loading' ? <Spinner /> : 'Sellar'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer helper */}
      <div className="mt-3 text-xs text-gray-500 dark:text-neutral-400">
        Consejo: puedes verificar el hash en tu equipo antes y después del sellado para confirmar la integridad del archivo.
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
      <path className="opacity-75" d="M4 12a8 8 0 018-8v3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
    </svg>
  );
}

function IndeterminateBar() {
  return (
    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
      <div className="h-full w-1/3 bg-gradient-to-r from-orange-400 to-orange-600 animate-[indeterminate_1.2s_ease_infinite]" />
      <style>{`
        @keyframes indeterminate {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}