import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CirclePlus, Cog, ListRestart, Group, House, Eye } from "lucide-react";

import AppLayout from "../../layouts/AppLayout";
import ColumnModal from "../../components/ColumnModal"
import ColumnList from "../../components/ColumnList";

import { type PanelConfiguration, type PanelColumn, renumberColumns } from "../../models/panel";
import { loadPanel, savePanel, clearPanelConfig } from "../../utils/storage";

const initialPanelConfig: PanelConfiguration = {
    id: "",
    name: "",
    description: "",
    columns: [],
    metadata: {
        createdBy: "User",
        createdAt: new Date(),
        lastModifiedAt: new Date()
    }
}

function PanelForgePage() {
    let params = useParams();
    const panelId = params.panelId;

    const navigate = useNavigate();
    const [config, setConfig] = useState<PanelConfiguration>(initialPanelConfig);

    useEffect(() => {
        if(!panelId) return;
        const loaded = loadPanel(panelId);

        setConfig(loaded ?? initialPanelConfig);

    }, [panelId]);

    const [showModal, setShowModal] = useState(false);
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null);

    const [newColumn, setNewColumn] = useState<Partial<PanelColumn>>({
        name: "",
        typical: "",
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

    const handleDeleteColumn = (column: PanelColumn) => {
        const confirmation = confirm(`Deseja realmente excluir a coluna ${column.position}?`)

        if (!confirmation) {
            return;
        }

        setConfig(prev => {
            const remaining = prev.columns.filter(c => c.columnId !== column.columnId);
            return { 
                ...prev, 
                columns: renumberColumns(remaining),
                metadata: { ...prev.metadata, lastModifiedAt: new Date() } 
            };
        });
    };

    const handleReorderColumns = (newOrder: PanelColumn[]) => {
        setConfig((prev) => ({
            ...prev,
            columns: renumberColumns(newOrder)
        }));
    };

    const handleSubmit = () => {
        const confirmation = confirm(`Deseja prosseguir com este layout?`)

        if (!confirmation) {
            return;
        }

        savePanel(config);

        // In the future, send the data to the backend
    };

    const handleDuplicateColumn = (column: PanelColumn) => {
        setConfig(prev => {
            const duplicated: PanelColumn = {
                ...column,
                columnId: `C-${Date.now()}`,
                position: column.position + 1,
                name: `${column.name} (Cópia)`
            };

            const newCols = [...prev.columns, duplicated];
            const renumbered = renumberColumns(newCols);

            return {
                ...prev,
                columns: renumbered,
                metadata: { ...prev.metadata, lastModifiedAt: new Date() }
            };
        });
    };

    return (
        <AppLayout>
            <header className="h-16 rounded-xl bg-[var(--color-surface-2)] border-b border-gray-200 flex items-center px-4 mb-2">
                <span className="font-medium text-gray-800 flex justify-between gap-3 w-full">
                    <div className="gap-1 items-center flex">
                        <button
                            onClick={() => navigate("/")}
                            className="flex justify-center items-center gap-2 
                                px-2 py-1 bg-[var(--color-accent-600)] 
                                hover:bg-[var(--color-accent-500)] rounded 
                                text-semibold text-[var(--color-surface-1)] 
                                font-medium text-l"
                        >
                            <House size={22} />
                            <p>HOME</p>
                        </button>
                        <button
                            onClick={() => navigate(`/panel-view/${panelId}`)}
                            className="flex justify-center items-center gap-2 
                                px-2 py-1 bg-red-500 
                                hover:bg-red-700 rounded 
                                text-semibold text-[var(--color-bg)] 
                                font-medium text-l"
                        >
                            <Eye size={22} />
                            <p>PREVIEW</p>
                        </button>
                    </div>                          
                    <h1 className="text-2xl text-[var(--color-bg)]"><b>{config.name}</b></h1>
                    <h1 className="text-2xl text-[var(--color-bg)]">Panel Forge</h1>
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
                        <div className="col-span-1 md:col-span-3 flex gap-3">
                            <button 
                                onClick={() => { 
                                    setNewColumn({
                                        typical: "",
                                        position: config.columns.length + 1,
                                        dimensions: { height: 2000, width: 800, depth: 600 },
                                        modules: []
                                    })
                                    setEditingColumnId(null); 
                                    setShowModal(true); 
                                }}
                                className="
                                    flex-13 px-4 py-2 flex items-center justify-center 
                                    gap-2 bg-[var(--color-brand-600)] text-white rounded 
                                    hover:bg-[var(--color-brand-700)] w-full font-semibold
                                "
                            >
                                <CirclePlus size={28}/> ADICIONAR COLUNA
                            </button>
                             <button
                                onClick={() => {
                                    const confirmation = confirm("Deseja realmente resetar a configuração do painel?");
                                    if (!confirmation) return;
                                    clearPanelConfig(panelId ?? "");
                                    setConfig(prev => ({
                                        ...initialPanelConfig,
                                        id: prev.id
                                    }));
                                }}
                                    className="
                                        flex-8 px-4 py-2 flex items-center justify-center 
                                        gap-2 bg-[var(--color-danger)] text-white rounded 
                                        hover:bg-red-800 font-semibold
                                    "
                            >
                                <ListRestart size={28}/> RESET
                            </button>
                        </div>

                        {/* List of Columns */}
                        <div className="mt-6">
                            <ColumnList 
                                columns={config.columns}
                                onEdit={handleEditColumn}
                                onDelete={handleDeleteColumn}
                                onReorder={handleReorderColumns}
                                onDuplicate={handleDuplicateColumn}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="col-span-1 md:col-span-3">
                            <button 
                                onClick={handleSubmit} 
                                className="
                                    flex items-center justify-center gap-3
                                    px-4 py-2 bg-[var(--color-accent-600)] 
                                    text-[var(--color-alt-bg)] rounded 
                                    hover:bg-[var(--color-brand-800)] w-full font-semibold
                                "
                            >
                                <Group size={28} /> SALVAR PAINEL
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
                    setConfig((prev) => {
                        if (editingColumnId) {
                            const edited = prev.columns.map(c =>
                                c.columnId === editingColumnId 
                                ? { ...c, ...updatedColumn, name: updatedColumn.name || c.name } as PanelColumn 
                                : c
                            );

                            const sorted = [...edited].sort((a, b) => a.position - b.position);
                            const renumbered = renumberColumns(sorted);

                            return { ...prev, columns: renumbered, metadata: { ...prev.metadata, lastModifiedAt: new Date() }};
                        } else {
                            const columnId = `C-${Date.now()}`;
                            const columnToAdd: PanelColumn = {
                                columnId,
                                name: updatedColumn.name || `Coluna ${prev.columns.length + 1}`,
                                typical: updatedColumn.typical || "Padrão",
                                position: config.columns.length + 1,
                                dimensions: updatedColumn.dimensions || { height: 2000, width: 800, depth: 600 },
                                modules: updatedColumn.modules || []
                            };

                            const afterAdd = [...prev.columns, columnToAdd];
                            const renumbered = renumberColumns(afterAdd);

                            return { ...prev, columns: renumbered, metadata: { ...prev.metadata, lastModifiedAt: new Date() }};
                        }
                    });
                    
                    setShowModal(false);
                    setEditingColumnId(null);
                    setNewColumn({
                        typical: "",
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
