package spog.krsna.vanishai.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import spog.krsna.vanishai.ui.theme.AuroraCyan
import spog.krsna.vanishai.ui.theme.AuroraViolet
import spog.krsna.vanishai.ui.theme.InkBase
import spog.krsna.vanishai.ui.theme.InkGradientStart

/**
 * Aurora Glass Design System - Backdrop Component
 * Exact implementation from design-system.json:
 * - Base gradient: bg-gradient-to-b from-[#071018] via-[#060B0D] to-[#060B0D]
 * - Horizon glow: radial-gradient(1200px_600px_at_50%_35%, rgba(59,214,255,0.40)_0%, rgba(59,214,255,0.18)_28%, rgba(155,109,255,0.10)_48%, rgba(6,11,13,0.00)_72%)
 */
@Composable
fun AuroraBackdrop(
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
    ) {
        // Base gradient layer
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            InkGradientStart,
                            InkBase,
                            InkBase
                        )
                    )
                )
        )

        // Horizon glow layer (radial gradient centered at 50% horizontal, 35% vertical)
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            AuroraCyan.copy(alpha = 0.40f),     // rgba(59,214,255,0.40)
                            AuroraCyan.copy(alpha = 0.18f),     // rgba(59,214,255,0.18)
                            AuroraViolet.copy(alpha = 0.10f),   // rgba(155,109,255,0.10)
                            InkBase.copy(alpha = 0.00f)         // rgba(6,11,13,0.00)
                        ),
                        radius = 1200f
                    )
                )
        )
    }
}

