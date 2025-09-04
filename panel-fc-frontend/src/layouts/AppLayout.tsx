import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, Columns3Cog, Columns3, LogOut, Cog, User, Menu } from 'lucide-react'

function AppLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { label: "Página Inicial", path: "/", icons: <House size={28} /> },
        { label: "Configurar Painéis", path: "/panel-forge", icons: <Columns3Cog size={28} /> },
        { label: "Visualizar Painéis", path: "/panel-design", icons: <Columns3 size={28} /> }
    ];

    const sidebarContent = (
        <>
            {/* Espaço superior */}
            <div>
                {/* Logo */}
                <div className="h-20 w-fit flex items-center justify-center p-6 border-b-2 border-[var(--color-brand-800)]">
                    <img src="./Logo_Act.png" alt="PanelForgeCraft" className="max-h-12 " />
                </div>
                {/* Navegação */}
                <nav className="flex-1 p-6 space-y-2 px-1 w-full">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 text-lg p-4 rounded-lg ${
                                    isActive
                                        ? "bg-[var(--color-foreground)] text-[var(--color-brand-foreground)] font-semibold"
                                        : "text-gray-200 hover:bg-[var(--color-surface-1)] hover:text-white"
                                }`}
                            >
                                <span className="inline-block mr-2 align-middle">
                                    {item.icons}
                                </span>
                                {item.label}
                            </Link>
                        );

                    })}
                </nav>
            </div>

            {/* Espaço inferior */}
            <div className="p-6 px-1 w-full">
                {/* Configurações */}
                <Link to="#" className="flex items-center gap-3 text-lg p-4 rounded-lg hover:bg-[var(--color-alt-bg)]">
                    <Cog size={28} /> Configurações
                </Link>

                {/* Perfil */}
                <div className="flex items-center gap-3 rounded-lg bg-[var(--color-alt-bg)] px-1 py-3 mt-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-foreground)] flex items-center justify-center text-white">
                        <User size={28} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-medium text-white">Usuário</span>
                        <span className="text-sm text-gray-400">usuario@empresa.com</span>
                    </div>
                </div>

                {/* Sair */}
                <Link to="#" className="flex items-center gap-3 text-lg p-4 rounded-lg hover:bg-[var(--color-alt-bg)]">
                    <LogOut size={28} /> Sair
                </Link>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-[var(--color-surface-2)] text-[var(--color-foreground)]">
            {/* Sidebar Desktop*/}
            <aside className="hidden md:flex w-70 bg-[var(--color-surface-2)] flex-col justify-between shadow-lg text-[var(--color-bg)]">
                {sidebarContent}
            </aside>

            { /* Sidebar Mobile */}
            <div className={`fixed inset-0 z-40 flex md:hidden transition-transform ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="relative w-64 bg-[var(--color-surface-2)] flex flex-col justify-between shadow-xl text-[var(--color-bg)]">
                    {sidebarContent}
                </div>
                <div
                    className="flex-1 bg-black bg-opacity-30"
                    onClick={() => setSidebarOpen(false)}
                />
            </div>
                

        {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar Mobile */}
                <header className="md:hidden h-16 bg-[var(--color-surface-1)] flex items-center px-4 shadow-sm text-white">
                    <button
                        className="p-2 rounded hover:bg-[var(--color-surface-2)]"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={28} />
                    </button>
                    <h1 className="ml-4 text-lg font-semibold">Actemium Panel Forge Craft</h1>
                </header>

                {/* Conteúdo dinâmico */}
                <main className="flex-1 overflow-y-auto p-2">
                    <div className="bg-[var(--color-bg)] rounded-2xl shadow-md p-4 min-h-full text-black">
                        {children}
                    </div>
                </main>
            </div>
        </div>

    );
}

export default AppLayout;