import { ReadStream } from "fs";
import { Stream } from "stream";

export interface HqArgs {
  '<selector>': string,
  '<url>'?: string,
  ls: Boolean
}

export interface HqOpts {
  in?: any,
  out?: any
}
