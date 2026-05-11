/* ------------------------------------------------------------------
   Nav-trail builder.

   Every pack-scoped page (`/<packId>/...`) renders a breadcrumb
   trail. The original trails started with a generic `Dashboard`
   crumb — but "Dashboard" doesn't tell a learner *which* learning
   journey they're in, and gives them no jump-out to all journeys.

   `journeyTrail()` produces the same shape everywhere:

     [All journeys] → [Journey: <name>] → ...extra crumbs

   The first crumb links back to `/` (the home picker), the second
   to `/<packId>` (the journey overview). Pages pass in any deeper
   crumbs (section, concept, mock, test, game) and get a consistent
   navigation trail back to home.
------------------------------------------------------------------ */

import type { ContentPack } from "@/content/pack-types";
import type { Crumb } from "@/components/primitives/Breadcrumbs";

export function journeyTrail(pack: ContentPack, ...extra: Crumb[]): Crumb[] {
  return [
    { label: "All journeys", href: "/" },
    { label: pack.config.name, href: `/${pack.config.id}` },
    ...extra,
  ];
}
