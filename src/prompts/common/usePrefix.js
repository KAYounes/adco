import { makeTheme, useEffect, useState } from "@inquirer/core";
import { getRawLength } from "#utilities/chalkUtils.js";

export function usePrefix({ status = "idle", theme }) {
  const [showLoader, setShowLoader] = useState(status === "loading");
  const [tick, setTick] = useState(0);
  const { prefix, spinner } = makeTheme(theme);
  const maxLen = Math.max(
    ...spinner.frames.map((e) => e.length),
    prefix.idle.length ?? 0,
    prefix.done.length ?? 0
  );

  // console.log(prefix, status, prefix[status]);
  useEffect(() => {
    if (status === "loading") {
      let inc = -1;
      setShowLoader(true);

      // Start tick interval immediately
      const tickInterval = setInterval(() => {
        inc = inc + 1;
        setTick(inc % spinner.frames.length);
      }, spinner.interval);

      return () => clearInterval(tickInterval);
    } else {
      setShowLoader(false);
    }
  }, [status]);

  if (showLoader) {
    return spinner.frames[tick].padEnd(maxLen);
  }

  const iconName = status === "loading" ? "idle" : status;
  return typeof prefix === "string"
    ? prefix.padEnd(maxLen)
    : (prefix[iconName] ?? prefix["idle"]).padEnd(maxLen);
}
