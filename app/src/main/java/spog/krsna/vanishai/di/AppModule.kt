package spog.krsna.vanishai.di

import io.ktor.client.HttpClient
import io.ktor.client.engine.android.Android
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import org.koin.androidx.viewmodel.dsl.viewModel
import org.koin.dsl.module
import spog.krsna.vanishai.data.gateways.ApiGateway
import spog.krsna.vanishai.data.gateways.KtorApiGateway
import spog.krsna.vanishai.data.repositories.DefaultVanishRepository
import spog.krsna.vanishai.domain.repositories.VanishRepository
import spog.krsna.vanishai.ui.viewmodels.VanishViewModel

val appModule = module {
    single<HttpClient> {
        HttpClient(Android) {
            install(ContentNegotiation) {
                json(Json {
                    ignoreUnknownKeys = true
                    isLenient = true
                    encodeDefaults = false
                })
            }
        }
    }

    single<ApiGateway> {
        KtorApiGateway(
            httpClient = get(),
            baseUrl = "http://10.150.144.195:8000" // Public IP
        )
    }

    single<VanishRepository> {
        DefaultVanishRepository(apiGateway = get())
    }

    viewModel { VanishViewModel(repository = get()) }
}

