package com.nammaride.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
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
import com.nammaride.app.ui.theme.NammaRideTheme

data class DriverProfile(
    val id: String = "driver_101",
    val fullName: String = "Ravi Kumar",
    val phone: String = "+919876543210",
    val serviceArea: String = "Banaswadi",
    val isOnline: Boolean = true,
    val rating: Double = 4.9
)

data class Trip(
    val id: String,
    val customerName: String,
    val pickupAddress: String,
    val dropAddress: String,
    val fare: Int,
    val distanceKm: Double,
    val durationMin: Int,
    val status: String = "pending"
)

data class SummaryCard(
    val label: String,
    val value: String
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NammaRideTheme {
                Surface(color = MaterialTheme.colorScheme.background) {
                    NammaRideApp()
                }
            }
        }
    }
}

@Composable
fun NammaRideApp() {
    var loggedIn by remember { mutableStateOf(false) }
    var driver by remember { mutableStateOf(DriverProfile()) }
    var trips by remember {
        mutableStateOf(
            listOf(
                Trip("TN-101", "Nisha", "MG Road", "Whitefield", 420, 8.6, 22),
                Trip("TN-102", "Sanjay", "Banaswadi", "Indiranagar", 310, 6.2, 18),
                Trip("TN-103", "Asha", "Kalyan Nagar", "Koramangala", 520, 9.4, 26)
            )
        )
    }
    var enableAutoAccept by remember { mutableStateOf(true) }

    if (!loggedIn) {
        LoginScreen(
            onLogin = { phone, password ->
                if (phone.isNotBlank() && password.isNotBlank()) {
                    loggedIn = true
                }
            }
        )
        return
    }

    DriverDashboardScreen(
        driver = driver,
        trips = trips,
        autoAcceptEnabled = enableAutoAccept,
        onToggleOnline = {
            driver = driver.copy(isOnline = !driver.isOnline)
        },
        onToggleAutoAccept = { enableAutoAccept = it },
        onAcceptTrip = { trip -> trips = trips.filterNot { it.id == trip.id } },
        onRejectTrip = { trip -> trips = trips.filterNot { it.id == trip.id } }
    )
}

@Composable
fun LoginScreen(onLogin: (String, String) -> Unit) {
    var phone by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(Color(0xFF09090B), Color(0xFF111827), Color(0xFF1F2937))
                )
            )
            .padding(20.dp),
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "NammaRide",
            color = Color(0xFFF7C35F),
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "Driver login",
            color = Color.White,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Phone number") }
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            modifier = Modifier.fillMaxWidth(),
            label = { Text("Password") }
        )

        Spacer(modifier = Modifier.height(20.dp))

        Button(
            onClick = { onLogin(phone, password) },
            modifier = Modifier.fillMaxWidth(),
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF59E0B)),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text(text = "Login", color = Color.White, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun DriverDashboardScreen(
    driver: DriverProfile,
    trips: List<Trip>,
    autoAcceptEnabled: Boolean,
    onToggleOnline: () -> Unit,
    onToggleAutoAccept: (Boolean) -> Unit,
    onAcceptTrip: (Trip) -> Unit,
    onRejectTrip: (Trip) -> Unit
) {
    val summary = listOf(
        SummaryCard("Trips", "148"),
        SummaryCard("Earnings", "₹3,420"),
        SummaryCard("Completed", "27"),
        SummaryCard("Cancelled", "3")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(Color(0xFF09090B), Color(0xFF111827), Color(0xFF1F2937))
                )
            )
            .padding(20.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(text = "Welcome back", color = Color(0xFFD1D5DB), fontSize = 14.sp)
                Text(text = driver.fullName, color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold)
            }

            Button(
                onClick = onToggleOnline,
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (driver.isOnline) Color(0xFFF59E0B) else Color(0xFF374151)
                ),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text(text = if (driver.isOnline) "Online" else "Offline", color = Color.White, fontWeight = FontWeight.Bold)
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            summary.forEach { item ->
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF111827)),
                    shape = RoundedCornerShape(18.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(item.value, color = Color(0xFFF7C35F), fontWeight = FontWeight.Bold, fontSize = 20.sp)
                        Text(item.label, color = Color(0xFFE5E7EB), fontSize = 12.sp)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF111827)),
            shape = RoundedCornerShape(20.dp)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Auto Accept", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Switch(
                        checked = autoAcceptEnabled,
                        onCheckedChange = onToggleAutoAccept
                    )
                }
                Text("Minimum fare: ₹200", color = Color(0xFFE5E7EB), modifier = Modifier.padding(top = 8.dp))
                Text("Maximum pickup distance: 8 km", color = Color(0xFFE5E7EB))
                Text("Preferred area: Banaswadi / HRBR", color = Color(0xFFE5E7EB))
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text("Incoming Requests", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 22.sp)

        Spacer(modifier = Modifier.height(12.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            items(trips) { trip ->
                TripCard(
                    trip = trip,
                    onAccept = { onAcceptTrip(trip) },
                    onReject = { onRejectTrip(trip) }
                )
            }
        }
    }
}

@Composable
fun TripCard(
    trip: Trip,
    onAccept: () -> Unit,
    onReject: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF111827)),
        shape = RoundedCornerShape(18.dp)
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(trip.customerName, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text("₹${trip.fare}", color = Color(0xFFF7C35F), fontWeight = FontWeight.Bold, fontSize = 18.sp)
            }

            Text("Pickup: ${trip.pickupAddress}", color = Color(0xFFD1D5DB), modifier = Modifier.padding(top = 8.dp))
            Text("Drop: ${trip.dropAddress}", color = Color(0xFFD1D5DB))
            Text("Distance: ${trip.distanceKm} km • ${trip.durationMin} min", color = Color(0xFFD1D5DB))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = onAccept,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF59E0B)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.Check, contentDescription = null)
                    Spacer(modifier = Modifier.padding(start = 6.dp))
                    Text("Accept")
                }

                Button(
                    onClick = onReject,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF374151)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.Close, contentDescription = null)
                    Spacer(modifier = Modifier.padding(start = 6.dp))
                    Text("Reject")
                }
            }
        }
    }
}
