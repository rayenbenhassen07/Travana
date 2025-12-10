"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Alert from "@/components/shared/Alert";
import { FaHome, FaCheckCircle } from "react-icons/fa";

function VerifyEmailSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const already = searchParams.get("already");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 font-poppins mb-2">
            {already ? "Déjà vérifié !" : "Email vérifié !"}
          </h1>
        </div>

        <Alert
          type="success"
          message={
            already
              ? "Votre email a déjà été vérifié. Vous pouvez vous connecter."
              : "Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant profiter de toutes les fonctionnalités."
          }
        />

        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
          >
            Se connecter
          </Link>

          <p className="text-sm text-center text-neutral-500">
            Redirection automatique dans {countdown}s...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailSuccessPage() {
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
      <VerifyEmailSuccessContent />
    </Suspense>
  );
}
