package spog.krsna.vanishai.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.dp
import spog.krsna.vanishai.ui.theme.AuroraCyan
import spog.krsna.vanishai.ui.theme.AuroraViolet
import spog.krsna.vanishai.ui.theme.InkBase
import spog.krsna.vanishai.ui.theme.InkGradientStart

/**
 * Aurora Glass Design System - Backdrop Component
 * Exact implementation from design-system.json / Web Dashboard.tsx:
 * - Base gradient: bg-gradient-to-b from-[#071018] via-[#060B0D] to-[#060B0D]
 * - Rings: Radial gradient circles (simulated via Canvas for precision)
 * - Horizon glow: Elliptical radial gradient
 * - Vignette: Radial gradient darkening edges
 */
@Composable
fun AuroraBackdrop(
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color.Black) // Safety background
    ) {
        // 1. Base gradient layer
        // bg-gradient-to-b from-[#071018] via-[#060B0D] to-[#060B0D]
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

        // 2. Rings Layer (Concentric circles)
        // Web: radial-gradient(circle_at_50%_45%, ...)
        // 180px -> white/12
        // 270px -> white/9
        // 370px -> white/7
        // 520px -> white/5
        Canvas(modifier = Modifier.fillMaxSize().graphicsLayer { alpha = 0.6f }) {
            val centerX = size.width / 2
            val centerY = size.height * 0.45f // 45% height

            // Draw rings
            // Note: dp to px conversion needed if strict sizing, but using raw px values 
            // from web (assuming high density) or scaling. 
            // Web px values: 180, 270, 370, 520.
            // On a typical phone (approx 2.75-3x density), 180px web might validly be interpreted as 180.dp or raw px.
            // Let's use logic: Web 180px is likely logical pixels. 180.dp is safer for Android.
            
            val rings = listOf(
                180.dp to Color(0x1FFFFFFF), // 12%
                271.dp to Color(0x17FFFFFF), // 9%
                371.dp to Color(0x12FFFFFF), // 7%
                521.dp to Color(0x0DFFFFFF)  // 5%
            )

            rings.forEach { (radiusDp, color) ->
                drawCircle(
                    color = color,
                    radius = radiusDp.toPx(),
                    center = Offset(centerX, centerY),
                    style = Stroke(width = 1.dp.toPx())
                )
            }
        }

        // 3. Horizon glow layer (Elliptical)
        // Web: radial-gradient(1200px_600px_at_50%_35%, ...)
        // Android RadialGradient is circular. Use scale to make it elliptical.
        Box(
            modifier = Modifier
                .fillMaxSize()
                .graphicsLayer {
                    scaleX = 2.0f // Stretch horizontally to mimic ellipse
                    scaleY = 1.0f
                    translationY = -size.height * 0.15f // Adjust position to match 35% visually after scaling
                }
                .background(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            AuroraCyan.copy(alpha = 0.40f),     // 0%
                            AuroraCyan.copy(alpha = 0.18f),     // 28%
                            AuroraViolet.copy(alpha = 0.10f),   // 48%
                            InkBase.copy(alpha = 0.00f)         // 72%
                        ),
                        center = Offset.Unspecified, // Defaults to center, which is what we want for the Box
                        radius = 800f // Adjusted radius
                    )
                )
        )

        // 4. Vignette Layer
        // Web: radial-gradient(circle_at_50%_50%, transparent 0%, transparent 55%, rgba(0,0,0,0.55) 100%)
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            Color.Transparent,          // 0%
                            Color.Transparent,          // 55%
                            Color(0x8C000000)           // 0.55 alpha black at 100%
                        ),
                        radius = 2000f // Large radius to push darkness to corners
                    )
                )
        )
    }
}
