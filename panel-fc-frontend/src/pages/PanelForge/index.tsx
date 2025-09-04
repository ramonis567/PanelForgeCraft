import React, { useState } from "react";
import { CirclePlus, Cog, PencilLine, Trash2 } from "lucide-react";

import AppLayout from "../../layouts/AppLayout";
import ColumnModal from "../../components/ColumnModal"

import type { PanelConfiguration, PanelColumn } from "../../models/panel";

const initialPanelConfig: PanelConfiguration = {
    id: "P-001",
    name: "",
    description: "",
    columns: [],
    metadata: {
        createdBy: "Usuário",
        createdAt: new Date(),
        lastModifiedAt: new Date()
    }
}

function PanelForgePage() {
    const [config, setConfig] = useState<PanelConfiguration>(initialPanelConfig);
    const [showModal, setShowModal] = useState(false);
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null);

    const [newColumn, setNewColumn] = useState<Partial<PanelColumn>>({
        type: "",
        position: 1,
        dimensions: { height: 2000, width: 800, depth: 600 },
        modules: []
    });

    const handlePanelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditColumn = (column: PanelColumn) => {
       setEditingColumnId(column.columnId);
        setNewColumn({ ...column });
        setShowModal(true);
    };

    const handleDeleteColumn = (columnId: string) => {
        setConfig((prev) => ({
            ...prev,
            columns: prev.columns.filter((c) => c.columnId !== columnId)
        }));
    };

    const handleSubmit = () => {
        console.log("Panel Configuration Submitted:", config);

        // In the future, send the data to the backend
    }

    return (
        <AppLayout>
            <header className="h-16 rounded-xl bg-[var(--color-surface-2)] border-b border-gray-200 flex items-center px-4 mb-2">
                <span className="font-medium text-gray-800">
                    <h1 className="text-2xl text-[var(--color-bg)]">Panel Forge  - <b>{config.name}</b></h1>
                </span>
            </header>

            <div className="flex">
                <div className="bg-[var(--color-brand-800)] border-l-4 rounded-2xl border-[var(--color-accent-600)]"></div>
                <div className="px-2 flex-1">
                    {/* Form header */}
                    <div className="flex gap-3 items-center">
                        <Cog size={28} className="" />
                        <h1 className="text-3xl font-bold">
                            Configuração do Painel
                        </h1>
                    </div>

                    {/* Form */}
                    <h3 className="text-xl font-semibold mt-4">Informações do Painel</h3>
                    <div className="space-y-4 mt-4">
                        {/* Panel Name Input */}
                        <div>
                            <label className="block text-sm font-medium">Nome do Painel</label>
                            <input 
                                type="text" 
                                name="name"
                                placeholder="Insira nome para o painel..."
                                value={config.name} 
                                onChange={handlePanelChange} 
                                className="mt-1 block w-full rounded border border-gray-200 p-2"
                            />
                        </div>

                        {/* Panel Description Input */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium">Descrição do Painel</label>
                            <input
                                type="text"
                                name="description"
                                placeholder="Insira descrição para o painel..."
                                value={config.description}
                                onChange={handlePanelChange}
                                className="mt-1 block w-full rounded border border-gray-200 p-2"
                            />
                        </div>

                        {/* Add Column Button */}
                        <h3 className="text-xl font-semibold">Colunas</h3>
                        <div className="col-span-1 md:col-span-3">
                            <button 
                                onClick={() => { 
                                    setNewColumn({
                                        type: "",
                                        position: config.columns.length + 1,
                                        dimensions: { height: 2000, width: 800, depth: 600 },
                                        modules: []
                                    })
                                    setEditingColumnId(null); 
                                    setShowModal(true); 
                                }}
                                className="
                                    px-4 py-2 flex items-center justify-center 
                                    gap-2 bg-[var(--color-brand-600)] text-white rounded 
                                    hover:bg-[var(--color-brand-700)] w-full font-semibold
                                "
                            >
                                <CirclePlus size={28}/> ADICIONAR COLUNA
                            </button>
                        </div>

                        {/* List of Columns */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium mb-2">Lista de Colunas</label>

                                {config.columns.length === 0 && (
                                    <p className="text-gray-500">Nenhuma coluna adicionada.</p>
                                )}

                                {/* <div className="
                                    grid gap-4 grid-cols-[repeat(auto-fill, minmax(200px, 1fr))]"
                                > */}
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                    {config.columns.map((col) => (
                                        <div 
                                            key={col.columnId} 
                                            className="
                                                bg-white shadow-md rounded-xl p-4 
                                                hover:shadow-lg transition-shadow flex
                                                flex-col justify-between
                                            "
                                        >
                                            <div>
                                                <p className="font-medium text-[var(--color-brand-700)]">
                                                    <b>Tipo:</b> {col.type}
                                                </p>
                                                <p>
                                                    <b>Posição:</b> {col.position}
                                                </p>
                                                <p>
                                                    <b>Dimensões:</b> {col.dimensions.height} x {col.dimensions.width} x {col.dimensions.depth} mm
                                                </p>
                                                <p>
                                                    <b>Módulos:</b> {col.modules.length}
                                                </p>
                                            </div>
                                            
                                            <div className="mt-4 flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEditColumn(col)} 
                                                    className="
                                                        px-2 py-1 text-sm
                                                        rounded bg-[var(--color-accent-500)] text-[var(--color-success)] hover:bg-[var(--color-accent-600)]
                                                    "
                                                >  
                                                    <PencilLine size={18} />
                                                </button>

                                                <button 
                                                    onClick={() => handleDeleteColumn(col.columnId)} 
                                                    className="
                                                        px-2 py-1 text-sm rounded
                                                        bg-red-100 text-red-700 hover:bg-red-200"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>                      
                                    ))}
                                </div>
                        </div>

                        {/* Submit Button */}
                        <div className="col-span-1 md:col-span-3">
                            <button 
                                onClick={handleSubmit} 
                                className="px-4 py-2 bg-[var(--color-accent-600)] text-[var(--color-alt-bg)] rounded hover:bg-[var(--color-brand-800)] w-full font-semibold"
                            >
                                CRIAR PAINEL
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for add column */}
            <ColumnModal 
                isOpen={showModal}
                column={newColumn}
                onClose={() => setShowModal(false)}
                onSave={(updatedColumn) => {
                    if (editingColumnId) {
                        setConfig(prev => ({
                            ...prev,
                            columns: prev.columns.map(c =>
                                c.columnId === editingColumnId ? { ...c, ...updatedColumn } as PanelColumn : c
                            )
                        }));
                    } else {
                        const columnId = `C-${Date.now()}`;
                        const columnToAdd: PanelColumn = {
                            columnId,
                            type: updatedColumn.type || "Padrão",
                            position: updatedColumn.position || config.columns.length + 1,
                            dimensions: updatedColumn.dimensions || { height: 2000, width: 800, depth: 600 },
                            modules: updatedColumn.modules || []
                        };
                        setConfig(prev => ({ ...prev, columns: [...prev.columns, columnToAdd] }));
                    }
                    setShowModal(false);
                    setEditingColumnId(null);
                    setNewColumn({
                        type: "",
                        position: config.columns.length + 1,
                        dimensions: { height: 2000, width: 800, depth: 600 },
                        modules: []
                    });
                }}
                onChange={(updates) => setNewColumn(prev => ({ ...prev, ...updates }))}
            />
        </AppLayout>
    );
}

export default PanelForgePage;
