"use client";

const Heading = ({
  title,
  subtitle,
  center = false,
  size = "lg", // sm, md, lg, xl
  className = "",
}) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const alignmentClass = center ? "text-center" : "";

  return (
    <div className={`space-y-2 ${alignmentClass} ${className}`}>
      {title && (
        <h1 className={`${sizeClasses[size]} font-semibold text-secondary-900`}>
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-neutral-500 text-sm md:text-base">{subtitle}</p>
      )}
    </div>
  );
};

export default Heading;
