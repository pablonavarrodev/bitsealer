import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as authApi from '../api/auth';

export default function Settings() {
    const { user } = useAuth();

    const [openModal, setOpenModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage('');
        setError('');
    };

    const openPasswordModal = () => {
        resetForm();
        setOpenModal(true);
    };

    const closeModal = () => {
        resetForm();
        setOpenModal(false);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Debes rellenar todos los campos.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }

        if (newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            setSaving(true);

            const response = await authApi.updatePassword({
                currentPassword,
                newPassword
            });

            setMessage(
                typeof response === 'string'
                    ? response
                    : 'Contraseña actualizada correctamente.'
            );

            setTimeout(() => {
                closeModal();
            }, 800);
        } catch (err) {
            setError(err?.response?.data || 'No se pudo actualizar la contraseña.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-4 md:p-6">
            <main className="max-w-3xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ajustes</h1>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                        Gestiona la información básica de tu cuenta.
                    </p>
                </div>

                <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Perfil</h2>
                        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
                            Datos de la cuenta registrada en BitSealer.
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-4">
                            <div className="text-sm text-gray-500 dark:text-neutral-400">Nombre</div>
                            <div className="mt-1 font-medium text-gray-900 dark:text-white">
                                {user?.username || 'Sin nombre'}
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 dark:border-neutral-800 p-4">
                            <div className="text-sm text-gray-500 dark:text-neutral-400">Correo</div>
                            <div className="mt-1 font-medium text-gray-900 dark:text-white">
                                {user?.email || 'Sin correo'}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={openPasswordModal}
                            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition"
                        >
                            Cambiar contraseña
                        </button>
                    </div>
                </section>
            </main>

            {openModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Cambiar contraseña
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-neutral-200">
                                    Contraseña actual
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-neutral-200">
                                    Nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-neutral-200">
                                    Confirmar nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-500">{error}</div>
                            )}

                            {message && (
                                <div className="text-sm text-green-600">{message}</div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-sm"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium disabled:opacity-60"
                                >
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}