import { useState, useCallback } from "react";

export default function useCopyClipboard(timeout = 2000) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback((text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), timeout);
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  }, [timeout]);

  return [isCopied, copy];
}
