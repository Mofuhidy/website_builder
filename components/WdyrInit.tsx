"use client";

/**
 * Development-only Why-Did-You-Render initialiser.
 *
 * Rendered as the first child of <body> so this client module evaluates
 * before the rest of the interactive tree hydrates.
 */
if (process.env.NODE_ENV === "development") {
  void import("@/lib/wdyr");
}

export function WdyrInit() {
  return null;
}
