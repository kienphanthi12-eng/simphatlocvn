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
        className="flex-1 bg-[#0066CC] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md shadow-blue-200"
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
