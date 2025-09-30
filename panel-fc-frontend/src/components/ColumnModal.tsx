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
                { moduleId: `M-${Date.now()}`, name: "", height: 0, width: 0, depth: 0, weight: 0 }
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
                <h2 className="text-xl font-semibold mb-4">Editar Coluna</h2>

                <div>
                    <label className="block text-sm font-medium">Posição</label>
                    <input
                        type="number"
                        name="position"
                        disabled
                        value={column.position || ""}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full rounded border bg-gray-200 border-gray-300 p-2 "
                    />
                </div>

                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-1">
                        <div>
                            <label className="block text-sm font-medium">Tag da Coluna</label>
                            <input
                                type="text"
                                name="columnTag"
                                value={column.columnTag || ""}
                                onChange={(e) => onChange({ columnTag: e.target.value })}
                                className="mt-1 block w-full rounded border border-gray-200 p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Função</label>
                            <input
                                type="text"
                                name="columnFunction"
                                value={column.columnFunction || ""}
                                onChange={(e) => onChange({ columnFunction: e.target.value })}
                                className="mt-1 block w-full rounded border border-gray-200 p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                        <div>
                            <label className="block text-sm font-medium">Equipamento Principal</label>
                            <input
                                type="text"
                                name="main_equipment"
                                value={column.main_equipment || ""}
                                onChange={(e) => onChange({ columnTag: e.target.value })}
                                className="mt-1 block w-full rounded border border-gray-200 p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Equip`s. Secundários</label>
                            <input
                                type="text"
                                name="secondary_equipments"
                                value={column.secondary_equipments || ""}
                                onChange={(e) => onChange({ columnFunction: e.target.value })}
                                className="mt-1 block w-full rounded border border-gray-200 p-2"
                            />
                        </div>
                    </div>
                        
                    <div className="grid grid-cols-2 gap-1">
                        <div>
                            <label className="block text-sm font-medium">Corrente Deriv. Carga (A)</label>
                            <input
                                type="text"
                                name="current_load"
                                value={column.current_load || ""}
                                onChange={handleFieldChange}
                                className="mt-1 block w-full rounded border border-gray-200 p-2 disabled:bg-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Potência Carga (kW)</label>
                            <input
                                type="text"
                                name="power_load_kw"
                                value={column.power_load_kw || ""}
                                onChange={handleFieldChange}
                                className="mt-1 block w-full rounded border border-gray-200 p-2 disabled:bg-gray-200"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                        <div>
                            <label className="block text-sm font-medium">Alt. (mm)</label>
                            <input
                                type="number"
                                name="height"
                                value={column.dimensions?.height || ""}
                                onChange={handleFieldChange}
                                disabled
                                className="mt-1 block w-full rounded border border-gray-200 p-2 disabled:bg-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Larg. (mm)</label>
                            <input
                                type="number"
                                name="width"
                                value={column.dimensions?.width || ""}
                                onChange={handleFieldChange}
                                disabled
                                className="mt-1 block w-full rounded border border-gray-200 p-2 disabled:bg-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Prof. (mm)</label>
                            <input
                                type="number"
                                name="depth"
                                value={column.dimensions?.depth || ""}
                                onChange={handleFieldChange}
                                disabled
                                className="mt-1 block w-full rounded border border-gray-200 p-2 disabled:bg-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Peso (kg)</label>
                            <input
                                type="number"
                                name="depth"
                                value={column.dimensions?.weight || ""}
                                onChange={handleFieldChange}
                                disabled
                                className="mt-1 block w-full rounded border border-gray-200 p-2 disabled:bg-gray-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Acessórios</label>
                        {(column.modules || []).map((mod, idx) => (
                            <div key={mod.moduleId} className="flex gap-1 mb-2 items-center">
                                <div>
                                    <label className="block text-sm font-medium">Nome</label>
                                    <input
                                        type="text"
                                        placeholder="Nome"
                                        value={mod.name}
                                        onChange={(e) =>
                                            handleModuleChange(idx, "name", e.target.value)
                                        }
                                        className="flex-1 rounded border border-gray-200 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Altura (mm)</label>
                                    <input
                                        type="text"
                                        placeholder="Tamanho"
                                        value={mod.height}
                                        onChange={(e) =>
                                            handleModuleChange(idx, "height", e.target.value)
                                        }
                                        className="w-20 rounded border border-gray-200 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Peso (kg)</label>
                                    <input
                                        type="text"
                                        placeholder="Tamanho"
                                        value={mod.weight}
                                        onChange={(e) =>
                                            handleModuleChange(idx, "weight", e.target.value)
                                        }
                                        className="w-20 rounded border border-gray-200 p-2"
                                    />
                                </div>
                                <div className="mt-6">
                                    <button
                                        onClick={() => handleRemoveModule(idx)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
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