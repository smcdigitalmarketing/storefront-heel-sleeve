import {
  ArrowLeftRightIcon,
  FootprintsIcon,
  InfinityIcon,
  LayersIcon,
  RulerIcon,
  SparklesIcon,
  UsersIcon,
  WashingMachineIcon,
  WavesIcon,
  type LucideIcon,
} from "lucide-react";

import type { IconName } from "~/content/types";

/** The lucide icon behind each `IconName` in the brand copy (bullets, callouts). */
export const featureIcons: Record<IconName, LucideIcon> = {
  cleat: FootprintsIcon,
  // The strap wraps the ankle in a figure-8.
  strap: InfinityIcon,
  heel: LayersIcon,
  knit: WavesIcon,
  wash: WashingMachineIcon,
  ruler: RulerIcon,
  swap: ArrowLeftRightIcon,
  family: UsersIcon,
  sparkle: SparklesIcon,
};
