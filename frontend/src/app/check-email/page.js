"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/shared/inputs/Button";
import { FaEnvelope, FaHome, FaPaperPlane } from "react-icons/fa";
import axios from "@/lib/axios";
import { toast } from "sonner";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);

    try {
      const response = await axios.post(
        "/api/email/verification-notification",
        {
          email: email,
        }
      );

      if (response.data.verified) {
        toast.success(
          "Votre email est déjà vérifié ! Vous pouvez vous connecter."
        );
      } else {
        toast.success(
          "Un nouveau lien de vérification a été envoyé à votre adresse email."
        );
      }
    } catch (error) {
      toast.error("Une erreur s'est produite. Veuillez réessayer plus tard.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-primary-500 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 font-poppins mb-2">
            Vérifiez votre email
          </h1>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            {email
              ? `Nous avons envoyé un email de vérification à ${email}. Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte.`
              : "Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte."}
          </p>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
          <h3 className="font-semibold text-neutral-800 mb-2">
            Vous n'avez pas reçu l'email ?
          </h3>
          <ul className="text-sm text-neutral-600 space-y-1 mb-3">
            <li>• Vérifiez votre dossier spam</li>
            <li>• Assurez-vous que l'adresse email est correcte</li>
            <li>• Le lien expire après 60 minutes</li>
          </ul>

          {email && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleResend}
              isLoading={isResending}
              disabled={isResending}
              className="w-full"
            >
              <FaPaperPlane className="mr-2" />
              {isResending ? "Envoi..." : "Renvoyer l'email"}
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <FaEnvelope />
            Se connecter
          </Link>

          <Link
            href="/"
            className="w-full border-2 border-neutral-300 hover:border-primary-500 text-neutral-700 hover:text-primary-500 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <FaHome />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-pulse">
              <div className="w-20 h-20 bg-neutral-200 rounded-full mx-auto mb-4"></div>
              <div className="h-8 bg-neutral-200 rounded w-3/4 mx-auto mb-2"></div>
            </div>
          </div>
        </div>
      }
    >
      <CheckEmailContent />
    </Suspense>
  );
}
