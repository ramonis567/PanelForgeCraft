import Catalog from "../models/Catalog";

export class CatalogService {
    static async getAll(filters: any = {}) {
        const query: any = {};

        if (filters.structure) query.structure = filters.structure;
        if (filters.voltage_kv) query.voltage_kv = filters.voltage_kv;
        if (filters.icc_ka) query.icc_ka = filters.icc_ka;
        if (filters.function) query.function = filters.function;

        return Catalog.find(query).limit(200);
    }

    static async getById(id: string) {
        return Catalog.findById(id);
    }
}
