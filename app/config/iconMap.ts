// src/data/iconMap.ts
export const ICON_MAP: Record<string, string> = {
  github: "/icons/github.svg",
  instagram: "/icons/instagram.svg",
  x: "/icons/x.svg",
  facebook: "/icons/facebook.svg",
  linkedin: "/icons/linkedin.svg",
  gmail: "/icons/gmail.svg",
  discord: "/icons/discord.svg",
  reddit: "/icons/reddit.svg",
};

// helper opcional con fallback
export const getIconPath = (key?: string | null) => {
  return key && ICON_MAP[key] ? ICON_MAP[key] : "/icons/other.svg";
};

