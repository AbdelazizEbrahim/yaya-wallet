// YaYa Wallet API integration with secure authentication
interface Transaction {
  id: string
  sender: string
  receiver: string
  amount: number
  currency: string
  cause: string
  created_at: string
}

interface TransactionResponse {
  data: Transaction[]
  total: number
  page: number
  per_page: number
}

interface SearchRequest {
  query: string
}

class YaYaWalletAPI {
  private baseUrl = "https://sandbox.yayawallet.com/api/en"
  private apiKey: string
  private apiSecret: string

  constructor() {
    // Use environment variables for security
    this.apiKey = process.env.YAYA_API_KEY || ""
    this.apiSecret = process.env.YAYA_API_SECRET || ""

    if (!this.apiKey || !this.apiSecret) {
      throw new Error("YaYa Wallet API credentials not found in environment variables")
    }
  }

  private getAuthHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiSecret}`,
      "X-API-Key": this.apiKey,
    }
  }

  async getTransactionsByUser(page = 1): Promise<TransactionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/find-by-user?p=${page}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching transactions:", error)
      throw error
    }
  }

  async searchTransactions(query: string): Promise<TransactionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/search`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ query } as SearchRequest),
      })

      if (!response.ok) {
        throw new Error(`Search request failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error searching transactions:", error)
      throw error
    }
  }
}

export const yaYaAPI = new YaYaWalletAPI()
export type { Transaction, TransactionResponse }
