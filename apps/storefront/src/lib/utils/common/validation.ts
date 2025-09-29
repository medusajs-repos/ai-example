/**
 * Checks if the input is a plain object (not array, null, or other types).
 * 
 * @param input - The value to check
 * @returns True if input is an object, false otherwise
 * 
 * @example
 * ```typescript
 * isObject({}); // true
 * isObject([]); // false
 * isObject(null); // false
 * isObject("string"); // false
 * ```
 */
export const isObject = (input: any) => input instanceof Object

/**
 * Checks if the input is an array.
 * 
 * @param input - The value to check
 * @returns True if input is an array, false otherwise
 * 
 * @example
 * ```typescript
 * isArray([]); // true
 * isArray([1, 2, 3]); // true
 * isArray({}); // false
 * isArray("string"); // false
 * ```
 */
export const isArray = (input: any) => Array.isArray(input)

/**
 * Checks if the input is empty (null, undefined, empty object, empty array, or empty string).
 * 
 * @param input - The value to check
 * @returns True if input is considered empty, false otherwise
 * 
 * @example
 * ```typescript
 * isEmpty(null); // true
 * isEmpty(undefined); // true
 * isEmpty({}); // true
 * isEmpty([]); // true
 * isEmpty(""); // true
 * isEmpty("   "); // true
 * isEmpty("hello"); // false
 * isEmpty({ key: "value" }); // false
 * isEmpty([1, 2, 3]); // false
 * ```
 */
export const isEmpty = (input: any) => {
  return (
    input === null ||
    input === undefined ||
    (isObject(input) && Object.keys(input).length === 0) ||
    (isArray(input) && (input as any[]).length === 0) ||
    (typeof input === "string" && input.trim().length === 0)
  )
}