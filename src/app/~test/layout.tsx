import '@test/style.css';
import type { ReactNode } from 'react';

export default function TestLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
