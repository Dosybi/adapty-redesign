export function getTintClasses(index: number): string {
  const tints = [
    "from-emerald-100/60 via-slate-100/30 to-emerald-100/40",
    "from-teal-100/70 via-slate-100/30 to-teal-100/40",
    "from-violet-100/60 via-slate-100/30 to-violet-100/40",
    "from-rose-100/60 via-slate-100/30 to-rose-100/40",
    "from-slate-100/60 via-slate-100/30 to-slate-100/60",
  ];
  return tints[index % tints.length];
}
