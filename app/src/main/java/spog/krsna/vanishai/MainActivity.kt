package spog.krsna.vanishai

import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import org.koin.androidx.compose.koinViewModel
import spog.krsna.vanishai.ui.events.VanishEvent
import spog.krsna.vanishai.ui.screens.EditorScreen
import spog.krsna.vanishai.ui.screens.LandingScreen
import spog.krsna.vanishai.ui.theme.VanishAITheme
import spog.krsna.vanishai.ui.viewmodels.VanishViewModel
import java.io.File

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        window.isNavigationBarContrastEnforced = false
        setContent {
            VanishAITheme {
                MainScreen()
            }
        }
    }
}

@Composable
private fun MainScreen() {
    val viewModel: VanishViewModel = koinViewModel()
    val state by viewModel.state.collectAsState()
    val context = LocalContext.current

    val imagePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            try {
                val file = File(context.cacheDir, "selected_image_${System.currentTimeMillis()}.jpg")
                context.contentResolver.openInputStream(it)?.use { input ->
                    file.outputStream().use { output ->
                        input.copyTo(output)
                    }
                }
                if (file.exists() && file.length() > 0) {
                    viewModel.handleEvent(VanishEvent.ImageSelected(file))
                }
            } catch (e: Exception) {
                viewModel.handleEvent(VanishEvent.ClearError)
            }
        }
    }

    if (state.imageBase64 == null) {
        LandingScreen(
            modifier = Modifier.fillMaxSize(),
            onUploadClick = { imagePickerLauncher.launch("image/*") },
            isLoading = state.isLoading
        )
    } else {
        EditorScreen(
            modifier = Modifier.fillMaxSize(),
            viewModel = viewModel,
            onBackToLanding = {
                viewModel.handleEvent(VanishEvent.ClearImage)
            }
        )
    }
}
