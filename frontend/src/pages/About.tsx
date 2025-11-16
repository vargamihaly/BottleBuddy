import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Recycle, Heart, Users, Leaf, ArrowLeft, Shield, Zap, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: <Recycle className="w-8 h-8 text-green-600" />,
      titleKey: "about.feature1.title",
      descriptionKey: "about.feature1.description"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      titleKey: "about.feature2.title",
      descriptionKey: "about.feature2.description"
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-700" />,
      titleKey: "about.feature3.title",
      descriptionKey: "about.feature3.description"
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      titleKey: "about.feature4.title",
      descriptionKey: "about.feature4.description"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      titleKey: "about.feature5.title",
      descriptionKey: "about.feature5.description"
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      titleKey: "about.feature6.title",
      descriptionKey: "about.feature6.description"
    }
  ];

  const stats = [
    { value: "1000+", labelKey: "about.stats.bottlesRecycled" },
    { value: "500+", labelKey: "about.stats.activeUsers" },
    { value: "50+", labelKey: "about.stats.cities" },
    { value: "95%", labelKey: "about.stats.userSatisfaction" }
  ];

  const steps = [
    { titleKey: "about.step1.title", descriptionKey: "about.step1.description", colorClass: "bg-green-600" },
    { titleKey: "about.step2.title", descriptionKey: "about.step2.description", colorClass: "bg-blue-600" },
    { titleKey: "about.step3.title", descriptionKey: "about.step3.description", colorClass: "bg-purple-600" },
    { titleKey: "about.step4.title", descriptionKey: "about.step4.description", colorClass: "bg-orange-600" },
    { titleKey: "about.step5.title", descriptionKey: "about.step5.description", colorClass: "bg-indigo-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:bg-green-100"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("about.backToHome")}
            </Button>
            <div className="flex items-center gap-2">
              <Recycle className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {t("common.brandName")}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            {t("about.madeWithLove")}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("about.title")}
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">{t("about.whyChoose")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("about.whyChooseSubtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-green-300 transition-all hover:shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{t(feature.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{t(feature.descriptionKey)}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">{t("about.mission")}</h2>
          <p className="text-xl leading-relaxed mb-8">
            {t("about.missionDescription")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              {t("about.cta.getStarted")}
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">{t("about.howItWorksTitle")}</h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${step.colorClass} text-white flex items-center justify-center text-xl font-bold`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{t(step.titleKey)}</h3>
                  <p className="text-gray-600">
                    {t(step.descriptionKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Highlight Box */}
          <div className="mt-12 bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-2xl">
                💡
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-800 mb-2">{t("about.paymentHighlight.title")}</h4>
                <p className="text-gray-700 leading-relaxed">
                  {t("about.paymentHighlight.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{t("about.cta.title")}</h2>
          <p className="text-lg text-gray-600 mb-8">
            {t("about.cta.description")}
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            {t("about.cta.joinToday")}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
