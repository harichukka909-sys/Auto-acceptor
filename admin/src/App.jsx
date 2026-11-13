const drivers = [
  { name: 'Ravi Kumar', status: 'Online', trips: 148, earnings: 3420, area: 'Banaswadi', auto: 'Active' },
  { name: 'Karthik', status: 'Offline', trips: 96, earnings: 2140, area: 'HRBR', auto: 'Paused' },
  { name: 'Santhosh', status: 'Online', trips: 118, earnings: 2890, area: 'Kalyan Nagar', auto: 'Active' }
];

const trips = [
  { id: 'TRIP-1001', customer: 'Nisha', driver: 'Ravi Kumar', fare: 290, status: 'Pending' },
  { id: 'TRIP-1002', customer: 'Arjun', driver: 'Karthik', fare: 420, status: 'Accepted' },
  { id: 'TRIP-1003', customer: 'Meena', driver: 'Santhosh', fare: 510, status: 'Completed' }
];

export default function App() {
  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="brand">Smart Auto Trip</div>
        <nav>
          <span className="nav-item active">Dashboard</span>
          <span className="nav-item">Drivers</span>
          <span className="nav-item">Trips</span>
          <span className="nav-item">Areas</span>
          <span className="nav-item">Settings</span>
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="tiny-label">Operations overview</p>
            <h1>Fleet Dashboard</h1>
          </div>
          <button className="primary-btn">Export Report</button>
        </header>

        <section className="summary-grid">
          <div className="summary-card accent">
            <span>Total Drivers</span>
            <strong>128</strong>
          </div>
          <div className="summary-card">
            <span>Active Trips</span>
            <strong>46</strong>
          </div>
          <div className="summary-card">
            <span>Today Earnings</span>
            <strong>₹32,240</strong>
          </div>
          <div className="summary-card">
            <span>Cancelled</span>
            <strong>14</strong>
          </div>
        </section>

        <section className="table-panel">
          <div className="section-header">
            <h2>Driver Activity</h2>
            <span className="chip">Live</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Driver</th>
                <th>Status</th>
                <th>Trips</th>
                <th>Earnings</th>
                <th>Area</th>
                <th>Auto</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.name}>
                  <td>{driver.name}</td>
                  <td><span className={`status ${driver.status === 'Online' ? 'online' : 'offline'}`}>{driver.status}</span></td>
                  <td>{driver.trips}</td>
                  <td>₹{driver.earnings}</td>
                  <td>{driver.area}</td>
                  <td>{driver.auto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="table-panel">
          <div className="section-header">
            <h2>Recent Trips</h2>
            <span className="chip">Updated 2m ago</span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Customer</th>
                <th>Driver</th>
                <th>Fare</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td>{trip.id}</td>
                  <td>{trip.customer}</td>
                  <td>{trip.driver}</td>
                  <td>₹{trip.fare}</td>
                  <td><span className={`status ${trip.status.toLowerCase()}`}>{trip.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
