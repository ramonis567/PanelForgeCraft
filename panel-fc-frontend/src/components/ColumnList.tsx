import React from "react";
import type { PanelColumn } from "../models/panel";
import ColumnCard from "./ColumnCard";

import {
    DndContext, 
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import type { DragEndEvent } from "@dnd-kit/core";

import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities"


type Props = {
  columns: PanelColumn[];
  onEdit: (column: PanelColumn) => void;
  onDelete: (column: PanelColumn) => void;
  onReorder: (newOrder: PanelColumn[]) => void;
  title?: string;
  className?: string;   // for custom design
};

const EmptyState: React.FC = () => (
    <>
        <p className="text-gray-500">Nenhuma coluna adicionada.</p>
    </>
);

const SortableColumnCard: React.FC<{
    column: PanelColumn;
    onEdit: (c: PanelColumn) => void;
    onDelete: (id: string) => void;
}> = ({ column, onEdit, onDelete }) => {
    
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = 
        useSortable({ id: column.columnId });


    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
    } as React.CSSProperties;

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ColumnCard 
                column={column}
                onEdit={onEdit}
                onDelete={() => onDelete(column.columnId)}
            />
        </div>
    
    );

};

const ColumnList: React.FC<Props> = ({ 
    columns, 
    onEdit, 
    onDelete,
    onReorder,
    className, 
}) => {

    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: { distance: 6 }})
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = columns.findIndex((c) => c.columnId === String(active.id));
        const newIndex = columns.findIndex((c) => c.columnId === String(over.id));
        if (oldIndex < 0 || newIndex < 0) return;

        const newOrder = arrayMove(columns, oldIndex, newIndex);
        onReorder(newOrder); 
    };


    return (
        <section className={className}>
            <label className="block text-sm font-medium mb-2">Lista de Colunas</label>
            
            {columns.length === 0 ? (
                <EmptyState />
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext
                        items={columns.map((c) => c.columnId)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="grid gap-4 items-stretch sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {columns.map((col) => (
                                <SortableColumnCard
                                    key={col.columnId}
                                    column={col}
                                    onEdit={onEdit}
                                    onDelete={() => onDelete(col)}
                                />
                            ))}
                        </div>
                    </SortableContext>

                </DndContext>
            )}
        </section>
    );
};

export default React.memo(ColumnList);