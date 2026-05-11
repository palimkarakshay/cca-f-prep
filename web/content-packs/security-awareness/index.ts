import type { ContentPack } from "./_types";
import { packConfig } from "./pack.config";
import { CURRICULUM } from "./curriculum";

export const pack: ContentPack = {
  config: packConfig,
  curriculum: CURRICULUM,
};
