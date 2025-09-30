import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2, Copy } from 'lucide-react';

import AppLayout from '../_common/layouts/AppLayout';
import PanelInitModal from '../../components/PanelModal';
import type { PanelConfiguration } from '../../models/panel';
import { loadAllPanels, savePanel, deletePanel } from '../../utils/storage';
import { createBlankPanel, generatePanelId } from '../../utils/initPanel';

const Home = () => {
    const [panels, setPanels] = useState<PanelConfiguration[]>([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const loadPanelsList = () => {
        let savedPanels = loadAllPanels();

        savedPanels = savedPanels.sort((a, b) => {
            const da = new Date(a.metadata.lastModifiedAt).getTime();
            const db = new Date(b.metadata.lastModifiedAt).getTime();
            return db - da;
        });

        setPanels(savedPanels);
    };

    useEffect(() => { loadPanelsList() }, [])

    const handleOpenModal = () => {
        setShowModal(true);
    }

    const handleConfirmInit = (tensao: string, icc: string) => {
        const newPanel = createBlankPanel();
        newPanel.tensaoNominal = tensao;
        newPanel.icc = icc;
        savePanel(newPanel);
        setShowModal(false);
        navigate(`/panel-forge/${newPanel.id}`);
    }

    const editPanel = (id: string) => {
        navigate(`/panel-forge/${id}`);
    }

    const viewPanel = (id: string) => {
        navigate(`/panel-view/${id}`);
    }

    const removePanel = (id: string) => {
        deletePanel(id);
        loadPanelsList();
    }

    const duplicatePanel = (panel: PanelConfiguration) => {
        const copy: PanelConfiguration = {
            ...panel,
            id: generatePanelId(),
            name: panel.name + " (Cópia)",
            metadata: {
                ...panel.metadata,
                createdAt: new Date(),
                lastModifiedAt: new Date(),
            },
        };
        savePanel(copy);
        loadPanelsList();
    };

    const filtered = panels.filter(
        (p) =>
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            (p.description?.toLowerCase().includes(search.toLowerCase())) ||
            p.id?.toLowerCase().includes(search.toLowerCase())
    )
    
    
    return (
        <AppLayout>
            <PanelInitModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleConfirmInit}
            />

            <header className="h-16 rounded-xl bg-[var(--color-surface-2)] border-b border-gray-200 flex items-center px-4 mb-2">
                <span className="font-medium text-gray-800 flex justify-between gap-3 w-full">
                    <h1 className="text-2xl text-[var(--color-bg)]"><b>{}</b></h1>
                    <h1 className="text-2xl text-[var(--color-bg)]">Panel List</h1>
                </span>
            </header>

            <div 
                className="flex items-center justify-start gap-3 
                px-2 py-1 bg-gray-50 border border-gray-200 rounded mb-1"
            >
                <button
                    className="flex items-center justify-center gap-3 px-3 py-1 rounded 
                    bg-[var(--color-accent-600)] text-[var(--color-alt-bg)]  
                    hover:bg-[var(--color-brand-800)] gray shadow w-full"
                    onClick={handleOpenModal}
                >
                    <Plus size={24} /> Novo Painel
                </button>

                <input 
                    type="text"
                    placeholder="Pesquisar painel..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p className="text-lg">Nenhum projeto encontrado. Crie um novo painel para começar!</p>
                </div>
            ) : (
                <div className="w-full">
                    <div className="grid grid-cols-24 gap-1 px-2 py-2 bg-gray-200 rounded-t">
                        <div className='col-span-3 font-semibold text-gray-700'>ID</div>
                        <div className="col-span-5 font-semibold text-gray-700">Nome</div>
                        <div className="col-span-10 font-semibold text-gray-700">Descrição</div>
                        <div className="col-span-2 font-semibold text-gray-700">Colunas</div>
                        <div className="col-span-4 font-semibold text-gray-700 justify-self-end">Ações</div>
                    </div>
                    <div>
                        {filtered.map(panel => (
                            <div key={panel.id} 
                                className="grid grid-cols-24 gap-3 items-center 
                                px-2 py-3 border-b border-gray-300 
                                hover:bg-gray-200 transition"
                            >
                                <div className="col-span-3 text-gray-500 truncate">
                                    {panel.id}
                                </div>
                                <div className="col-span-5 text-[var(--color-brand-600)] font-semibold truncate">
                                    {panel.name || "Sem nome"}
                                </div>
                                <div className="col-span-10 text-gray-500 truncate">
                                    {panel.description || "Sem descrição"}
                                </div>
                                <div className="col-span-2 text-gray-500 truncate">
                                    {panel.columns?.length || 0} colunas
                                </div>
                                <div className="col-span-4 flex justify-end gap-2">
                                    <button
                                        onClick={() => viewPanel(panel.id)}
                                        className="p-2 rounded bg-[var(--color-accent-600)] hover:bg-[var(--color-brand-800)]"
                                        title="Visualizar preview"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => editPanel(panel.id)}
                                        className="p-2 rounded bg-blue-300 hover:bg-[var(--color-brand-600)] text-[var(--color-bg)]"
                                        title="Editar painel"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => duplicatePanel(panel)}
                                        className="p-2 rounded bg-gray-300 hover:bg-gray-500 text-gray-900"
                                        title="Duplicar painel"
                                    >
                                        <Copy size={18} />
                                    </button>
                                    <button
                                        onClick={() => removePanel(panel.id)}
                                        className="p-2 rounded bg-red-200 hover:bg-[var(--color-danger)] text-red-800"
                                        title="Excluir painel                                                                               "
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

export default Home;
