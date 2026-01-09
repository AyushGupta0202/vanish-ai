package spog.krsna.vanishai.ui.screens

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import spog.krsna.vanishai.ui.theme.VanishAITheme

@Preview(
    name = "Dashboard Light Preview",
    showBackground = true,
    backgroundColor = 0xFF060B0D,
    widthDp = 360,
    heightDp = 800
)
@Composable
fun DashboardScreenPreview() {
    VanishAITheme {
        DashboardScreen()
    }
}

@Preview(
    name = "Dashboard Tablet Preview",
    showBackground = true,
    backgroundColor = 0xFF060B0D,
    widthDp = 800,
    heightDp = 1280
)
@Composable
fun DashboardScreenTabletPreview() {
    VanishAITheme {
        DashboardScreen()
    }
}

