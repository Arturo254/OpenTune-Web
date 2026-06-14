import { forwardRef } from 'react';
import { DEFAULT_SIZE, COLOR } from '@icon/_base';
import type { IconProps } from '@icon/_types';

const ICON_NAME = 'Windows';

export const Windows = forwardRef<SVGSVGElement, IconProps>(
  ({ size = DEFAULT_SIZE, color, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color ?? COLOR}
      className={className}
      {...props}
    >
      <path d="M0 3.449L9.75 2.1v9.451H0V3.449zM9.75 12.451V21.9l-9.75-1.35V12.451H9.75zM10.749 2.099L24 0v11.551H10.749V2.099zM24 24l-13.251-1.899V12.451H24V24z" />
    </svg>
  ),
);
Windows.displayName = ICON_NAME;
