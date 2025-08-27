import { type NextRequest, NextResponse } from "next/server"
import { yaYaAPI } from "@/lib/yaya-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("p") || "1")

    const transactions = await yaYaAPI.getTransactionsByUser(page)

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
