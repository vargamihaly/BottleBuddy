import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Recycle } from "lucide-react";
import { useTranslation } from "react-i18next";

const TermsOfService = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const sections = [
        { id: 1, titleKey: "terms.section1.title", contentKey: "terms.section1.content" },
        { id: 2, titleKey: "terms.section2.title", contentKey: "terms.section2.content" },
        { id: 3, titleKey: "terms.section3.title", contentKey: "terms.section3.content" },
        { id: 4, titleKey: "terms.section4.title", contentKey: "terms.section4.content" },
        { id: 5, titleKey: "terms.section5.title", contentKey: "terms.section5.content" },
        { id: 6, titleKey: "terms.section6.title", contentKey: "terms.section6.content" },
        { id: 7, titleKey: "terms.section7.title", contentKey: "terms.section7.content" },
        { id: 8, titleKey: "terms.section8.title", contentKey: "terms.section8.content" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-gray-50">
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

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {t("terms.title")}
                    </h1>
                    <p className="text-gray-600">{t("terms.lastUpdated")}: 2025-01-09</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
                    {sections.map((section) => (
                        <div key={section.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {section.id}. {t(section.titleKey)}
                            </h2>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {t(section.contentKey)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button
                        size="lg"
                        onClick={() => navigate("/")}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    >
                        {t("about.backToHome")}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
