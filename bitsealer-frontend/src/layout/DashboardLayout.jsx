import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-[260px_1fr] bg-gray-50 text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
            <Sidebar />
            <div className="flex min-w-0 flex-col">
                <Topbar />
                <main className="p-4 md:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}