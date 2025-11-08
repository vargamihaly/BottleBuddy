import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { HelpCircle, ArrowLeft, Recycle } from "lucide-react";

const FAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "When do I get paid for my bottles?",
      answer: "You get paid immediately during the pickup! The volunteer pays you your agreed share upfront (for example, 25 HUF per bottle if you agreed on a 50/50 split). There's no need to meet again after the exchange."
    },
    {
      question: "How does the payment split work?",
      answer: "You decide the split when creating your listing (e.g., 50/50, 60/40, etc.). The volunteer pays you your portion upfront during pickup, then they return the bottles to get the full 50 HUF refund and keep their share. For example: if you have 100 bottles and agree on 50/50, the volunteer pays you 2,500 HUF during pickup, then gets 5,000 HUF from the store."
    },
    {
      question: "What if the volunteer doesn't return the bottles?",
      answer: "You've already received your payment upfront, so there's no risk to you! The volunteer is motivated to return the bottles because that's how they earn their portion of the refund. Our rating system helps build trust in the community."
    },
    {
      question: "Do I need to meet the volunteer twice?",
      answer: "No! You only meet once during pickup when you hand over the bottles and receive your payment. The volunteer handles returning the bottles on their own and keeps their share. It's one meeting, one payment, done."
    },
    {
      question: "How do we agree on the split?",
      answer: "When creating your listing, you set your preferred split (e.g., \"I want 25 HUF per bottle\"). Volunteers see this and can send a pickup request if they agree. You can also discuss and negotiate via the in-app messaging before accepting a request."
    },
    {
      question: "Is it safe to invite someone to my home?",
      answer: "Your safety is important! You can choose to meet at a public location instead of your home. Our platform includes user ratings and reviews so you can see other people's experiences. You can also chat with volunteers first to get comfortable before accepting a pickup request."
    },
    {
      question: "How do I create a bottle listing?",
      answer: "After signing in, click the \"List Your Bottles\" button on the home page or in the header. Enter how many bottles you have, your location, and your preferred split percentage. You can also add photos and additional details to help volunteers."
    },
    {
      question: "Can I cancel a pickup request?",
      answer: "Yes! Both the listing owner and the volunteer can cancel a pickup request before it's completed. If you're the owner, you can reject requests. If you're the volunteer, you can cancel your request. Just remember to communicate via the chat if there's a change of plans."
    },
    {
      question: "How does the rating system work?",
      answer: "After completing a pickup, both parties can rate each other on a scale of 1-5 stars and leave a comment. Ratings help build trust in the community and let users see who is reliable. Your average rating is displayed on your profile."
    },
    {
      question: "What types of bottles can I list?",
      answer: "Any returnable plastic bottles that are accepted at Hungarian stores for the 50 HUF deposit refund. This includes most beverage bottles (water, soda, juice, etc.). Make sure bottles are empty and reasonably clean before pickup."
    }
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
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Recycle className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                BottleBuddy
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
            Frequently Asked Questions
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Find answers to common questions about using BottleBuddy, managing pickups, and earning from your bottles.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-2 hover:border-green-300 transition-colors bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
                      Q
                    </span>
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-700 leading-relaxed pl-9">
                    {faq.answer}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Help */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Still Have Questions?</CardTitle>
                <CardDescription className="text-white/90 text-base">
                  We're here to help! Contact our support team or explore more resources.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate("/about")}
                  >
                    Learn More About Us
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white/10 border-white text-white hover:bg-white/20"
                    onClick={() => window.location.href = "mailto:support@bottlebuddy.com"}
                  >
                    Contact Support
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
          <p>&copy; 2025 BottleBuddy. Making recycling easier and more rewarding.</p>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
