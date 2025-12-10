"use client";
import { useRouter } from "next/navigation";

const Logo = ({ color = "black" }) => {
  const router = useRouter();

  const textColor = color === "white" ? "text-white" : "text-black";

  return (
    <div
      onClick={() => router.push("/")}
      className={`text-xl md:text-2xl font-[family-name:var(--font-poppins)] font-bold ${textColor} cursor-pointer hover:opacity-80 transition-opacity`}
    >
      <span className="text-primary-500 font-extrabold">t</span>ravana.tn
    </div>
  );
};

export default Logo;
