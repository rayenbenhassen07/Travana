"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaHome, FaEnvelope, FaTimesCircle } from "react-icons/fa";

function VerifyEmailFailedContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "invalid":
        return {
          title: "Lien invalide",
          message:
            "Le lien de vérification est invalide. Veuillez demander un nouveau lien.",
        };
      case "expired":
        return {
          title: "Lien expiré",
          message:
            "Le lien de vérification a expiré. Veuillez demander un nouveau lien de vérification.",
        };
      default:
        return {
          title: "Erreur de vérification",
          message:
            "Une erreur s'est produite lors de la vérification de votre email. Veuillez réessayer.",
        };
    }
  };

  const { title, message } = getErrorMessage();

  return (
    <div className="p-6 space-y-5">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaTimesCircle className="text-red-500 text-5xl" />
        </div>
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">{title}</h1>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm text-red-800">{message}</p>
      </div>

      <div className="space-y-3">
        <Link
          href="/login"
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <FaEnvelope />
          Se connecter et renvoyer
        </Link>

        <Link
          href="/"
          className="w-full border-2 border-neutral-300 hover:border-primary-500 text-neutral-700 hover:text-primary-500 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <FaHome />
          Retour à l'accueil
        </Link>
      </div>

      <div className="pt-4 border-t border-neutral-200">
        <p className="text-sm text-center text-neutral-500">
          Besoin d'aide ?{" "}
          <Link href="/contact" className="text-primary-500 hover:underline">
            Contactez-nous
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 space-y-5">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-20 h-20 bg-neutral-200 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-neutral-200 rounded w-3/4 mx-auto mb-2"></div>
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailFailedContent />
    </Suspense>
  );
}
