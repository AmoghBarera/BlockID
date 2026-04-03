import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { AuthProvider } from "./context/AuthContext";
import { LandingPage } from "./pages/LandingPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { OrganizationDashboard } from "./pages/org/OrganizationDashboard";
import { UserDashboard } from "./pages/user/UserDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/organization" element={<OrganizationDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </AppShell>
      </AuthProvider>
    </BrowserRouter>
  );
}
