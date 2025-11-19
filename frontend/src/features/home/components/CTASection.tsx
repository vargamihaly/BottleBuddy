import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CTASectionProps {
  onDashboardClick: () => void;
}

export const CTASection = ({ onDashboardClick }: CTASectionProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-6">{t("homeSections.cta.title")}</h3>
        <p className="text-xl mb-8 opacity-90">
          {t("homeSections.cta.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <Button size="lg" variant="secondary" onClick={() => navigate("/create-listing")}>
                {t("homeSections.cta.listBottles")}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" onClick={onDashboardClick}>
                {t("homeSections.cta.viewDashboard")}
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
                {t("homeSections.cta.signUpFree")}
              </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate("/about")}>
                    {t("homeSections.cta.learnMore")}
                </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
