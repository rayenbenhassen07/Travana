"use client";

import { useState } from "react";
import { Button } from "@/components/shared/inputs/Button";
import { FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import axios from "@/lib/axios";
import { toast } from "sonner";

export default function VerifyEmailNotice({ email, onDismiss }) {
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
        toast.success("Un nouveau lien de vérification a été envoyé !");
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          Vérifiez votre email
        </h4>
        <p className="text-sm text-blue-700">
          Nous avons envoyé un email de vérification à <strong>{email}</strong>.
          Veuillez vérifier votre boîte de réception et cliquer sur le lien pour
          activer votre compte.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <FaCheckCircle className="text-green-600 text-xl flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-800 mb-1">
              Après vérification
            </h4>
            <p className="text-sm text-green-700">
              Une fois votre email vérifié, vous aurez accès à toutes les
              fonctionnalités de la plateforme.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          variant="secondary"
          onClick={handleResend}
          isLoading={isResending}
          disabled={isResending}
          className="w-full"
        >
          <FaPaperPlane className="mr-2" />
          {isResending ? "Envoi..." : "Renvoyer l'email de vérification"}
        </Button>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            J'ai vérifié mon email, essayer de se connecter
          </button>
        )}
      </div>
    </div>
  );
}
