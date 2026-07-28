import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <main className="flex-1 lg:pl-64">
        <div className="p-6 pt-20 lg:pt-6">{children}</div>
      </main>
    </div>
  )
}
