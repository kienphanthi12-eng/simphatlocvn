import { Metadata } from "next"
import { AdminLayoutClient } from "./AdminLayoutClient"

export const metadata: Metadata = {
  title: "Admin Panel | Sim Phát Lộc",
  description: "Hệ thống quản trị website",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
