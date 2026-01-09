package spog.krsna.vanishai.domain.entities

data class ProcessResult(
    val success: Boolean,
    val imageBase64: String,
    val message: String? = null
)

