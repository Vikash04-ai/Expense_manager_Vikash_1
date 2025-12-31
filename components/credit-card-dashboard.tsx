"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, TrendingUp, DollarSign, AlertCircle } from "lucide-react"

interface CreditCardData {
  "CC Repay This Month"?: string
  "CC Used This Month"?: string
  "CC Balance"?: string
  "CC Usage %"?: string
}

const CreditCardDashboard = () => {
  const [dashboardData, setDashboardData] = useState<CreditCardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("https://sheetdb.io/api/v1/si5qkk2bym6hc")
        if (!response.ok) {
          throw new Error("Failed to fetch data from Google Sheet")
        }

        const data = await response.json()

        if (data && data.length > 0) {
          const firstRow = data[0]
          setDashboardData(firstRow)
        } else {
          setError("No data found in sheet. Please add credit card dashboard data.")
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError(err instanceof Error ? err.message : "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const parseAmount = (value: string | undefined): number => {
    if (!value) return 0
    const parsed = Number.parseFloat(String(value).replace(/[₹,]/g, ""))
    return isNaN(parsed) ? 0 : parsed
  }

  const formatAmount = (amount: number): string => {
    return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const ccRepay = parseAmount(dashboardData?.["CC Repay This Month"])
  const ccUsed = parseAmount(dashboardData?.["CC Used This Month"])
  const ccBalance = parseAmount(dashboardData?.["CC Balance"])
  const ccUsagePercent = parseAmount(dashboardData?.["CC Usage %"])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-8">
      <Card className="w-full max-w-6xl mx-auto shadow-2xl">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8" />
            <div>
              <CardTitle className="text-2xl sm:text-3xl">Credit Card Dashboard</CardTitle>
              <p className="text-blue-100 text-sm mt-1">Track your credit card spending and repayment status</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600 font-semibold">Loading dashboard data...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">{error}</p>
                <p className="text-red-700 text-sm mt-1">
                  Please add the following columns to your Google Sheet: "CC Repay This Month", "CC Used This Month",
                  "CC Balance", "CC Usage %"
                </p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-8">
              {/* Dashboard Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* This Month Credit Card Repay */}
                <Card className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-br from-blue-50 to-blue-100 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-700">CC Repay This Month</CardTitle>
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-3xl font-bold text-blue-600">{formatAmount(ccRepay)}</div>
                    <p className="text-xs text-gray-500 mt-2">Amount to repay</p>
                  </CardContent>
                </Card>

                {/* Credit Card Used */}
                <Card className="border-2 border-orange-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-br from-orange-50 to-orange-100 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-700">CC Used This Month</CardTitle>
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-3xl font-bold text-orange-600">{formatAmount(ccUsed)}</div>
                    <p className="text-xs text-gray-500 mt-2">Total spending</p>
                  </CardContent>
                </Card>

                {/* Credit Card Balance */}
                <Card className="border-2 border-green-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-br from-green-50 to-green-100 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-700">CC Balance</CardTitle>
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-3xl font-bold text-green-600">{formatAmount(ccBalance)}</div>
                    <p className="text-xs text-gray-500 mt-2">Remaining credit</p>
                  </CardContent>
                </Card>

                {/* Credit Card Usage Percent */}
                <Card className="border-2 border-purple-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-br from-purple-50 to-purple-100 pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-gray-700">CC Usage %</CardTitle>
                      <div className="w-5 h-5 text-purple-600 font-bold flex items-center justify-center">%</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-3xl font-bold text-purple-600">{ccUsagePercent.toFixed(1)}%</div>
                    <p className="text-xs text-gray-500 mt-2">Credit utilization</p>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Meter */}
              <Card className="border-2 border-purple-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                  <CardTitle className="text-lg">Credit Card Usage Meter</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Usage: {ccUsagePercent.toFixed(1)}%</span>
                      <span className="text-sm text-gray-500">
                        {formatAmount(ccUsed)} / {formatAmount(ccUsed + ccBalance)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          ccUsagePercent > 80 ? "bg-red-500" : ccUsagePercent > 50 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min(ccUsagePercent, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      {ccUsagePercent > 80 && "High usage - Consider paying off your balance soon"}
                      {ccUsagePercent > 50 && ccUsagePercent <= 80 && "Moderate usage - Keep track of your spending"}
                      {ccUsagePercent <= 50 && "Good - You have plenty of credit available"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border-2 border-indigo-200">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100">
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-gray-600 font-semibold uppercase">Amount to Repay</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">{formatAmount(ccRepay)}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-gray-600 font-semibold uppercase">Available Credit</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">{formatAmount(ccBalance)}</p>
                    </div>
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

export default CreditCardDashboard
