package spog.krsna.vanishai.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import coil.request.ImageRequest
import org.koin.androidx.compose.koinViewModel
import spog.krsna.vanishai.ui.components.AuroraBackdrop
import spog.krsna.vanishai.ui.components.GlassButton
import spog.krsna.vanishai.ui.components.GlassCard
import spog.krsna.vanishai.ui.components.ButtonVariant
import spog.krsna.vanishai.ui.events.VanishEvent
import spog.krsna.vanishai.ui.state.ToolMode
import spog.krsna.vanishai.ui.theme.AuroraCyan
import spog.krsna.vanishai.ui.theme.GlassActive12
import spog.krsna.vanishai.ui.theme.GlassFill6
import spog.krsna.vanishai.ui.theme.StatusDanger
import spog.krsna.vanishai.ui.theme.StrokeDefault12
import spog.krsna.vanishai.ui.theme.StrokeSubtle10
import spog.krsna.vanishai.ui.theme.TextPrimary
import spog.krsna.vanishai.ui.theme.TextSecondary56
import spog.krsna.vanishai.ui.theme.TextSecondary62
import spog.krsna.vanishai.ui.theme.TextSecondary72
import spog.krsna.vanishai.ui.theme.TextTertiary52
import spog.krsna.vanishai.ui.viewmodels.VanishViewModel
import java.io.File

