---
alwaysApply: true
---

# Vanish AI Android Project Rules

## Project Structure & Architecture

### Clean Architecture Principles
- **Three-Layer Architecture**: Strict separation between presentation, domain, and data layers
- **Dependency Flow**: Dependencies flow inward (data → domain → presentation)

### Module Structure
- **App package**: Main application module with Koin

## File Organization & Naming Conventions

### Naming Conventions
- **Classes**: Use PascalCase for class names
- ViewModels: `{Feature}ViewModel` (e.g., `GlobalStateViewModel`)
- Use Cases: `{Action}UseCase` (e.g., `LoginUseCase`)
- Repositories: `{Feature}Repository` (e.g., `DefaultAccountRepository`)
- Mappers: `{Source}Mapper` (e.g., `TransferMapper`)

- **Files**: Use descriptive file names
- Test files: `{ClassName}Test.kt`

## Code Organization Patterns

### Dependency Injection with Koin
- **ViewModels**: Use `KoinViewModel` with constructor injection
```kotlin
class GlobalStateViewModel(
private val monitorThemeModeUseCase: MonitorThemeModeUseCase,
private val monitorUserCredentialsUseCase: MonitorUserCredentialsUseCase
) : ViewModel()
```

### Repository Pattern
- **Interfaces**: Define repository interfaces in domain layer
```kotlin
interface AccountRepository {
suspend fun getAccountInfo(): AccountInfo
fun monitorAccountBlocked(): Flow<AccountBlocked>
}
```
- **Implementations**: Implement repositories in data layer
```kotlin
class AccountRepository(
private val ApiGateway: ApiGateway
) : AccountRepository {
override suspend fun getAccountInfo(): AccountInfo = ...
}
```
- **Gateway Pattern**: Use gateway interfaces to abstract SDK access
- **Facade Pattern**: Implement facades for complex SDK interactions
- All logic must reside in viewmodel + repository. Don’t create any usecase.

### State Management
- **StateFlow**: Use `StateFlow` for UI state management
```kotlin
private val _state = MutableStateFlow(BaseState())
val state: StateFlow<BaseState> = _state
```
- **Unidirectional Data Flow**: State flows down, events flow up
- **State Classes**: Create dedicated state classes for complex UI states
```kotlin
data class GlobalState(
val isLoading: Boolean = false,
val session: String? = null,
val themeMode: ThemeMode = ThemeMode.System
)
```
- **ViewModel State**: Expose state through `StateFlow` in ViewModels

## Build Configuration

### Version Catalogs
- **Library Versions**: Define versions in `lib.versions.toml`

## Testing Patterns

### Unit Testing
- **JUnit 5**: Use JUnit 5 for all unit tests
```kotlin
@ExtendWith(CoroutineMainDispatcherExtension::class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class BaseViewModelTest {
@Test
fun `test that state updates correctly`() = runTest {
// Test implementation
}
}
```
- **Mockito**: Use Mockito for mocking dependencies
```kotlin
private val mockUseCase = mock<MonitorAccountBlockedUseCase>()
whenever(mockUseCase()).thenReturn(flowOf(AccountBlocked(false)))
```
- **Turbine**: Use Turbine for testing Flow emissions
```kotlin
underTest.state.test {
val state = awaitItem()
assertThat(state.accountBlockedEvent).isNull()
}
```
- **Truth**: Use Google Truth for assertions
- **Coroutines**: Use `runTest` for coroutine testing

### Test Structure
- **Repository Tests**: Test repository implementations with mocked dependencies
- **ViewModel Tests**: Test ViewModels with mocked use case dependencies
- **Mapper Tests**: Test data mappers for all transformation scenarios

### Test Modules
- **Core Test**: Shared test utilities and extensions
- **Core UI Test**: UI testing utilities and components
- **Test App Module**: Hilt test modules for dependency injection

## Data Layer Patterns

