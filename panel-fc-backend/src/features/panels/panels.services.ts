import Panel from "./Panel";

export class PanelService {
  static async getAll() {
    return Panel.find();
  }

  static async getById(id: string) {
    return Panel.findById(id);
  }

  static async create(data: any) {
    return Panel.create(data);
  }

  static async update(id: string, data: any) {
    return Panel.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id: string) {
    return Panel.findByIdAndDelete(id);
  }
}
