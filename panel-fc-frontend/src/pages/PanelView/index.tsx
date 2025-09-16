import React, { useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import type { PanelConfiguration, PanelColumn } from "../../models/panel";
import { loadPanelConfig } from "../../utils/storage";
import { ZoomIn, ZoomOut, RulerDimensionLine, ChevronLeft, ChevronRight } from "lucide-react";


const PanelViewPage: React.FC = () => {
    const [zoom, setZoom] = useState(0.9);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [config, setConfig] = useState<PanelConfiguration | null>(null);
    const [page, setPage] = useState(0);
    const pageWidthMM = 3000;

    const columns = [
        {
            "columnId": "C-1",
            "type": "Alimentação",
            "dimensions": {
                "height": 2000,
                "width": 400,
                "depth": 600
            },
            "position": 1,
            "modules": [
                { 
                    "moduleId": "M-1", 
                    "name": "Disjuntor QF1", 
                    "size": "125A" 
                }
            ]
        },
        {
            "columnId": "C-2",
            "type": "Saídas",
            "dimensions": {
                "height": 2000,
                "width": 400,
                "depth": 600
            },
            "position": 2,
            "modules": [
                { 
                    "moduleId": "M-2", 
                    "name": "Disjuntor QF2", 
                    "size": "63A" 
                }
            ]
        },
        {
            "columnId": "C-3",
            "type": "Saídas",
            "dimensions": {
                "height": 2100,
                "width": 500,
                "depth": 600
            },
            "position": 3,
            "modules": [
                { 
                    "moduleId": "M-2", 
                    "name": "Disjuntor QF2", 
                    "size": "63A" 
                }
            ]
        }
    ]

    const totalWidth = columns.reduce((sum, c) => sum + c.dimensions.width, 0) + 0;
    const maxHeight = Math.max(...columns.map(c => c.dimensions.height)) + 0;

    const marginX = totalWidth * 0.15;
    const marginY = totalWidth * 0.1;

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

    return(
        <AppLayout>
            <header className="h-16 rounded-xl bg-[var(--color-surface-2)] border-b border-gray-200 flex items-center px-4 mb-2">
                <span className="font-medium text-gray-800 flex justify-between gap-3 w-full">
                    <h1 className="text-2xl text-[var(--color-bg)]">{}</h1>

                    <div className="flex items-center gap-1"> 
                        <button
                            className="px-1 py-1 rounded bg-white hover:bg-gray-100 
                                gray shadow text-[var(--color-foreground)]"

                            onClick={() => setZoom(z => Math.max(0.5, z * 0.9))}
                        >
                            <ZoomOut size={20} />
                        </button>
                        <button
                            className="px-1 py-1 rounded bg-white hover:bg-gray-100 
                                gray shadow text-[var(--color-foreground)]"
                            
                            onClick={() => setZoom(z => Math.min(1, z * 1.1))}
                        >
                            <ZoomIn size={20} />
                        </button>
                    </div>

                    <h1 className="text-2xl text-[var(--color-bg)]">Panel View</h1>
                </span>
            </header>
            
            <div className="flex h-[calc(100vh-6.5rem)]" ref={containerRef}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${totalWidth+2*marginX} ${maxHeight+2*marginY}`}
                    className="bg-white rounded-xl shadow-inner"
                    style={{
                        transform: `scale(${zoom})`, 
                        transformOrigin: "center"
                    }}
                >
                    <rect 
                        x={0}
                        y={0}
                        width={totalWidth+2*marginX}
                        height={maxHeight+2*marginY}
                        fill="white"
                        stroke="black"
                        strokeWidth={1}
                    />

                    <g transform={`translate(${marginX}, ${marginY})`}>
                        {(() => {
                            let offsetX = 0;

                            return columns.map(col => {
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
                                            {`Coluna ${col.position} - ${col.type}`}
                                        </text>
                                    </g>
                                );
                            })
                        })()}
                    </g>
                </svg>
            </div>
        </AppLayout>
    );
}

export default PanelViewPage;
