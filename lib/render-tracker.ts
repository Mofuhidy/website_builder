/**
 * React 19-compatible render tracker.
 *
 * WDYR (@welldone-software/why-did-you-render) relies on patching
 * React.createElement, but React 19 uses the new JSX transform
 * (react/jsx-runtime) which bypasses createElement entirely.
 *
 * These hooks use a useRef + useEffect approach instead:
 * - Counts renders per component
 * - Detects renders where props are shallow-equal to previous props
 * - Logs warnings for unnecessary parent-driven re-renders
 */
import { useRef, useEffect } from "react";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

function shallowEqual(a: Record<string, unknown>, b: Record<string, unknown>) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

/**
 * For components that RECEIVE PROPS.
 * Warns when the component re-renders with shallow-equal props.
 * This indicates the parent re-rendered and forced this child to
 * re-render even though its inputs didn't change.
 *
 * Usage:
 *   function MyComponent({ id, name }) {
 *     useRenderTracker("MyComponent", { id, name });
 *     ...
 *   }
 */
export function useRenderTracker(
  componentName: string,
  props: Record<string, unknown>,
) {
  const renderCount = useRef(0);
  const prevProps = useRef<Record<string, unknown> | null>(null);
  const hasWarned = useRef(false);
  const isArmed = useRef(false);

  useEffect(() => {
    if (!IS_DEVELOPMENT) {
      return;
    }

    renderCount.current += 1;
    const count = renderCount.current;

    if (!isArmed.current) {
      prevProps.current = { ...props };
      const armTimer = window.setTimeout(() => {
        isArmed.current = true;
      }, 0);

      return () => {
        window.clearTimeout(armTimer);
      };
    }

    if (prevProps.current === null) {
      prevProps.current = { ...props };
      return;
    }

    const previousProps = prevProps.current;
    const propsAreEqual = shallowEqual(previousProps, props);

    if (propsAreEqual) {
      if (!hasWarned.current) {
        console.warn(
          `[RenderTracker] ⚠️  ${componentName} re-rendered unnecessarily (render #${count}). ` +
            `Props are shallow-equal to previous render.`,
          props,
        );
        hasWarned.current = true;
        setTimeout(() => {
          hasWarned.current = false;
        }, 3000);
      }
    } else {
      const changedKeys: string[] = [];
      const allKeys = new Set([
        ...Object.keys(previousProps),
        ...Object.keys(props),
      ]);

      for (const key of allKeys) {
        if (previousProps[key] !== props[key]) {
          changedKeys.push(key);
        }
      }

      console.log(
        `[RenderTracker] ℹ️  ${componentName} rendered #${count} (changed props: ${changedKeys.join(", ")})`,
      );
    }

    prevProps.current = { ...props };
  });
}

/**
 * For state-driven components with NO props.
 * Simply logs the render count without warning.
 * Useful for tracking how often a top-level component renders.
 *
 * Usage:
 *   function TopToolbar() {
 *     useRenderCount("TopToolbar");
 *     ...
 *   }
 */
export function useRenderCount(componentName: string) {
  const renderCount = useRef(0);
  const isArmed = useRef(false);

  useEffect(() => {
    if (!IS_DEVELOPMENT) {
      return;
    }

    renderCount.current += 1;
    const count = renderCount.current;

    if (!isArmed.current) {
      const armTimer = window.setTimeout(() => {
        isArmed.current = true;
      }, 0);

      return () => {
        window.clearTimeout(armTimer);
      };
    }

    console.log(`[RenderTracker] ℹ️  ${componentName} rendered #${count}`);
  });
}
