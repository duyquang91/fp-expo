/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    surface: '#F5F5F5',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    warn: '#FF6D00',
    info: '#616161',
    action: '#F50057',
    divider: '#E0E0E0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    surface: '#212121',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    warn: '#E65100',
    info: '#757575',
    action: '#C51162',
    divider: '#424242',
  },
};
