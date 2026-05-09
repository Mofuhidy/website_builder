/**
 * Why Did You Render (WDYR) — development-only re-render detection.
 *
 * Docs: https://github.com/welldone-software/why-did-you-render
 */
import React from "react";
import whyDidYouRender from "@welldone-software/why-did-you-render";

if (process.env.NODE_ENV === "development") {
  console.log("[WDYR] Initializing why-did-you-render...");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    logOnDifferentValues: false,
    collapseGroups: true,
  });
  console.log("[WDYR] why-did-you-render initialized");
}
