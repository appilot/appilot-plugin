import {PluginRegistry} from "appilot-plugin";
import { Search } from './search';

export default function setup(req: PluginRegistry) {
    req.registerRobot({
        name: "taobao",
        description: "a robot for taobao.com",
        category: "utilities",
        functions: {
            search: Search
        }
    })
}