"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { BiDollar } from "react-icons/bi";

// interface InputProps {
//   id: string;
//   label: string;
//   type?: string;
//   disabled?: boolean;
//   formatPrice?: boolean;
//   required?: boolean;
//   register: UseFormRegister<FieldValues>;
//   errors: FieldErrors;
//   textarea?: boolean;
// }

const Input = ({
  id,
  label,
  type,
  disabled,
  formatPrice,
  required,
  register,
  errors,
  textarea,
}) => {
  return (
    <div className="w-full relative">
      {formatPrice && (
        <BiDollar
          size={24}
          className="text-neutral-700 absolute top-5 left-2"
        />
      )}
      {textarea ? (
        <textarea
          id="description"
          placeholder="description"
          disabled={disabled}
          {...register(id, { required })}
          className={`
                        peer
                        w-full
                        p-4
                        pt-6 
                        font-light 
                        bg-white 
                        border-2
                        rounded-md
                        outline-none
                        transition
                        disabled:opacity-70
                        disabled:cursor-not-allowed
                        ${formatPrice ? "pl-9" : "pl-4"}
                        ${errors[id] ? "border-rose-500" : "border-neutral-300"}
                        ${
                          errors[id]
                            ? "focus:border-rose-500"
                            : "focus:border-black"
                        }
            `}
        />
      ) : (
        <input
          id={id}
          type={type}
          disabled={disabled}
          {...register(id, { required })}
          placeholder={label}
          className={`peer w-full p-2 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed ${
            formatPrice ? "pl-9" : "pl-4"
          } ${errors[id] ? "border-rose-500" : "border-neutral-300"} ${
            errors[id] ? "focus:border-rose-500" : "focus:border-black"
          }`}
        />
      )}
      {errors[id] && (
        <p className="text-sm text-rose-500 mt-1">
          {errors[id]?.message?.toString() || "This field is required"}
        </p>
      )}
    </div>
  );
};

export default Input;
