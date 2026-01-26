"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChart, TrendingUp, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, PieChart as RechartsChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ExpenseData {
  "Expense on"?: string
  "Expense Date"?: string
  "Expense Amount"?: string
  "Other Expense"?: string
  "Other Expense Date"?: string
  "Other Payment"?: string
}

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#ec4899", "#14b8a6"]

const SpendAnalytics = () => {
  const [data, setData] = useState<ExpenseData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([])
  const [totalSpend, setTotalSpend] = useState(0)

  const fetchExpenseData = async () => {
    setLoading(true)
    setError("")
    try {
      // Replace with your SheetDB API endpoint
      const response = await fetch("https://sheetdb.io/api/v1/si5qkk2bym6hc")
      if (!response.ok) throw new Error("Failed to fetch data")

      const result = await response.json()
      console.log("[v0] Fetched expense data:", result)

      setData(result)

      // Process data for analytics
      const expenseMap: { [key: string]: number } = {}
      let total = 0

      result.forEach((row: ExpenseData) => {
        // Process credit card expenses
        if (row["Expense on"] && row["Expense Amount"]) {
          const amount = parseFloat(row["Expense Amount"]) || 0
          expenseMap[row["Expense on"]] = (expenseMap[row["Expense on"]] || 0) + amount
          total += amount
        }

        // Process other expenses
        if (row["Other Expense"] && row["Other Payment"]) {
          const amount = parseFloat(row["Other Payment"]) || 0
          expenseMap[row["Other Expense"]] = (expenseMap[row["Other Expense"]] || 0) + amount
          total += amount
        }
      })

      const chartData = Object.entries(expenseMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)

      setCategoryData(chartData)
      setTotalSpend(total)
    } catch (err) {
      console.error("[v0] Error fetching data:", err)
      setError("Failed to load expense data. Please check your SheetDB connection.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenseData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-8">
      <Card className="w-full max-w-6xl mx-auto shadow-2xl">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              <div>
                <CardTitle className="text-2xl sm:text-3xl">Spend Analytics</CardTitle>
                <p className="text-emerald-100 text-sm mt-1">Analyze your spending patterns and trends</p>
              </div>
            </div>
            <Button
              onClick={fetchExpenseData}
              disabled={loading}
              className="bg-white text-emerald-600 hover:bg-emerald-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold">Error Loading Data</p>
                <p className="text-red-700 text-sm">{error}</p>
                <p className="text-red-600 text-xs mt-2">
                  Make sure your SheetDB API link is: https://sheetdb.io/api/v1/si5qkk2bym6hc
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading your expense data...</p>
            </div>
          ) : categoryData.length === 0 ? (
            <div className="text-center py-12">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Expenses Yet</h3>
              <p className="text-gray-500">Start adding expenses in the Expense Tracker to see analytics here.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Total Spent</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">₹{totalSpend.toFixed(2)}</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-emerald-600 opacity-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-semibold">Categories</p>
                        <p className="text-3xl font-bold text-teal-600 mt-2">{categoryData.length}</p>
                      </div>
                      <BarChart3 className="w-12 h-12 text-teal-600 opacity-20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <Card className="border-emerald-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Spending by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                        <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card className="border-teal-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Expense Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ₹${value.toFixed(0)}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                      </RechartsChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Category Breakdown Table */}
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-lg">Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoryData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-semibold text-gray-700">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">₹{item.value.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{((item.value / totalSpend) * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SpendAnalytics
