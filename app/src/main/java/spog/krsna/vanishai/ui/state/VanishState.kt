package spog.krsna.vanishai.ui.state

import spog.krsna.vanishai.domain.entities.TextRegion

data class VanishState(
    val imageUri: String? = null,
    val imageBase64: String? = null,
    val processedImageBase64: String? = null,
    val maskBase64: String? = null,
    val detectedRegions: List<TextRegion> = emptyList(),
    val isLoading: Boolean = false,
    val isDetecting: Boolean = false,
    val isProcessing: Boolean = false,
    val error: String? = null,
    val brushSize: Int = 20,
    val confidenceThreshold: Double = 0.5,
    val expandPixels: Int = 5,
    val toolMode: ToolMode = ToolMode.Brush
)

enum class ToolMode {
    Brush,
    Hand
}