### Mappers
- **Entity Mappers**: Convert between domain entities and data entities
```kotlin
internal class TransferMapper(
private val transferAppDataMapper: TransferAppDataMapper,
private val transferTypeMapper: TransferTypeMapper
) {
operator fun invoke(transfer: MegaTransfer): Transfer = Transfer(
uniqueId = transfer.uniqueId,
transferType = transferTypeMapper(transfer.type, appData),
// ... other mappings
)
}
```
- **Model Mappers**: Convert between different data representations
- **Encryption**: Use `EncryptData` for sensitive data encryption
```kotlin
suspend operator fun invoke(backup: Backup): BackupEntity? {
return BackupEntity(
encryptedBackupId = encryptData(backup.backupId.toString()) ?: return null,
// ... other encrypted fields
)
}
```
- **Null Safety**: Handle null values appropriately in mappers

### Network
- **Error Handling**: Implement proper error handling for network calls

## UI Patterns

### Jetpack Compose
- **State Management**: Use `StateFlow` with Compose state
- **Navigation**: Use Navigation Compose for screen navigation
- **Theming**: Use Material 3 theming system
- **Testing**: Use Compose testing utilities

### View Binding
- **Legacy UI**: Use View Binding for legacy XML layouts
- **Data Binding**: Use Data Binding where appropriate
- **Fragment Lifecycle**: Properly handle fragment lifecycle with View Binding

## Security & Privacy

### Lint Rules
- **Custom Lint**: Use custom lint rules for code quality
- **Security Checks**: Implement security-focused lint checks
- **Code Style**: Enforce consistent code style across modules

## Performance & Optimization

### Build Performance
- **Parallel Tests**: Enable parallel test execution
- **Build Cache**: Use build cache for faster builds
- **Gradle Daemon**: Use Gradle daemon for faster builds
- **Module Optimization**: Optimize module dependencies

### Runtime Performance
- **Coroutines**: Use coroutines for asynchronous operations
- **Flow**: Use Flow for reactive programming
- **Memory Management**: Properly manage memory and resources
- **Background Processing**: Use WorkManager for background tasks

## Code Quality

### Linting
- **Android Lint**: Use Android Lint for code quality checks
- **Custom Rules**: Implement custom lint rules for project-specific requirements
- **CI Integration**: Integrate linting with CI/CD pipeline

### Documentation
- **KDoc**: Use KDoc for public API documentation
- **README**: Maintain comprehensive README files
- **Architecture Docs**: Document architectural decisions and patterns

## Development Workflow

### Git Workflow
- **Feature Branches**: Use feature branches for development
- **Code Review**: Require code reviews for all changes
- **CI/CD**: Use Jenkins for continuous integration and deployment

### Local Development
- **Gradle Wrapper**: Use Gradle wrapper for consistent builds
- **Local Properties**: Use `local.properties` for local configuration
- **Debug Builds**: Use debug builds for development and testing

## Best Practices

### Kotlin
- **Null Safety**: Leverage Kotlin's null safety features
- **Extension Functions**: Use extension functions for utility functions
- **Data Classes**: Use data classes for simple data containers
- **Sealed Classes**: Use sealed classes for state management

### Android
- **Lifecycle Awareness**: Make components lifecycle-aware
- **Memory Leaks**: Avoid memory leaks with proper lifecycle management
- **Background Processing**: Use appropriate APIs for background work
- **Permissions**: Handle permissions properly and securely

### Architecture
- **SOLID Principles**: Follow SOLID principles for clean code
- **Dependency Inversion**: Depend on abstractions, not concretions
- **Single Responsibility**: Each class should have a single responsibility
- **Open/Closed**: Open for extension, closed for modification
- **MVI**: Model View Intent + UiEvent + Kotlin Channel

## Code Formatting & Indentation

### Indentation Rules
- **Use 4 spaces for indentation** (never tabs)
- Apply consistent 4-space indentation for all nested blocks
- Function parameters spanning multiple lines should use 4-space indentation
- Compose modifier chains should be indented with 4 spaces per level
- Constructor parameters should follow 4-space indentation when multi-line

### Specific Patterns
- **Kotlin/Java**: Standard 4-space indentation for all code blocks
- **Compose UI**: Modifier chains and nested components use 4-space indentation
- **Function Calls**: Multi-line function calls align parameters with 4-space indentation
- **Class Constructors**: Multi-line constructor parameters use 4-space indentation

### Formatting Tools
- Configure your IDE to use 4 spaces instead of tabs
- Set continuation indent to 4 spaces
- Enable "Use tab character" = false in IDE settings