"use client";

import { useRouter } from "next/navigation";

import { Button } from "./shared/inputs";
import Heading from "./shared/Heading";

const EmptyState = ({
  title = "Pas de correspondances exactes",
  subtitle = "Essayez de modifier ou de supprimer certains de vos filtres",
  showReset,
}) => {
  const router = useRouter();
  return (
    <div
      className="
        h-[60vh]
        flex
        flex-col
        gap-2
        justify-center
        items-center
    "
    >
      <Heading center title={title} subtitle={subtitle} />

      <div className="w-52 mt-4">
        {showReset && (
          <Button
            outline
            label="Supprimer tous les filtres"
            onClick={() => router.push("/")}
          />
        )}
      </div>
    </div>
  );
};

export default EmptyState;
