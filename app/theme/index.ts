/**
 * Theme Configuration
 * Centralized design tokens for colors, typography, spacing, and layout
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary
  primary: "#007AFF",
  primaryLight: "#E3F2FD",
  primaryDark: "#0051D5",
  
  // Status Colors
  success: "#34C759",
  successLight: "#E8F8EC",
  warning: "#FF9500",
  warningLight: "#FFF4E5",
  danger: "#FF3B30",
  dangerLight: "#FFE8E6",
  info: "#5AC8FA",
  infoLight: "#E5F6FD",
  
  // Neutral Colors
  white: "#FFFFFF",
  black: "#000000",
  
  // Gray Scale
  gray50: "#F9F9F9",
  gray100: "#EEEEEE",
  gray200: "#DDDDDD",
  gray300: "#CCCCCC",
  gray400: "#999999",
  gray500: "#666666",
  gray600: "#555555",
  gray700: "#333333",
  gray800: "#282323",
  gray900: "#1A1A1A",
  
  // Semantic Colors - Borders
  borderLight: "#EEEEEE",
  borderDefault: "#DDDDDD",
  borderDark: "#CCCCCC",
  borderFocus: "#007AFF",
  
  // Semantic Colors - Backgrounds
  backgroundWhite: "#FFFFFF",
  backgroundLight: "#F9F9F9",
  backgroundGray: "#EEEEEE",
  backgroundDark: "#333333",
  
  // Semantic Colors - Text
  textPrimary: "#333333",
  textSecondary: "#666666",
  textTertiary: "#999999",
  textPlaceholder: "#CCCCCC",
  textDisabled: "#DDDDDD",
  textInverse: "#FFFFFF",
  
  // Overlay
  overlayLight: "rgba(0, 0, 0, 0.2)",
  overlayMedium: "rgba(0, 0, 0, 0.5)",
  overlayDark: "rgba(0, 0, 0, 0.8)",
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const fontSizes = {
  xs: 12,
  sm: 13,
  md: 14,
  base: 15,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  heading: 32,
  display: 40,
} as const;

export const fontWeights = {
  light: "300" as const,
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  heavy: "800" as const,
};

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
} as const;

// ============================================================================
// SPACING SCALE
// ============================================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  xxxxl: 48,
  xxxxxl: 64,
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  pill: 100,
  round: 999,
} as const;

// ============================================================================
// BORDER WIDTH
// ============================================================================

export const borderWidth = {
  none: 0,
  thin: 1,
  medium: 2,
  thick: 3,
  heavy: 4,
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

// ============================================================================
// LAYOUT DIMENSIONS
// ============================================================================

export const layout = {
  // Header
  headerHeight: 60,
  headerHeightSmall: 50,
  headerPaddingTop: 60,
  headerPaddingTopSmall: 50,
  headerPaddingHorizontal: 16,
  headerPaddingBottom: 12,
  headerPaddingBottomLarge: 13,
  
  // Tab Bar
  tabBarHeight: 50,
  tabBarPadding: 8,
  
  // Container
  containerMaxWidth: 1200,
  containerPadding: 16,
  screenPadding: 16,
  
  // Scroll Content
  scrollContentPadding: 16,
  scrollContentPaddingBottom: 40,
  
  // Form
  formGap: 16,
  formInputGap: 16,
  formButtonHeight: 48,
  
  // Input
  inputHeight: 48,
  inputPaddingHorizontal: 16,
  inputPaddingVertical: 12,
  
  // Button
  buttonHeight: 48,
  buttonHeightSmall: 36,
  buttonHeightLarge: 56,
  buttonPaddingHorizontal: 24,
  buttonPaddingVertical: 12,
  
  // Card
  cardPadding: 16,
  cardGap: 12,
  
  // List
  listItemHeight: 60,
  listItemPadding: 16,
  listGap: 8,
} as const;

// ============================================================================
// ICON SIZES
// ============================================================================

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 32,
  xxxl: 40,
} as const;

// ============================================================================
// OPACITY
// ============================================================================

export const opacity = {
  disabled: 0.4,
  hover: 0.8,
  pressed: 0.6,
  overlay: 0.5,
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

// ============================================================================
// THEME OBJECT
// ============================================================================

export const theme = {
  colors,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacing,
  spacing,
  borderRadius,
  borderWidth,
  shadows,
  layout,
  iconSizes,
  opacity,
  zIndex,
  transitions,
} as const;

export type Theme = typeof theme;

export default theme;
