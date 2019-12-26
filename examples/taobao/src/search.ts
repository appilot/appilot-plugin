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

const ProductSchema = {
    "title": "Product",
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

class Product {
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
    private webContext?: WebContext;
    private input: string = "";

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
          items: ProductSchema
      }
    };

    setInput(input: any) {
        this.input = input
    }

    setWebContext(webContext: WebContext): void {
        this.webContext = webContext;
    }

    async run(): Promise<Product[]> {
        return []
    }

}