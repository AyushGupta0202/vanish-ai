package spog.krsna.vanishai.ui.screens

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import spog.krsna.vanishai.ui.components.AuroraBackdrop
import spog.krsna.vanishai.ui.components.GlassButton
import spog.krsna.vanishai.ui.components.GlassCard
import spog.krsna.vanishai.ui.components.ButtonVariant
import spog.krsna.vanishai.ui.theme.AuroraCyan
import spog.krsna.vanishai.ui.theme.GlassFill6
import spog.krsna.vanishai.ui.theme.GlassFill7
import spog.krsna.vanishai.ui.theme.StrokeDefault12
import spog.krsna.vanishai.ui.theme.TextPrimary
import spog.krsna.vanishai.ui.theme.TextSecondary56
import spog.krsna.vanishai.ui.theme.TextSecondary62
import spog.krsna.vanishai.ui.theme.TextSecondary72
import spog.krsna.vanishai.ui.theme.TextTertiary52

@Composable
fun LandingScreen(
    modifier: Modifier = Modifier,
    onUploadClick: () -> Unit,
    isLoading: Boolean = false
) {
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
                verticalArrangement = Arrangement.spacedBy(48.dp)
            ) {
                item {
                    Spacer(modifier = Modifier.height(20.dp))
                }

                // Header
                item {
                    LandingHeader(onTryClick = onUploadClick)
                    Spacer(modifier = Modifier.height(32.dp))
                }

                // Hero Section
                item {
                    HeroSection(onTryClick = onUploadClick, isLoading = isLoading)
                    Spacer(modifier = Modifier.height(48.dp))
                }

                // How It Works
                item {
                    HowItWorksSection()
                    Spacer(modifier = Modifier.height(48.dp))
                }

                // Why Vanish
                item {
                    WhyVanishSection()
                    Spacer(modifier = Modifier.height(48.dp))
                }

                // Live Demo
                item {
                    LiveDemoSection(onUploadClick = onUploadClick, isLoading = isLoading)
                    Spacer(modifier = Modifier.height(48.dp))
                }

                // CTA Section
                item {
                    CTASection(onStartClick = onUploadClick)
                    Spacer(modifier = Modifier.height(48.dp))
                }

                // Footer
                item {
                    Footer()
                    Spacer(modifier = Modifier.height(32.dp))
                }
            }
        }
    }
}

@Composable
private fun LandingHeader(onTryClick: () -> Unit) {
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
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Features",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary72
            )
            Text(
                text = "Pricing",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary72
            )
            Text(
                text = "Login",
                style = MaterialTheme.typography.bodyMedium,
                color = TextSecondary72
            )
            GlassButton(
                text = "Try Vanish AI",
                variant = ButtonVariant.Secondary,
                onClick = onTryClick
            )
        }
    }
}

@Composable
private fun HeroSection(onTryClick: () -> Unit, isLoading: Boolean) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(32.dp)
    ) {
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            Text(
                text = "MAKE ANYTHING VANISH.",
                style = MaterialTheme.typography.displaySmall.copy(
                    fontSize = 48.sp,
                    fontWeight = FontWeight.SemiBold
                ),
                color = TextPrimary
            )
            Text(
                text = "INSTANTLY.",
                style = MaterialTheme.typography.displaySmall.copy(
                    fontSize = 48.sp,
                    fontWeight = FontWeight.SemiBold
                ),
                color = AuroraCyan
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "AI-powered object removal with zero residue, zero effort, zero compromise.",
                style = MaterialTheme.typography.bodyLarge,
                color = TextSecondary62
            )
            Spacer(modifier = Modifier.height(16.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                GlassButton(
                    text = "Try Vanish AI",
                    variant = ButtonVariant.Primary,
                    onClick = onTryClick
                )
                GlassButton(
                    text = "See it in action",
                    variant = ButtonVariant.Secondary,
                    onClick = onTryClick
                )
            }
        }

        Box(
            modifier = Modifier
                .weight(1f)
                .height(400.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(GlassFill7)
                .border(1.dp, StrokeDefault12, RoundedCornerShape(24.dp))
        ) {
            Column(
                modifier = Modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "Before / After",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary72
                )
                Text(
                    text = "Comparison",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextTertiary52
                )
            }
        }
    }
}

