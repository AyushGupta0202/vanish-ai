package spog.krsna.vanishai.data.gateways

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.forms.MultiPartFormDataContent
import io.ktor.client.request.forms.formData
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.http.contentType
import kotlinx.serialization.json.Json
import java.io.File

class KtorApiGateway(
    private val httpClient: HttpClient,
    private val baseUrl: String = "http://10.150.144.195:8000" // Public IP
) : ApiGateway {

    override suspend fun uploadImage(file: File): UploadResponse {
        return httpClient.post("$baseUrl/api/upload") {
            contentType(ContentType.MultiPart.FormData)
            setBody(
                MultiPartFormDataContent(
                    formData {
                        append("file", file.readBytes(), Headers.build {
                            append(HttpHeaders.ContentType, "image/*")
                            append(HttpHeaders.ContentDisposition, "filename=${file.name}")
                        })
                    }
                )
            )
        }.body()
    }

    override suspend fun detectText(request: DetectTextRequest): DetectTextResponse {
        return httpClient.post("$baseUrl/api/detect-text") {
            contentType(ContentType.Application.Json)
            setBody(request)
        }.body()
    }

    override suspend fun processImage(request: ProcessRequest): ProcessResponse {
        return httpClient.post("$baseUrl/api/process") {
            contentType(ContentType.Application.Json)
            setBody(request)
        }.body()
    }
}

