/* PMBOK 8e Prep — pack entry point.
   Shape defined in `src/content/pack-types.ts`. */

import type { ContentPack } from "./_types";
import { packConfig } from "./pack.config";
import { CURRICULUM } from "./curriculum";

export const pack: ContentPack = {
  config: packConfig,
  curriculum: CURRICULUM,
};
