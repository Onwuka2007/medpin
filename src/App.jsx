import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import FindPharmaciesPage from "./pages/FindPharmaciesPage.jsx";
import HowItWorksPage from "./pages/HowItWorksPage.jsx";
import PharmacyLayout from "./components/pharmacy-dashboard/PharmacyLayout.jsx";
import PharmacyDashboardPage from "./pages/PharmacyDashboardPage.jsx";
import PharmacyLoginPage from "./pages/PharmacyLoginPage.jsx";
import PharmacyPendingPage from "./pages/PharmacyPendingPage.jsx";
import PharmacyRejectedPage from "./pages/PharmacyRejectedPage.jsx";
import PharmacyRegisterPage from "./pages/PharmacyRegisterPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import PublicLayout from "./components/layout/PublicLayout.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      {/* w/o navbar */}
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/pharmacy/register" element={<PharmacyRegisterPage />} />
      <Route path="/partners" element={<PharmacyRegisterPage />} />
      <Route path="/pharmacy/login" element={<PharmacyLoginPage />} />
      <Route path="/pharmacy/pending" element={<PharmacyPendingPage />} />
      <Route path="/pharmacy/rejected" element={<PharmacyRejectedPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/pharmacies/pending" element={<AdminDashboardPage />} />

      {/* with navbar */}
      <Route element={<PublicLayout />}>
        <Route path="/pharmacies" element={<FindPharmaciesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
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
