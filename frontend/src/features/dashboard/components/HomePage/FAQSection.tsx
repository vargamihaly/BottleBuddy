import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { HelpCircle } from "lucide-react";

export const FAQSection = () => {
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
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Got Questions? We've Got Answers</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about how BottleBuddy works
          </p>
        </div>

        <div className="grid gap-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-2 hover:border-green-300 transition-colors">
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
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@bottlebuddy.com"
              className="inline-flex items-center justify-center px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
