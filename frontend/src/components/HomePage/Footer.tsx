import { Recycle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Recycle className="w-6 h-6 text-green-500" />
              <span className="font-bold text-lg">{t("common.brandName")}</span>
            </div>
            <p className="text-gray-400">
              {t("about.missionText")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.platform")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => navigate("/about")}>{t("footer.aboutUs")}</span>
              </li>
              <li>
                <span className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t("footer.howItWorks")}</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => navigate("/faq")}>{t("common.faq")}</span>
              </li>
              <li>
                <a href="mailto:misi@protonmail.ch" className="hover:text-green-400 cursor-pointer transition-colors">{t("footer.contactUs")}</a>
              </li>
              <li>
                <span className="hover:text-green-400 cursor-pointer transition-colors" onClick={() => navigate("/terms")}>{t("footer.termsOfService")}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 {t("common.brandName")}. {t("footer.madeWithLove")}</p>
        </div>
      </div>
    </footer>
  );
};
