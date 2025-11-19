
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/shared/hooks/use-toast";
import { ArrowLeft, Loader2, Recycle, Sparkles } from "lucide-react";
import config from "@/config";
import { useTranslation } from "react-i18next";

const Auth = () => {
  const { t } = useTranslation();

  // Validation schemas using translated messages
  const signInSchema = z.object({
    email: z
      .string()
      .min(1, t("auth.emailRequired"))
      .email(t("auth.emailInvalid")),
    password: z
      .string()
      .min(1, t("auth.passwordRequired")),
  });

  const signUpSchema = z.object({
    email: z
      .string()
      .min(1, t("auth.emailRequired"))
      .email(t("auth.emailInvalid")),
    password: z
      .string()
      .min(8, t("auth.passwordMin"))
      .regex(/[A-Z]/, t("auth.passwordUppercase"))
      .regex(/[a-z]/, t("auth.passwordLowercase"))
      .regex(/[0-9]/, t("auth.passwordNumber")),
    confirmPassword: z.string(),
    // Optional profile fields
    fullName: z.string().max(100, t("auth.fullNameMax")).optional(),
    username: z
      .string()
      .max(50, t("auth.usernameMax"))
      .regex(/^[a-zA-Z0-9_-]*$/, t("auth.usernameInvalid"))
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .regex(/^(\+?[0-9\s\-()]+)?$/, t("auth.phoneInvalid"))
      .optional()
      .or(z.literal("")),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t("auth.passwordsDontMatch"),
    path: ["confirmPassword"],
  });

  type SignInFormData = z.infer<typeof signInSchema>;
  type SignUpFormData = z.infer<typeof signUpSchema>;

  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  // Redirect if coming from a specific page
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";

  // Sign in form
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Sign up form
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

  // Handle form switching - reset forms when switching
  useEffect(() => {
    signInForm.reset();
    signUpForm.reset();
  }, [isSignUp, signInForm, signUpForm]);

  const onSignInSubmit = async (data: SignInFormData) => {
    try {
      await signIn(data.email, data.password);
      toast({
        title: t("auth.signInSuccess"),
        description: t("auth.signInSuccessDesc"),
      });
      navigate(from, { replace: true });
    } catch (error: unknown) {
      console.error("Sign in error:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'response' in error
          ? ((error as { response?: { data?: { error?: string } } }).response?.data?.error || t("common.error"))
          : t("common.error");
      toast({
        title: t("auth.signInError"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const onSignUpSubmit = async (data: SignUpFormData) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName || undefined,
        username: data.username || undefined,
        phone: data.phone || undefined,
      });
      toast({
        title: t("auth.signUpSuccess"),
        description: t("auth.signUpSuccessDesc"),
      });
      navigate(from, { replace: true });
    } catch (error: unknown) {
      console.error("Sign up error:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'response' in error
          ? ((error as { response?: { data?: { error?: string } } }).response?.data?.error || t("common.error"))
          : t("common.error");
      toast({
        title: t("auth.signUpError"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      if (!idToken) {
        throw new Error(t("auth.googleSignInErrorDesc"));
      }

      await signInWithGoogle(idToken);

      toast({
        title: t("auth.googleSignInSuccess"),
        description: t("auth.googleSignInSuccessDesc"),
      });

      navigate(from, { replace: true });
    } catch (error: unknown) {
      console.error("Google sign-in error:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'response' in error
          ? ((error as { response?: { data?: { error?: string } } }).response?.data?.error || t("auth.googleSignInErrorDesc"))
          : t("auth.googleSignInErrorDesc");
      toast({
        title: t("auth.googleSignInError"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleGoogleError = () => {
    toast({
      title: t("auth.googleSignInError"),
      description: t("auth.googleSignInErrorDesc"),
      variant: "destructive",
    });
  };

  const isLoadingSignIn = signInForm.formState.isSubmitting;
  const isLoadingSignUp = signUpForm.formState.isSubmitting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home Button */}
        <Button
          variant="ghost"
          className="mb-4 text-gray-700 hover:text-gray-900 hover:bg-white/50"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("auth.backToHome")}
        </Button>

        <Card className="backdrop-blur-sm bg-white/90 shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-3">
                {isSignUp ? (
                  <Sparkles className="h-8 w-8 text-white" />
                ) : (
                  <Recycle className="h-8 w-8 text-white" />
                )}
              </div>
            </div>
            <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {isSignUp ? t("auth.joinBottleBuddy") : t("auth.welcomeBack")}
            </CardTitle>
            <CardDescription className="text-center text-base">
              {isSignUp ? t("auth.signUpSubtitle") : t("auth.signInSubtitle")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Google Sign In */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  text={isSignUp ? "signup_with" : "signin_with"}
                  size="large"
                  width="100%"
                  logo_alignment="left"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    {t("auth.or")}
                  </span>
                </div>
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
                          <FormLabel>{t("auth.email")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t("auth.emailPlaceholder")}
                              {...field}
                              disabled={isLoadingSignIn}
                              className="transition-all"
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
                          <FormLabel>{t("auth.password")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t("auth.passwordPlaceholder")}
                              {...field}
                              disabled={isLoadingSignIn}
                              className="transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 transition-all"
                      disabled={isLoadingSignIn}
                    >
                      {isLoadingSignIn ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("auth.signingIn")}
                        </>
                      ) : (
                        t("auth.signIn")
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
                          <FormLabel>{t("auth.email")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder={t("auth.emailPlaceholder")}
                              {...field}
                              disabled={isLoadingSignUp}
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
                          <FormLabel>{t("auth.password")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t("auth.passwordPlaceholder")}
                              {...field}
                              disabled={isLoadingSignUp}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500 mt-1">
                            {t("auth.passwordHint")}
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={t("auth.passwordPlaceholder")}
                              {...field}
                              disabled={isLoadingSignUp}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Optional Profile Fields */}
                    <div className="space-y-3 pt-2 border-t">
                      <p className="text-sm text-gray-600">{t("auth.optional")}</p>

                      <FormField
                        control={signUpForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("auth.fullName")} <span className="text-gray-400 text-xs">{t("auth.optional")}</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("auth.fullNamePlaceholder")}
                                {...field}
                                disabled={isLoadingSignUp}
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
                            <FormLabel>
                              {t("auth.username")} <span className="text-gray-400 text-xs">{t("auth.optional")}</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("auth.usernamePlaceholder")}
                                {...field}
                                disabled={isLoadingSignUp}
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-gray-500">{t("auth.usernameHint")}</p>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signUpForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("auth.phone")} <span className="text-gray-400 text-xs">{t("auth.optional")}</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder={t("auth.phonePlaceholder")}
                                {...field}
                                disabled={isLoadingSignUp}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 transition-all"
                      disabled={isLoadingSignUp}
                    >
                      {isLoadingSignUp ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("auth.creatingAccount")}
                        </>
                      ) : (
                        t("auth.createAccount")
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              {/* Switch between Sign In and Sign Up */}
              <div className="text-center text-sm">
                {isSignUp ? (
                  <>
                    {t("auth.alreadyHaveAccount")}{" "}
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="text-green-600 hover:text-green-700 font-semibold underline-offset-4 hover:underline"
                    >
                      {t("auth.signIn")}
                    </button>
                  </>
                ) : (
                  <>
                    {t("auth.dontHaveAccount")}{" "}
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="text-green-600 hover:text-green-700 font-semibold underline-offset-4 hover:underline"
                    >
                      {t("auth.signUp")}
                    </button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
