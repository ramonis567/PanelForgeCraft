import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AppLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const menuItems = [
        { label: "Home", path: "/" },
        { label: "Panel Forge", path: "/panel-forge" },
        { label: "Panel Design", path: "/panel-design" }
    ];

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 font-bold text-xl border-b border-gray-700">
                    <img src="../assets/Logo_Act.png" alt="PanelForgeCraft" />
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block p-2 rounded hover:bg-gray-700 ${
                                location.pathname === item.path ? 'bg-gray-700' : ''
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <header className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-4">
                    <span className="font-medium text-gray-800">
                        Painel atual
                    </span>
                </header>
                {/* Conteúdo dinâmico */}
                <main className="flex-1 overflow-y-auto p-4">
                    {children}
                </main>
            </div>
        </div>

    );
}

export default AppLayout;