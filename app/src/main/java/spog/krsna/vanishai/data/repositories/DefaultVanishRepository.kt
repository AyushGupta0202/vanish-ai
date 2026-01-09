package spog.krsna.vanishai.data.repositories

import spog.krsna.vanishai.data.gateways.ApiGateway
import spog.krsna.vanishai.data.gateways.DetectTextRequest
import spog.krsna.vanishai.data.gateways.ProcessRequest
import spog.krsna.vanishai.data.mappers.VanishMapper
import spog.krsna.vanishai.domain.entities.ImageUploadResult
import spog.krsna.vanishai.domain.entities.ProcessResult
import spog.krsna.vanishai.domain.entities.TextDetectionResult
import spog.krsna.vanishai.domain.repositories.VanishRepository
import java.io.File

class DefaultVanishRepository(
    private val apiGateway: ApiGateway,
    private val mapper: VanishMapper = VanishMapper()
) : VanishRepository {

    override suspend fun uploadImage(file: File): ImageUploadResult {
        val response = apiGateway.uploadImage(file)
        return mapper.toImageUploadResult(response)
    }

    override suspend fun detectText(
        imageBase64: String,
        maskBase64: String?,
        confidenceThreshold: Double,
        expandPixels: Int
    ): TextDetectionResult {
        val request = DetectTextRequest(
            image_base64 = imageBase64,
            mask_base64 = maskBase64,
            confidence_threshold = confidenceThreshold,
            expand_pixels = expandPixels
        )
        val response = apiGateway.detectText(request)
        return mapper.toTextDetectionResult(response)
    }

    override suspend fun processImage(
        imageBase64: String,
        maskBase64: String
    ): ProcessResult {
        val request = ProcessRequest(
            image_base64 = imageBase64,
            mask_base64 = maskBase64
        )
        val response = apiGateway.processImage(request)
        return mapper.toProcessResult(response)
    }
}

