package spog.krsna.vanishai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import spog.krsna.vanishai.ui.components.AuroraBackdrop
import spog.krsna.vanishai.ui.components.ButtonVariant
import spog.krsna.vanishai.ui.components.GlassButton
import spog.krsna.vanishai.ui.components.GlassCard
import spog.krsna.vanishai.ui.components.Pill
import spog.krsna.vanishai.ui.components.StatusDot
import spog.krsna.vanishai.ui.theme.AuroraCyan
import spog.krsna.vanishai.ui.theme.AuroraGreen
import spog.krsna.vanishai.ui.theme.AuroraViolet
import spog.krsna.vanishai.ui.theme.GlassActive12
import spog.krsna.vanishai.ui.theme.GlassFill6
import spog.krsna.vanishai.ui.theme.GlassFill7
import spog.krsna.vanishai.ui.theme.GlassHoverState8
import spog.krsna.vanishai.ui.theme.GlassTableHeader5
import spog.krsna.vanishai.ui.theme.InkBase
import spog.krsna.vanishai.ui.theme.StatusDanger
import spog.krsna.vanishai.ui.theme.StrokeDefault12
import spog.krsna.vanishai.ui.theme.StrokeDefault14
import spog.krsna.vanishai.ui.theme.StrokeStrong16
import spog.krsna.vanishai.ui.theme.StrokeSubtle10
import spog.krsna.vanishai.ui.theme.TextPrimary
import spog.krsna.vanishai.ui.theme.TextSecondary56
import spog.krsna.vanishai.ui.theme.TextSecondary62
import spog.krsna.vanishai.ui.theme.TextSecondary70
import spog.krsna.vanishai.ui.theme.TextSecondary72
import spog.krsna.vanishai.ui.theme.TextSecondary86
import spog.krsna.vanishai.ui.theme.TextTertiary52

data class Stat(
    val label: String,
    val value: String,
    val delta: String,
    val trend: StatTrend
)

enum class StatTrend { Up, Down }

data class ContentRow(
    val title: String,
    val platform: String,
    val views: String,
    val engagement: String,
    val revenue: String
)

data class Transaction(
    val title: String,
    val meta: String,
    val state: TransactionState
)

enum class TransactionState { Info, Success, Danger }

private val stats = listOf(
    Stat("FOLLOWERS", "218,430", "+3.2% this week", StatTrend.Up),
    Stat("VIEWS", "4.82M", "+11.4% this week", StatTrend.Up),
    Stat("ENGAGEMENT", "6.8%", "-0.4% this week", StatTrend.Down),
    Stat("REVENUE", "$18,920", "+5.1% this week", StatTrend.Up)
)

private val topContent = listOf(
    ContentRow("30s Hook Formula (that actually converts)", "YouTube", "812K", "7.9%", "$3,420"),
    ContentRow("Editing stack: 5 settings that change everything", "TikTok", "1.34M", "9.1%", "$2,180"),
    ContentRow("Brand deals: pricing without sounding insecure", "Instagram", "522K", "6.4%", "$1,120"),
    ContentRow("The analytics mistake creators keep repeating", "YouTube", "403K", "5.8%", "$890")
)

private val transactions = listOf(
    Transaction("Transfer sent for processing", "Due in 08:00", TransactionState.Info),
    Transaction("Brand deal approved", "Paid in 2 days", TransactionState.Success),
    Transaction("Fee applied", "Settlement updated", TransactionState.Danger)
)

private val viewsSeries = listOf(12, 18, 14, 22, 26, 20, 28, 34, 30, 38, 44, 40)

@Composable
fun DashboardScreen(modifier: Modifier = Modifier) {
    Box(modifier = modifier.fillMaxSize()) {
        // Backdrop renders once at root level
        AuroraBackdrop()
        
        Scaffold(
            modifier = Modifier
                .fillMaxSize(),
            containerColor = Color.Transparent // Transparent to show backdrop
        ) { paddingValues ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 20.dp),
                contentPadding = paddingValues
            ) {
                item(key = "topbar") {
                    TopBar()
                    Spacer(modifier = Modifier.height(20.dp))
                }
                
                item(key = "header") {
                    DashboardHeader()
                    Spacer(modifier = Modifier.height(24.dp))
                }

                item(key = "stats") {
                    StatsGrid()
                    Spacer(modifier = Modifier.height(24.dp))
                }

                item(key = "charts") {
                    ChartsRow()
                    Spacer(modifier = Modifier.height(24.dp))
                }

                item(key = "table") {
                    TableSection()
                    Spacer(modifier = Modifier.height(32.dp))
                }
            }
        }
    }
}

