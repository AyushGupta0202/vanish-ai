package spog.krsna.vanishai.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import spog.krsna.vanishai.R

// Aurora Glass Design System Typography
// Using custom Helvetica font family
val HelveticaFamily = FontFamily(
    Font(R.font.helvetica_light, FontWeight.Light),
    Font(R.font.helvetica, FontWeight.Normal),
    Font(R.font.helvetica_oblique, FontWeight.Normal, FontStyle.Italic),
    Font(R.font.helvetica_bold, FontWeight.Bold),
    Font(R.font.helvetica_boldoblique, FontWeight.Bold, FontStyle.Italic)
)

val Typography = Typography(
    // Display styles
    displayLarge = TextStyle(
        fontFamily = HelveticaFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 56.sp,
        lineHeight = 58.8.sp,
        letterSpacing = (-0.03).em
    ),
    displayMedium = TextStyle(
        fontFamily = HelveticaFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 44.sp,
        lineHeight = 50.6.sp,
        letterSpacing = (-0.015).em
    ),
    displaySmall = TextStyle(
        fontFamily = HelveticaFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 32.sp,
        lineHeight = 36.8.sp,
        letterSpacing = (-0.015).em
    ),
    // Headline styles
    headlineLarge = TextStyle(
        fontFamily = HelveticaFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 32.sp,
        lineHeight = 36.8.sp,
        letterSpacing = (-0.015).em
    ),
    headlineMedium = TextStyle(
        fontFamily = HelveticaFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 24.sp,
        lineHeight = 27.6.sp,
        letterSpacing = (-0.015).em
    ),
    headlineSmall = TextStyle(
        fontFamily = HelveticaFamily,
        fontWeight = FontWeight.SemiBold,
        fontSize = 18.sp,
        lineHeight = 21.6.sp,
        letterSpacing = 0.em
    ),
    // Body styles
    bodyLarge = TextStyle(
        fontFamily = HelveticaFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 18.sp,
        lineHeight = 27.sp,
        letterSpacing = 0.em
    ),
    bodyMedium = TextStyle(
        fontFamily = HelveticaFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        letterSpacing = 0.em
    ),
    bodySmall = TextStyle(
        fontFamily = HelveticaFamily,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 21.sp,
        letterSpacing = 0.em
    ),
    // Label styles
    labelLarge = TextStyle(
        fontFamily = HelveticaFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 16.8.sp,
        letterSpacing = 0.08.em
    ),
    labelMedium = TextStyle(
        fontFamily = HelveticaFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 12.sp,
        lineHeight = 14.4.sp,
        letterSpacing = 0.08.em
    ),
    labelSmall = TextStyle(
        fontFamily = HelveticaFamily,
        fontWeight = FontWeight.Medium,
        fontSize = 11.sp,
        lineHeight = 13.2.sp,
        letterSpacing = 0.08.em
    )
)