@Composable
fun EditorScreen(
    modifier: Modifier = Modifier,
    viewModel: VanishViewModel = koinViewModel(),
    onBackToLanding: () -> Unit
) {
    val state by viewModel.state.collectAsState()
    val context = LocalContext.current

    val imagePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            try {
                val file = File(context.cacheDir, "selected_image_${System.currentTimeMillis()}.jpg")
                context.contentResolver.openInputStream(it)?.use { input ->
                    file.outputStream().use { output ->
                        input.copyTo(output)
                    }
                }
                if (file.exists() && file.length() > 0) {
                    viewModel.handleEvent(VanishEvent.ImageSelected(file))
                }
            } catch (e: Exception) {
                viewModel.handleEvent(VanishEvent.ClearError)
            }
        }
    }

    Box(modifier = modifier.fillMaxSize()) {
        AuroraBackdrop()

        Scaffold(
            modifier = Modifier.fillMaxSize(),
            containerColor = Color.Transparent
        ) { paddingValues ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 20.dp),
                contentPadding = paddingValues,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    Spacer(modifier = Modifier.height(20.dp))
                }

                // Header
                item {
                    EditorHeader(
                        onNewImageClick = { imagePickerLauncher.launch("image/*") },
                        onExportClick = { /* TODO */ },
                        onBackClick = onBackToLanding
                    )
                    Spacer(modifier = Modifier.height(24.dp))
                }

                item {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // Left Sidebar
                        Column(
                            modifier = Modifier.width(220.dp),
                            verticalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            ToolsPanel(
                                toolMode = state.toolMode,
                                brushSize = state.brushSize,
                                onToolModeChange = { mode ->
                                    viewModel.handleEvent(VanishEvent.ToolModeChanged(mode))
                                },
                                onBrushSizeChange = { size ->
                                    viewModel.handleEvent(VanishEvent.BrushSizeChanged(size))
                                }
                            )

                            DetectionSettingsPanel(
                                confidenceThreshold = state.confidenceThreshold,
                                expandPixels = state.expandPixels,
                                onConfidenceChange = { threshold ->
                                    viewModel.handleEvent(VanishEvent.ConfidenceThresholdChanged(threshold))
                                },
                                onExpandChange = { pixels ->
                                    viewModel.handleEvent(VanishEvent.ExpandPixelsChanged(pixels))
                                }
                            )
                        }

                        // Main Content
                        Column(
                            modifier = Modifier.weight(1f),
                            verticalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            // Select. Vanish. Section
                            GlassCard(contentPadding = PaddingValues(24.dp)) {
                                Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = "Select. Vanish.",
                                            style = MaterialTheme.typography.headlineMedium,
                                            color = TextPrimary
                                        )
                                        Row(
                                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                                        ) {
                                            GlassButton(
                                                text = if (state.isDetecting) "Detecting..." else "Auto Detect",
                                                variant = ButtonVariant.Secondary,
                                                onClick = { viewModel.handleEvent(VanishEvent.AutoDetect) }
                                            )
                                            GlassButton(
                                                text = "New Image",
                                                variant = ButtonVariant.Secondary,
                                                onClick = { imagePickerLauncher.launch("image/*") }
                                            )
                                        }
                                    }

                                    // Image Display
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(400.dp)
                                            .clip(RoundedCornerShape(16.dp))
                                            .background(GlassFill6)
                                            .border(1.dp, StrokeSubtle10, RoundedCornerShape(16.dp))
                                    ) {
                                        val imageBase64 = state.imageBase64
                                        if (imageBase64 != null) {
                                            val imageUrl = if (imageBase64.startsWith("data:")) {
                                                imageBase64
                                            } else {
                                                "data:image/jpeg;base64,$imageBase64"
                                            }
                                            Image(
                                                painter = rememberAsyncImagePainter(
                                                    ImageRequest.Builder(LocalContext.current)
                                                        .data(imageUrl)
                                                        .build()
                                                ),
                                                contentDescription = "Selected image",
                                                modifier = Modifier.fillMaxSize(),
                                                contentScale = ContentScale.Fit
                                            )
                                        }
                                    }

                                    Text(
                                        text = "Tip: Draw on areas you want to remove. Pinch to zoom on all devices.",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = TextSecondary62
                                    )

                                    GlassButton(
                                        text = if (state.isProcessing) "Processing..." else "Process Image",
                                        variant = ButtonVariant.Primary,
                                        onClick = { viewModel.handleEvent(VanishEvent.ProcessImage) },
                                        modifier = Modifier.fillMaxWidth()
                                    )

                                    if (state.detectedRegions.isNotEmpty()) {
                                        Text(
                                            text = "Detected ${state.detectedRegions.size} text regions",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = TextSecondary72
                                        )
                                    }
                                }
                            }

                            // Result Section
                            if (state.processedImageBase64 != null) {
                                GlassCard(contentPadding = PaddingValues(24.dp)) {
                                    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                                        Text(
                                            text = "Result",
                                            style = MaterialTheme.typography.headlineMedium,
                                            color = TextPrimary
                                        )
                                        Text(
                                            text = "Gone. Clean. Done.",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = TextSecondary56
                                        )
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(400.dp)
                                                .clip(RoundedCornerShape(16.dp))
                                                .background(GlassFill6)
                                                .border(1.dp, StrokeSubtle10, RoundedCornerShape(16.dp))
                                        ) {
                                            val processedBase64 = state.processedImageBase64
                                            if (processedBase64 != null) {
                                                val processedUrl = if (processedBase64.startsWith("data:")) {
                                                    processedBase64
                                                } else {
                                                    "data:image/png;base64,$processedBase64"
                                                }
                                                Image(
                                                    painter = rememberAsyncImagePainter(
                                                        ImageRequest.Builder(LocalContext.current)
                                                            .data(processedUrl)
                                                            .build()
                                                    ),
                                                    contentDescription = "Processed image",
                                                    modifier = Modifier.fillMaxSize(),
                                                    contentScale = ContentScale.Fit
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                item {
                    // History Bar
                    HistoryBar(
                        hasProcessedImage = state.processedImageBase64 != null,
                        onDownloadClick = { /* TODO */ }
                    )
                    Spacer(modifier = Modifier.height(32.dp))
                }
            }
        }

        // Error Snackbar
        state.error?.let { error ->
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(16.dp)
            ) {
                GlassCard(contentPadding = PaddingValues(16.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text(
                            text = error,
                            style = MaterialTheme.typography.bodySmall,
                            color = StatusDanger
                        )
                        Text(
                            text = "✕",
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextSecondary72,
                            modifier = Modifier.clickable {
                                viewModel.handleEvent(VanishEvent.ClearError)
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun EditorHeader(
    onNewImageClick: () -> Unit,
    onExportClick: () -> Unit,
    onBackClick: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "VANISH AI",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.SemiBold
            ),
            color = TextPrimary
        )
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            GlassButton(
                text = "Export",
                variant = ButtonVariant.Secondary,
                onClick = onExportClick
            )
            GlassButton(
                text = "Account",
                variant = ButtonVariant.Secondary,
                onClick = { /* TODO */ }
            )
        }
    }
}

@Composable
private fun ToolsPanel(
    toolMode: ToolMode,
    brushSize: Int,
    onToolModeChange: (ToolMode) -> Unit,
    onBrushSizeChange: (Int) -> Unit
) {
    GlassCard(contentPadding = PaddingValues(16.dp)) {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
                text = "TOOLS",
                style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 1.sp),
                color = TextTertiary52
            )
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                ToolButton(
                    text = "Brush",
                    active = toolMode == ToolMode.Brush,
                    onClick = { onToolModeChange(ToolMode.Brush) }
                )
                ToolButton(
                    text = "Hand",
                    active = toolMode == ToolMode.Hand,
                    onClick = { onToolModeChange(ToolMode.Hand) }
                )
                ToolButton(
                    text = "Rectangle",
                    active = false,
                    enabled = false,
                    onClick = {}
                )
                ToolButton(
                    text = "Lasso",
                    active = false,
                    enabled = false,
                    onClick = {}
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Undo",
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary72,
                modifier = Modifier.clickable { /* TODO */ }
            )
            Text(
                text = "Redo",
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary72,
                modifier = Modifier.clickable { /* TODO */ }
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Brush Size: $brushSize",
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary72
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                GlassButton(
                    text = "-",
                    variant = ButtonVariant.Secondary,
                    onClick = { onBrushSizeChange((brushSize - 5).coerceAtLeast(5)) },
                    modifier = Modifier.size(40.dp)
                )
                GlassButton(
                    text = "+",
                    variant = ButtonVariant.Secondary,
                    onClick = { onBrushSizeChange((brushSize + 5).coerceAtMost(50)) },
                    modifier = Modifier.size(40.dp)
                )
            }
        }
    }
}

