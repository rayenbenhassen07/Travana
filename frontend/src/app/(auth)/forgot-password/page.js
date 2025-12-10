"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Input } from "@/components/shared/inputs/Input";
import { Button } from "@/components/shared/inputs/Button";
import Alert from "@/components/shared/Alert";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import axios from "@/lib/axios";
import { translateError } from "@/lib/translations";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post("/api/forgot-password", {
        email: data.email,
      });

      if (response.status === 200) {
        setSuccess(true);
        setSentEmail(data.email);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      const errorMessage = translateError(
        err.response?.data?.message || "Une erreur s'est produite"
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 space-y-5">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
          <h1 className="text-xl font-bold text-secondary-900">
            Email envoyé !
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Vérifiez votre boîte de réception
          </p>
        </div>

        <Alert
          type="success"
          message={`Nous avons envoyé un lien de réinitialisation à ${sentEmail}. Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.`}
        />

        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
          <p className="text-sm text-neutral-600">
            <strong>Remarque :</strong> Le lien expire après 60 minutes. Si vous
            ne recevez pas l'email, vérifiez votre dossier spam.
          </p>
        </div>

        <div className="text-center space-y-3">
          <Link
            href="/login"
            className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="text-center">
        <h1 className="text-xl font-bold text-secondary-900">
          Mot de passe oublié ?
        </h1>
        <p className="text-xs text-neutral-600 mt-1">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          icon={<FaEnvelope />}
          placeholder="votre@email.com"
          {...register("email", {
            required: "Email requis",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Adresse email invalide",
            },
          })}
          error={errors.email?.message}
          required
        />

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Envoi..." : "Envoyer le lien"}
        </Button>
      </form>

      <div className="text-center text-sm space-y-2">
        <Link
          href="/login"
          className="block text-neutral-600 hover:text-primary-600"
        >
          Retour à la connexion
        </Link>
        <div>
          <span className="text-neutral-600">Pas encore de compte ? </span>
          <Link
            href="/register"
            className="font-medium text-primary-600 hover:underline"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}
