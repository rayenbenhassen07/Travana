// app/register/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useAuthStore from "@/store/useAuthStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { Input } from "@/components/shared/inputs/Input";
import { Select } from "@/components/shared/inputs/Select";
import { DateInput } from "@/components/shared/inputs/DateInput";
import { Textarea } from "@/components/shared/inputs/Textarea";
import { Button } from "@/components/shared/inputs/Button";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaCalendar,
  FaGlobe,
  FaMoneyBill,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const registerUser = useAuthStore((s) => s.register);
  const user = useAuthStore((s) => s.user);
  const hydrateAuth = useAuthStore((s) => s.hydrateAuth);

  // Language and Currency stores
  const { languages, fetchLanguages } = useLanguageStore();
  const { currencies, fetchCurrencies } = useCurrencyStore();

  useEffect(() => {
    hydrateAuth();
    fetchLanguages();
    fetchCurrencies();
  }, [hydrateAuth, fetchLanguages, fetchCurrencies]);

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
      setServerErrors({});

      // Clean up the data - remove empty optional fields
      const submitData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password_confirmation,
      };

      // Only add optional fields if they have values
      if (data.date_of_birth) submitData.date_of_birth = data.date_of_birth;
      if (data.bio?.trim()) submitData.bio = data.bio;
      if (data.language_id) submitData.language_id = parseInt(data.language_id);
      if (data.currency_id) submitData.currency_id = parseInt(data.currency_id);

      const res = await registerUser(submitData);

      if (res.success) {
        toast.success("Inscription réussie ! Vérifiez votre email.");
        // Redirect to check-email page with email parameter
        router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(res.error);
        setServerErrors(res.errors || {});
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Une erreur inattendue s'est produite");
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Required Fields Section */}
        <div className="space-y-3">
          <Input
            label="Nom complet"
            icon={<FaUser />}
            placeholder="Votre nom"
            {...register("name", { required: "Nom requis" })}
            error={errors.name?.message || serverErrors.name?.[0]}
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

          <Input
            label="Téléphone"
            type="tel"
            icon={<FaPhone />}
            placeholder="+216 XX XXX XXX"
            {...register("phone", { required: "Téléphone requis" })}
            error={errors.phone?.message || serverErrors.phone?.[0]}
            required
          />

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
        </div>

        {/* Optional Fields Section */}
        <div className="pt-3 border-t border-neutral-200">
          <div className="flex items-center gap-2 mb-3">
            <FaInfoCircle className="text-neutral-500 text-sm" />
            <span className="text-xs text-neutral-600 font-medium">
              Informations optionnelles
            </span>
          </div>

          <div className="space-y-3">
            <Controller
              name="date_of_birth"
              control={control}
              render={({ field }) => (
                <DateInput
                  label="Date de naissance"
                  icon={<FaCalendar />}
                  placeholder="JJ/MM/AAAA"
                  max={new Date().toISOString().split("T")[0]}
                  error={
                    errors.date_of_birth?.message ||
                    serverErrors.date_of_birth?.[0]
                  }
                  {...field}
                />
              )}
            />

            <Controller
              name="language_id"
              control={control}
              render={({ field }) => (
                <Select
                  label="Langue préférée"
                  placeholder="Sélectionnez votre langue"
                  options={languages.map((lang) => ({
                    value: lang.id,
                    label: `${lang.name} (${lang.code.toUpperCase()})`,
                  }))}
                  error={
                    errors.language_id?.message || serverErrors.language_id?.[0]
                  }
                  {...field}
                />
              )}
            />

            <Controller
              name="currency_id"
              control={control}
              render={({ field }) => (
                <Select
                  label="Devise préférée"
                  placeholder="Sélectionnez votre devise"
                  options={currencies.map((curr) => ({
                    value: curr.id,
                    label: `${curr.code} - ${curr.symbol}`,
                  }))}
                  error={
                    errors.currency_id?.message || serverErrors.currency_id?.[0]
                  }
                  {...field}
                />
              )}
            />
          </div>
        </div>

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
    </div>
  );
}
