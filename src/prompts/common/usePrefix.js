import { makeTheme, useEffect, useState } from '@inquirer/core';

export function usePrefix({ status = 'idle', theme }) {
  const [showLoader, setShowLoader] = useState(status === 'loading');
  const [tick, setTick] = useState(0);
  const { prefix, spinner } = makeTheme(theme);

  useEffect(() => {
    if (status === 'loading') {
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
    return spinner.frames[tick];
  }

  const iconName = status === 'loading' ? 'idle' : status;
  return typeof prefix === 'string' ? prefix : prefix[iconName] ?? prefix['idle'];
}
