import type { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export interface MulIconProps extends Omit<SVGProps<SVGSVGElement>, 'color'> {
  size?: number | string;
}
