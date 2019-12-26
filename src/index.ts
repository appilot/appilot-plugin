import { JsonSchema, InputSchema } from "./json_schema";
import {WebContext} from "./web_context";

export interface FunctionDef {
  description?: string;
  inputSchema: InputSchema;
  outputSchema: JsonSchema;
  loader: () => Function
}

export interface FunctionDefClass {
  description: string;
  inputSchema(): InputSchema;
  outputSchema(): JsonSchema | null;
  setInput(input: any): void;
  run(): Promise<any>
  prepare?(): Promise<any>;
  setWebContext?(webContext: WebContext): void
}

export interface RobotDef {
  name: string,
  category?: string,
  description?: string
  functions: {
      [name: string]: FunctionDef | FunctionDefConstructor
  }
}

export interface FunctionDefConstructor {
  new(): FunctionDefClass;
}

export interface PluginRegistry {
  registerRobot(robot: RobotDef): void
}

export type PluginSetup = (register: PluginRegistry) => void


export * from './json_schema';


export {PluginManager} from './plugin_manager';