import { useEffect, useState } from 'react';
import { getHistory } from '../api/files';
import RecentTable from '../components/RecentTable';

export default function History() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getHistory()
      .then(data => {
        const rows = data.map(file => ({
          id: file.id,
          stampId: file.stampId,
          nombre: file.originalFilename,
          fecha: file.createdAt ? file.createdAt.split('T')[0] : '',
          hash: file.sha256,
          estado: file.stampStatus || 'PENDING',
        }));
        setFiles(rows);
      })
      .catch(err => {
        console.error(err);
        setError('Error al cargar el historial');
      });
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Archivos</h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">Pulsa en un hash para ver el detalle completo del sello.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200 p-3">
          {error}
        </div>
      )}

      <RecentTable rows={files} title="Historial" showViewAll={false} />
    </div>
  );
}
