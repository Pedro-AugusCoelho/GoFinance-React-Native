const productColors = {
    green_700: '#00875F',
    green_500: '#00B37E',

    purple_700: '#6A3CBC',
    purple_500: '#8A5FD8',

    blue_700: '#1E6BD6',
    blue_500: '#3B82F6',

    red_700: '#D43C4A',
    red_500: '#F75A68',

    yellow_700: '#C9A227',
    yellow_500: '#F5C542',

    orange_700: '#C75B12',
    orange_500: '#F97316',

    pink_700: '#C0266D',
    pink_500: '#EC4899',
} as const

const darkBase = {
    background: '#121214',
    shape_primary: '#202024',
    shape_secondary: '#29292E',
    shape_third: '#323238',
    placeholder: '#7C7C8A',
    text: '#C4C4CC',
    title: '#E1E1E6',
    white: '#FFFFFF',
    transparent: 'transparent',
} as const

const lightBase = {
  background: '#F5F5F5',
  shape_primary: '#FFFFFF',
  shape_secondary: '#F0F0F0',
  shape_third: '#E5E5E5',
  placeholder: '#8A8A8A',
  text: '#52525B',
  title: '#27272A',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const

const fontConfig = {
    family: {
        regular: 'Poppins_400Regular',
        medium: 'Poppins_500Medium',
        bold: 'Poppins_700Bold',
    },
    lineHeight: '160%',
    sizes: {
        small: 14,
        medium: 16,
        large: 18,
        xlarge: 24,
    },
} as const

function createTheme(base: typeof darkBase | typeof lightBase) {
    return {
        product: productColors,
        base,
        font: fontConfig,
        colors: {
            primary: productColors.green_700,

            secodary: base.title,
            secodary_light: base.shape_third,

            success: productColors.green_500,
            success_light: 'rgba(0, 179, 126, 0.5)',

            attention: productColors.red_500,
            attention_light: 'rgba(247, 90, 104, 0.5)',

            shape: base.shape_primary,
            title: base.title,
            text: base.text,
            background: base.background,

            avatar_bg: base.shape_secondary,
            avatar_text: productColors.green_500,
        },
        fonts: {
            regular: fontConfig.family.regular,
            medium: fontConfig.family.medium,
            bold: fontConfig.family.bold,
        },
    } as const
}

export const darkTheme = createTheme(darkBase)
export const lightTheme = createTheme(lightBase)

export const theme = darkTheme

export type ThemeType = typeof darkTheme

export default theme