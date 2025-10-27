// src/modules/panels/panels.services.ts
import Panel from "./Panel";

export class PanelService {
  static async getAllByOwner(userId: string) {
    return Panel.find({ "metadata.createdBy": userId }).sort({ updatedAt: -1 });
  }

  static async getById(id: string) {
    return Panel.findById(id);
  }

  static async create(data: any) {
    return Panel.create(data);
  }

  static async update(id: string, data: any) {
    return Panel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async delete(id: string) {
    return Panel.findByIdAndDelete(id);
  }
}
