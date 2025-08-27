import { type NextRequest, NextResponse } from "next/server"
import { yaYaAPI } from "@/lib/yaya-api"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const results = await yaYaAPI.searchTransactions(query)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search API route error:", error)
    return NextResponse.json({ error: "Failed to search transactions" }, { status: 500 })
  }
}
