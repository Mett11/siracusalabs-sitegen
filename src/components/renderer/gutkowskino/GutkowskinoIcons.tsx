import React from 'react';

export const OliveBranchIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 42C12 36 24 24 38 10" />
    <path d="M16 32C12 28 14 22 18 20C22 18 26 22 24 28" fill="currentColor" fillOpacity="0.15" />
    <path d="M26 22C24 16 28 12 33 13C36 16 34 22 28 24" fill="currentColor" fillOpacity="0.15" />
    <path d="M34 14C36 8 42 7 44 11C44 16 39 18 35 16" fill="currentColor" fillOpacity="0.15" />
    <path d="M22 36C26 38 29 42 27 45C23 45 20 41 21 37" fill="currentColor" fillOpacity="0.15" />
    <circle cx="28" cy="28" r="2.5" fill="currentColor" />
    <circle cx="38" cy="18" r="2.5" fill="currentColor" />
  </svg>
);

export const WaveDecoration: React.FC<{ className?: string }> = ({ className = 'w-16 h-3 text-amber-600' }) => (
  <svg viewBox="0 0 120 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <path d="M2 8C12 2 20 14 30 8C40 2 50 14 60 8C70 2 80 14 90 8C100 2 110 14 118 8" />
  </svg>
);

export const StarRating: React.FC<{ rating: number; className?: string }> = ({ rating, className = 'w-4 h-4 text-amber-500' }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 24 24"
          fill={star <= rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          className={className}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  );
};
