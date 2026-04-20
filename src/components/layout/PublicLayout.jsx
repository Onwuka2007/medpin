import { Outlet } from "react-router-dom";
import Navbar from "../hero/Navbar.jsx";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
