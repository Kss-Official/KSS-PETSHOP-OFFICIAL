export const DogFaceIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 22 L14 10 L24 18" />
    <path d="M44 22 L50 10 L40 18" />
    <circle cx="32" cy="30" r="14" />
    <circle cx="27" cy="28" r="1.5" fill="currentColor" />
    <circle cx="37" cy="28" r="1.5" fill="currentColor" />
    <path d="M29 35 Q32 38 35 35" />
    <path d="M32 30 L32 33" />
    <path d="M32 44 L32 50" />
    <circle cx="32" cy="52" r="2" fill="currentColor" />
  </svg>
);

export const GroomingIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="18" cy="20" r="6" />
    <circle cx="18" cy="44" r="6" />
    <path d="M22 24 L48 40" />
    <path d="M22 40 L48 24" />
  </svg>
);

export const TrainingIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M32 14 L54 24 L32 34 L10 24 Z" />
    <path d="M20 28 L20 40 Q32 48 44 40 L44 28" />
    <path d="M54 24 L54 36" />
  </svg>
);
