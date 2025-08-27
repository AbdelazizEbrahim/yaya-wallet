"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  currency: string;
  cause: string;
  created_at: string;
  transaction_type?: "incoming" | "outgoing";
}

interface ApiResponse {
  data: Transaction[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

const CURRENT_USER = "current_user"; // This would normally come from auth context

export function TransactionDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const API_KEY =
    process.env.NEXT_PUBLIC_YAYA_API_KEY ||
    "key-test_13817e87-33a9-4756-82e0-e6ac74be5f77";
  const API_SECRET =
    process.env.YAYA_API_SECRET ||
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcGlfa2V5Ijoia2V5LXRlc3RfMTM4MTdlODctMzNhOS00NzU2LTgyZTAtZTZhYzc0YmU1Zjc3Iiwic2VjcmV0IjoiY2E5ZjJhMGM5ZGI1ZmRjZWUxMTlhNjNiMzNkMzVlMWQ4YTVkNGZiYyJ9.HesEEFWkY55B8JhxSJT4VPJTXZ-4a18wWDRacTcimNw";

  const determineTransactionType = (
    transaction: Transaction
  ): "incoming" | "outgoing" => {
    // If receiver is current user, it's incoming
    if (transaction.receiver === CURRENT_USER) return "incoming";
    // If sender and receiver are the same (top-up), it's incoming
    if (transaction.sender === transaction.receiver) return "incoming";
    // Otherwise it's outgoing
    return "outgoing";
  };

  const fetchTransactions = async (page = 1, query = "") => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl = "https://sandbox.yayawallet.com/api/en/transaction";
      let url: string;
      let requestOptions: RequestInit;

      if (query.trim()) {
        // Use search endpoint for queries
        url = `${baseUrl}/search?p=${page}`;
        requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_SECRET}`,
            "X-API-Key": API_KEY,
          },
          body: JSON.stringify({ query: query.trim() }),
        };
      } else {
        // Use find-by-user endpoint for general listing
        url = `${baseUrl}/find-by-user?p=${page}`;
        requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_SECRET}`,
            "X-API-Key": API_KEY,
          },
        };
      }

      const response = await fetch(url, requestOptions);
      console.log("Respone: ", response);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      console.log("Data: ", data);

      // Add transaction type to each transaction
      const transactionsWithType = data.data.map((transaction) => ({
        ...transaction,
        transaction_type: determineTransactionType(transaction),
      }));

      setTransactions(transactionsWithType);
      setTotalPages(data.total_pages || 1);
      setTotal(data.total || 0);
      setCurrentPage(data.page || page);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch transactions"
      );
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTransactions(1, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "ETB",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Transaction History
        </CardTitle>
        <CardDescription>
          Monitor your account transactions with search and pagination
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by sender, receiver, cause, or transaction ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
          {searchQuery && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
                fetchTransactions(1, "");
              }}>
              Clear
            </Button>
          )}
        </form>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Summary */}
        {!loading && !error && (
          <div className="text-sm text-muted-foreground">
            Showing {transactions.length} of {total} transactions
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        )}

        {/* Transactions Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Cause</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Loading transactions...
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground">
                    {searchQuery
                      ? "No transactions found matching your search."
                      : "No transactions found."}
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge
                        variant={
                          transaction.transaction_type === "incoming"
                            ? "default"
                            : "secondary"
                        }
                        className="flex items-center gap-1 w-fit">
                        {transaction.transaction_type === "incoming" ? (
                          <ArrowDownLeft className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {transaction.transaction_type === "incoming"
                          ? "In"
                          : "Out"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {transaction.id}
                    </TableCell>
                    <TableCell>{transaction.sender}</TableCell>
                    <TableCell>{transaction.receiver}</TableCell>
                    <TableCell className="text-right font-medium">
                      <span
                        className={
                          transaction.transaction_type === "incoming"
                            ? "text-green-600"
                            : "text-red-600"
                        }>
                        {transaction.transaction_type === "incoming"
                          ? "+"
                          : "-"}
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency
                        )}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.cause}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(transaction.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loading}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
