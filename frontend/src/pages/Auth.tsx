
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Recycle, Sparkles } from "lucide-react";
import config from "@/config";

// Validation schemas
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

const signUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  // Optional profile fields
  fullName: z.string().max(100, "Full name cannot exceed 100 characters").optional(),
  username: z
    .string()
    .max(50, "Username cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9_-]*$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^(\+?[0-9\s\-()]+)?$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Form for sign in
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form for sign up
  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      username: "",
      phone: "",
    },
  });

  const currentForm = isSignUp ? signUpForm : signInForm;

  useEffect(() => {
    // Handle legacy URL-based token (deprecated, for backwards compatibility)
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/";
      return;
    }

    // Handle cookie-based auth success from Google OAuth
    if (location.pathname === "/auth/success") {
      // Token is now in httpOnly cookie, need to fetch it via API
      const checkAuth = async () => {
        try {
          // The cookie will be sent automatically with this request
          const response = await fetch(`${config.api.baseUrl}/api/auth/me`, {
            credentials: 'include' // Important: include cookies
          });

          if (response.ok) {
            const userData = await response.json();
            // Extract token from response headers if available, or rely on cookie
            toast({
              title: "Welcome!",
              description: "Successfully signed in with Google",
            });
            navigate("/");
          } else {
            toast({
              title: "Authentication Failed",
              description: "Could not complete Google sign-in",
              variant: "destructive",
            });
            navigate("/auth");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          navigate("/auth");
        }
      };

      checkAuth();
    }
  }, [location, navigate, toast]);

  // Reset form when switching between sign in/sign up
  useEffect(() => {
    signInForm.reset();
    signUpForm.reset();
  }, [isSignUp, signInForm, signUpForm]);

  const onSignInSubmit = async (data: SignInFormData) => {
    setLoading(true);

    try {
      await signIn(data.email, data.password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/");
    } catch (error: unknown) {
      toast({
        title: "Sign In Failed",
        description: getErrorMessage(error, "An unexpected error occurred. Please try again."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSignUpSubmit = async (data: SignUpFormData) => {
    setLoading(true);

    try {
      await signUp(
        data.email,
        data.password,
        data.fullName || undefined,
        data.username || undefined,
        data.phone || undefined
      );
      toast({
        title: "Account created!",
        description: "Welcome to BottleShare!",
      });
      navigate("/");
    } catch (error: unknown) {
      toast({
        title: "Sign Up Failed",
        description: getErrorMessage(error, "An unexpected error occurred. Please try again."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast({
        title: "Error",
        description: "No credential received from Google",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await signInWithGoogle(credentialResponse.credential);
      toast({
        title: "Welcome!",
        description: "Successfully signed in with Google",
      });
      navigate("/");
    } catch (error: unknown) {
      toast({
        title: "Google Sign-In Failed",
        description: getErrorMessage(error, "Failed to sign in with Google"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast({
      title: "Error",
      description: "Google sign-in was cancelled or failed",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-4 bg-white/80 backdrop-blur-sm hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-2xl border-2 bg-white/90 backdrop-blur-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Recycle className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <CardTitle className="text-3xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {isSignUp ? "Join BottleBuddy" : "Welcome Back"}
              </CardTitle>
              {isSignUp && <Sparkles className="w-5 h-5 text-yellow-500" />}
            </div>
            <CardDescription className="text-base">
              {isSignUp
                ? "Create your account to start sharing bottles and making an impact"
                : "Sign in to continue your recycling journey"
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                text="continue_with"
                shape="rectangular"
                size="large"
                width="384"
              />
            </div>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                or
              </span>
            </div>

            {/* Sign In Form */}
            {!isSignUp && (
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>
            )}

            {/* Sign Up Form */}
            {isSignUp && (
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name <span className="text-gray-400 text-xs">(optional)</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            type="text"
                            autoComplete="name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username <span className="text-gray-400 text-xs">(optional)</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="johndoe"
                            type="text"
                            autoComplete="username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500 mt-1">
                          Letters, numbers, underscores, and hyphens only
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone <span className="text-gray-400 text-xs">(optional)</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1234567890"
                            type="tel"
                            autoComplete="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500 mt-1">
                          Must be 8+ characters with uppercase, lowercase, and number
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </Form>
            )}

            <div className="text-center text-sm">
              <span className="text-gray-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </span>
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={loading}
                className="p-1 h-auto font-semibold text-green-600"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
