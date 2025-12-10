// components/(auth)/FieldError.js
export default function FieldError({ errors, fieldName }) {
  if (!errors || !errors[fieldName]) return null;

  const errorMessages = Array.isArray(errors[fieldName])
    ? errors[fieldName]
    : [errors[fieldName]];

  return (
    <div className="space-y-1">
      {errorMessages.map((error, index) => (
        <p
          key={index}
          className="text-red-600 text-xs pl-1 animate-fadeIn flex items-center gap-1"
        >
          <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      ))}
    </div>
  );
}
