import { LoadingSpinner } from "../Loading";

const Loading = ({
  size = "lg",
  color = "blue",
  message = null,
  center = true,
  className = "",
}) => {
  const containerClasses = center
    ? "flex justify-center items-center w-full"
    : "flex items-center";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <LoadingSpinner size={size} color={color} />
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default Loading;
