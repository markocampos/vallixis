export default function LogoIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path 
        d="M16 8L26 22H20L16 14L12 22H6L16 8Z" 
        fill="white" 
      />
      <path 
        d="M16 26L12 18H20L16 26Z" 
        fill="white" 
        opacity="0.5" 
      />
    </svg>
  );
}
