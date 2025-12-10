"use client";

import { IconType } from "react-icons";

// interface categoryInputProps {
//   icon: IconType;
//   label: string;
//   selected: boolean;
//   onClick: (value: string) => void;
// }

const CategoryInput = ({ icon: Icon, label, selected, onClick }) => {
  return (
    <div
      onClick={() => {
        onClick(label);
      }}
      className={`
            rounded-xl
            border-2
            p-3
            flex
            items-center
            gap-3
            hover:border-black
            transition
            cursor-pointer
            ${selected ? "border-black" : "border-neutral-200"}
            ${selected ? "bg-green-200" : "bg-white"}
        `}
    >
      <Icon size={30} />
      <div className="font-semibold">{label}</div>
    </div>
  );
};

export default CategoryInput;
