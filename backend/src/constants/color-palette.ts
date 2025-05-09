// src/items/color-palette.ts
import { Item } from 'src/items/schemas/item.schema';
import { Color } from '../common/color-utils';

// A very comprehensive set of clothing-related colors (each [R,G,B] is 0..255)
export const PREDEFINED_COLORS: Color[] = [
  // -- Neutrals --
  { name: 'Black',        rgb: [0, 0, 0] },
  { name: 'White',        rgb: [255, 255, 255] },
  { name: 'DarkGray',     rgb: [105, 105, 105] },
  { name: 'LightGray',    rgb: [211, 211, 211] },
  { name: 'Charcoal',     rgb: [54, 69, 79] },
  { name: 'Gainsboro',    rgb: [220, 220, 220] },
  { name: 'Gray',         rgb: [128, 128, 128] },
  { name: 'Silver',       rgb: [192, 192, 192] },

  // -- Additional Grays --
  { name: 'DimGray',      rgb: [105, 105, 105] }, // same as DarkGray, remove if you want truly unique
  { name: 'SlateGray',    rgb: [112, 128, 144] },

  // -- Whites / Off-Whites --
  { name: 'Ivory',        rgb: [255, 255, 240] },
  { name: 'Beige',        rgb: [245, 245, 220] },
  { name: 'Snow',         rgb: [255, 250, 250] },

  // -- Reds --
  { name: 'Red',          rgb: [255, 0, 0] },
  { name: 'Maroon',       rgb: [128, 0, 0] },
  { name: 'Crimson',      rgb: [220, 20, 60] },
  { name: 'DarkRed',      rgb: [139, 0, 0] },
  { name: 'FireBrick',    rgb: [178, 34, 34] },
  { name: 'IndianRed',    rgb: [205, 92, 92] },
  { name: 'LightCoral',   rgb: [240, 128, 128] },

  // -- Pinks --
  { name: 'Pink',         rgb: [255, 192, 203] },
  { name: 'LightPink',    rgb: [255, 182, 193] },
  { name: 'HotPink',      rgb: [255, 105, 180] },
  { name: 'DeepPink',     rgb: [255, 20, 147] },
  { name: 'Salmon',       rgb: [250, 128, 114] },

  // -- Magentas / Fuchsias --
  { name: 'Magenta',      rgb: [255, 0, 255] },
  { name: 'MediumVioletRed', rgb: [199, 21, 133] },
  { name: 'PaleVioletRed',   rgb: [219, 112, 147] },

  // -- Purples --
  { name: 'Purple',       rgb: [128, 0, 128] },
  { name: 'Lavender',     rgb: [230, 230, 250] },
  { name: 'Plum',         rgb: [221, 160, 221] },
  { name: 'Orchid',       rgb: [218, 112, 214] },
  { name: 'Violet',       rgb: [238, 130, 238] },
  { name: 'DarkPurple',   rgb: [75, 0, 130] },
  { name: 'Eggplant',     rgb: [97, 64, 81] },
  { name: 'DarkViolet',   rgb: [148, 0, 211] },
  { name: 'BlueViolet',   rgb: [138, 43, 226] },
  { name: 'RebeccaPurple',rgb: [102, 51, 153] },
  { name: 'MediumPurple', rgb: [147, 112, 219] },

  // -- Blues --
  { name: 'Blue',         rgb: [0, 0, 255] },
  { name: 'Navy',         rgb: [0, 0, 128] },
  { name: 'LightBlue',    rgb: [173, 216, 230] },
  { name: 'SkyBlue',      rgb: [135, 206, 235] },
  { name: 'MidnightBlue', rgb: [25, 25, 112] },
  { name: 'CadetBlue',    rgb: [95, 158, 160] },
  { name: 'RoyalBlue',    rgb: [65, 105, 225] },
  { name: 'DenimBlue',    rgb: [67, 89, 100] },
  { name: 'SlateBlue',    rgb: [106, 90, 205] },
  { name: 'SteelBlue',    rgb: [70, 130, 180] },
  { name: 'DodgerBlue',   rgb: [30, 144, 255] },
  { name: 'DeepSkyBlue',  rgb: [0, 191, 255] },
  { name: 'PowderBlue',   rgb: [176, 224, 230] },
  { name: 'LightSteelBlue', rgb: [176, 196, 222] },
  { name: 'MediumBlue',   rgb: [0, 0, 205] },

  // -- Greens --
  { name: 'Green',        rgb: [0, 128, 0] },
  { name: 'LimeGreen',    rgb: [50, 205, 50] },
  { name: 'DarkGreen',    rgb: [0, 100, 0] },
  { name: 'ForestGreen',  rgb: [34, 139, 34] },
  { name: 'PaleGreen',    rgb: [152, 251, 152] },
  { name: 'SeaGreen',     rgb: [46, 139, 87] },
  { name: 'MintGreen',    rgb: [152, 255, 152] },
  { name: 'MediumSeaGreen', rgb: [60, 179, 113] },
  { name: 'LightGreen',   rgb: [144, 238, 144] },

  // -- Olives / Yellow-Greens --
  { name: 'Olive',        rgb: [128, 128, 0] },
  { name: 'Khaki',        rgb: [195, 176, 145] },
  { name: 'DarkOliveGreen', rgb: [85, 107, 47] },
  { name: 'YellowGreen',  rgb: [154, 205, 50] },

  // -- Yellows --
  { name: 'Yellow',       rgb: [255, 255, 0] },
  { name: 'LightYellow',  rgb: [255, 255, 224] },
  { name: 'Gold',         rgb: [255, 215, 0] },
  { name: 'Goldenrod',    rgb: [218, 165, 32] },
  { name: 'LemonChiffon', rgb: [255, 250, 205] },

  // -- Oranges --
  { name: 'Orange',       rgb: [255, 165, 0] },
  { name: 'Coral',        rgb: [255, 127, 80] },
  { name: 'DarkOrange',   rgb: [255, 140, 0] },
  { name: 'PeachPuff',    rgb: [255, 218, 185] },
  { name: 'LightSalmon',  rgb: [255, 160, 122] },

  // -- Browns / Tans --
  { name: 'Brown',        rgb: [139, 69, 19] },
  { name: 'Tan',          rgb: [210, 180, 140] },
  { name: 'Chocolate',    rgb: [210, 105, 30] },
  { name: 'BurlyWood',    rgb: [222, 184, 135] },
  { name: 'Sienna',       rgb: [160, 82, 45] },
  { name: 'RosyBrown',    rgb: [188, 143, 143] },
  { name: 'Peru',         rgb: [205, 133, 63] },
];


