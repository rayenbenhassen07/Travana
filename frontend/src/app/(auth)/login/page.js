"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/useAuthStore";
import { Input } from "@/components/shared/inputs/Input";
import { Button } from "@/components/shared/inputs/Button";
import Alert from "@/components/shared/Alert";
import VerifyEmailNotice from "@/components/(auth)/VerifyEmailNotice";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const hydrateAuth = useAuthStore((s) => s.hydrateAuth);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  // Redirect if logged in and verified
  useEffect(() => {
    if (user && user.email_verified_at) {
      router.replace("/");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError(null);

    const res = await login(data);

    if (res.success) {
      // Check if email is verified
      if (res.needsVerification || !res.verified) {
        setShowVerificationNotice(true);
        setUserEmail(res.user.email);
      } else {
        // Email verified - redirect to home
        router.push("/");
      }
    } else {
      setAuthError(res.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="p-6 space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-bold text-secondary-900">Bon retour !</h1>
        <p className="text-xs text-neutral-600 mt-1">
          Connectez-vous à votre compte
        </p>
      </div>

      {showVerificationNotice ? (
        <VerifyEmailNotice
          email={userEmail}
          onDismiss={() => setShowVerificationNotice(false)}
        />
      ) : (
        <>
          {authError && (
            <Alert
              type="error"
              message={authError}
              onClose={() => setAuthError(null)}
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              icon={<FaEnvelope />}
              placeholder="votre@email.com"
              {...register("email", { required: "Email requis" })}
              error={errors.email?.message}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              icon={<FaLock />}
              placeholder="••••••••"
              {...register("password", { required: "Mot de passe requis" })}
              error={errors.password?.message}
              required
            />

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs text-primary-600 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-neutral-600">Pas encore de compte ? </span>
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:underline"
            >
              S'inscrire
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
