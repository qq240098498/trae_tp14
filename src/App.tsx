import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import HomePage from "@/pages/HomePage";
import PlayerRegisterPage from "@/pages/PlayerRegisterPage";
import CoachRegisterPage from "@/pages/CoachRegisterPage";
import CreateOrderPage from "@/pages/CreateOrderPage";
import MatchPage from "@/pages/MatchPage";
import OrderListPage from "@/pages/OrderListPage";
import OrderDetailPage from "@/pages/OrderDetailPage";
import ReviewPage from "@/pages/ReviewPage";
import CoachListPage from "@/pages/CoachListPage";
import CoachDetailPage from "@/pages/CoachDetailPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register/player" element={<PlayerRegisterPage />} />
            <Route path="/register/coach" element={<CoachRegisterPage />} />
            <Route path="/order/create" element={<CreateOrderPage />} />
            <Route path="/order/match" element={<MatchPage />} />
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/orders/:id/review" element={<ReviewPage />} />
            <Route path="/coaches" element={<CoachListPage />} />
            <Route path="/coaches/:id" element={<CoachDetailPage />} />
          </Routes>
        </main>
        <footer className="border-t border-white/5 py-6 mt-16">
          <div className="container mx-auto px-4 text-center text-sm text-cyber-text-muted">
            <p>© 2025 GameMate · 专业游戏陪玩平台</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}
