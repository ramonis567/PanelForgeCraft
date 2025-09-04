import React, { useState } from "react";
import { Cog } from "lucide-react";
import AppLayout from "../../layouts/AppLayout";
import type { PanelConfiguration } from "../../models/panel";

const initialPanelConfig: PanelConfiguration = {
    id: "P-001",
    name: "Meu painel",
    description: "Descrição do meu painel",
    columns: [
        {
            columnId: "C-001",
            type: "Type A",
            dimensions: {
                height: 2000,
                width: 800,
                depth: 600
            },
            position: 1,
            modules: []
        }
    ],
    metadata: {
        createdBy: "Usuário",
        createdAt: new Date(),
        lastModifiedAt: new Date()
    }
}


function PanelForgePage() {
    const [config, setConfig] = useState<PanelConfiguration>(initialPanelConfig);
    const [panelName, setPanelName] = useState("");

    const handlePanelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig((prevConfig) => ({
            ...prevConfig,
            [name]: value
        }));
    }

    const handleColumnDimensionChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        columnId: string
    ) => {
        const { name, value } = e.target;
        setConfig((prevConfig) => ({
            ...prevConfig,
            columns: prevConfig.columns.map((col) =>
                col.columnId === columnId 
                    ? { 
                        ...col, 
                        dimensions: { 
                            ...col.dimensions, 
                            [name]: Number(value) 
                        } 
                    }
                : col
            )
        }));
    }

    const handleSubmit = () => {
        console.log("Panel Configuration Submitted:", config);
        setPanelName(config.name)

        // In the future, send the data to the backend
    }

    return (
        <AppLayout>
            <header className="h-16 rounded-xl bg-[var(--color-surface-2)] border-b border-gray-200 flex items-center px-4 mb-2">
                <span className="font-medium text-gray-800">
                    <h1 className="text-2xl text-[var(--color-bg)]">Panel Forge  - <b>{panelName}</b></h1>
                </span>
            </header>

            <div className="flex">
                <div className="bg-[var(--color-brand-800)] border-l-4 rounded-2xl border-[var(--color-accent-600)]"></div>
                <div className="px-2">
                    {/* Form header */}
                    <div className="flex gap-3 items-center">
                        <Cog size={28} className="" />
                        <h1 className="text-3xl font-bold">
                            Configuração do Painel
                        </h1>
                    </div>

                    {/* Form */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* Panel Name Input */}
                        <div>
                            <label className="block text-sm font-medium">Nome do Painel</label>
                            <input 
                                type="text" 
                                name="name"
                                value={config.name} 
                                onChange={handlePanelChange} 
                                className="mt-1 block w-full rounded border border-gray-200 p-2"
                            />
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

        </AppLayout>
    );
}

export default PanelForgePage;
