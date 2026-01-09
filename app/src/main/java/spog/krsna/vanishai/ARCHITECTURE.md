# Clean Architecture Package Structure

## Overview
This project follows Clean Architecture principles with strict separation between presentation, domain, and data layers.

**Note:** The `DashboardScreen` is a dummy/sample screen for UI design purposes. All production screens will follow this architecture.

## Package Structure

```
spog.krsna.vanishai/
├── di/                          # Dependency Injection (Koin modules)
│   └── [Koin modules]
│
├── domain/                      # Domain Layer (Business Logic)
│   ├── entities/               # Domain entities (pure Kotlin, no Android deps)
│   └── repositories/           # Repository interfaces (contracts)
│
├── data/                        # Data Layer (Data Sources)
│   ├── repositories/           # Repository implementations
│   ├── mappers/                # Data transformation mappers
│   ├── gateways/               # Gateway interfaces (SDK/API abstraction)
│   └── facades/                # Facades for complex SDK interactions
│
└── ui/                          # Presentation Layer (UI)
    ├── components/             # Reusable UI components
    ├── screens/                # Screen composables
    ├── theme/                  # Material 3 theming
    ├── viewmodels/            # ViewModels (KoinViewModel + StateFlow)
    ├── state/                  # State data classes
    └── events/                 # UI events (MVI pattern with Kotlin Channel)
```

## Dependency Flow

```
UI Layer (ui/)
    ↓ depends on
Domain Layer (domain/)
    ↓ depends on
Data Layer (data/)
```

**Rule:** Dependencies flow inward. UI depends on domain, domain depends on data. Data layer has no dependencies on domain or UI.

## Architecture Rules

### 1. Domain Layer (`domain/`)
- **Pure Kotlin** - No Android dependencies
- **Entities**: Data classes representing business objects
- **Repository Interfaces**: Contracts defining data operations
- **No Use Cases**: Per project rules, all logic goes in ViewModel + Repository

### 2. Data Layer (`data/`)
- **Repository Implementations**: Implement domain repository interfaces
- **Mappers**: Convert between domain entities and data DTOs
- **Gateways**: Abstract SDK/API access
- **Facades**: Simplify complex SDK interactions

### 3. Presentation Layer (`ui/`)
- **ViewModels**: Use `KoinViewModel` with constructor injection
- **StateFlow**: Use `StateFlow` for state management
- **MVI Pattern**: Model View Intent with `UiEvent` sealed classes and Kotlin Channel
- **Composables**: UI components that observe ViewModel state

## Example Structure

### Domain Entity
```kotlin
// domain/entities/AccountInfo.kt
data class AccountInfo(
    val id: String,
    val name: String,
    val balance: Double
)
```

### Domain Repository Interface
```kotlin
// domain/repositories/AccountRepository.kt
interface AccountRepository {
    suspend fun getAccountInfo(): AccountInfo
    fun monitorAccountBlocked(): Flow<AccountBlocked>
}
```

### Data Repository Implementation
```kotlin
// data/repositories/DefaultAccountRepository.kt
class DefaultAccountRepository(
    private val apiGateway: ApiGateway
) : AccountRepository {
    override suspend fun getAccountInfo(): AccountInfo = 
        accountMapper(apiGateway.fetchAccountData())
}
```

### ViewModel
```kotlin
// ui/viewmodels/AccountViewModel.kt
class AccountViewModel(
    private val accountRepository: AccountRepository
) : ViewModel() {
    private val _state = MutableStateFlow(AccountState())
    val state: StateFlow<AccountState> = _state
    
    private val _uiEvent = Channel<AccountUiEvent>()
    val uiEvent = _uiEvent.receiveAsFlow()
    
    init {
        viewModelScope.launch {
            accountRepository.monitorAccountBlocked()
                .collect { blocked ->
                    _state.update { it.copy(accountBlocked = blocked) }
                }
        }
    }
}
```

### UI State
```kotlin
// ui/state/AccountState.kt
data class AccountState(
    val isLoading: Boolean = false,
    val accountInfo: AccountInfo? = null,
    val error: String? = null
)
```

### UI Events
```kotlin
// ui/events/AccountUiEvent.kt
sealed class AccountUiEvent {
    object LoadAccount : AccountUiEvent()
    data class RefreshAccount(val accountId: String) : AccountUiEvent()
}
```

## Dependency Injection (Koin)

```kotlin
// di/AppModule.kt
val appModule = module {
    // ViewModels
    viewModel { AccountViewModel(get()) }
    
    // Repositories
    single<AccountRepository> { DefaultAccountRepository(get()) }
    
    // Gateways
    single { ApiGateway() }
}
```

## Testing Structure

```
app/src/test/java/spog/krsna/vanishai/
├── domain/
│   └── [Entity tests]
├── data/
│   ├── repositories/
│   └── mappers/
└── ui/
    └── viewmodels/
```

## Notes

- **Dashboard Screen**: Currently a dummy/sample screen. Not following architecture (by design).
- **Future Screens**: All production screens must follow this architecture.
- **No Use Cases**: Per project rules, logic resides in ViewModel + Repository only.

