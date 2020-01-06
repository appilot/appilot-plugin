import {PluginRegistry} from "../../../src";
import { InputSchema } from "../../../src";

export const SPLIT_INPUT_SCHEMA: InputSchema = {
    type: "object",
    properties: {
        value: {
            type: "string",
            description: "要被切分的字符串",
        },
        separator: {
            type: "string",
            description: "用来切分字符串的字符, 默认是空格",
            default: "[:space:]",
            suggests: ["${.space}", "${.tab}", "${.newline}", "${.return}"],
        },
    },
    required: ["value"]
};

export const SPLIT_OUTPUT_SCHEMA = {
    type: "array",
    items: {type: "string"},
    description: "被切分后的字符串数组",
};

export const JOIN_INPUT_SCHEMA: InputSchema = {
    type: "object",
    properties: {
        strings: {type: "array", items: {type: "string"}},
        separator: {type: "string"}
    }
};
export default function setup(req: PluginRegistry) {

    req.registerRobot({
        name: "string",
        description: "a simple robot handles strings",
        category: "utilities",
        functions: {
            split: {
                description: "split a string to arrays",
                inputSchema: SPLIT_INPUT_SCHEMA,
                outputSchema: SPLIT_OUTPUT_SCHEMA,
                loader: () => split
            },
            join: {
                description: "join strings into one",
                inputSchema: JOIN_INPUT_SCHEMA,
                outputSchema: {
                    type: "string",
                },
                loader: () => function ({strings, separator}: { strings: string[], separator: string}) {
                    return strings.join(separator)
                }
            }
        }
    })
}

function split({value, separator}: { value: string, separator: string }) {
    return Promise.resolve(value.split(separator || " "))
}