package spog.krsna.vanishai.data.mappers

import spog.krsna.vanishai.data.gateways.DetectTextResponse
import spog.krsna.vanishai.data.gateways.ProcessResponse
import spog.krsna.vanishai.data.gateways.UploadResponse
import spog.krsna.vanishai.domain.entities.ImageUploadResult
import spog.krsna.vanishai.domain.entities.ProcessResult
import spog.krsna.vanishai.domain.entities.TextDetectionResult
import spog.krsna.vanishai.domain.entities.TextRegion

class VanishMapper {
    fun toImageUploadResult(response: UploadResponse): ImageUploadResult {
        return ImageUploadResult(
            success = response.success,
            imageBase64 = response.image,
            width = response.width,
            height = response.height
        )
    }

    fun toTextDetectionResult(response: DetectTextResponse): TextDetectionResult {
        return TextDetectionResult(
            success = response.success,
            textRegions = response.text_regions.map { region ->
                TextRegion(
                    bbox = region.bbox,
                    bboxRect = region.bbox_rect,
                    text = region.text,
                    confidence = region.confidence
                )
            },
            maskBase64 = response.mask,
            count = response.count
        )
    }

    fun toProcessResult(response: ProcessResponse): ProcessResult {
        return ProcessResult(
            success = response.success,
            imageBase64 = response.image,
            message = response.message
        )
    }
}

