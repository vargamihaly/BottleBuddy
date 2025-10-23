import { Recycle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Recycle className="w-6 h-6 text-green-500" />
              <span className="font-bold text-lg">BottleBuddy</span>
            </div>
            <p className="text-gray-400">
              Making recycling profitable and community-driven across Hungary.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => navigate("/about")}>About Us</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>How it Works</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Safety Guidelines</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-green-400 cursor-pointer transition-colors">User Stories</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Environmental Impact</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Local Partners</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-green-400 cursor-pointer transition-colors">Help Center</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Contact Us</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BottleBuddy. Made with 💚 in Hungary.</p>
        </div>
      </div>
    </footer>
  );
};