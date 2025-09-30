import React from "react";
import { X } from "lucide-react";
import type { CatalogColumn } from "../services/panelData";

interface Props {
  isOpen: boolean;
  catalog: CatalogColumn[];
  onClose: () => void;
  onSelect: (col: CatalogColumn) => void;
}

const CatalogModal: React.FC<Props> = ({ isOpen, catalog, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Selecionar Coluna do Catálogo</h2>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Função</th>
              <th className="p-2 border">Equipto Principal</th>
              <th className="p-2 border">Dimensões (AxLxP)</th>
              <th className="p-2 border">Ação</th>
            </tr>
          </thead>
          <tbody>
            {catalog.map((c, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-2 border">{c.funcao_principal}</td>
                <td className="p-2 border">{c.equipto_principal}</td>
                <td className="p-2 border">
                  {c.altura_mm__ver_acessorios} x {c.largura_mm} x {c.profundidade_mm_considerando_as_portas}
                </td>
                <td className="p-2 border text-center">
                  <button
                    className="px-2 py-1 bg-[var(--color-brand-600)] text-white rounded hover:bg-[var(--color-brand-700)]"
                    onClick={() => onSelect(c)}
                  >
                    Escolher
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CatalogModal;
