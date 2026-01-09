package spog.krsna.vanishai.data.gateways

import kotlinx.serialization.Serializable
import java.io.File

interface ApiGateway {
    suspend fun uploadImage(file: File): UploadResponse
    suspend fun detectText(request: DetectTextRequest): DetectTextResponse
    suspend fun processImage(request: ProcessRequest): ProcessResponse
}

@Serializable
data class UploadResponse(
    val success: Boolean,
    val image: String,
    val width: Int? = null,
    val height: Int? = null
)

@Serializable
data class DetectTextRequest(
    val image_base64: String,
    val mask_base64: String? = null,
    val confidence_threshold: Double = 0.5,
    val expand_pixels: Int = 5
)

@Serializable
data class TextRegionResponse(
    val bbox: List<List<Double>>,
    val bbox_rect: List<Double>,
    val text: String,
    val confidence: Double
)

@Serializable
data class DetectTextResponse(
    val success: Boolean,
    val text_regions: List<TextRegionResponse> = emptyList(),
    val mask: String? = null,
    val count: Int = 0,
    val message: String? = null
)

@Serializable
data class ProcessRequest(
    val image_base64: String,
    val mask_base64: String
)

@Serializable
data class ProcessResponse(
    val success: Boolean,
    val image: String,
    val message: String? = null
)

