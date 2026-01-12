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

/**
 * Glass Card - Exact from design-system.json
 * Base: rounded-2xl border border-white/12 bg-white/7 backdrop-blur-xl ring-1 ring-white/8 shadow-[0_24px_80px_rgba(0,0,0,0.55)]
 */
@Composable
fun GlassCard(
    modifier: Modifier = Modifier,
    contentPadding: PaddingValues = PaddingValues(20.dp),
    content: @Composable () -> Unit
) {
    Box(
        modifier = modifier
            .shadow(
                elevation = 24.dp,
                shape = RoundedCornerShape(24.dp),
                ambientColor = Color.Black.copy(alpha = 0.55f),
                spotColor = Color.Black.copy(alpha = 0.55f)
            )
            .clip(RoundedCornerShape(24.dp))
            .background(GlassFill7) // bg-white/7
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
 * Base: inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium
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
                    color = borderColor,
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
 * Primary: bg-white text-ink-base
 * Secondary: bg-white/7 border-white/16
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

    Box(
        modifier = modifier
            .shadow(
                elevation = if (variant == ButtonVariant.Primary) 24.dp else 0.dp,
                shape = CircleShape,
                ambientColor = Color.Black.copy(alpha = 0.55f)
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
 * Status Dot - Simple circle with color
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
            .background(color, shape = CircleShape)
    )
}

