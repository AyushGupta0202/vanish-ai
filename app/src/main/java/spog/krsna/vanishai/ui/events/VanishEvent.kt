package spog.krsna.vanishai.ui.events

import android.net.Uri
import java.io.File

sealed class VanishEvent {
    data class ImageSelected(val file: File) : VanishEvent()
    data class BrushSizeChanged(val size: Int) : VanishEvent()
    data class ConfidenceThresholdChanged(val threshold: Double) : VanishEvent()
    data class ExpandPixelsChanged(val pixels: Int) : VanishEvent()
    data class ToolModeChanged(val mode: spog.krsna.vanishai.ui.state.ToolMode) : VanishEvent()
    data class MaskDrawn(val maskBase64: String) : VanishEvent()
    object AutoDetect : VanishEvent()
    object ProcessImage : VanishEvent()
    object ClearImage : VanishEvent()
    object ClearError : VanishEvent()
}

