import React from 'react'

export default function PublicLoading() {
  return (
    <div className="min-h-[70vh] bg-parchment flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
      {/* Traditional Ornate Seal Motif */}
      <div className="text-gold-deep text-5xl mb-6 animate-pulse-gentle">❖</div>
      
      {/* Premium Royal Golden Shimmer Spinner */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-gold-deep/10" />
        <div className="absolute inset-0 rounded-full border-4 border-t-gold-deep border-r-gold border-b-gold-soft border-l-transparent animate-spin" />
      </div>
      
      {/* Poetic Auspicious Message */}
      <p className="text-crimson-deep font-serif text-lg md:text-xl tracking-widest font-extrabold animate-pulse">
        ĐANG KHỞI TẠO VẬN KHÍ TỐT LÀNH
      </p>
      <p className="text-muted-foreground text-xs md:text-sm font-sans tracking-widest uppercase mt-2.5">
        Hệ thống Sim Phong Thủy - Sim Phát Lộc
      </p>
    </div>
  )
}
