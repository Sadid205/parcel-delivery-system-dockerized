interface Props {
  size?: number;
  color?: string;
  className?: string;
}

const GlobalLoader = ({
  size = 24,
  color = "border-blue-500",
  className = "",
}: Props) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent ${color}`}
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default GlobalLoader;
