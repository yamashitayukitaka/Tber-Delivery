'use client';

import { useLayoutEffect, useRef } from 'react';

interface HeaderHeightSetterProps {
  children: React.ReactNode;
  enable?: boolean;
}

export default function HeaderHeightSetter({ children, enable }: HeaderHeightSetterProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!enable) return; // ←ここで制御

    const updateHeight = () => {
      if (ref.current) {
        const height = ref.current.offsetHeight;
        document.documentElement.style.setProperty('--headerHeight', String(height));
        console.log(`Current Header Height: ${height}`);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [enable]); // ←依存配列に入れる

  return (
    <header
      ref={ref}
      className="fixed top-0 left-0 w-full z-50 bg-white max-w-[1920px] mx-auto"
    >
      {children}
    </header>
  );
}