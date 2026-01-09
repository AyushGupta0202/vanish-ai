package spog.krsna.vanishai.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import spog.krsna.vanishai.domain.repositories.VanishRepository
import spog.krsna.vanishai.ui.events.VanishEvent
import spog.krsna.vanishai.ui.state.ToolMode
import spog.krsna.vanishai.ui.state.VanishState
import java.io.File
import java.util.Base64

class VanishViewModel(
    private val repository: VanishRepository
) : ViewModel() {

    private val _state = MutableStateFlow(VanishState())
    val state: StateFlow<VanishState> = _state.asStateFlow()

    fun handleEvent(event: VanishEvent) {
        when (event) {
            is VanishEvent.ImageSelected -> uploadImage(event.file)
            is VanishEvent.BrushSizeChanged -> updateBrushSize(event.size)
            is VanishEvent.ConfidenceThresholdChanged -> updateConfidenceThreshold(event.threshold)
            is VanishEvent.ExpandPixelsChanged -> updateExpandPixels(event.pixels)
            is VanishEvent.ToolModeChanged -> updateToolMode(event.mode)
            is VanishEvent.MaskDrawn -> updateMask(event.maskBase64)
            is VanishEvent.AutoDetect -> autoDetectText()
            is VanishEvent.ProcessImage -> processImage()
            is VanishEvent.ClearImage -> clearImage()
            is VanishEvent.ClearError -> clearError()
        }
    }

    private fun uploadImage(file: File) {
        viewModelScope.launch {
            _state.value = _state.value.copy(isLoading = true, error = null)
            try {
                val result = repository.uploadImage(file)
                if (result.success) {
                    _state.value = _state.value.copy(
                        imageBase64 = result.imageBase64,
                        isLoading = false,
                        processedImageBase64 = null,
                        detectedRegions = emptyList(),
                        maskBase64 = null
                    )
                } else {
                    _state.value = _state.value.copy(
                        isLoading = false,
                        error = "Failed to upload image"
                    )
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isLoading = false,
                    error = "Upload failed: ${e.message}"
                )
            }
        }
    }

    private fun autoDetectText() {
        val currentState = _state.value
        if (currentState.imageBase64 == null || currentState.maskBase64 == null) {
            _state.value = currentState.copy(
                error = "Please draw on the image first to select an area"
            )
            return
        }

        viewModelScope.launch {
            _state.value = currentState.copy(isDetecting = true, error = null)
            try {
                val result = repository.detectText(
                    imageBase64 = currentState.imageBase64,
                    maskBase64 = currentState.maskBase64,
                    confidenceThreshold = currentState.confidenceThreshold,
                    expandPixels = currentState.expandPixels
                )
                if (result.success) {
                    _state.value = _state.value.copy(
                        detectedRegions = result.textRegions,
                        maskBase64 = result.maskBase64 ?: currentState.maskBase64,
                        isDetecting = false
                    )
                } else {
                    _state.value = _state.value.copy(
                        isDetecting = false,
                        error = result.textRegions.firstOrNull()?.text ?: "Detection failed"
                    )
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isDetecting = false,
                    error = "Detection failed: ${e.message}"
                )
            }
        }
    }

    private fun processImage() {
        val currentState = _state.value
        if (currentState.imageBase64 == null || currentState.maskBase64 == null) {
            _state.value = currentState.copy(
                error = "Please draw a mask or use auto-detect first"
            )
            return
        }

        viewModelScope.launch {
            _state.value = currentState.copy(isProcessing = true, error = null)
            try {
                val result = repository.processImage(
                    imageBase64 = currentState.imageBase64,
                    maskBase64 = currentState.maskBase64
                )
                if (result.success) {
                    _state.value = _state.value.copy(
                        processedImageBase64 = result.imageBase64,
                        isProcessing = false
                    )
                } else {
                    _state.value = _state.value.copy(
                        isProcessing = false,
                        error = result.message ?: "Processing failed"
                    )
                }
            } catch (e: Exception) {
                _state.value = _state.value.copy(
                    isProcessing = false,
                    error = "Processing failed: ${e.message}"
                )
            }
        }
    }

    private fun updateBrushSize(size: Int) {
        _state.value = _state.value.copy(brushSize = size)
    }

    private fun updateConfidenceThreshold(threshold: Double) {
        _state.value = _state.value.copy(confidenceThreshold = threshold)
    }

    private fun updateExpandPixels(pixels: Int) {
        _state.value = _state.value.copy(expandPixels = pixels)
    }

    private fun updateToolMode(mode: ToolMode) {
        _state.value = _state.value.copy(toolMode = mode)
    }

    private fun updateMask(maskBase64: String) {
        _state.value = _state.value.copy(maskBase64 = maskBase64)
    }

    private fun clearImage() {
        _state.value = VanishState()
    }

    private fun clearError() {
        _state.value = _state.value.copy(error = null)
    }
}

