import "styled-components";
import "styled-components/native";

import type { ThemeType } from "./theme";

declare module "styled-components" {
    export interface DefaultTheme extends ThemeType {}
}

declare module "styled-components/native" {
    export interface DefaultTheme extends ThemeType {}
}
