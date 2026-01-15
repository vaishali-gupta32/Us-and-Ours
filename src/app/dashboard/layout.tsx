import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-transparent">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 max-h-screen overflow-y-auto scrollbar-hide relative w-full">
                <div className="max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav (Keep for small screens) */}
            <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
                <Navbar />
            </div>
        </div>
    );
}
