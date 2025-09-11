import React, { useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import type { PanelConfiguration, PanelColumn } from "../../models/panel";
import { loadPanelConfig } from "../../utils/storage";
import { ZoomIn, ZoomOut, RulerDimensionLine, ChevronLeft, ChevronRight } from "lucide-react";



const PanelViewPage: React.FC = () => {
    const [config, setConfig] = useState<PanelConfiguration | null>(null);
    const [zoom, setZoom] = useState(1);
    const [page, setPage] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);

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
        }
    ]


    return(
        <AppLayout>
            <header className="h-16 rounded-xl bg-[var(--color-surface-2)] border-b border-gray-200 flex items-center px-4 mb-2">
                <span className="font-medium text-gray-800 flex justify-between gap-3 w-full">
                    <h1 className="text-2xl text-[var(--color-bg)]">{}</h1>

                    <div className="flex items-center gap-1"> 
                        <button
                            className="px-1 py-1 rounded bg-white hover:bg-gray-100 
                                gray shadow text-[var(--color-foreground)]"
                        >
                            <ZoomOut size={20} />
                        </button>
                        <button
                            className="px-1 py-1 rounded bg-white hover:bg-gray-100 
                                gray shadow text-[var(--color-foreground)]"
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
                    viewBox={`0 0 3000 2000`}
                    className="bg-white rounded-xl shadow-inner"
                >
                    <g>
                        <rect 
                            x={0}
                            y={0}
                            width={5000}
                            height={4000}
                            fill="white"
                            stroke="black"
                            strokeWidth={1/1}
                        />

                        {columns.map(col => (
                            <g>
                                <rect
                                    x={0}
                                    y={0}
                                    width={col.dimensions.width}
                                    height={col.dimensions.height}
                                    fill="#f9fafb"
                                    stroke="#034C8C"
                                    strokeWidth={1 / 1}
                                />
                                <text
                                    x={col.dimensions.width / 2}
                                    y={14}
                                    fontSize={12}
                                    textAnchor="middle"
                                    fill="#023059"
                                    style={{ fontWeight: 600 }}
                                >
                                    {`Coluna ${col.position}`}
                                </text>
                            </g>
                        ))}
                    </g>
                </svg>


            </div>
        </AppLayout>
    );
}

export default PanelViewPage;
