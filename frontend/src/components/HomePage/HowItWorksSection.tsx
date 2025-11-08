import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const HowItWorksSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">How BottleBuddy Works</h3>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Simple, transparent, and convenient - get your share of the refund without the hassle
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-green-200 hover:border-green-400 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <CardTitle className="text-lg">1. List Your Bottles</CardTitle>
              <CardDescription className="text-sm">
                Post how many bottles you have and your location. Set your preferred split arrangement.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <CardTitle className="text-lg">2. Get Matched</CardTitle>
              <CardDescription className="text-sm">
                Nearby volunteers see your listing and send pickup requests. Chat to coordinate the meeting.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💵</span>
              </div>
              <CardTitle className="text-lg">3. Get Paid Upfront</CardTitle>
              <CardDescription className="text-sm">
                Volunteer pays you your share (e.g., 25 HUF/bottle) during pickup. No need to meet again!
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-emerald-200 hover:border-emerald-400 transition-all hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">♻️</span>
              </div>
              <CardTitle className="text-lg">4. Bottles Get Returned</CardTitle>
              <CardDescription className="text-sm">
                Volunteer returns bottles to the store, gets the full refund, and keeps their portion. Everyone wins!
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
                <h4 className="font-bold text-lg mb-2">Quick & Convenient Payment</h4>
                <p className="text-white/90 text-sm leading-relaxed">
                  <strong>You get paid immediately during pickup</strong> - no waiting, no second meetup needed.
                  The volunteer pays you your agreed share upfront, then they handle returning the bottles and collect
                  the full refund from the store. It's that simple!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};