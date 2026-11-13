import Header from "../components/navigation/Header";
import Footer from "../components/navigation/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
