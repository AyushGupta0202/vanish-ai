package spog.krsna.vanishai.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import spog.krsna.vanishai.ui.theme.GlassActive12
import spog.krsna.vanishai.ui.theme.GlassFill7
import spog.krsna.vanishai.ui.theme.GlassHoverState8
import spog.krsna.vanishai.ui.theme.StrokeDefault12
import spog.krsna.vanishai.ui.theme.StrokeStrong16
import spog.krsna.vanishai.ui.theme.TextPrimary
import spog.krsna.vanishai.ui.theme.TextSecondary72

// Extra token for the Ring effect (white/8)
val RingWhite8 = Color(0x14FFFFFF)

/**
 * Glass Card - Exact from design-system.json + Web Match
 * Base: rounded-2xl border border-white/12 bg-white/7 backdrop-blur-xl ring-1 ring-white/8 shadow-[0_24px_80px_rgba(0,0,0,0.55)]
 * 
 * Updates:
 * - Added "Middle" border to simulate ring-1 (White/8)
 * - Explicit shadow color
 */
@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    contentPadding: PaddingValues = PaddingValues(20.dp),
    content: @Composable () -> Unit
) {
    Box(
        modifier = modifier
            // Shadow: 0 24px 80px rgba(0,0,0,0.55)
            // Android elevation 24.dp is close, but we ensure color is correct.
            .shadow(
                elevation = 24.dp,
                shape = RoundedCornerShape(24.dp),
                ambientColor = Color(0x8C000000), // 0.55 Alpha Black
                spotColor = Color(0x8C000000)     // 0.55 Alpha Black
            )
            .clip(RoundedCornerShape(24.dp))
            .background(GlassFill7) // bg-white/7
            // Ring-1 (White/8) - Outer effect
            .border(
                width = 2.dp, // Combine ring and border visual width slightly or stack them
                color = RingWhite8, 
                shape = RoundedCornerShape(24.dp)
            )
            // Main Border (White/12) - Inner effect
            .border(
                width = 1.dp,
                color = StrokeDefault12, // border-white/12
                shape = RoundedCornerShape(24.dp)
            )
            .padding(contentPadding)
    ) {
        content()
    }
}

/**
 * Pill Component - Exact from design-system.json
 * Base: inline-flex items-center rounded-full px-3 py-1.5 (12dp x 6dp)
 * Active: bg-white/12 text-white ring-1 ring-white/16
 * Inactive: text-white/72 hover:text-white/90
 */
@Composable
fun Pill(
    text: String,
    active: Boolean = false,
    modifier: Modifier = Modifier,
    textStyle: TextStyle = androidx.compose.material3.MaterialTheme.typography.bodySmall,
    onClick: (() -> Unit)? = null
) {
    val backgroundColor = if (active) GlassActive12 else Color.Transparent
    val textColor = if (active) TextPrimary else TextSecondary72
    val borderColor = if (active) StrokeStrong16 else Color.Transparent

    Box(
        modifier = modifier
            .clip(CircleShape)
            .background(backgroundColor)
            .then(
                if (active) Modifier.border(
                    width = 1.dp,
                    color = borderColor, // ring-white/16
                    shape = CircleShape
                ) else Modifier
            )
            .clickable(enabled = onClick != null) { onClick?.invoke() }
            .padding(horizontal = 12.dp, vertical = 6.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            style = textStyle,
            color = textColor
        )
    }
}

/**
 * Button Component - Exact from design-system.json
 */
@Composable
fun GlassButton(
    text: String,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Secondary,
    onClick: () -> Unit
) {
    val backgroundColor = when (variant) {
        ButtonVariant.Primary -> spog.krsna.vanishai.ui.theme.ButtonPrimaryFill
        ButtonVariant.Secondary -> GlassFill7
    }
    val textColor = when (variant) {
        ButtonVariant.Primary -> spog.krsna.vanishai.ui.theme.ButtonPrimaryText
        ButtonVariant.Secondary -> spog.krsna.vanishai.ui.theme.TextSecondary90
    }
    val borderColor = when (variant) {
        ButtonVariant.Primary -> Color.Transparent
        ButtonVariant.Secondary -> StrokeStrong16
    }
    val shadowElevation = if (variant == ButtonVariant.Primary) 24.dp else 0.dp

    Box(
        modifier = modifier
            .shadow(
                elevation = shadowElevation,
                shape = CircleShape,
                ambientColor = Color(0x8C000000),
                spotColor = Color(0x8C000000)
            )
            .clip(CircleShape)
            .background(backgroundColor)
            .then(
                if (variant == ButtonVariant.Secondary) Modifier.border(
                    width = 1.dp,
                    color = borderColor,
                    shape = CircleShape
                ) else Modifier
            )
            .clickable { onClick() }
            .padding(horizontal = 20.dp, vertical = 11.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            style = androidx.compose.material3.MaterialTheme.typography.bodyMedium,
            color = textColor
        )
    }
}

enum class ButtonVariant {
    Primary,
    Secondary
}

/**
 * Status Dot - Simple circle with color + Glow Shadow
 * Web: shadow-[0_0_18px_rgba(63,226,100,0.25)] (for green)
 */
@Composable
fun StatusDot(
    color: Color,
    modifier: Modifier = Modifier,
    size: Dp = 8.dp
) {
    Box(
        modifier = modifier
            .size(size)
            // Glow effect: Shadow with same color
            .shadow(
                elevation = 8.dp, // Simulate 18px blur roughly
                shape = CircleShape,
                spotColor = color, 
                ambientColor = color
            )
            .background(color, shape = CircleShape)
    )
}
