package spog.krsna.vanishai.domain.entities

data class TextRegion(
    val bbox: List<List<Double>>,
    val bboxRect: List<Double>,
    val text: String,
    val confidence: Double
)

data class TextDetectionResult(
    val success: Boolean,
    val textRegions: List<TextRegion>,
    val maskBase64: String? = null,
    val count: Int = 0
)

