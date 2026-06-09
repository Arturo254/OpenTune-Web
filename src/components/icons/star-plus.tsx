// Remove when StarPlus is released in Lucide.
// Ref: https://github.com/lucide-icons/lucide/pull/3918
import { forwardRef } from 'react';
import { DEFAULT_SIZE, COLOR } from '@icon/_base';
import type { IconProps } from '@icon/_types';

const ICON_NAME = 'StarPlus';

export const StarPlus = forwardRef<SVGSVGElement, IconProps>(
  ({ size = DEFAULT_SIZE, color, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M11.013 18.582 6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904L20 11.5"
        stroke={color ?? COLOR}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 18h6"
        stroke={color ?? COLOR}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 15v6"
        stroke={color ?? COLOR}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
);

StarPlus.displayName = ICON_NAME;
