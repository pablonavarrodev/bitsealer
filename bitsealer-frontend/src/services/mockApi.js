const wait = (ms) => new Promise(res => setTimeout(res, ms))

export async function loginMock({ email, password }) {
    await wait(600)
    if (!email || !password) throw new Error('Completa email y contraseña')
    return { email, name: email.split('@')[0], role: 'user' }
}

export async function registerMock({ name, email, password }) {
    await wait(800)
    if (!name || !email || !password) throw new Error('Completa todos los campos')
    return { name, email, role: 'user' }
}

export async function fetchDashboardMock() {
    await wait(300)
    return {
        kpis: [
        { label: 'Archivos hoy', value: 12, delta: '+5%', trend: 'up' },
        { label: 'Total sellados', value: 1243, delta: '+2%', trend: 'up' },
        { label: 'Confirmación media', value: 42, suffix: ' min', delta: '-4%', trend: 'down' },
        { label: 'Fallos', value: 1, delta: '-2', trend: 'down' },
        ],
        recent: [
        { nombre: 'contrato_alquiler.pdf', fecha: '2025-09-15', hash: 'a3f5b2c9d1e8f6a7b9c0d123e4f56789abcdef0123456789abcdef0123456789' },
        { nombre: 'informe_medico.docx',   fecha: '2025-09-15', hash: 'b7c9e4f1a8d2c3b4f56789abcdef0123456789abcdef0123456789abcdef0123' },
        { nombre: 'foto_pasaporte.png',    fecha: '2025-09-14', hash: 'c1d2e3f4a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789ab' },
        ],
        charts: {
        line: { labels: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'], data: [12,18,15,21,26,30,28] },
        bar:  { labels: ['Madrid','Barcelona','Sevilla','Valencia','Bilbao'], data: [320,280,180,210,140] },
        donut:{ labels: ['Directo','Agencias','Empresas','Afiliados'], data: [45,25,20,10] },
        }
    }
}
