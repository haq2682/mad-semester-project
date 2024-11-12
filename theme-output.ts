type Theme = {
  accentBackground: string;
  accentColor: string;
  background0: string;
  background025: string;
  background05: string;
  background075: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  color6: string;
  color7: string;
  color8: string;
  color9: string;
  color10: string;
  color11: string;
  color12: string;
  color0: string;
  color025: string;
  color05: string;
  color075: string;
  background: string;
  backgroundHover: string;
  backgroundPress: string;
  backgroundFocus: string;
  borderColor: string;
  borderColorHover: string;
  borderColorPress: string;
  borderColorFocus: string;
  color: string;
  colorHover: string;
  colorPress: string;
  colorFocus: string;
  colorTransparent: string;
  placeholderColor: string;
  outlineColor: string;

}

function t(a: [number, number][]) {
  let res: Record<string, string> = {}
  for (const [ki, vi] of a) {
    res[ks[ki] as string] = vs[vi] as string
  }
  return res as Theme
}
const vs = [
  'hsla(18, 100%, 55%, 1)',
  'hsla(0, 0%, 99%, 0)',
  'hsla(0, 0%, 99%, 0.25)',
  'hsla(0, 0%, 99%, 0.5)',
  'hsla(0, 0%, 99%, 0.75)',
  'hsla(0, 0%, 99%, 1)',
  'hsla(4, 11%, 93%, 1)',
  'hsla(8, 22%, 88%, 1)',
  'hsla(12, 33%, 82%, 1)',
  'hsla(16, 44%, 77%, 1)',
  'hsla(20, 56%, 72%, 1)',
  'hsla(24, 67%, 66%, 1)',
  'hsla(28, 78%, 61%, 1)',
  'hsla(32, 89%, 55%, 1)',
  'hsla(36, 100%, 50%, 1)',
  'hsla(0, 15%, 15%, 1)',
  'hsla(0, 15%, 10%, 1)',
  'hsla(0, 14%, 10%, 0)',
  'hsla(0, 14%, 10%, 0.25)',
  'hsla(0, 14%, 10%, 0.5)',
  'hsla(0, 14%, 10%, 0.75)',
  'hsla(18, 100%, 58%, 1)',
  'hsla(0, 0%, 12%, 0)',
  'hsla(0, 0%, 12%, 0.25)',
  'hsla(0, 0%, 12%, 0.5)',
  'hsla(0, 0%, 12%, 0.75)',
  'hsla(0, 0%, 12%, 1)',
  'hsla(4, 11%, 16%, 1)',
  'hsla(8, 22%, 20%, 1)',
  'hsla(12, 33%, 25%, 1)',
  'hsla(16, 44%, 29%, 1)',
  'hsla(20, 56%, 33%, 1)',
  'hsla(24, 67%, 37%, 1)',
  'hsla(28, 78%, 42%, 1)',
  'hsla(32, 89%, 46%, 1)',
  'hsla(0, 15%, 93%, 1)',
  'hsla(0, 15%, 95%, 1)',
  'hsla(0, 15%, 95%, 0)',
  'hsla(0, 15%, 95%, 0.25)',
  'hsla(0, 15%, 95%, 0.5)',
  'hsla(0, 15%, 95%, 0.75)',
  'hsla(18, 100%, 50%, 0)',
  'hsla(18, 100%, 50%, 0.25)',
  'hsla(18, 100%, 50%, 0.5)',
  'hsla(18, 100%, 50%, 0.75)',
  'hsla(18, 100%, 50%, 1)',
  'hsla(18, 100%, 52%, 1)',
  'hsla(18, 100%, 53%, 1)',
  'hsla(18, 100%, 57%, 1)',
  'hsla(18, 100%, 60%, 1)',
  'hsla(18, 100%, 62%, 1)',
  'hsla(18, 100%, 63%, 1)',
  'hsla(18, 100%, 65%, 1)',
  'hsla(250, 50%, 95%, 1)',
  'hsla(249, 52%, 95%, 0)',
  'hsla(249, 52%, 95%, 0.25)',
  'hsla(249, 52%, 95%, 0.5)',
  'hsla(249, 52%, 95%, 0.75)',
  'hsla(18, 100%, 41%, 0)',
  'hsla(18, 100%, 41%, 0.25)',
  'hsla(18, 100%, 41%, 0.5)',
  'hsla(18, 100%, 41%, 0.75)',
  'hsla(18, 100%, 41%, 1)',
  'hsla(18, 100%, 43%, 1)',
  'hsla(18, 100%, 45%, 1)',
  'hsla(18, 100%, 47%, 1)',
  'hsla(18, 100%, 49%, 1)',
  'hsla(18, 100%, 54%, 1)',
  'hsla(18, 100%, 56%, 1)',
  'hsla(250, 50%, 90%, 1)',
]

