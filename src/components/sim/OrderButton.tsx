"use client"

import { useState } from "react"
import { OrderModal } from "./OrderModal"
import { ShoppingCart } from "lucide-react"
import { Sim } from "@prisma/client"

interface OrderButtonProps {
  sim: Pick<Sim, "id" | "phone" | "type" | "price">
}

export function OrderButton({ sim }: OrderButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex-1 flex justify-center items-center gap-2 bg-[var(--blue-500)] text-white px-[18px] py-[8px] rounded-[8px] font-sans text-[13px] font-[700] tracking-[0.3px] hover:bg-[var(--blue-600)] transition shadow-sm"
      >
        <ShoppingCart size={20} /> Đặt mua ngay
      </button>
      
      <OrderModal 
        sim={sim} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
