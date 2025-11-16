import type { UUID } from "node:crypto";
import { Readable } from "node:stream";

export function isUUID(arg: unknown): arg is UUID {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(toString(arg));
}
export function isString(arg: unknown): arg is string {
  return typeof arg === "string";
}
export function toString(value: unknown): string {
  if (isRecord(value) || isArray(value)) {
    value = JSON.stringify(value);
  }
  return isString(value) ? value : String(value);
}
export function isNumber(arg: unknown): arg is number {
  return typeof arg === "number" && !isNaN(arg);
}
export function isRecord(arg: unknown): arg is Record<PropertyKey, any> {
  return Object.prototype.toString.call(arg) === "[object Object]";
}
export function isArray(arg: unknown): arg is any[] {
  return Object.prototype.toString.call(arg) === "[object Array]";
}
export function isBuffer(arg: unknown): arg is Buffer {
  return Buffer.isBuffer(arg);
}
export function isReadable(arg: unknown): arg is Readable {
  return arg instanceof Readable;
}
export function isUint8Array(arg: unknown): arg is Uint8Array {
  return arg instanceof Uint8Array;
}
export function isUint16Array(arg: unknown): arg is Uint16Array {
  return arg instanceof Uint16Array;
}
export function isUint32Array(arg: unknown): arg is Uint32Array {
  return arg instanceof Uint32Array;
}
export function isDate(arg: unknown): arg is Date {
  return arg instanceof Date;
}
export function isMap(arg: unknown): arg is Map<PropertyKey, any> {
  return arg instanceof Map;
}
export function isSet(arg: unknown): arg is Set<any> {
  return arg instanceof Set;
}
export function isURL(arg: unknown): arg is URL {
  return arg instanceof URL;
}
export function isLink(arg: unknown): arg is NonNullable<string> {
  try {
    new URL(toString(arg));
    return true;
  }
  catch {
    return false;
  }
}
export function isError(arg: unknown): arg is Error {
  return arg instanceof Error;
}
export function toError(value: unknown): Error {
  if (isError(value)) {
    return value;
  }
  return new Error(toString(value));
}