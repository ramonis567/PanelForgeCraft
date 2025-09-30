import React, { useState } from "react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (tensao: string, icc: string) => void;
}

// IN FUTURE: Load these values from a API or database
const tensoes = ["7,2", "15"];
const iccs = {
  "7,2": ["40", "50", "<= 31,5", "<= 31,5 / 40"],
  "15": ["40", "50", "<= 31,5", "<= 31,5 / 40"]
};

const PanelInitModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  const [tensao, setTensao] = useState("");
  const [icc, setIcc] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (tensao && icc) {
      onConfirm(tensao, icc);
    }
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
        <h2 className="text-xl font-semibold mb-4">Novo Painel</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Tensão Nominal (kV)</label>
            <select
              value={tensao}
              onChange={(e) => {
                const value = e.target.value;
                setTensao(value);
                setIcc("");
              }}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
            >
              <option value="">Selecione...</option>
              {tensoes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {tensao && (
            <div>
              <label className="block text-sm font-medium">Icc (kA)</label>
              <select
                value={icc}
                onChange={(e) => setIcc(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              >
                {iccs[tensao as "7.2" | "15"]?.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!tensao || !icc}
          className={`mt-4 w-full px-4 py-2 rounded font-semibold ${
            tensao && icc
              ? "bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default PanelInitModal;
