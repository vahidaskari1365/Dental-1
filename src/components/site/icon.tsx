import {
  Anchor,
  AlignCenter,
  Sparkles,
  Activity,
  ShieldPlus,
  Sun,
  Scissors,
  Baby,
  Microscope,
  HeartHandshake,
  ShieldCheck,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Anchor,
  AlignCenter,
  Sparkles,
  Activity,
  ShieldPlus,
  Sun,
  Scissors,
  Baby,
  Microscope,
  HeartHandshake,
  ShieldCheck,
  BadgeCheck,
};

export function DynamicIcon({ name, ...props }: { name: string } & React.ComponentProps<LucideIcon>) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon {...props} />;
}
