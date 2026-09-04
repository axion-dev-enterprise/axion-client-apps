import React from 'react';

/**
 * Skeleton para o Card de Pizza/Produto no Cardápio e Home
 */
export const PizzaCardSkeleton = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div 
          key={`pizza-skeleton-${idx}`}
          className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col justify-between overflow-hidden animate-pulse"
        >
          {/* Imagem Placeholder */}
          <div className="w-full aspect-square bg-slate-200 rounded-xl mb-4 skeleton-shimmer" />

          {/* Título & Badge */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              <div className="h-5 bg-slate-200 rounded w-2/3 skeleton-shimmer" />
              <div className="h-4 bg-slate-150 rounded-full w-14 skeleton-shimmer" />
            </div>
            <div className="h-3.5 bg-slate-100 rounded w-full skeleton-shimmer" />
            <div className="h-3.5 bg-slate-100 rounded w-4/5 skeleton-shimmer" />
          </div>

          {/* Preço e Botão */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
            <div>
              <div className="h-3 bg-slate-100 rounded w-10 mb-1 skeleton-shimmer" />
              <div className="h-6 bg-slate-200 rounded w-20 skeleton-shimmer" />
            </div>
            <div className="h-10 w-28 bg-amber-200/60 rounded-full skeleton-shimmer" />
          </div>
        </div>
      ))}
    </>
  );
};

/**
 * Skeleton para a barra de Categorias do Cardápio
 */
export const CategoryPillsSkeleton = ({ count = 6 }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scroll-hide">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={`cat-skeleton-${idx}`}
          className="h-10 w-28 bg-slate-200/80 rounded-full flex-shrink-0 skeleton-shimmer"
        />
      ))}
    </div>
  );
};

/**
 * Skeleton para Seção de Destaque / Hero Banner
 */
export const HeroBannerSkeleton = () => {
  return (
    <div className="w-full bg-slate-100 rounded-3xl p-8 mb-8 skeleton-shimmer min-h-[240px] flex flex-col justify-between">
      <div className="space-y-3 max-w-md">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-8 bg-slate-300 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-full" />
      </div>
      <div className="h-12 w-40 bg-amber-300/70 rounded-full mt-6" />
    </div>
  );
};

export default PizzaCardSkeleton;
