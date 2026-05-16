import prisma from "@/lib/db"
import { SimsTableClient } from "./SimsTableClient"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AdminSimsPage() {
  // Fetch all sims and pass to Client Component (so we can filter locally without enum errors)
  const allSims = await prisma.sim.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Kho Sim</h1>
        <Link href="/admin/sims/import" className="bg-[#0066CC] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus size={20} /> Import CSV
        </Link>
      </div>
      <SimsTableClient initialSims={allSims} />
    </div>
  )
}