@Composable
private fun TopBar() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(GlassFill7) // bg-white/7
                    .border(1.dp, StrokeDefault12, CircleShape), // border-white/12
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .background(AuroraCyan, CircleShape) // bg-aurora-cyan
                )
            }
            Column {
                Text(
                    text = "CreatorIQ",
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold),
                    color = TextPrimary // text-white/92
                )
                Text(
                    text = "Analytics Platform",
                    style = MaterialTheme.typography.labelSmall,
                    color = TextTertiary52 // text-white/52
                )
            }
        }

        GlassButton(
            text = "Connect",
            variant = ButtonVariant.Primary,
            onClick = { }
        )
    }
}

@Composable
private fun DashboardHeader() {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = "CREATOR DASHBOARD",
            style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 1.2.sp),
            color = TextTertiary52 // text-white/52
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Achieve your goals, effortlessly.",
            style = MaterialTheme.typography.displaySmall.copy(
                fontSize = 32.sp,
                fontWeight = FontWeight.SemiBold
            ),
            color = TextPrimary // text-white/92
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "One surface for growth, revenue, and content performance. Clean numbers. No noise.",
            style = MaterialTheme.typography.bodySmall,
            color = TextSecondary62 // text-white/62
        )
        Spacer(modifier = Modifier.height(16.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Pill(text = "Weekly", active = true)
            Pill(text = "Monthly")
            Pill(text = "Yearly")
        }
    }
}

@Composable
private fun StatsGrid() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(16.dp) // gap-4
    ) {
        stats.chunked(2).forEach { rowStats ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp) // gap-4
            ) {
                rowStats.forEach { stat ->
                    StatCard(stat = stat, modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
private fun StatCard(stat: Stat, modifier: Modifier = Modifier) {
    GlassCard(
        modifier = modifier,
        contentPadding = PaddingValues(20.dp) // p-5
    ) {
        Column(modifier = Modifier.fillMaxWidth()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column {
                    Text(
                        text = stat.label,
                        style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 1.sp),
                        color = TextTertiary52 // text-white/52
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = stat.value,
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontSize = 24.sp,
                            fontWeight = FontWeight.SemiBold
                        ),
                        color = TextPrimary // text-white/92
                    )
                }
                Box(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(
                            if (stat.trend == StatTrend.Up)
                                AuroraGreen.copy(alpha = 0.12f) // bg-aurora-green/12
                            else
                                AuroraViolet.copy(alpha = 0.12f) // bg-aurora-violet/12
                        )
                        .border(
                            width = 1.dp,
                            color = if (stat.trend == StatTrend.Up)
                                AuroraGreen.copy(alpha = 0.30f) // border-aurora-green/30
                            else
                                AuroraViolet.copy(alpha = 0.30f), // border-aurora-violet/30
                            shape = CircleShape
                        )
                        .padding(horizontal = 12.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = if (stat.trend == StatTrend.Up) "↗" else "↘",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextSecondary86 // text-white/86
                    )
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = stat.delta,
                style = MaterialTheme.typography.labelSmall,
                color = TextSecondary56 // text-white/56
            )
        }
    }
}

@Composable
private fun ChartsRow() {
    Column(verticalArrangement = Arrangement.spacedBy(24.dp)) { // gap-6
        ViewsChart()
        TransactionsCard()
    }
}

@Composable
private fun ViewsChart() {
    GlassCard(contentPadding = PaddingValues(24.dp)) { // p-6
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "Views",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold),
                        color = TextPrimary // text-white/92
                    )
                    Text(
                        text = "Last 12 weeks",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextSecondary56 // text-white/56
                    )
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    LegendItem("Total", AuroraViolet)
                    LegendItem("New", AuroraCyan)
                }
            }
            Spacer(modifier = Modifier.height(20.dp))
            BarChart(data = viewsSeries)
            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Week 1",
                    style = MaterialTheme.typography.labelSmall,
                    color = TextTertiary52 // text-white/52
                )
                Text(
                    text = "Week 12",
                    style = MaterialTheme.typography.labelSmall,
                    color = TextTertiary52 // text-white/52
                )
            }
        }
    }
}

@Composable
private fun LegendItem(label: String, color: Color) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .clip(CircleShape)
            .background(GlassFill6) // bg-white/6
            .border(1.dp, StrokeDefault12, CircleShape) // border-white/12
            .padding(horizontal = 12.dp, vertical = 6.dp)
    ) {
        Box(
            modifier = Modifier
                .size(8.dp)
                .background(color, CircleShape)
        )
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = TextSecondary70 // text-white/70
        )
    }
}

