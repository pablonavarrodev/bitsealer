// src/api/files.js
import apiClient from './http';

const MEMPOOL_SPACE_API = 'https://mempool.space/api/v1/fees/recommended';

export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
};

export const getHistory = () => {
    return apiClient.get('/files/history').then(res => res.data);
};

// Detalle (para /history/:id)
export const getFileDetails = (fileHashId) => {
    return apiClient.get(`/files/${fileHashId}`).then(res => res.data);
};

// Descargas (blob)
export const downloadOts = (fileHashId) => {
    return apiClient.get(`/files/${fileHashId}/ots`, { responseType: 'blob' })
        .then(res => res);
};

export const downloadCertificate = (fileHashId) => {
    return apiClient.get(`/files/${fileHashId}/certificate`, { responseType: 'blob' })
        .then(res => res);
};

export const getDashboard = () => {
    return apiClient.get('/dashboard').then(res => res.data);
};

/**
 * Consulta la tarifa de transacción recomendada en satoshis/vByte (sat/vB).
 * Retorna la tarifa más rápida o un valor por defecto.
 */
export const getBitcoinFee = () => {
    return fetch(MEMPOOL_SPACE_API)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            return data.fastestFee || data.halfHourFee || 10;
        })
        .catch(err => {
            console.error("Error fetching Bitcoin fee:", err);
            return 10;
        });
};
