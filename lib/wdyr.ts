/**
 * Why Did You Render (WDYR) — development-only re-render detection.
 *
 * Imported via webpack entry injection in next.config.ts so it patches
 * React before any component imports it.
 *
 * Docs: https://github.com/welldone-software/why-did-you-render
 */
import React from "react";

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    logOnDifferentValues: false,
    collapseGroups: true,
  });
}
