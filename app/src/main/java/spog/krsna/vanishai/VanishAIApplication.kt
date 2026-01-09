package spog.krsna.vanishai

import android.app.Application
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.context.startKoin
import spog.krsna.vanishai.di.appModule

class VanishAIApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize Koin
        startKoin {
            androidLogger()
            androidContext(this@VanishAIApplication)
            modules(appModule)
        }
    }
}

