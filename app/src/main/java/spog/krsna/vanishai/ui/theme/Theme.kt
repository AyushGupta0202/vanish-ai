package spog.krsna.vanishai.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

// Aurora Glass Design System - Exact from design.json
private val AuroraColorScheme = darkColorScheme(
    primary = AuroraCyan,
    secondary = AuroraViolet,
    tertiary = AuroraGreen,
    background = InkBase,
    surface = GlassFill7,
    surfaceVariant = GlassFill6,
    onPrimary = InkBase,
    onSecondary = TextPrimary,
    onTertiary = InkBase,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    onSurfaceVariant = TextSecondary72,
    outline = StrokeDefault14,
    outlineVariant = StrokeSubtle10,
    error = StatusDanger,
    onError = TextPrimary
)

@Composable
fun VanishAITheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = AuroraColorScheme,
        typography = Typography,
        content = content
    )
}