import React from "react";
import { PencilLine, Trash2 } from "lucide-react";
import type { PanelColumn } from "../models/panel";

type Props = {
    column: PanelColumn;
    onEdit: (column: PanelColumn) => void;
    onDelete: (column: PanelColumn) => void;
    className?: string;
}

const ColumnCard: React.FC<Props> = ({ column, onEdit, onDelete, className }) => {
  return (
    <div
      className={
        "bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow flex flex-col justify-between " +
        (className ?? "")
      }
    >
      <div>
        <p className="font-medium text-[var(--color-brand-700)]">
          <b>Tipo:</b> {column.type}
        </p>
        <p>
          <b>Posição:</b> {column.position}
        </p>
        <p>
          <b>Dimensões:</b>{" "}
          {column.dimensions.height} x {column.dimensions.width} x {column.dimensions.depth} mm
        </p>
        <p>
          <b>Módulos:</b> {column.modules.length}
        </p>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={() => onEdit(column)}
          className="px-2 py-1 text-sm rounded bg-[var(--color-accent-600)] text-[var(--color-alt-bg)] hover:opacity-90"
          aria-label={`Editar coluna ${column.columnId}`}
          title="Editar"
        >
          <PencilLine size={18} />
        </button>

        <button
          onClick={() => onDelete(column)}
          className="px-2 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200"
          aria-label={`Excluir coluna ${column.columnId}`}
          title="Excluir"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ColumnCard);