// app/register/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/useAuthStore";
import { Input } from "@/components/shared/inputs/Input";
import { Select } from "@/components/shared/inputs/Select";
import { Button } from "@/components/shared/inputs/Button";
import Alert from "@/components/shared/Alert";
import VerifyEmailNotice from "@/components/(auth)/VerifyEmailNotice";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [serverErrors, setServerErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const registerUser = useAuthStore((s) => s.register);
  const user = useAuthStore((s) => s.user);
  const hydrateAuth = useAuthStore((s) => s.hydrateAuth);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  // Redirect if already logged in and email is verified
  useEffect(() => {
    if (user && user.email_verified_at) {
      router.replace("/");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      setServerErrors({});

      const res = await registerUser(data);

      if (res.success) {
        setRegisteredEmail(data.email);
        setRegistrationSuccess(true);
      } else {
        setAuthError(res.error);
        setServerErrors(res.errors || {});
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setAuthError("Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-bold text-secondary-900">
          Créer un compte
        </h1>
        <p className="text-xs text-neutral-600 mt-1">
          Rejoignez-nous en quelques clics
        </p>
      </div>

      {registrationSuccess ? (
        <VerifyEmailNotice email={registeredEmail} />
      ) : (
        <>
          {authError && (
            <Alert
              type="error"
              message={authError}
              onClose={() => setAuthError(null)}
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input
              label="Nom complet"
              icon={<FaUser />}
              placeholder="Votre nom"
              {...register("username", { required: "Nom requis" })}
              error={errors.username?.message || serverErrors.username?.[0]}
              required
            />

            <Input
              label="Email"
              type="email"
              icon={<FaEnvelope />}
              placeholder="votre@email.com"
              {...register("email", { required: "Email requis" })}
              error={errors.email?.message || serverErrors.email?.[0]}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="sex"
                control={control}
                rules={{ required: "Sexe requis" }}
                render={({ field }) => (
                  <Select
                    label="Sexe"
                    placeholder="Sélectionnez"
                    options={[
                      { value: "male", label: "Homme" },
                      { value: "female", label: "Femme" },
                    ]}
                    error={errors.sex?.message || serverErrors.sex?.[0]}
                    required
                    {...field}
                  />
                )}
              />

              <Input
                label="Téléphone"
                type="tel"
                icon={<FaPhone />}
                placeholder="+216 XX XXX XXX"
                {...register("phone", { required: "Téléphone requis" })}
                error={errors.phone?.message || serverErrors.phone?.[0]}
                required
              />
            </div>

            <Input
              label="Mot de passe"
              type="password"
              icon={<FaLock />}
              placeholder="8+ caractères"
              {...register("password", {
                required: "Mot de passe requis",
                minLength: { value: 8, message: "Minimum 8 caractères" },
              })}
              error={errors.password?.message || serverErrors.password?.[0]}
              required
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              icon={<FaLock />}
              placeholder="Confirmer"
              {...register("password_confirmation", {
                required: "Confirmation requise",
                validate: (v) =>
                  v === password || "Les mots de passe ne correspondent pas",
              })}
              error={
                errors.password_confirmation?.message ||
                serverErrors.password_confirmation?.[0]
              }
              required
            />

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Création..." : "Créer mon compte"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-neutral-600">Déjà membre ? </span>
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
