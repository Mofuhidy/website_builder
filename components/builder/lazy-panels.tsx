"use client";

import React from "react";

export const LazyPropertiesForm = React.lazy(() =>
  import("./PropertiesForm").then((m) => ({ default: m.PropertiesForm })),
);
export const LazyPagesPanel = React.lazy(() =>
  import("./PagesPanel").then((m) => ({ default: m.PagesPanel })),
);
export const LazyFontsPanel = React.lazy(() =>
  import("./FontsPanel").then((m) => ({ default: m.FontsPanel })),
);
export const LazyColorsPanel = React.lazy(() =>
  import("./ColorsPanel").then((m) => ({ default: m.ColorsPanel })),
);
export const LazyCssPanel = React.lazy(() =>
  import("./CssPanel").then((m) => ({ default: m.CssPanel })),
);
