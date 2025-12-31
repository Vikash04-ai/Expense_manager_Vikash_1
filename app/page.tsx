"use client"

import { useState } from "react"
import ExpenseTracker from "@/components/expense-tracker"
import CreditCardDashboard from "@/components/credit-card-dashboard"
import SpendAnalytics from "@/components/spend-analytics"

export default function Page() {
  const [activeSection, setActiveSection] = useState<"expense-tracker" | "credit-card" | "analytics">("expense-tracker")

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-1">
              <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                FinManager
              </h1>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => setActiveSection("expense-tracker")}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                  activeSection === "expense-tracker"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                💰 Expense Tracker
              </button>
              <button
                onClick={() => setActiveSection("credit-card")}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                  activeSection === "credit-card"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                💳 Credit Card
              </button>
              <button
                onClick={() => setActiveSection("analytics")}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-sm sm:text-base ${
                  activeSection === "analytics"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                📊 Spend Analytics
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Section */}
      <div className="p-4 sm:p-8">
        {activeSection === "expense-tracker" && <ExpenseTracker />}
        {activeSection === "credit-card" && <CreditCardDashboard />}
        {activeSection === "analytics" && <SpendAnalytics />}
      </div>
    </main>
  )
}
