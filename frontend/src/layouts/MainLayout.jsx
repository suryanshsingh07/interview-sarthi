import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Banner */}
      <div className="bg-[#0B1331] text-white text-center py-2.5 px-4 text-sm font-medium relative z-[60] flex items-center justify-center gap-4">
        <span>Monsoon Sale! Let Confidence Rain with <span className="font-bold text-primary">6% Off</span>. Code: MONSOON6</span>
        <Link to="/register">
          <button className="bg-white/10 hover:bg-white/20 transition-colors px-3 py-1 rounded-md text-xs font-semibold">
            Claim Offer
          </button>
        </Link>
      </div>

      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