// src/constants/color-groups.ts

export const COLOR_GROUPS: Record<string, string[]> = {
  Red: [
    'Red', 'Maroon', 'Crimson', 'DarkRed', 'FireBrick', 'IndianRed', 'LightCoral'
  ],
  Blue: [
    'Blue', 'Navy', 'LightBlue', 'SkyBlue', 'MidnightBlue', 'CadetBlue', 'RoyalBlue',
    'DenimBlue', 'SlateBlue', 'SteelBlue', 'DodgerBlue', 'DeepSkyBlue',
    'PowderBlue', 'LightSteelBlue', 'MediumBlue'
  ],
  Pink: [
    'Pink', 'LightPink', 'HotPink', 'DeepPink', 'Salmon',
    'Magenta', 'MediumVioletRed', 'PaleVioletRed'
  ],
  Purple: [
    'Purple', 'Lavender', 'Plum', 'Orchid', 'Violet', 'DarkPurple',
    'Eggplant', 'DarkViolet', 'BlueViolet', 'RebeccaPurple', 'MediumPurple'
  ],
  Yellow: [
    'Yellow', 'LightYellow', 'Gold', 'Goldenrod', 'LemonChiffon'
  ],
  Green: [
    'Green', 'LimeGreen', 'DarkGreen', 'ForestGreen', 'PaleGreen',
    'SeaGreen', 'MintGreen', 'MediumSeaGreen', 'LightGreen',
    'Olive', 'Khaki', 'DarkOliveGreen', 'YellowGreen'
  ],
  Orange: [
    'Orange', 'Coral', 'DarkOrange', 'PeachPuff', 'LightSalmon'
  ],
  Brown: [
    'Brown', 'Tan', 'Chocolate', 'BurlyWood', 'Sienna', 'RosyBrown', 'Peru'
  ],
  Neutrals: [
    'Black', 'White', 'DarkGray', 'LightGray', 'Charcoal', 'Gainsboro', 'Gray', 'Silver',
    'DimGray', 'SlateGray', 'Ivory', 'Beige', 'Snow'
  ]
};

export const INCOMPATIBLE_GROUPS = [
  ['Red', 'Pink'],
  ['Red', 'Orange'],
  ['Purple', 'Green'],
  ['Green', 'Pink'],
  ['Brown', 'Gray'],
  ['Yellow', 'Pink'],
  ['Purple', 'Orange'],
  ['Green', 'Orange'],
  ['Pink', 'Brown'],
];

export function getColorGroup(color: string): string | null {
  for (const group in COLOR_GROUPS) {
    if (COLOR_GROUPS[group as keyof typeof COLOR_GROUPS].includes(color)) {
      return group;
    }
  }
  return null;
}

export function isColorCombinationValid(items: Item[]): { valid: boolean, reason?: string } {
  const groups = new Set<string>();
  const itemGroups: { [group: string]: Item[] } = {};

  for (const item of items) {
    const group = getColorGroup(item.color);
    if (group) {
      groups.add(group);
      if (!itemGroups[group]) itemGroups[group] = [];
      itemGroups[group].push(item);
    }
  }

  const groupArray = Array.from(groups);
  for (let i = 0; i < groupArray.length; i++) {
    for (let j = i + 1; j < groupArray.length; j++) {
      const g1 = groupArray[i];
      const g2 = groupArray[j];
      if (
        INCOMPATIBLE_GROUPS.some(pair =>
          pair.includes(g1) && pair.includes(g2)
        )
      ) {
        return {
          valid: false,
          reason: `Conflict between ${g1} and ${g2} colors`,
        };
      }
    }
  }

  return { valid: true };
}
