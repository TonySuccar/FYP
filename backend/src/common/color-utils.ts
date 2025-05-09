// color-utils.ts
import colorDiff from 'color-diff';

export interface Color {
  name: string;
  rgb: [number, number, number]; // e.g., [128, 0, 0]
}

/**
 * Uses color-diff's built-in comparison (Lab-based) to find the palette color
 * closest to a given [r, g, b].
 */
export function findClosestColorWithColorDiff(
  [r, g, b]: [number, number, number],
  palette: Color[],
): string {
  // Convert the pixel color to { R, G, B }
  const colorObj = { R: r, G: g, B: b };

  // Convert the palette to the same structure, with an added `name` property
  const paletteObjects = palette.map((c) => ({
    R: c.rgb[0],
    G: c.rgb[1],
    B: c.rgb[2],
    name: c.name,
  }));

  // color-diff.closest() returns the matching color object
  const closestMatch = colorDiff.closest(colorObj, paletteObjects) as any;

  // Return the name we stored in each palette object
  return closestMatch.name || 'Unknown';
}
