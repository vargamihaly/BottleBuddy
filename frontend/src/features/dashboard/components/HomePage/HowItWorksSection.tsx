import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { useTranslation } from "react-i18next";

export const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">{t("howItWorks.title")}</h3>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {t("howItWorks.subtitle")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <CardTitle className="text-lg">{t("howItWorks.step1.title")}</CardTitle>
              <CardDescription className="text-sm">
                {t("howItWorks.step1.description")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <CardTitle className="text-lg">{t("howItWorks.step2.title")}</CardTitle>
              <CardDescription className="text-sm">
                {t("howItWorks.step2.description")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💵</span>
              </div>
              <CardTitle className="text-lg">{t("howItWorks.step3.title")}</CardTitle>
              <CardDescription className="text-sm">
                {t("howItWorks.step3.description")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">♻️</span>
              </div>
              <CardTitle className="text-lg">{t("howItWorks.step4.title")}</CardTitle>
              <CardDescription className="text-sm">
                {t("howItWorks.step4.description")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Key Point Highlight */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">{t("howItWorks.highlight.title")}</h4>
                <p className="text-white/90 text-sm leading-relaxed">
                  {t("howItWorks.highlight.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};