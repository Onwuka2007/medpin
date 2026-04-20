import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import FindPharmaciesPage from "./pages/FindPharmaciesPage.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import PharmacyLayout from "./components/pharmacy-dashboard/PharmacyLayout.jsx";
import PharmacyDashboardPage from "./pages/PharmacyDashboardPage.jsx";
import PharmacyLoginPage from "./pages/PharmacyLoginPage.jsx";
import PharmacyRegisterPage from "./pages/PharmacyRegisterPage.jsx";
import PublicLayout from "./components/layout/PublicLayout.jsx";
import NotFound from "./pages/NotFound.jsx";


export default function App() {
  return (
    <Routes>
      {/* w/o navbar */}
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />

      {/* with navbar */}
      <Route element={<PublicLayout />}>
        <Route path="/pharmacies" element={<FindPharmaciesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/pharmacy/login" element={<PharmacyLoginPage />} />
        <Route path="/pharmacy/register" element={<PharmacyRegisterPage />} />
        <Route path="/partners" element={<PharmacyRegisterPage />} />
      </Route>

      <Route
        path="/pharmacy/dashboard"
        element={
          <PharmacyLayout>
            <PharmacyDashboardPage />
          </PharmacyLayout>
        }
      />


      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
