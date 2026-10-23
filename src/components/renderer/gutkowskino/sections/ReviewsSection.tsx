import React from 'react';
import { Quote, CheckCircle2 } from 'lucide-react';
import { ReviewsSectionData, ThemeTokens } from '../../../../types';
import { renderRichText } from '../../../../lib/richText';
import { StarRating } from '../GutkowskinoIcons';

interface ReviewsSectionProps {
  data: ReviewsSectionData;
  theme: ThemeTokens;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ data, theme }) => {
  return (
    <section id="section-reviews" className="py-20 md:py-28 bg-[#F4EFE6] border-t border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-stone-500">
            Dicono di Noi
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mt-2 tracking-tight">
            Riconoscimenti & Voci
          </h2>
          {data.leadText && (
            <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
              {data.leadText}
            </p>
          )}

          {(data.averageScore || data.totalReviewsCount) && (
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-stone-200 shadow-xs">
              {data.averageScore && (
                <span className="font-editorial text-lg font-bold text-stone-900">
                  ★ {data.averageScore}
                </span>
              )}
              {data.totalReviewsCount && (
                <span className="text-xs text-stone-500 font-mono">
                  {data.totalReviewsCount}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.items.map((review, idx) => (
            <div
              key={review.id || idx}
              className="bg-white rounded-2xl p-7 shadow-md border border-stone-200/90 flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-transform text-left"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <StarRating rating={review.rating} />
                  <Quote className="w-6 h-6 text-stone-300" />
                </div>
                <blockquote className="font-editorial text-lg sm:text-xl text-stone-800 italic leading-snug">
                  {renderRichText(review.quote)}
                </blockquote>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-sans font-semibold text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                    {review.author}
                    {review.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </h4>
                  <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                    {review.source} {review.date ? `• ${review.date}` : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
