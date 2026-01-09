package spog.krsna.vanishai.domain.entities

data class ImageUploadResult(
    val success: Boolean,
    val imageBase64: String,
    val width: Int? = null,
    val height: Int? = null
)

