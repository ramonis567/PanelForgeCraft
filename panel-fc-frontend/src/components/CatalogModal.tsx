import React, { useState, useMemo } from "react";
import { X, Cpu } from "lucide-react";
import type { CatalogColumn } from "../services/panelData";

interface Props {
	isOpen: boolean;
  	catalog: CatalogColumn[];
  	onClose: () => void;
  	onSelect: (col: CatalogColumn) => void;
}

const CatalogModal: React.FC<Props> = ({ isOpen, catalog, onClose, onSelect }) => {
	const [query, setQuery] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);

	const normalize = (val: string) => val.toLowerCase().trim()

	const filteredCatalog = useMemo(() => {
		if(!query) return catalog;

		return catalog.filter(
			(c) =>
				normalize(c.funcao_principal).includes(normalize(query)) ||
				normalize(c.equipto_principal).includes(normalize(query))
		);
	}, [catalog, query])

	const suggestions = useMemo(() => {
		if(!query) return [];

		const all = [
			...catalog.map((c) => c.funcao_principal),
			...catalog.map((c) => c.equipto_principal),
		];

		return Array.from(new Set(all))
			.filter((s) => normalize(s).includes(normalize(query)))
			.slice(0, 5);
	}, [catalog, query])

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
	  		<div className="bg-white p-6 rounded-lg shadow-2xl max-w-5xl w-full relative overflow-y-auto max-h-[90vh]">
				<button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
		  			<X size={22} />
				</button>

				<h2 className="text-xl font-bold text-[var(--color-brand-700)] mb-6 flex items-center gap-2">
					<Cpu size={22} /> Selecionar Coluna do Catálogo
				</h2>

				<div className="relative mb-6">
          <input
            type="text"
            placeholder="Filtrar por função ou equipamento..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full border rounded-lg p-2 shadow-sm focus:ring-2 focus:ring-[var(--color-brand-600)]"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border rounded-lg shadow max-h-40 overflow-y-auto w-full mt-1">
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setQuery(s);
                    setShowSuggestions(false);
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

				<div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{filteredCatalog.map((c, idx) => (
						<div
							key={idx}
							className="flex flex-col justify-between border rounded-lg shadow hover:shadow-md p-4 transition bg-white"
						>
							<div>
								<h3 className="text-lg font-semibold text-[var(--color-brand-600)] mb-1">
									{c.funcao_principal}
								</h3>
								<p className="text-sm text-gray-700">
									<b>Equipamento Principal:</b> {c.equipto_principal}
								</p>
								<p className="text-sm text-gray-700">
									<b>Equipamentos Secundários:</b> {c.equipto_secundario}
								</p>
								<p className="text-sm text-gray-700">
									<b>Corrente Carga:</b> {c.corrente_carga}
								</p>
								<p className="text-sm text-gray-700">
									<b>Potência Carga:</b> {c.potencia_carga}
								</p>

								<p className="text-sm text-gray-600 mt-1">
									<b>Dimensões:</b> {c.altura_mm__ver_acessorios} x {c.largura_mm} x {c.profundidade_mm_considerando_as_portas} mm
								</p>
							</div>

							<button
								className="mt-4 px-3 py-2 bg-[var(--color-brand-600)] text-white rounded-lg hover:bg-[var(--color-brand-700)] font-medium transition"
								onClick={() => onSelect(c)}
							>
								Escolher
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CatalogModal;
