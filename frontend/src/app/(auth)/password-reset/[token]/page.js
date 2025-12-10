"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/shared/inputs/Input";
import { Button } from "@/components/shared/inputs/Button";
import Alert from "@/components/shared/Alert";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import axios from "@/lib/axios";
import { translateError } from "@/lib/translations";

function ResetPasswordContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const token = params.token;
  const email = searchParams.get("email");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: email || "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    if (!token) {
      setError("Lien de réinitialisation invalide");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/reset-password", {
        token,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      if (response.status === 200) {
        setSuccess(true);
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMessage = translateError(
        err.response?.data?.message || "Une erreur s'est produite"
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="p-6 space-y-5">
        <div className="text-center">
          <h1 className="text-xl font-bold text-secondary-900">
            Lien invalide
          </h1>
        </div>

        <Alert
          type="error"
          message="Le lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien."
        />

        <Link
          href="/forgot-password"
          className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl text-center transition"
        >
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6 space-y-5">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
          <h1 className="text-xl font-bold text-secondary-900">
            Mot de passe réinitialisé !
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Redirection vers la connexion...
          </p>
        </div>

        <Alert
          type="success"
          message="Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-bold text-secondary-900">
          Nouveau mot de passe
        </h1>
        <p className="text-xs text-neutral-600 mt-1">
          Choisissez un nouveau mot de passe sécurisé
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="votre@email.com"
          {...register("email", {
            required: "Email requis",
          })}
          error={errors.email?.message}
          required
          disabled
        />

        <Input
          label="Nouveau mot de passe"
          type="password"
          icon={<FaLock />}
          placeholder="8+ caractères"
          {...register("password", {
            required: "Mot de passe requis",
            minLength: {
              value: 8,
              message: "Minimum 8 caractères",
            },
          })}
          error={errors.password?.message}
          required
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          icon={<FaLock />}
          placeholder="Confirmer"
          {...register("password_confirmation", {
            required: "Confirmation requise",
            validate: (value) =>
              value === password || "Les mots de passe ne correspondent pas",
          })}
          error={errors.password_confirmation?.message}
          required
        />

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <Link
          href="/login"
          className="text-neutral-600 hover:text-primary-600"
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-neutral-200 rounded w-3/4 mx-auto"></div>
            <div className="h-12 bg-neutral-200 rounded"></div>
            <div className="h-12 bg-neutral-200 rounded"></div>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