@Composable
private fun ToolButton(
    text: String,
    active: Boolean,
    enabled: Boolean = true,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(
                if (active) GlassActive12 else Color.Transparent
            )
            .border(
                width = if (active) 1.dp else 0.dp,
                color = if (active) StrokeDefault12 else Color.Transparent,
                shape = RoundedCornerShape(8.dp)
            )
            .clickable(enabled = enabled) { onClick() }
            .padding(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = text,
                style = MaterialTheme.typography.bodyMedium,
                color = if (active) TextPrimary else if (enabled) TextSecondary72 else TextTertiary52
            )
            if (!enabled) {
                Text(
                    text = "Coming Soon",
                    style = MaterialTheme.typography.labelSmall,
                    color = TextTertiary52
                )
            }
        }
    }
}

@Composable
private fun DetectionSettingsPanel(
    confidenceThreshold: Double,
    expandPixels: Int,
    onConfidenceChange: (Double) -> Unit,
    onExpandChange: (Int) -> Unit
) {
    GlassCard(contentPadding = PaddingValues(16.dp)) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Text(
                text = "DETECTION SETTINGS",
                style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 1.sp),
                color = TextTertiary52
            )
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Confidence Threshold: ${(confidenceThreshold * 100).toInt()}%",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary72
                )
                Text(
                    text = "Higher values = more confident detections only",
                    style = MaterialTheme.typography.labelSmall,
                    color = TextTertiary52
                )
            }
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Mask Expansion: ${expandPixels}px",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary72
                )
                Text(
                    text = "Pixels to expand mask around detected text",
                    style = MaterialTheme.typography.labelSmall,
                    color = TextTertiary52
                )
            }
        }
    }
}

@Composable
private fun HistoryBar(
    hasProcessedImage: Boolean,
    onDownloadClick: () -> Unit
) {
    GlassCard(
        modifier = Modifier.fillMaxWidth(),
        contentPadding = PaddingValues(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "History:",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontWeight = FontWeight.SemiBold
                    ),
                    color = TextPrimary
                )
                Text(
                    text = "Original",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary72
                )
                Text(
                    text = "→",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary72
                )
                Text(
                    text = "Selection",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary72
                )
                Text(
                    text = "→",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary72
                )
                Text(
                    text = if (hasProcessedImage) "Vanished" else "Ready",
                    style = MaterialTheme.typography.bodySmall,
                    color = if (hasProcessedImage) AuroraCyan else TextSecondary72
                )
            }
            if (hasProcessedImage) {
                GlassButton(
                    text = "Download Result",
                    variant = ButtonVariant.Primary,
                    onClick = onDownloadClick
                )
            }
        }
    }
}

