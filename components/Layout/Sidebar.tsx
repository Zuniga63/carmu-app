import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import NavLinks from './NavLinks';

export default function Sidebar() {
  const largeScreen = useMediaQuery('(min-width: 1280px)');
  const [showAside, setShowAside] = useState(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>(undefined);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if ((timeoutId && largeScreen) || (largeScreen && !showAside)) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(undefined);
      }
      setShowAside(true);
    } else if (!largeScreen && showAside) {
      const id = setTimeout(() => setShowAside(false), 275);
      setTimeoutId(id);
    }
  }, [largeScreen]);

  return (
    <ScrollArea className="w-0 flex-shrink-0 overflow-y-auto bg-neutral-900 bg-opacity-20 backdrop-blur transition-[width] delay-75 duration-200 xl:h-full xl:w-52">
      {showAside && (
        <aside>
          <NavLinks />
        </aside>
      )}
    </ScrollArea>
  );
}
