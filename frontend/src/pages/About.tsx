import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Recycle, Heart, Users, Leaf, ArrowLeft, Shield, Zap, Globe } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Recycle className="w-8 h-8 text-green-600" />,
      title: "Easy Bottle Sharing",
      description: "List your returnable bottles with just a few taps. Set your location, add details, and you're done!"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Community Driven",
      description: "Connect with neighbors who can pick up your bottles. Build a network of people who care about recycling."
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-700" />,
      title: "Environmental Impact",
      description: "Every bottle returned is a step towards a cleaner planet. Track your contribution to sustainability."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Safe & Secure",
      description: "User ratings, verified profiles, and secure authentication ensure a trustworthy experience."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Fast & Efficient",
      description: "Real-time listings and notifications help you find bottles nearby instantly."
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "Local Focus",
      description: "Interactive map view shows bottles in your neighborhood, making collection easy and efficient."
    }
  ];

  const stats = [
    { value: "1000+", label: "Bottles Recycled" },
    { value: "500+", label: "Active Users" },
    { value: "50+", label: "Cities" },
    { value: "95%", label: "User Satisfaction" }
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Made with love for the planet
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            About BottleBuddy
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            We're on a mission to make bottle recycling easier, more rewarding, and more social.
            BottleBuddy connects people who have returnable bottles with those willing to return them,
            creating a win-win situation for everyone involved.
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
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Why Choose BottleBuddy?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've built the most comprehensive platform for bottle sharing and recycling.
              Here's what makes us special.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-green-300 transition-all hover:shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl leading-relaxed mb-8">
            To create a sustainable future by making bottle recycling accessible, social, and rewarding
            for everyone. We believe that small actions, when multiplied by millions of people,
            can transform the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              Get Started Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/")}
              className="border-2 border-white text-white hover:bg-white/10"
            >
              Explore Listings
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Create an Account</h3>
                <p className="text-gray-600">
                  Sign up with your email or Google account. It takes less than a minute to get started.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">List or Find Bottles</h3>
                <p className="text-gray-600">
                  Have bottles? Create a listing with details and location. Looking to collect? Browse the map
                  to find bottles near you.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Connect & Collect</h3>
                <p className="text-gray-600">
                  Coordinate pickup times, collect bottles, and earn refunds. Rate your experience to
                  build trust in the community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to Make a Difference?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who are making bottle recycling easier and more rewarding.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            Join BottleBuddy Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
