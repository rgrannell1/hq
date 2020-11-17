import { ReadStream } from "fs";
import { Stream } from "stream";

export interface HqArgs {
  '<selector>': string
}

export interface HqOpts {
  in?: any,
  out?: any
}
