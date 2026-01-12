package spog.krsna.vanishai.ui.theme

import androidx.compose.ui.graphics.Color

// EXACT colors from design.json and design-system.json
// Ink base colors
val InkBase = Color(0xFF060B0D)
val InkRaised = Color(0xFF0B1115)
val InkOverlay = Color(0xFF0E151B)
val InkGradientStart = Color(0xFF071018) // Gradient start color for backdrop

// Accent colors (aurora.*)
val AuroraCyan = Color(0xFF3BD6FF)
val AuroraViolet = Color(0xFF9B6DFF)
val AuroraGreen = Color(0xFF3FE264)

// Status colors
val StatusDanger = Color(0xFFFF4D4D)

// Neutral - Text with alpha (rgba(255,255,255,alpha))
// EXACT match to frontend: text-white/92, text-white/90, text-white/72, text-white/62, text-white/56, text-white/52
val TextPrimary = Color(0xEBFFFFFF)       // rgba(255,255,255,0.92) = 92% = text-white/92
val TextSecondary90 = Color(0xE6FFFFFF)   // rgba(255,255,255,0.90) = 90% = text-white/90 (for secondary buttons)
val TextSecondary86 = Color(0xDBFFFFFF)   // rgba(255,255,255,0.86) = 86% = 0xDB
val TextSecondary72 = Color(0xB8FFFFFF)   // rgba(255,255,255,0.72) = 72% = text-white/72
val TextSecondary70 = Color(0xB3FFFFFF)   // rgba(255,255,255,0.70) = 70% = 0xB3
val TextSecondary62 = Color(0x9EFFFFFF)   // rgba(255,255,255,0.62) = 62% = text-white/62
val TextSecondary56 = Color(0x8FFFFFFF)   // rgba(255,255,255,0.56) = 56% = text-white/56
val TextTertiary52 = Color(0x85FFFFFF)    // rgba(255,255,255,0.52) = 52% = text-white/52

// Surface - Glass with alpha (rgba(255,255,255,alpha))
val GlassFill6 = Color(0x0FFFFFFF)        // rgba(255,255,255,0.06) = 6% = 0x0F
val GlassFill7 = Color(0x12FFFFFF)        // rgba(255,255,255,0.07) = 7% = 0x12
val GlassFill9 = Color(0x17FFFFFF)        // rgba(255,255,255,0.09) = 9% = 0x17
val GlassHover10 = Color(0x1AFFFFFF)      // rgba(255,255,255,0.10) = 10% = 0x1A
val GlassActive12 = Color(0x1FFFFFFF)     // rgba(255,255,255,0.12) = 12% = 0x1F
val GlassPressed5 = Color(0x0DFFFFFF)     // rgba(255,255,255,0.05) = 5% = 0x0D
val GlassTableHeader5 = Color(0x0DFFFFFF) // rgba(255,255,255,0.05) = 5% = 0x0D
val GlassHoverState8 = Color(0x14FFFFFF)  // rgba(255,255,255,0.08) = 8% = 0x14

// Stroke - Borders with alpha (rgba(255,255,255,alpha))
val StrokeSubtle10 = Color(0x1AFFFFFF)    // rgba(255,255,255,0.10) = 10% = 0x1A
val StrokeDefault12 = Color(0x1FFFFFFF)   // rgba(255,255,255,0.12) = 12% = 0x1F
val StrokeDefault14 = Color(0x24FFFFFF)   // rgba(255,255,255,0.14) = 14% = 0x24
val StrokeStrong16 = Color(0x29FFFFFF)    // rgba(255,255,255,0.16) = 16% = 0x29
val StrokeStrong22 = Color(0x38FFFFFF)    // rgba(255,255,255,0.22) = 22% = 0x38

// CTA/Button colors
val ButtonPrimaryFill = Color(0xFFFFFFFF)
val ButtonPrimaryText = InkBase