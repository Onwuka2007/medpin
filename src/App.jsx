import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import PharmacyLayout from "./components/pharmacy-dashboard/PharmacyLayout.jsx";
import InventoryPage from "./components/pharmacy-dashboard/InventoryPage.jsx";
import OverviewPage from "./components/pharmacy-dashboard/OverviewPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchPage />} />

      <Route
        path="/pharmacy/dashboard"
        element={
          <PharmacyLayout>
            <OverviewPage />
          </PharmacyLayout>
        }
      />
      <Route
        path="/pharmacy/dashboard/inventory"
        element={
          <PharmacyLayout>
            <InventoryPage />
          </PharmacyLayout>
        }
      />
    </Routes>
  );
}
