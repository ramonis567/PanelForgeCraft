import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, House, Pen } from "lucide-react";

import AppLayout from "../_common/layouts/AppLayout";
import type { PanelColumn, PanelConfiguration } from "../../models/panel";

import { loadPanel } from "../../utils/storage";

const PanelViewPage: React.FC = () => {
    let params = useParams();
    const panelId = params.panelId;

    const navigate = useNavigate();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const [zoom, setZoom] = useState(0.9);
    const [page, setPage] = useState(0);
    
    const pageWidthMM = 3000;

    const [config, setConfig] = useState<PanelConfiguration | null>(null);

    useEffect(() => {
        if(!panelId) return;
        const loaded = loadPanel(panelId);

        setConfig(loaded || null);     
    }, [panelId]);

    const columns = config?.columns ?? [];

    const paginateColumns = (columns: PanelColumn[], pageWidth: number) =>{
        const pages: PanelColumn[][] = [];
        let current: PanelColumn[] = [];
        let currentWidth = 0;

        for (const col of columns) {
            if (currentWidth + col.dimensions.width > pageWidth && current.length > 0) {
                pages.push(current);
                current = [];
                currentWidth = 0;
            }
            current.push(col);
            currentWidth += col.dimensions.width;
        }

        if (current.length > 0) {
            pages.push(current);   
        }

        return pages;
    }

    const pages = useMemo(() => paginateColumns(columns, pageWidthMM), [columns]);
    const currentColumns = pages[page] || [];

    const widthSum = currentColumns.reduce((sum, col) => sum + col.dimensions.width, 0);
    const maxHeight = Math.max(...columns.map(c => c.dimensions.height)) + 0;

    const marginX = pageWidthMM * 0.15;
    const marginY = maxHeight * 0.1;

    if(!config) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p>Carregando painel...</p>
                </div>
            </AppLayout>
        );
    };

    return(
        <AppLayout>
            {/* Header */}
            <header className="h-16 rounded-xl bg-[var(--color-surface-2)] border-b border-gray-200 flex items-center px-4 mb-2">
                <span className="font-medium text-gray-800 flex justify-between gap-3 w-full">
                    <div className="gap-2 items-center flex">
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
                            onClick={() => navigate(`/panel-forge/${panelId}`)}
                            className="flex justify-center items-center gap-2 
                                px-2 py-1 bg-red-500 
                                hover:bg-red-700 rounded 
                                text-semibold text-[var(--color-bg)] 
                                font-medium text-l"
                        >
                            <Pen size={22} />
                            <p>EDITAR</p>
                        </button>
                    </div>
                    <h1 className="text-2xl text-[var(--color-bg)]"><b>{config.name}</b></h1>
                    <h1 className="text-2xl text-[var(--color-bg)]">Panel View</h1>
                </span>
            </header>

            {/* Metadados */}
            <div className="px-4 py-1 mb-2 bg-gray-50 border border-gray-200 rounded">
                <p className="text-gray-600"><b>Descrição: </b>{config.description || "Sem descrição"}</p>
                <div className="text-sm text-gray-500 mt-1">
                    <p><b>Criado por:</b> {config.metadata.createdBy}</p>
                    <p><b>Última modificação:</b> {new Date(config.metadata.lastModifiedAt).toLocaleString()}</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-evenly gap-3 px-4 py-1 bg-gray-50 border border-gray-200 rounded mb-1">
                <div className="flex items-center gap-1"> 
                        <button
                            className="px-1 py-1 rounded bg-white hover:bg-gray-100 
                                gray shadow text-[var(--color-foreground)]"
                            onClick={() => setZoom(z => Math.min(1, z * 1.05))}
                        >
                            <ZoomIn size={20} />
                        </button>
                        <button
                            className="px-1 py-1 rounded bg-white hover:bg-gray-100 
                                gray shadow text-[var(--color-foreground)]"
                            onClick={() => setZoom(z => Math.max(0.5, z * 0.95))}
                        >
                            <ZoomOut size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1 text-[var(--color-alt-bg)]">
                        <button onClick={() => setPage(p => Math.max(0, p - 1))}>
                            <ChevronLeft />
                        </button>
                        <span>{page + 1} / {pages.length}</span>
                        <button onClick={() => setPage(p => Math.min(pages.length - 1, p + 1))}>
                            <ChevronRight />
                        </button>
                    </div>
            </div>

            {/* Preview */}
            <div className="flex h-[calc(100vh-6.5rem)]" ref={containerRef}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${pageWidthMM+2*marginX} ${maxHeight+2*marginY}`}
                    className="bg-white rounded-xl shadow-inner"
                    style={{
                        transform: `scale(${zoom})`, 
                        transformOrigin: "center"
                    }}
                    
                >
                    <defs>
                        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#181818" strokeWidth="0.6" />                        
                        </pattern>
                        <pattern id="gridBold" width="500" height="500" patternUnits="userSpaceOnUse">
                            <path d="M 500 0 L 0 0 0 500" fill="none" stroke="black" strokeWidth="1" />                        
                        </pattern>
                    </defs>

                    <rect 
                        x={0}
                        y={0}
                        width={pageWidthMM+2*marginX}
                        height={maxHeight+2*marginY}
                        fill="url(#grid)"
                        stroke="black"
                        strokeWidth={1}
                    />

                    <rect
                        x={0}
                        y={0}
                        width={pageWidthMM+2*marginX}
                        height={maxHeight+2*marginY}
                        fill="url(#gridBold)"
                    />

                    {/* Columns */}
                    <g transform={`translate(${marginX}, ${marginY})`}>
                        {(() => {
                            let offsetX = 0;

                            return currentColumns.map(col => {
                                const { width, height } = col.dimensions;
                                const x = offsetX;
                                const y = maxHeight - height;
                                offsetX += width;

                                return (
                                    <g key={col.columnId} transform={`translate(${x},${y})`}>
                                        <rect
                                            x={0}
                                            y={0}
                                            width={width}
                                            height={height}
                                            fill="#f9fafb"
                                            stroke="#034C8C"
                                            strokeWidth={1}
                                        />
                                        <text
                                            x={width/2}
                                            y={50}
                                            fontSize={28}
                                            textAnchor="middle"
                                            fill="#023059"
                                            style={{ fontWeight: 400 }}
                                        >
                                            {`Coluna ${col.position} - ${col.typical}`}
                                        </text>

                                        <>
                                            <line
                                                x1={0}
                                                y1={height + 35}
                                                x2={width}
                                                y2={height + 35}
                                                stroke="black"
                                                strokeWidth={2}
                                            />
                                            <text
                                                x={width / 2}
                                                y={height + 70}
                                                fontSize={40}
                                                textAnchor="middle"
                                            >
                                                {width} mm
                                            </text>
                                        </>

                                        <>
                                            <line 
                                                x1={-30}
                                                y1={0}
                                                x2={-30}
                                                y2={height}
                                                stroke="black"
                                                strokeWidth={2}
                                            />
                                            <text
                                                x={-40}
                                                y={height/2}
                                                fontSize={50}
                                                textAnchor="middle"
                                                fill="#023059"
                                                transform={`rotate(-90, ${-50}, ${height/2})`}
                                            >
                                                {col.dimensions.height}mm
                                            </text>
                                        </>
                                    </g>
                                );
                            })
                        })()}
                    </g>
                        <>
                            <line 
                                x1={marginX}
                                y1={maxHeight + marginY + 80}
                                x2={marginX + widthSum}
                                y2={maxHeight + marginY + 80}
                                stroke="black"
                                strokeWidth={3}
                            />
                            <text
                                x={marginX + widthSum / 2}
                                y={maxHeight + marginY + 130}
                                fontSize={50}
                                textAnchor="middle"
                                fill="#023059"
                            >
                                {widthSum}mm
                            </text>
                        </>
                </svg>
            </div>
        </AppLayout>
    );
}

export default PanelViewPage;
