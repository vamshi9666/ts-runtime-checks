import ts from "typescript";
import { Block } from "./block";
import { Transformer } from "./transformer";
import { validateType, ValidationContext } from "./validation";

export const enum MacroCallContext {
    As,
    Parameter
}

export interface MarkerCallData {
    parameters: Array<ts.Type>,
    block: Block<unknown>,
    ctx: MacroCallContext,
    optional?: boolean,
    exp: ts.BindingName,
    paramName: string
}

export type MacroFn = (transformer: Transformer, data: MarkerCallData) => ts.Node|undefined;

export const Markers: Record<string, MacroFn> = {
    Assert: (trans, {ctx, exp, block, parameters, optional, paramName}) => {
        if (!parameters[0]) return;
        if (ctx === MacroCallContext.Parameter) {
            if (ts.isIdentifier(exp)) {
                block.nodes.push(...validateType(parameters[0], exp, new ValidationContext({
                    errorTypeName: parameters[1]?.symbol?.name,
                    checker: trans.checker,
                    depth: [],
                    propName: paramName
                }), optional));
            }
            return undefined;
        } else return undefined;
    }
};

/**
 * An assert marker. Makes sure the value matches the provided type by generating code which validates the value. 
 * Throws a detailed error by using the `Error` constructor. You can speicfy a different class to use as the marker's
 * second parameter. 
 * 
 * This marker can be used in function parameters and in the the `as` expression.
 * 
 * @example
 * ```ts
 * function test(a: Assert<string>, b?: Assert<number, TypeError>) {
 *    // Your code
 * }
 * ```
 * 
 * Generates the following javascript code:
 * 
 * ```js
 * function test(a, b) {
 *    if (!a || typeof a !== "string") throw new Error("`a` must be of type `string`.");
 *    else if (b && typeof b !== "number") throw new TypeError("`b` must be of type `number`.");
 *    // Your code
 * }
 * ```
 */
//@ts-expect-error Unused ErrorType
//eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Assert<T, ErrorType = Error> = T | T & { __marker: "assert" };
