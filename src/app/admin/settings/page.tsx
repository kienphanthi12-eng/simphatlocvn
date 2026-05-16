import prisma from "@/lib/db"
import { SettingsFormClient } from "./SettingsFormClient"

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany()
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt Hệ thống</h1>
      <SettingsFormClient initialData={settingsMap} />
    </div>
  )
}
