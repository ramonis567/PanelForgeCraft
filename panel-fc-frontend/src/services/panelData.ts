import pa4 from "../assets/pa4.json"
// import cm4 from "../assets/cm4.json"

export interface CatalogColumn {
  tensao_kv: string;
  icc_ka: string;
  funcao_principal: string;
  equipto_principal: string;
  equipto_secundario: string;
  largura_mm: number;
  altura_mm__ver_acessorios: number;
  profundidade_mm_considerando_as_portas: number;
  acessorio_1?: string | null;
  acessorio_2?: string | null;
  acessorio_3?: string | null;
}

type Catalog = {
  [key: string]: CatalogColumn[];
};

const catalog: Catalog = {
  PA4: pa4 as unknown as CatalogColumn[],
  // CM4: cm4 as unknown as CatalogColumn[],
};

export function getCatalog(type: "PA4") {
  return catalog[type];
}

export function filterCatalog(
  type: "PA4",
  tensao: string,
  icc: string
): CatalogColumn[] {
  return catalog[type].filter(
    (c) =>
      c.tensao_kv == tensao &&
      c.icc_ka == icc
  );
}