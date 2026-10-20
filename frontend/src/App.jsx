import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RobotProvider } from './context/RobotContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Page Imports
import Dashboard from './pages/Dashboard';
import Robot from './pages/Robot';
import Tasks from './pages/Tasks';
import Pallets from './pages/Pallets';
import Warehouse from './pages/Warehouse';
import Map from './pages/Map';
import Navigation from './pages/Navigation';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Login from './pages/Login';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

// Layout wrapper for authenticated pages
const AppLayout = ({ children, adminOnly = false }) => {
  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <div className="flex h-screen w-screen overflow-hidden bg-industrial-950 text-industrial-100">
        {/* Permanent Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <RobotProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. First Page is Login Page */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            {/* Public Pages: About and Contact remain same */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* 2. After Login: Home Page (replaces Dashboard) */}
            <Route
              path="/home"
              element={
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              }
            />
            {/* Backward-compatibility alias for /dashboard */}
            <Route path="/dashboard" element={<Navigate to="/home" replace />} />

            {/* 2. Robot Page */}
            <Route
              path="/robots"
              element={
                <AppLayout>
                  <Robot />
                </AppLayout>
              }
            />

            {/* 3. Task Page */}
            <Route
              path="/tasks"
              element={
                <AppLayout>
                  <Tasks />
                </AppLayout>
              }
            />

            {/* 4. Pallet Page */}
            <Route
              path="/pallets"
              element={
                <AppLayout>
                  <Pallets />
                </AppLayout>
              }
            />

            {/* 5. Warehouse Page */}
            <Route
              path="/warehouse"
              element={
                <AppLayout>
                  <Warehouse />
                </AppLayout>
              }
            />

            {/* 6. Map Page */}
            <Route
              path="/map"
              element={
                <AppLayout>
                  <Map />
                </AppLayout>
              }
            />

            {/* 7. Navigation Page */}
            <Route
              path="/navigation"
              element={
                <AppLayout>
                  <Navigation />
                </AppLayout>
              }
            />

            {/* 8. Report Page */}
            <Route
              path="/reports"
              element={
                <AppLayout>
                  <Reports />
                </AppLayout>
              }
            />

            {/* 9. Alert Page */}
            <Route
              path="/alerts"
              element={
                <AppLayout>
                  <Alerts />
                </AppLayout>
              }
            />

            {/* 10. Setting Page */}
            <Route
              path="/settings"
              element={
                <AppLayout>
                  <Settings />
                </AppLayout>
              }
            />

            {/* 11. Admin Panel (Admin / Boss only) */}
            <Route
              path="/admin"
              element={
                <AppLayout adminOnly={true}>
                  <Admin />
                </AppLayout>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </RobotProvider>
    </AuthProvider>
  );
}

export default App;