const ks = [
  'accentBackground',
  'accentColor',
  'background0',
  'background025',
  'background05',
  'background075',
  'color1',
  'color2',
  'color3',
  'color4',
  'color5',
  'color6',
  'color7',
  'color8',
  'color9',
  'color10',
  'color11',
  'color12',
  'color0',
  'color025',
  'color05',
  'color075',
  'background',
  'backgroundHover',
  'backgroundPress',
  'backgroundFocus',
  'borderColor',
  'borderColorHover',
  'borderColorPress',
  'borderColorFocus',
  'color',
  'colorHover',
  'colorPress',
  'colorFocus',
  'colorTransparent',
  'placeholderColor',
  'outlineColor']


const n1 = t([[0, 0], [1, 0], [2, 1], [3, 2], [4, 3], [5, 4], [6, 5], [7, 6], [8, 7], [9, 8], [10, 9], [11, 10], [12, 11], [13, 12], [14, 13], [15, 14], [16, 15], [17, 16], [18, 17], [19, 18], [20, 19], [21, 20], [22, 5], [23, 4], [24, 6], [25, 6], [26, 8], [27, 7], [28, 9], [29, 8], [30, 16], [31, 15], [32, 16], [33, 15], [34, 17], [35, 13], [36, 18]])

export const light = n1
const n2 = t([[0, 21], [1, 21], [2, 22], [3, 23], [4, 24], [5, 25], [6, 26], [7, 27], [8, 28], [9, 29], [10, 30], [11, 31], [12, 32], [13, 33], [14, 34], [15, 14], [16, 35], [17, 36], [18, 37], [19, 38], [20, 39], [21, 40], [22, 26], [23, 25], [24, 27], [25, 27], [26, 29], [27, 28], [28, 30], [29, 29], [30, 36], [31, 35], [32, 36], [33, 35], [34, 37], [35, 34], [36, 38]])

export const dark = n2
const n3 = t([[0, 8], [1, 8], [2, 41], [3, 42], [4, 43], [5, 44], [6, 45], [7, 46], [8, 47], [9, 0], [10, 48], [11, 21], [12, 49], [13, 50], [14, 51], [15, 52], [16, 53], [17, 53], [18, 54], [19, 55], [20, 56], [21, 57], [22, 45], [23, 44], [24, 46], [25, 46], [26, 0], [27, 47], [28, 48], [29, 0], [30, 53], [31, 53], [32, 53], [33, 53], [34, 54], [35, 51], [36, 55]])

export const light_accent = n3
const n4 = t([[0, 34], [1, 34], [2, 58], [3, 59], [4, 60], [5, 61], [6, 62], [7, 63], [8, 64], [9, 65], [10, 66], [11, 46], [12, 67], [13, 68], [14, 21], [15, 49], [16, 69], [17, 53], [18, 54], [19, 55], [20, 56], [21, 57], [22, 62], [23, 61], [24, 63], [25, 63], [26, 65], [27, 64], [28, 66], [29, 65], [30, 53], [31, 69], [32, 53], [33, 69], [34, 54], [35, 21], [36, 55]])

export const dark_accent = n4