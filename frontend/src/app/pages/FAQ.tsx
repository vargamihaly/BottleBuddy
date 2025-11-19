import {Button} from "@/shared/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/shared/ui/card";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/shared/ui/accordion";
import {useNavigate} from "react-router-dom";
import {ArrowLeft, HelpCircle, Recycle} from "lucide-react";
import {useTranslation} from "react-i18next";

const FAQ = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const faqKeys = [
    'payment',
    'split',
    'risk',
    'meetings',
    'agreement',
    'safety',
    'create',
    'cancel',
    'rating',
    'bottles'
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
              {t("faq.backToHome")}
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
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            {t("faq.title")}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("faq.title")}
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            {t("faq.subtitle")}
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqKeys.map((key, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 rounded-lg bg-white/90 backdrop-blur-sm hover:border-green-300 transition-colors px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <div className="flex items-start gap-3 w-full">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      Q
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {t(`faq.questions.${key}.question`)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <div className="text-base text-gray-700 leading-relaxed pl-9">
                    {t(`faq.questions.${key}.answer`)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Additional Help */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-2xl">{t("faq.needHelp")}</CardTitle>
                <CardDescription className="text-white/90 text-base">
                  {t("faq.subtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate("/about")}
                  >
                    {t("footer.aboutUs")}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 border-white text-white hover:bg-white/20"
                    onClick={() => window.location.href = "mailto:misi@protonmail.ch"}
                  >
                    {t("faq.contactSupport")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-white/60 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="container mx-auto max-w-4xl text-center text-gray-600 text-sm">
          <p>&copy; 2025 {t("common.brandName")}. {t("footer.madeWithLove")}</p>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
