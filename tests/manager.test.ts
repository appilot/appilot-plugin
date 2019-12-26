import {PluginManager} from "../src";
import path from 'path';
import assert from 'assert';
import {DummyDb} from "./helper/db";
import stringRobot from "./internal/string";
import fs from 'fs';
import os from "os";
import {PluginSource, SourceType} from "../src/plugin_database";

describe('plugin manager', function () {
    this.timeout(15000);

    let manager: PluginManager;
    before(async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(),'pm_test'));
        const options = {
            pluginsPath: path.join(dir, "plugins")
        };

        const internals = [stringRobot];

        const externals: PluginSource[] = [{
            sourceType: SourceType.FILE,
            path: path.resolve(__dirname, '../examples/taobao'),
        }];
        const db = new DummyDb(externals);
        manager = new PluginManager(db, internals, options);
        await manager.load();
    });


    it("can load internal plugins", async () => {
        assert.ok(manager.getRobot('internal.string'));
    });

    it("can load plugins from disk", async () => {
        assert.ok(manager.getRobot('@appilot/taobao.taobao'));
    })
});