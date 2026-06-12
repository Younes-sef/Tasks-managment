import { CheckCircle2, Clock, AlertCircle, Zap, Flame, ArrowUpRight, LucideIcon } from "lucide-react";

export const STATUS_CFG: Record<string, { label: string; color: string; bg: string; darkBg: string; icon: LucideIcon; dotColor: string; gradient: string }> = {
  completed: {
    label: "Completed",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 border-emerald-200/60",
    darkBg: "dark:bg-emerald-950/30 dark:border-emerald-800/40",
    icon: CheckCircle2,
    dotColor: "bg-emerald-500",
    gradient: "from-emerald-500 to-teal-600",
  },
  "in-progress": {
    label: "In Progress",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 border-amber-200/60",
    darkBg: "dark:bg-amber-950/30 dark:border-amber-800/40",
    icon: Clock,
    dotColor: "bg-amber-500",
    gradient: "from-amber-500 to-orange-600",
  },
  pending: {
    label: "Pending",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 border-rose-200/60",
    darkBg: "dark:bg-rose-950/30 dark:border-rose-800/40",
    icon: AlertCircle,
    dotColor: "bg-rose-500",
    gradient: "from-rose-500 to-pink-600",
  },
};

export const PRIORITY_CFG: Record<string, { label: string; color: string; pillBg: string; pillDark: string; icon: LucideIcon; barColor: string }> = {
  high: {
    label: "High",
    color: "text-rose-500",
    pillBg: "bg-rose-50 border-rose-200/50 text-rose-700",
    pillDark: "dark:bg-rose-950/30 dark:border-rose-800/40 dark:text-rose-300",
    icon: Flame,
    barColor: "bg-gradient-to-r from-rose-500 to-pink-500",
  },
  medium: {
    label: "Medium",
    color: "text-amber-500",
    pillBg: "bg-amber-50 border-amber-200/50 text-amber-700",
    pillDark: "dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-300",
    icon: Zap,
    barColor: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
  low: {
    label: "Low",
    color: "text-sky-500",
    pillBg: "bg-sky-50 border-sky-200/50 text-sky-700",
    pillDark: "dark:bg-sky-950/30 dark:border-sky-800/40 dark:text-sky-300",
    icon: ArrowUpRight,
    barColor: "bg-gradient-to-r from-sky-500 to-blue-500",
  },
};

export function getStatusCfg(status: string) {
  return STATUS_CFG[status?.toLowerCase()] ?? STATUS_CFG.pending;
}

export function getPriorityCfg(priority: string) {
  return PRIORITY_CFG[priority?.toLowerCase()] ?? PRIORITY_CFG.low;
}
