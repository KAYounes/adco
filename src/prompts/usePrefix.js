import { makeTheme, useEffect, useState } from '@inquirer/core';
import { AsyncResource } from 'node:async_hooks';

export function usePrefix({ status = 'idle', theme }) {
  const [showLoader, setShowLoader] = useState(false);
  const [tick, setTick] = useState(0);
  const { prefix, spinner } = makeTheme(theme);

  useEffect(
    function () {
      if (status === 'loading') {
        let tickInterval;
        let inc = -1;

        // Show loader and start tick interval immediately
        setShowLoader(true);

        tickInterval = setInterval(
          AsyncResource.bind(() => {
            inc = inc + 1;
            setTick(inc % spinner.frames.length);
          }),
          spinner.interval,
        );

        return () => {
          clearInterval(tickInterval);
        };
      } else {
        setShowLoader(false);
      }
    },
    [status],
  );

  if (showLoader) {
    return spinner.frames[tick];
  }

  // There's no delay anymore, so `loading` status shows the loader immediately.
  const iconName = status === 'loading' ? 'idle' : status;
  return typeof prefix === 'string' ? prefix : prefix[iconName] ?? prefix['idle'];
}