@Composable
private fun HowItWorksSection() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(32.dp)
    ) {
        Text(
            text = "How it works",
            style = MaterialTheme.typography.headlineLarge,
            color = TextPrimary
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            HowItWorksCard(
                title = "Select",
                description = "Draw on areas to remove.",
                modifier = Modifier.weight(1f)
            )
            HowItWorksCard(
                title = "Vanish",
                description = "AI removes instantly.",
                modifier = Modifier.weight(1f)
            )
            HowItWorksCard(
                title = "Download",
                description = "Get your clean image.",
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
private fun HowItWorksCard(
    title: String,
    description: String,
    modifier: Modifier = Modifier
) {
    GlassCard(
        modifier = modifier,
        contentPadding = PaddingValues(24.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(GlassFill6)
                    .border(1.dp, StrokeDefault12, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "●",
                    style = MaterialTheme.typography.headlineMedium,
                    color = AuroraCyan
                )
            }
            Text(
                text = title,
                style = MaterialTheme.typography.headlineSmall,
                color = TextPrimary
            )
            Text(
                text = description,
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary62
            )
        }
    }
}

@Composable
private fun WhyVanishSection() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(32.dp)
    ) {
        Text(
            text = "Why Vanish",
            style = MaterialTheme.typography.headlineLarge,
            color = TextPrimary
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            WhyVanishCard(
                title = "Zero Artifacts",
                description = "Clean removal with no visible traces.",
                modifier = Modifier.weight(1f)
            )
            WhyVanishCard(
                title = "No Manual Cleanup",
                description = "AI handles everything automatically.",
                modifier = Modifier.weight(1f)
            )
            WhyVanishCard(
                title = "Realistic Fill",
                description = "Intelligent background reconstruction.",
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
private fun WhyVanishCard(
    title: String,
    description: String,
    modifier: Modifier = Modifier
) {
    GlassCard(
        modifier = modifier,
        contentPadding = PaddingValues(24.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.headlineSmall,
                color = TextPrimary
            )
            Text(
                text = description,
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary62
            )
        }
    }
}

@Composable
private fun LiveDemoSection(onUploadClick: () -> Unit, isLoading: Boolean) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text(
            text = "Live demo",
            style = MaterialTheme.typography.headlineLarge,
            color = TextPrimary
        )
        GlassCard(
            modifier = Modifier.fillMaxWidth(),
            contentPadding = PaddingValues(48.dp)
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .clip(CircleShape)
                        .background(GlassFill6)
                        .border(1.dp, StrokeDefault12, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "📷",
                        style = MaterialTheme.typography.headlineLarge
                    )
                }
                Text(
                    text = "Upload an image",
                    style = MaterialTheme.typography.headlineSmall,
                    color = TextPrimary
                )
                Text(
                    text = "Drag and drop or click to select (Max 50MB)",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary62
                )
                Spacer(modifier = Modifier.height(8.dp))
                GlassButton(
                    text = if (isLoading) "Uploading..." else "Select Image",
                    variant = ButtonVariant.Primary,
                    onClick = onUploadClick
                )
                if (isLoading) {
                    Spacer(modifier = Modifier.height(16.dp))
                    CircularProgressIndicator(color = AuroraCyan)
                }
            }
        }
    }
}

@Composable
private fun CTASection(onStartClick: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Text(
            text = "Ready to remove the unnecessary?",
            style = MaterialTheme.typography.headlineMedium,
            color = TextPrimary
        )
        GlassButton(
            text = "Start Vanish AI",
            variant = ButtonVariant.Primary,
            onClick = onStartClick
        )
    }
}

@Composable
private fun Footer() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "VANISH AI",
                    style = MaterialTheme.typography.headlineSmall,
                    color = TextPrimary
                )
                Text(
                    text = "AI-powered object removal with zero residue.",
                    style = MaterialTheme.typography.bodySmall,
                    color = TextSecondary62
                )
            }
            Row(
                horizontalArrangement = Arrangement.spacedBy(32.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Product",
                        style = MaterialTheme.typography.labelMedium,
                        color = TextTertiary52
                    )
                    Text(
                        text = "Features",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary72
                    )
                    Text(
                        text = "Pricing",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary72
                    )
                    Text(
                        text = "API",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary72
                    )
                }
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Company",
                        style = MaterialTheme.typography.labelMedium,
                        color = TextTertiary52
                    )
                    Text(
                        text = "About",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary72
                    )
                    Text(
                        text = "Blog",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary72
                    )
                    Text(
                        text = "Contact",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary72
                    )
                }
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Legal",
                        style = MaterialTheme.typography.labelMedium,
                        color = TextTertiary52
                    )
                    Text(
                        text = "Privacy",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary72
                    )
                    Text(
                        text = "Terms",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary72
                    )
                }
            }
        }
        Text(
            text = "© 2026 Vanish AI. All rights reserved.",
            style = MaterialTheme.typography.bodySmall,
            color = TextTertiary52,
            modifier = Modifier.fillMaxWidth()
        )
    }
}

