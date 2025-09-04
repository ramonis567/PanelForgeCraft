import React, { useState } from "react";
import { CirclePlus, Cog, X, PencilLine, Trash2, Plus } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import type { PanelConfiguration, PanelColumn, PanelModule } from "../../models/panel";

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
        position: config.columns.length + 1,
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

    const handleNewColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (["height", "width", "depth"].includes(name)) {
            setNewColumn((prev) => ({
                ...prev,
                dimensions: {
                    ...prev.dimensions!,
                    [name]: Number(value)
                }
            }));
        
        } else if (name === "position") {
            setNewColumn((prev) => ({
                ...prev,
                position: Number(value)
            }));
        } else {
            setNewColumn((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAddModuleToColumn = () => {
        setNewColumn((prev) => ({
            ...prev,
            modules: [...(prev.modules || []), { moduleId: `M-${Date.now()}`, name: "", size: 0 }]
        }));
    };

    const handleModuleChange = (index: number, field: keyof PanelModule, value: string | number) => {
        setNewColumn((prev) => {
            const updatedModules = [...(prev.modules || [])];
            updatedModules[index] = { ...updatedModules[index], [field]: value };
            return { ...prev, modules: updatedModules };
        });
    };

    const handleRemoveModule = (index: number) => {
        setNewColumn((prev) => {
            const updatedModules = [...(prev.modules || [])];
            updatedModules.splice(index, 1);
            return { ...prev, modules: updatedModules };
        });
    };

    const handleSaveColumn = () => {
        if (editingColumnId) {
            setConfig((prev) => ({
                ...prev,
                columns: prev.columns.map((col) =>
                    col.columnId === editingColumnId ? { ...col, ...newColumn } as PanelColumn : col
                )
            }));
            setShowModal(false);

        } else {
            const columnId = `C-${Date.now()}`
            const columnToAdd: PanelColumn = {
                columnId,
                type: newColumn.type || "Padrão",
                position: newColumn.position || config.columns.length + 1,
                dimensions: newColumn.dimensions || { height: 2000, width: 800, depth: 600 },
                modules: newColumn.modules || []
            };

            setConfig((prev) => ({
                ...prev,
                columns: [...prev.columns, columnToAdd]
            }));

            setShowModal(false);

            setNewColumn({
                type: "",
                position: config.columns.length + 2,
                dimensions: {
                    height: 2000,
                    width: 800,
                    depth: 600
                },
                modules: []
            });
        }
    }

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
                                onClick={() => { setShowModal(true); setEditingColumnId(null); }}
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
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Adicionar Coluna</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium">Tipo</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={newColumn.type || ""}
                                    onChange={handleNewColumnChange}
                                    className="mt-1 block w-full rounded border border-gray-200 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Posição</label>
                                <input
                                    type="number"
                                    name="position"
                                    value={newColumn.position || ""}
                                    onChange={handleNewColumnChange}
                                    className="mt-1 block w-full rounded border border-gray-200 p-2"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-sm font-medium">Altura (mm)</label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={newColumn.dimensions?.height || ""}
                                        onChange={handleNewColumnChange}
                                        className="mt-1 block w-full rounded border border-gray-200 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Largura (mm)</label>
                                    <input
                                        type="number"
                                        name="width"
                                        value={newColumn.dimensions?.width || ""}
                                        onChange={handleNewColumnChange}
                                        className="mt-1 block w-full rounded border border-gray-200 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Profundidade (mm)</label>
                                    <input
                                        type="number"
                                        name="depth"
                                        value={newColumn.dimensions?.depth || ""}
                                        onChange={handleNewColumnChange}
                                        className="mt-1 block w-full rounded border border-gray-200 p-2"
                                    />
                                </div>
                            </div>

                            {/* Module list */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Módulos</label>
                                {(newColumn.modules || []).map((mod, idx) => (
                                    <div key={mod.moduleId} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            placeholder="Nome"
                                            value={mod.name}
                                            onChange={(e) => handleModuleChange(idx, "name", e.target.value)}
                                            className="flex-1 rounded border border-gray-200 p-2"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Tamanho"
                                            value={mod.size}
                                            onChange={(e) => handleModuleChange(idx, "size", e.target.value)}
                                            className="w-24 rounded border border-gray-200 p-2"
                                        />
                                        <button
                                            onClick={() => handleRemoveModule(idx)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ))}
                                <button 
                                    onClick={handleAddModuleToColumn}
                                    className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    <Plus size={16} /> Adicionar módulo
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleSaveColumn}
                            className="mt-4 px-4 py-2 bg-[var(--color-brand-600)] text-white rounded hover:bg-[var(--color-brand-700)] w-full font-semibold"
                        >
                            Salvar Coluna
                        </button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

export default PanelForgePage;
