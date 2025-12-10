// app/auth/layout.jsx
import Link from "next/link";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flexitems-center text-xl  font-[family-name:var(--font-poppins)] font-bold "
          >
            <span className="text-primary-500 font-extrabold">t</span>ravana.tn
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-600 hover:text-primary-500 text-sm font-medium transition"
          >
            <FiArrowLeft size={16} />
            Accueil
          </Link>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[calc(100vh-140px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
