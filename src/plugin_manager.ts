import {PluginDatabase, SourceType} from "./plugin_database";
import {RobotDef, FunctionDefConstructor, FunctionDef, PluginSetup, PluginRegistry} from "./index";
import {PluginManager as PM, IPluginInfo} from 'live-plugin-manager';

export class PluginManager {

    private robotMap: { [id: string]: RobotDef; } = {};
    private readonly pm: PM;

    constructor(
        private readonly db: PluginDatabase,
        private readonly internals: PluginSetup[],
        options?: Partial<any>) {
        this.pm = new PM(options)
    }

    async load() {
        this.robotMap = {};
        const pluginSources = await this.db.loadFromDb();
        for (const {sourceType, path, version} of pluginSources) {

            const pluginInfo = await this.install(sourceType, path, version);
            let pluginSetup = this.pm.require(pluginInfo.name);
            if (typeof pluginSetup === 'object' && typeof pluginSetup.default === 'function') {
                pluginSetup = pluginSetup.default
            }
            pluginSetup({
                registerRobot: (robot: RobotDef) => {
                    this.robotMap[`${pluginInfo.name}.${robot.name}`] = robot
                }
            });
        }
        for (const internalPluginSetup of this.internals) {
            internalPluginSetup({
                registerRobot: (robot) => {
                    this.robotMap[`internal.${robot.name}`] = robot
                }
            })
        }
    }

    public robots() {
        return Object.values(this.robotMap)
    }

    public getRobot(id: string) {
        return this.robotMap[id]
    }

    async install(sourceType: SourceType, path: string, version?: string) {
        let pluginInfo: IPluginInfo;
        switch (sourceType) {
            case SourceType.NPM:
                pluginInfo = await this.pm.installFromNpm(path, version);
                break;
            case SourceType.FILE:
                pluginInfo = await this.pm.installFromPath(path);
                break;
            case SourceType.GITHUB:
                pluginInfo = await this.pm.installFromGithub(path);
                break;
        }
        return pluginInfo
    }
}