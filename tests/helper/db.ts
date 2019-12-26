import { PluginDatabase, PluginSource } from "../../src/plugin_database";



export class DummyDb implements PluginDatabase {
  constructor(readonly sources: PluginSource[] = []){}

  async loadFromDb(): Promise<PluginSource[]> {
    return this.sources
  }

  async saveToDb(plugins: string[]): Promise<void> {
  }


}