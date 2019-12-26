export enum SourceType {
  NPM ="npm",
  FILE = "file",
  GITHUB = "github"
}

export interface PluginSource {
    sourceType: SourceType,
    path: string,
    version?: string,
}

export interface PluginDatabase {
  loadFromDb(): Promise<PluginSource[]>
  saveToDb(plugins: string[]): Promise<void>
}