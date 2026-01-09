package spog.krsna.vanishai.domain.repositories

import spog.krsna.vanishai.domain.entities.ImageUploadResult
import spog.krsna.vanishai.domain.entities.ProcessResult
import spog.krsna.vanishai.domain.entities.TextDetectionResult
import java.io.File

interface VanishRepository {
    suspend fun uploadImage(file: File): ImageUploadResult
    suspend fun detectText(
        imageBase64: String,
        maskBase64: String?,
        confidenceThreshold: Double,
        expandPixels: Int
    ): TextDetectionResult
    suspend fun processImage(
        imageBase64: String,
        maskBase64: String
    ): ProcessResult
}

