import { useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function DashboardLayout({ children }) {
    useEffect(() => {
        const root = document.documentElement
        root.classList.add('dark')
        localStorage.setItem('theme', 'dark')
    }, [])

    return (
        <div className="h-screen w-full grid grid-cols-[260px_1fr] bg-gray-50 text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
            <Sidebar />
            <div className="flex flex-col">
                <Topbar />
                <main className="p-6 overflow-auto">{children}</main>
            </div>
        </div>
    )
}