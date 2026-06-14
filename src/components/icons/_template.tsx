/**
 * HOW TO CREATE A CUSTOM ICON
 * ============================
 *
 * Copy this template and create a new file:
 *   src/components/icons/<iconname>.tsx
 * cmd: `mv src/components/icons/_template.tsx src/components/icons/<iconname>.tsx`
 *
 * There are two variants:
 *
 *   1. [REQUIRED] Lucide-style — single-color, follows `currentColor`,
 *      supports size/color/className props — exactly like lucide-react icons.
 *      Naming:  <IconName>  (e.g. Opentune, MyBrand)
 *
 *   2. [OPTIONAL] Mul (original icon) — has its own hardcoded gradient/colors,
 *      does not accept a `color` prop (fixed artwork).
 *      Naming:  Mul<IconName>  (e.g. MulOpentune, MulMyBrand)
 *      Only create this when you also need a separate "branded / full-color"
 *      version of the icon.
 *
 *      Mul(मूल) means "original"
 *
 * After exporting, add a line to  src/components/icons/_index.ts:
 *   export { IconName, MulIconName } from '@icon/<iconname>';
 *   (The Mul export is optional)
 * ============================
 */

import { forwardRef, useId } from 'react';
import { DEFAULT_SIZE, COLOR } from '@icon/_base';
import type { IconProps, MulIconProps } from '@icon/_types';

// ---------------------------------------------------------------------------
// Put your icon name here (PascalCase)
// ---------------------------------------------------------------------------
const ICON_NAME = 'IconName'; // <-- CHANGE THIS

// ---------------------------------------------------------------------------
// [REQUIRED] Lucide-style icon
//
// - `size`      : controls both width and height (default 24px)
// - `color`     : fill color; falls back to `currentColor` when undefined,
//                 so it can be driven by CSS `color` / Tailwind `text-*`
// - `className` : for Tailwind or CSS classes
// - `...props`  : any other SVG attributes (aria-*, role, onClick, etc.)
// - `ref`       : forwards an SVGSVGElement ref
//
// Set viewBox to match your SVG, e.g. "0 0 24 24" or "0 0 500 500"
//
// FILL vs STROKE:
//   Icons may be fill-based, stroke-based, or a combination of both —
//   depending on the original SVG artwork. Do not assume every icon uses
//   "fill". Preserve the style of the original SVG:
//   - Fill-based  : set `fill={color ?? COLOR}` on the <svg> (as shown below)
//   - Stroke-based: remove the `fill` prop from <svg>, set `fill="none"` and
//                   pass `stroke={color ?? COLOR}` on the inner paths instead
//   - Mixed       : apply fill/stroke selectively on each child element
//
// ACCESSIBILITY:
//   - Decorative icons (purely visual, already labelled by surrounding text)
//     should be hidden from assistive technologies:
//       <IconName aria-hidden="true" />
//   - Icons that convey meaning on their own, or are interactive, need
//     explicit accessibility attributes, for example:
//       <IconName role="img" aria-label="Settings" />
//       <IconName aria-labelledby="title-id" />
//   All of these props are forwarded automatically via `...props`.
// ---------------------------------------------------------------------------
export const IconName = forwardRef<SVGSVGElement, IconProps>(
  ({ size = DEFAULT_SIZE, color, className, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      // Set your SVG viewBox here
      viewBox="0 0 24 24"
      fill={color ?? COLOR}
      className={className}
      {...props}
    >
      {/* Place your SVG content here — path, circle, rect, etc. */}
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
);
IconName.displayName = ICON_NAME;

// ---------------------------------------------------------------------------
// [OPTIONAL] Mul (Multicolor) variant
//
// - `size`   : sets both width and height at once (default 24px)
// - `width`  : overrides only the width (takes priority over size)
// - `height` : overrides only the height (takes priority over size)
// - No `color` prop — colors are hardcoded inside the SVG
//              (gradients, multiple fills, etc.)
// - `...props` : any other SVG attributes (including accessibility props)
//
// UNIQUE IDs WITH useId():
//   SVG <defs> elements (gradients, clip paths, masks, filters, etc.) require
//   an `id` to be referenced elsewhere in the SVG. Static string IDs such as
//   "my-gradient" will collide when multiple instances of the same icon are
//   rendered on the same page, causing only the first definition to apply.
//   Use React's `useId()` to generate a unique ID per instance, then use it
//   in both the <defs> element and the corresponding reference (e.g. fill="url(#...)").
//
// If you do not need a multicolor variant, delete this entire block.
// ---------------------------------------------------------------------------
export const MulIconName = forwardRef<SVGSVGElement, MulIconProps>(
  ({ size = DEFAULT_SIZE, width, height, ...props }, ref) => {
    const id = useId();
    const gradId = `${id}-grad`;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={width ?? size}
        height={height ?? size}
        // Set your SVG viewBox here
        viewBox="0 0 24 24"
        {...props}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF324D" />
            <stop offset="100%" stopColor="#C849BA" />
          </linearGradient>
        </defs>

        {/* Place your multicolor SVG content here */}
        <path
          fill={`url(#${gradId})`}
          d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        />
      </svg>
    );
  },
);
MulIconName.displayName = `Mul${ICON_NAME}`;

// ---------------------------------------------------------------------------
// Once your icon is done, please delete all the comments in this file —
// including this block, the top doc-comment, and every inline comment above.
// Keep only the imports, the ICON_NAME constant, and the component exports.
// ---------------------------------------------------------------------------
