import assert from 'assert';
import {Search} from "../src/search";
import chromedriver from 'chromedriver';
import {remote, BrowserObject} from 'webdriverio';
import path from 'path';

const TIMEOUT= 30000;

describe("taobao", function () {
    // @ts-ignore
    this.timeout(TIMEOUT);
    const plugin: Search = new Search();
    let browser: BrowserObject;
    before(async () => {
        await chromedriver.start(["--port=4444"]);
        await wait(1000);
        const profilePath = path.join(__dirname, 'test_profile');
        browser = await remote({
            logLevel: 'error',
            path:"/",
            capabilities: {
                browserName: 'chrome',
                "goog:chromeOptions": {
                    "args": [ "user-data-dir="+profilePath ],
                }
            }
        });
        plugin.setWebContext({browser})
    });

    after(async () => {
        if (browser) {
            await browser.deleteSession();
            chromedriver.stop()
        }
    });

    it("login", async () => {
        if(!await plugin.isLogin()){
            assert.ok((await plugin.waitForLogin(TIMEOUT)));
        }
        assert.ok(await plugin.isLogin());
    });

    it("search", async () => {
        assert.ok(await plugin.isLogin());
        const products = await plugin.search("iphone");
        assert.ok(products.length > 0);
    });

    async function wait(ms: number) {
        return new Promise((resolve => {
            setTimeout(resolve, ms)
        }))
    }
});