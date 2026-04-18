import { Route, Routes } from "react-router-dom";
import HomePage              from "./pages/HomePage.jsx";
import SearchPage            from "./pages/SearchPage.jsx";
import FindPharmaciesPage    from "./pages/FindPharmaciesPage.jsx";
import HowItWorksPage        from "./pages/HowItWorksPage.jsx";
import PharmacyLayout        from "./components/pharmacy-dashboard/PharmacyLayout.jsx";
import PharmacyDashboardPage from "./pages/PharmacyDashboardPage.jsx";
import PharmacyLoginPage     from "./pages/PharmacyLoginPage.jsx";
import PharmacyRegisterPage  from "./pages/PharmacyRegisterPage.jsx";


export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/"           element={<HomePage />} />
      <Route path="/search"     element={<SearchPage />} />
      <Route path="/pharmacies"    element={<FindPharmaciesPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />

      {/* Pharmacy partner auth */}
      <Route path="/pharmacy/login"    element={<PharmacyLoginPage />} />
      <Route path="/pharmacy/register" element={<PharmacyRegisterPage />} />
      <Route path="/partners"          element={<PharmacyRegisterPage />} />

      {/* Pharmacy dashboard - all tabs under one route */}
      <Route
        path="/pharmacy/dashboard"
        element={
          <PharmacyLayout>
            <PharmacyDashboardPage />
          </PharmacyLayout>
        }
      />
    </Routes>
  );
}
