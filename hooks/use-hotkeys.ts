import { useEffect } from "react";

export function useHotkeys(
  keyCombo: string,
  callback: (event: KeyboardEvent) => void,
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keys = keyCombo.toLowerCase().split("+");
      const isCtrl = keys.includes("ctrl") || keys.includes("cmd");
      const isShift = keys.includes("shift");
      const targetKey = keys.find((k) => k !== "ctrl" && k !== "cmd" && k !== "shift");

      const matchCtrl = isCtrl ? (event.ctrlKey || event.metaKey) : true;
      const matchShift = isShift ? event.shiftKey : !event.shiftKey;
      const matchKey = event.key.toLowerCase() === targetKey;

      if (matchCtrl && matchShift && matchKey) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyCombo, callback]);
}
