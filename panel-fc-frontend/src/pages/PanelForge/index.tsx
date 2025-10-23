import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CirclePlus, Cog, ListRestart, Group, House, Eye } from "lucide-react";

import AppLayout from "../_common/layouts/AppLayout";
import ColumnModal from "../../components/ColumnModal"
import ColumnList from "../../components/ColumnList";
import CatalogModal from "../../components/CatalogModal";

import { type PanelConfiguration, type PanelColumn, renumberColumns } from "../../models/panel";
import { loadPanel, savePanel, clearPanelConfig } from "../../utils/storage";
import { filterCatalog } from "../../services/panelData";
import type { CatalogColumn } from "../../services/panelData";

const initialPanelConfig: PanelConfiguration = {
    id: "",
    name: "",
    description: "",
    tensaoNominal: "",
    icc: "",
    structure: "PA4",
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

    const [showCatalog, setShowCatalog] = useState(false);
    const [availableColumns, setAvailableColumns] = useState<CatalogColumn[]>([]);

    const [newColumn, setNewColumn] = useState<Partial<PanelColumn>>({
        position: 1,
        columnTag: "",
        columnFunction: "",
        current_load: "",
        power_load_kw: "",
        main_equipment: "",
        secondary_equipments: [],
        dimensions: { height: 2000, width: 800, depth: 600, weight: 2000 },
        modules: []
    });

    const handleCatalogModal = () => {
        const type = "PA4";
        const filtered = filterCatalog(type, config.tensaoNominal, config.icc);

        setAvailableColumns(filtered);
        setShowCatalog(true);
    }

    const handlePanelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig((prev) => ({
            ...prev,
            [name]: value
        }));

        console.log("MUDANÇA")
        console.log(config)
    };

    const handleEditColumn = (column: PanelColumn) => {
        setEditingColumnId(column.columnId);
        setNewColumn({ ...column });
        setShowModal(true);
        
        console.log("EDIT")
        console.log(config)
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

        console.log("DELETE")
        console.log(config)
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

        console.log("ENVIADO")
        console.log(config)
        // In the future, send the data to the backend
    };

    const handleDuplicateColumn = (column: PanelColumn) => {
        setConfig(prev => {
            const duplicated: PanelColumn = {
                ...column,
                columnId: `C-${Date.now()}`,
                position: column.position + 1,
                columnTag: `${column.columnTag} (Cópia)`,
            };

            const newCols = [...prev.columns, duplicated];
            const renumbered = renumberColumns(newCols);

            console.log("DUPLICADO")
            console.log(renumbered)

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
                                        columnFunction: "",
                                        position: config.columns.length + 1,
                                        dimensions: { height: 2000, width: 800, depth: 600, weight: 2000 },
                                        modules: []
                                    })
                                    setEditingColumnId(null);
                                    handleCatalogModal();
                                    // setShowModal(true); 
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

            <CatalogModal 
                isOpen={showCatalog}
                catalog={availableColumns}
                onClose={() => setShowCatalog(false)}
                onSelect={(col) => {
                    setConfig((prev) => {
                        const newCol: PanelColumn = {
                            position: prev.columns.length + 1,
                            columnId: `C-${Date.now()}`,
                            columnTag: "COL-X",
                            columnFunction: col.funcao_principal,
                            main_equipment: col.equipto_principal,
                            secondary_equipments: col.equipto_secundario,
                            current_load: col.corrente_derivacao__carga_a,
                            power_load_kw: col.potencia_carga_kw,
                            dimensions: {
                                height: col.altura_mm__ver_acessorios,
                                width: col.largura_mm,
                                depth: col.profundidade_mm_considerando_as_portas,
                                weight: col.peso
                            },
                            modules: []
                        };
                        return {
                            ...prev,
                            columns: [...prev.columns, newCol],
                            metadata: { ...prev.metadata, lastModifiedAt: new Date() }
                        };
                    });
                    setShowCatalog(false);
                }}
            />

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
                                ? { ...c, ...updatedColumn, name: updatedColumn.columnTag || c.columnTag } as PanelColumn 
                                : c
                            );

                            const sorted = [...edited].sort((a, b) => a.position - b.position);
                            const renumbered = renumberColumns(sorted);

                            return { ...prev, columns: renumbered, metadata: { ...prev.metadata, lastModifiedAt: new Date() }};
                        } else {
                            const columnId = `C-${Date.now()}`;
                            const columnToAdd: PanelColumn = {
                                columnId,
                                position: config.columns.length + 1,
                                columnTag: updatedColumn.columnTag || `Coluna ${prev.columns.length + 1}`,
                                columnFunction: updatedColumn.columnFunction || "Padrão",
                                current_load: updatedColumn.current_load || "",
                                power_load_kw: updatedColumn.power_load_kw || "",
                                main_equipment: updatedColumn.main_equipment || "",
                                secondary_equipments: updatedColumn.secondary_equipments || [],
                                dimensions: updatedColumn.dimensions || { height: 2000, width: 800, depth: 600, weight: 2000 },
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
                        columnFunction: "",
                        position: config.columns.length + 1,
                        dimensions: { height: 2000, width: 800, depth: 600, weight: 2000 },
                        modules: []
                    });
                }}
                onChange={(updates) => setNewColumn(prev => ({ ...prev, ...updates }))}
            />
        </AppLayout>
    );
}

export default PanelForgePage;
