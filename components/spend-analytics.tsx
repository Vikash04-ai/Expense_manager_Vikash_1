"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, PieChart } from "lucide-react"

const SpendAnalytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-8">
      <Card className="w-full max-w-6xl mx-auto shadow-2xl">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8" />
            <div>
              <CardTitle className="text-2xl sm:text-3xl">Spend Analytics</CardTitle>
              <p className="text-emerald-100 text-sm mt-1">Analyze your spending patterns and trends</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <div className="text-center py-12">
            <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Coming Soon</h3>
            <p className="text-gray-500">Advanced spending analytics and visualization features are being developed.</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for insights into your spending patterns!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SpendAnalytics
