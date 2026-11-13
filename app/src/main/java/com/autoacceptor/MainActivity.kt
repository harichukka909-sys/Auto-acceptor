package com.autoacceptor

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.autoacceptor.ui.theme.AutoAcceptorsTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            AutoAcceptorsTheme {
                AutoAcceptRideScreen()
            }
        }
    }
}

@Composable
fun AutoAcceptRideScreen() {
    var isAutoAcceptEnabled by remember { mutableStateOf(true) }
    var activeRide by remember { mutableStateOf("Ride request • 1.2 km away") }
    var nearbyDrivers by remember { mutableStateOf("3 drivers online") }

    val gradient = Brush.verticalGradient(
        listOf(
            Color(0xFF0A1128),
            Color(0xFF112D5A),
            Color(0xFF1D4ED8)
        )
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(gradient)
            .padding(20.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Auto Acceptor",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        color = Color.White,
                        fontSize = 30.sp,
                        fontWeight = FontWeight.Bold
                    )
                )
                Switch(
                    checked = isAutoAcceptEnabled,
                    onCheckedChange = { isAutoAcceptEnabled = it }
                )
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFF112D5A)
                )
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "Live status",
                        style = MaterialTheme.typography.labelLarge.copy(color = Color(0xFF93C5FD))
                    )
                    Text(
                        text = if (isAutoAcceptEnabled) "Enabled" else "Paused",
                        style = MaterialTheme.typography.headlineSmall.copy(
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Text(
                        text = "Monitored platforms: Rapido • Uber • Ola",
                        style = MaterialTheme.typography.bodyMedium.copy(color = Color(0xFFDCEAFE))
                    )
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFFE0F2FE)
                )
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "Nearest ride",
                        style = MaterialTheme.typography.labelLarge.copy(color = Color(0xFF1E3A8A))
                    )
                    Text(
                        text = activeRide,
                        style = MaterialTheme.typography.titleLarge.copy(
                            color = Color(0xFF0F172A),
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Text(
                        text = "Pickup: 14 min • Rider rating: 4.9",
                        style = MaterialTheme.typography.bodyMedium.copy(color = Color(0xFF334155))
                    )
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(
                    containerColor = Color(0xFFDBEAFE)
                )
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "Driver network",
                        style = MaterialTheme.typography.labelLarge.copy(color = Color(0xFF1E3A8A))
                    )
                    Text(
                        text = nearbyDrivers,
                        style = MaterialTheme.typography.titleLarge.copy(
                            color = Color(0xFF0F172A),
                            fontWeight = FontWeight.Bold
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            Button(
                onClick = {
                    activeRide = "Ride request • 0.8 km away"
                    nearbyDrivers = "4 drivers online"
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF22C55E)
                ),
                shape = RoundedCornerShape(18.dp)
            ) {
                Text(
                    text = if (isAutoAcceptEnabled) "Accept nearest trip" else "Resume auto accept",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            }
        }
    }
}
