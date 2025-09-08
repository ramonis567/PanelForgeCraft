import React from "react";
import type { PanelColumn } from "../models/panel";

import ColumnCard from "./ColumnCard";

type Props = {
  columns: PanelColumn[];
  onEdit: (column: PanelColumn) => void;
  onDelete: (columnId: PanelColumn) => void;
  title?: string;
  className?: string;   // for custom design
};

const EmptyState: React.FC = () => (
    <>
        <p className="text-gray-500">Nenhuma coluna adicionada.</p>
    </>
);

const ColumnList: React.FC<Props> = ({ columns, onEdit, onDelete, className }) => {
    return (
        <section className={className}>
            <label className="block text-sm font-medium mb-2">Lista de Colunas</label>
            
            {columns.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid gap-4 items-stretch sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {columns.map((col) => (
                        <ColumnCard
                            key={col.columnId}
                            column={col}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            className="h-full"
                            />
                    ))}
                </div>
            )}
        </section>
    );
};

export default React.memo(ColumnList);