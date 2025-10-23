import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How BottleShare Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-green-200 hover:border-green-300 transition-colors">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <CardTitle className="text-xl">List Your Bottles</CardTitle>
              <CardDescription>
                Post how many bottles you have and your location. Set your preferred split arrangement.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-200 hover:border-green-300 transition-colors">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <CardTitle className="text-xl">Get Matched</CardTitle>
              <CardDescription>
                Nearby volunteers see your listing and can offer to pick up and return your bottles.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-200 hover:border-green-300 transition-colors">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <CardTitle className="text-xl">Split the Refund</CardTitle>
              <CardDescription>
                The 50 HUF per bottle refund is split as agreed. Both parties benefit from the exchange.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};