@Composable
private fun BarChart(data: List<Int>) {
    val maxValue = data.maxOrNull() ?: 1
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(224.dp), // h-56 = 14rem = 224dp
        horizontalArrangement = Arrangement.spacedBy(4.dp),
        verticalAlignment = Alignment.Bottom
    ) {
        data.forEach { value ->
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight(value.toFloat() / maxValue)
                    .clip(RoundedCornerShape(12.dp))
                    .background(AuroraViolet.copy(alpha = 0.55f)) // from-aurora-violet/55
                    .border(
                        width = 1.dp,
                        color = Color.White.copy(alpha = 0.08f), // ring-white/8
                        shape = RoundedCornerShape(12.dp)
                    )
            )
        }
    }
}

@Composable
private fun TransactionsCard() {
    GlassCard(contentPadding = PaddingValues(24.dp)) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "New transactions",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold),
                        color = TextPrimary // text-white/92
                    )
                    Text(
                        text = "Today",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextSecondary56 // text-white/56
                    )
                }
                Pill(text = "Live", active = true)
            }
            Spacer(modifier = Modifier.height(20.dp))
            transactions.forEachIndexed { index, transaction ->
                if (index > 0) Spacer(modifier = Modifier.height(12.dp))
                TransactionItem(transaction)
            }
        }
    }
}

@Composable
private fun TransactionItem(transaction: Transaction) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .background(GlassFill6) // bg-white/6
            .border(1.dp, StrokeSubtle10, RoundedCornerShape(24.dp)) // border-white/10
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = transaction.title,
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
                    color = TextSecondary86 // text-white/86
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = transaction.meta,
                    style = MaterialTheme.typography.labelSmall,
                    color = TextTertiary52 // text-white/52
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            StatusDot(
                color = when (transaction.state) {
                    TransactionState.Success -> AuroraGreen
                    TransactionState.Danger -> StatusDanger
                    TransactionState.Info -> AuroraCyan
                },
                size = 10.dp
            )
        }
    }
}

@Composable
private fun TableSection() {
    GlassCard(contentPadding = PaddingValues(24.dp)) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "Top content",
                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold),
                        color = TextPrimary // text-white/92
                    )
                    Text(
                        text = "Best performing posts across platforms",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextSecondary56 // text-white/56
                    )
                }
                GlassButton(
                    text = "Export",
                    variant = ButtonVariant.Secondary,
                    onClick = { }
                )
            }
            Spacer(modifier = Modifier.height(20.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(GlassTableHeader5) // bg-white/5
                    .padding(horizontal = 20.dp, vertical = 12.dp)
            ) {
                TableHeader()
            }

            Spacer(modifier = Modifier.height(8.dp))

            topContent.forEach { row ->
                TableRow(row)
                Spacer(modifier = Modifier.height(4.dp))
            }
        }
    }
}

@Composable
private fun TableHeader() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "TITLE",
            style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 1.sp),
            color = TextTertiary52, // text-white/52
            modifier = Modifier.weight(2.2f)
        )
        Text(
            text = "PLATFORM",
            style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 1.sp),
            color = TextTertiary52,
            modifier = Modifier.weight(1f)
        )
        Text(
            text = "VIEWS",
            style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 1.sp),
            color = TextTertiary52,
            textAlign = TextAlign.End,
            modifier = Modifier.weight(0.7f)
        )
        Text(
            text = "ENG.",
            style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 1.sp),
            color = TextTertiary52,
            textAlign = TextAlign.End,
            modifier = Modifier.weight(0.6f)
        )
        Text(
            text = "REV.",
            style = MaterialTheme.typography.labelSmall.copy(letterSpacing = 1.sp),
            color = TextTertiary52,
            textAlign = TextAlign.End,
            modifier = Modifier.weight(0.7f)
        )
    }
}

@Composable
private fun TableRow(row: ContentRow) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = row.title,
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary86, // text-white/86
                modifier = Modifier.weight(2.2f)
            )
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(CircleShape)
                    .background(GlassFill6) // bg-white/6
                    .border(1.dp, StrokeDefault12, CircleShape) // border-white/12
                    .padding(horizontal = 12.dp, vertical = 4.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = row.platform,
                    style = MaterialTheme.typography.labelSmall,
                    color = TextSecondary70 // text-white/70
                )
            }
            Text(
                text = row.views,
                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium),
                color = TextSecondary86, // text-white/86
                textAlign = TextAlign.End,
                modifier = Modifier.weight(0.7f)
            )
            Text(
                text = row.engagement,
                style = MaterialTheme.typography.bodySmall,
                color = TextSecondary72, // text-white/72
                textAlign = TextAlign.End,
                modifier = Modifier.weight(0.6f)
            )
            Text(
                text = row.revenue,
                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Medium),
                color = TextSecondary86, // text-white/86
                textAlign = TextAlign.End,
                modifier = Modifier.weight(0.7f)
            )
        }
    }
}

