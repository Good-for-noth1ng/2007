import { Dimensions } from "react-native";
export const COLORS = {
    primary: 'hsl(212, 42%, 52%)', // last one: hsl(212, 42%, 52%); rgba(81, 129, 184, 1) hsla(212, 52%, 52%, 1)
    primary_light: 'hsl(212, 46%, 50%)', // hsl(212, 46%, 50%) #447bba
    light_blue: 'hsl(212, 46%, 94%)', // hsl(0, 0%, 95%)
    white: 'hsl(0, 0%, 100%)', // hsl(0, 0%, 100%) rgb(255,255,255)
    secondary: 'hsl(213, 11%, 55%)',
    black: 'hsl(0, 0%, 0%)', // hsl(0, 0%, 0%) rgb(0, 0, 0)
    smoke: 'hsl(213, 14%, 72%)', // hsl(213, 14%, 72%) #aeb7c2
    light_smoke: 'hsl(210, 3%, 86%)', // hsl(210, 3%, 86%) #dbdcdd
    very_dark_gray: 'hsl(230, 16%, 22%)', // hsl(230, 16%, 22%) #303342
    primary_blue_dark: 'hsl(210, 68%, 52%)', // hsl(210, 68%, 52%) #2a5885
    very_light_gray: 'hsl(240,9%,93%)', // hsl(240,9%,93%) hsla(240,7%,70%,.22)
    dark_green: '#187D22',


    light_black: 'hsl(0, 0%, 24%)',   
    primary_dark: '#272727', //  primary_dark: '#272727', background_post: '#222222' rgba(255, 255, 255, 0.08) hsl(0, 0%, 15%)
    background_dark: 'hsl(0, 0%, 8%)', // hsl(0, 0%, 8%)
    primary_text: 'hsl(216, 9%, 89%)', // hsl(216, 9%, 89%)

    gradientHeaderStart: 'hsla(212, 42%, 64%, 1)',
    gradientHeaderEnd: 'hsla(212, 42%, 47%, 1)',
}

export const postWidth = Dimensions.get('window').width - 30

export const SIZES = {
    base: 8,
    small: 12,
    font: 14,
    medium: 16,
    large: 18,
    extraLarge: 24,
  };