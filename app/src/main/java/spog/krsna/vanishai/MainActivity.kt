package spog.krsna.vanishai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import spog.krsna.vanishai.ui.screens.DashboardScreen
import spog.krsna.vanishai.ui.theme.VanishAITheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            VanishAITheme {
                DashboardScreen(modifier = Modifier.fillMaxSize())
            }
        }
    }
}
