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
              Az újrahasznosítást nyereségessé és közösségivé tesszük Magyarországon.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => navigate("/about")}>Rólunk</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Működés</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Biztonsági irányelvek</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Árazás</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Közösség</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-green-400 cursor-pointer transition-colors">Felhasználói történetek</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Környezeti hatás</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Helyi partnerek</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Támogatás</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => navigate("/faq")}>FAQ</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Súgóközpont</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Kapcsolat</li>
              <li className="hover:text-green-400 cursor-pointer transition-colors">Felhasználási feltételek</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BottleBuddy. Szívvel-lélekkel 💚 Magyarországról.</p>
        </div>
      </div>
    </footer>
  );
};