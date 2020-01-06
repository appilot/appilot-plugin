import {InputSchema, JsonSchema} from "appilot-plugin";
import {FunctionDefClass} from "../../../src";
import {WebContext} from "../../../src/web_context";

const OptionSchema: JsonSchema = {
    type: "object",
    properties: {
        "limit": {
            type: "integer",
            description: "max number of products"
        }
    }
};

const SearchResultSchema = {
    "title": "SearchResult",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "title": "name"
        },
        "price": {
            "type": "number",
            "title": "price"
        },
        "url": {
            "type": "string",
            "title": "url"
        },
        "topN": {
            "type": "number",
            "title": "topN"
        },
        "shop": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "title": "name"
                },
                "url": {
                    "type": "string",
                    "title": "url"
                }
            },
            "required": [
                "name",
                "url"
            ],
            "title": "shop"
        }
    },
    "required": [
        "name",
        "price",
        "topN",
        "url"
    ]
};

class SearchResult {
    name: string;
    price: number;
    url: string;
    topN: number;
    shop?: {
        name: string,
        url: string
    }
}

export class Search implements FunctionDefClass {
    description = "search products";
    private input: string = "";
    browser: WebdriverIOAsync.BrowserObject;

    constructor() {
    }

    inputSchema(): InputSchema {
        return {
            type: "object",
            properties: {
                keyword: {
                    type: "string"
                },
                options: OptionSchema
            }
        }
    };

    outputSchema(): JsonSchema {
        return {
            type: "array",
            items: SearchResultSchema
        }
    };

    setInput(input: any) {
        this.input = input
    }

    setWebContext({browser}: WebContext): void {
        this.browser = browser;
    }

    async run(): Promise<SearchResult[]> {
        return []
    }

    async isLogin(): Promise<boolean> {
        const url = await this.browser.getUrl();
        if (!url.startsWith("https://taobao.com")) {
            await this.browser.url("https://taobao.com")
        }
        const el = await this.browser.$('.site-nav-user a');
        let text = await el.getText();
        return !(text === 'undefined' || text === "");
    }

    async waitForLogin(ms: number): Promise<boolean> {
        const login = await this.isLogin();
        if (!login) {
            const url = await this.browser.getUrl();
            if (!url.startsWith("https://login.taobao.com")) {
                await this.browser.url("https://login.taobao.com")
            }
        }
        const el = await this.browser.$('.site-nav-user a');
        await el.waitForExist(ms);
        return await this.isLogin()
    }

    async login(username: string, password: string) {
        const url = await this.browser.getUrl();
        if (!url.startsWith("https://login.taobao.com")) {
            await this.browser.url("https://login.taobao.com")
        }
        const loginBox = await this.browser.$(".login-box");
        await loginBox.waitForExist();
        const loginLinks = await this.browser.$$('.login-links a');
        for (const el of loginLinks) {
            const text = await el.getText();
            const displayed = await el.isDisplayed();
            if (text === "密码登录" && displayed) {
                await el.click();
                break;
            }
        }
        const userEl = await this.browser.$('input[name="TPL_username"]');
        await userEl.waitForDisplayed();
        await userEl.setValue(username);

        const passEl = await this.browser.$('input[name="TPL_password"]');
        await passEl.waitForDisplayed();
        await passEl.setValue(password);
        const loginBtn = await loginBox.$('button[type="submit"]');
        await loginBtn.waitForClickable({timeout: Number.MAX_SAFE_INTEGER});
        await loginBtn.click();
    }


    async search(q: string) {
        const searchInput = await this.browser.$('#q');
        while (!await searchInput.waitForExist(1000)) {
            await this.browser.url("https://taobao.com")
        }
        await searchInput.setValue(q);
        let searchBtn = await this.browser.$('.btn-search');
        if (!(await searchBtn.isDisplayed())) {
            searchBtn = await this.browser.$('.icon-btn-search');
        }
        if (!(await searchBtn.isDisplayed())) {
            throw new Error("can't find search button");
        }
        await searchBtn.click();
        const mainList = await this.browser.$("#mainsrp-itemlist");
        if (!(await mainList.isDisplayed())) {
            const url = await this.browser.getUrl();
            if (url.startsWith("https://login.taobao.com")) {
                this.waitForLogin(30000);
            }
        }
        const items = await this.browser.$$("#mainsrp-itemlist .items .item");
        const results: SearchResult[] = [];
        let i = 0;
        for (const item of items) {
            const priceEl = await item.$('.row .price strong');
            const price = await priceEl.getText();
            const titleEl = await item.$(".title a");
            const title = await titleEl.getText();
            const titleUrl = await titleEl.getAttribute("href");
            const shopEl = await item.$(".shop a");
            const shopName = await shopEl.getText();
            const shopUrl = await shopEl.getAttribute("href");
            const sr: SearchResult = {
                name: title,
                price: parseFloat(price),
                topN: ++i,
                url: titleUrl,
                shop: {
                    name: shopName,
                    url: shopUrl
                }
            };
            results.push(sr)
        }
        return results;
    }
}