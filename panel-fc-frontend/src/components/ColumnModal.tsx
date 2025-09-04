import React from "react";
import { X, Plus } from "lucide-react";
import type { PanelColumn, PanelModule } from "../models/panel";


interface ColumnModalProps {
    isOpen: boolean;
    column: Partial<PanelColumn>;
    onClose: () => void;
    onSave: (column: Partial<PanelColumn>) => void;
    onChange: (updates: Partial<PanelColumn>) => void
}

const ColumnModal: React.FC<ColumnModalProps> = ({
    isOpen,
    column,
    onClose,
    onSave,
    onChange,
}) => {
    if (!isOpen) return null;

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (["height", "width", "depth"].includes(name)) {
            onChange({
                dimensions: {
                    ...column.dimensions!,
                    [name]: Number(value),
                },
            });
        } else if (name === "position") {
            onChange({ position: Number(value) });
        } else {
            onChange({ [name]: value });
        }
    };

    const handleAddModuleToColumn = () => {
        onChange({
            modules:[
                ...(column.modules || []),
                { moduleId: `M-${Date.now()}`, name: "", size: 0 }
            ],
        });
    };

    const handleModuleChange = (
        idx: number,
        field: keyof PanelModule,
        value: string | number
    ) => {
        const updatedModules = [...(column.modules || [])];
        updatedModules[idx] = { ...updatedModules[idx], [field]: value };
        onChange({ modules: updatedModules });
    };

    const handleRemoveModule = (idx: number) => {
        const updatedModules = [...(column.modules || [])];
        updatedModules.splice(idx, 1);
        onChange({ modules: updatedModules });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Adicionar / Editar Coluna</h2>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium">Tipo</label>
                        <input
                            type="text"
                            name="type"
                            value={column.type || ""}
                            onChange={handleFieldChange}
                            className="mt-1 block w-full rounded border border-gray-200 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Posição</label>
                        <input
                            type="number"
                            name="position"
                            value={column.position || ""}
                            onChange={handleFieldChange}
                            className="mt-1 block w-full rounded border border-gray-200 p-2"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block text-sm font-medium">Altura (mm)</label>
                            <input
                                type="number"
                                name="height"
                                value={column.dimensions?.height || ""}
                                onChange={handleFieldChange}
                                className="mt-1 block w-full rounded border border-gray-200 p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Largura (mm)</label>
                            <input
                                type="number"
                                name="width"
                                value={column.dimensions?.width || ""}
                                onChange={handleFieldChange}
                                className="mt-1 block w-full rounded border border-gray-200 p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Profundidade (mm)</label>
                            <input
                                type="number"
                                name="depth"
                                value={column.dimensions?.depth || ""}
                                onChange={handleFieldChange}
                                className="mt-1 block w-full rounded border border-gray-200 p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Módulos</label>
                        {(column.modules || []).map((mod, idx) => (
                            <div key={mod.moduleId} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Nome"
                                    value={mod.name}
                                    onChange={(e) =>
                                        handleModuleChange(idx, "name", e.target.value)
                                    }
                                    className="flex-1 rounded border border-gray-200 p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Tamanho"
                                    value={mod.size}
                                    onChange={(e) =>
                                        handleModuleChange(idx, "size", e.target.value)
                                    }
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
                    onClick={() => onSave(column)}
                    className="mt-4 px-4 py-2 bg-[var(--color-brand-600)] text-white rounded hover:bg-[var(--color-brand-700)] w-full font-semibold"
                >
                    Salvar Coluna
                </button>
            </div>
        </div>
    );
};

export default ColumnModal;