import { TransactionDashboard } from "@/components/transaction-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">YaYa Wallet Transaction Dashboard</h1>
          <p className="text-muted-foreground mt-2">Monitor your account transactions with search and pagination</p>
        </div>
        <TransactionDashboard />
      </div>
    </main>
  )
}
