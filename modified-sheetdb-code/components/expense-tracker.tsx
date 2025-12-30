"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, TrendingUp, CreditCard, DollarSign, FileText, BarChart3, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const expenseCategories = [
  "Food",
  "Dress",
  "Electricity payment",
  "Mobile Recharge",
  "OTT Payment",
  "Haircut",
  "Amazon Payment",
]

// Helper function to format date as DD/MM/YYYY
const formatDate = (date: Date | undefined) => {
  if (!date) return ""
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const ExpenseTracker = () => {
  // Credit Card Expense State
  const [creditCardExpense, setCreditCardExpense] = useState({
    ExpenseOn: "",
    ExpenseDate: undefined as Date | undefined,
    ExpenseAmount: "",
  })
  const [creditCardExpenses, setCreditCardExpenses] = useState<
    { ExpenseOn: string; ExpenseDate: string; ExpenseAmount: string }[]
  >([])

  // Credit Card Repayment State
  const [repayment, setRepayment] = useState({
    RepayDate: undefined as Date | undefined,
    RepayAmount: "",
  })
  const [repayments, setRepayments] = useState<{ RepayDate: string; RepayAmount: string }[]>([])

  // Chit Payment State
  const [chitPayment, setChitPayment] = useState({
    ChitDate: undefined as Date | undefined,
    ChitPayment: "",
  })
  const [chitPayments, setChitPayments] = useState<{ ChitDate: string; ChitPayment: string }[]>([])

  // Other Expense State (includes Other Expense Date)
  const [otherExpense, setOtherExpense] = useState({
    OtherExpense: "",
    OtherExpenseDate: undefined as Date | undefined,
    OtherPayment: "",
  })
  const [otherExpenses, setOtherExpenses] = useState<
    { OtherExpense: string; OtherExpenseDate: string; OtherPayment: string }[]
  >([])

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Credit Card Expense Handlers
  const handleAddCreditCardExpense = () => {
    if (!creditCardExpense.ExpenseOn || !creditCardExpense.ExpenseDate || !creditCardExpense.ExpenseAmount) {
      alert("Please fill in all fields for Credit Card Expense")
      return
    }
    setCreditCardExpenses((prev) => [
      ...prev,
      {
        ExpenseOn: creditCardExpense.ExpenseOn,
        ExpenseDate: formatDate(creditCardExpense.ExpenseDate),
        ExpenseAmount: creditCardExpense.ExpenseAmount,
      },
    ])
    setCreditCardExpense({ ExpenseOn: "", ExpenseDate: undefined, ExpenseAmount: "" })
  }

  // Repayment Handlers
  const handleAddRepayment = () => {
    if (!repayment.RepayDate || !repayment.RepayAmount) {
      alert("Please fill in all fields for Credit Card Repayment")
      return
    }
    setRepayments((prev) => [
      ...prev,
      {
        RepayDate: formatDate(repayment.RepayDate),
        RepayAmount: repayment.RepayAmount,
      },
    ])
    setRepayment({ RepayDate: undefined, RepayAmount: "" })
  }

  // Chit Payment Handlers
  const handleAddChitPayment = () => {
    if (!chitPayment.ChitDate || !chitPayment.ChitPayment) {
      alert("Please fill in all fields for Chit Payment")
      return
    }
    setChitPayments((prev) => [
      ...prev,
      {
        ChitDate: formatDate(chitPayment.ChitDate),
        ChitPayment: chitPayment.ChitPayment,
      },
    ])
    setChitPayment({ ChitDate: undefined, ChitPayment: "" })
  }

  // Other Expense Handlers (with date)
  const handleAddOtherExpense = () => {
    if (!otherExpense.OtherExpense || !otherExpense.OtherExpenseDate || !otherExpense.OtherPayment) {
      alert("Please fill in all fields for Other Expense")
      return
    }
    setOtherExpenses((prev) => [
      ...prev,
      {
        OtherExpense: otherExpense.OtherExpense,
        OtherExpenseDate: formatDate(otherExpense.OtherExpenseDate),
        OtherPayment: otherExpense.OtherPayment,
      },
    ])
    setOtherExpense({ OtherExpense: "", OtherExpenseDate: undefined, OtherPayment: "" })
  }

  // Submit All Data
  const handleSubmitAll = async () => {
    if (
      creditCardExpenses.length === 0 &&
      repayments.length === 0 &&
      chitPayments.length === 0 &&
      otherExpenses.length === 0
    ) {
      alert("Please add at least one entry before submitting")
      return
    }

    setIsSubmitting(true)

    try {
      // Format data as a flat array for SheetDB with exact column names
      const formattedData: any[] = []

      // Add Credit Card Expenses
      creditCardExpenses.forEach((expense) => {
        formattedData.push({
          "Expense on": expense.ExpenseOn,
          "Expense Date": expense.ExpenseDate,
          "Expense Amount": expense.ExpenseAmount,
          "Repay Date": "",
          "Repay Amount": "",
          "Chit Date": "",
          "Chit Payment": "",
          "Other Expense": "",
          "Other Expense Date": "",
          "Other Payment": "",
        })
      })

      // Add Repayments
      repayments.forEach((payment) => {
        formattedData.push({
          "Expense on": "",
          "Expense Date": "",
          "Expense Amount": "",
          "Repay Date": payment.RepayDate,
          "Repay Amount": payment.RepayAmount,
          "Chit Date": "",
          "Chit Payment": "",
          "Other Expense": "",
          "Other Expense Date": "",
          "Other Payment": "",
        })
      })

      // Add Chit Payments
      chitPayments.forEach((payment) => {
        formattedData.push({
          "Expense on": "",
          "Expense Date": "",
          "Expense Amount": "",
          "Repay Date": "",
          "Repay Amount": "",
          "Chit Date": payment.ChitDate,
          "Chit Payment": payment.ChitPayment,
          "Other Expense": "",
          "Other Expense Date": "",
          "Other Payment": "",
        })
      })

      // Add Other Expenses (includes Other Expense Date)
      otherExpenses.forEach((expense) => {
        formattedData.push({
          "Expense on": "",
          "Expense Date": "",
          "Expense Amount": "",
          "Repay Date": "",
          "Repay Amount": "",
          "Chit Date": "",
          "Chit Payment": "",
          "Other Expense": expense.OtherExpense,
          "Other Expense Date": expense.OtherExpenseDate,
          "Other Payment": expense.OtherPayment,
        })
      })

      console.log("Sending data to SheetDB:", JSON.stringify({ data: formattedData }, null, 2))

      const response = await fetch("https://sheetdb.io/api/v1/si5qkk2bym6hc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: formattedData }),
      })

      const result = await response.json()
      console.log("SheetDB Response:", result)

      if (response.ok) {
        alert("Data submitted successfully to Google Sheets!")
        setCreditCardExpenses([])
        setRepayments([])
        setChitPayments([])
        setOtherExpenses([])
      } else {
        alert("Error submitting data: " + (result.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error submitting data. Check console for details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 sm:p-8">
      <Card className="w-full max-w-6xl mx-auto shadow-2xl">
        {/* Enhanced Header */}
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8" />
            <div>
              <CardTitle className="text-2xl sm:text-3xl">Expense Tracker</CardTitle>
              <p className="text-purple-100 text-sm mt-1">Manage credit card expenses, repayments, and payments</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <Tabs defaultValue="credit-card-expense" className="w-full">
            {/* Enhanced Tabs */}
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 mb-10 bg-gray-100 p-2 rounded-lg">
              <TabsTrigger
                value="credit-card-expense"
                className="text-xs sm:text-sm py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white"
              >
                💳 CC Expense
              </TabsTrigger>
              <TabsTrigger
                value="other-expense"
                className="text-xs sm:text-sm py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white"
              >
                📋 Other
              </TabsTrigger>
              <TabsTrigger
                value="repayment"
                className="text-xs sm:text-sm py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white"
              >
                ↩️ Repay
              </TabsTrigger>
              <TabsTrigger
                value="chit-payment"
                className="text-xs sm:text-sm py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700 data-[state=active]:text-white"
              >
                💰 Chit
              </TabsTrigger>
            </TabsList>

            {/* Credit Card Expense Tab */}
            <TabsContent value="credit-card-expense" className="space-y-6 mt-10">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  Record Credit Card Expense
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="font-semibold text-sm text-gray-700">Expense On*</label>
                    <Select
                      value={creditCardExpense.ExpenseOn}
                      onValueChange={(value) => setCreditCardExpense({ ...creditCardExpense, ExpenseOn: value })}
                    >
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-sm text-gray-700">Expense Date*</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal border-gray-300",
                            !creditCardExpense.ExpenseDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-purple-600" />
                          {creditCardExpense.ExpenseDate ? (
                            formatDate(creditCardExpense.ExpenseDate)
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={creditCardExpense.ExpenseDate}
                          onSelect={(date) =>
                            setCreditCardExpense({ ...creditCardExpense, ExpenseDate: date ?? undefined })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-sm text-gray-700">Expense Amount*</label>
                    <Input
                      type="number"
                      value={creditCardExpense.ExpenseAmount}
                      onChange={(e) => setCreditCardExpense({ ...creditCardExpense, ExpenseAmount: e.target.value })}
                      placeholder="Enter amount"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddCreditCardExpense}
                  className="mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Add Credit Card Expense
                </Button>
              </div>

              {creditCardExpenses.length > 0 && (
                <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                  <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Expenses List ({creditCardExpenses.length})
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-green-200">
                    <Table className="bg-white">
                      <TableHeader className="bg-green-50">
                        <TableRow>
                          <TableHead className="font-bold text-gray-700">Expense On</TableHead>
                          <TableHead className="font-bold text-gray-700">Date</TableHead>
                          <TableHead className="font-bold text-gray-700">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {creditCardExpenses.map((expense, index) => (
                          <TableRow key={index} className="hover:bg-green-50 transition-colors">
                            <TableCell className="text-sm font-medium">{expense.ExpenseOn}</TableCell>
                            <TableCell className="text-sm">{expense.ExpenseDate}</TableCell>
                            <TableCell className="text-sm font-semibold text-purple-600">
                              ₹{expense.ExpenseAmount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Other Expense Tab */}
            <TabsContent value="other-expense" className="space-y-6 mt-10">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Record Other Expense
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="font-semibold text-sm text-gray-700">Other Expense*</label>
                    <Input
                      value={otherExpense.OtherExpense}
                      onChange={(e) => setOtherExpense({ ...otherExpense, OtherExpense: e.target.value })}
                      placeholder="Enter description"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-sm text-gray-700">Other Expense Date*</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal border-gray-300",
                            !otherExpense.OtherExpenseDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-orange-600" />
                          {otherExpense.OtherExpenseDate ? (
                            formatDate(otherExpense.OtherExpenseDate)
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={otherExpense.OtherExpenseDate}
                          onSelect={(date) => setOtherExpense({ ...otherExpense, OtherExpenseDate: date ?? undefined })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-sm text-gray-700">Other Payment*</label>
                    <Input
                      type="number"
                      value={otherExpense.OtherPayment}
                      onChange={(e) => setOtherExpense({ ...otherExpense, OtherPayment: e.target.value })}
                      placeholder="Enter amount"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddOtherExpense}
                  className="mt-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Add Other Expense
                </Button>
              </div>

              {otherExpenses.length > 0 && (
                <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                  <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Other Expenses ({otherExpenses.length})
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-green-200">
                    <Table className="bg-white">
                      <TableHeader className="bg-green-50">
                        <TableRow>
                          <TableHead className="font-bold text-gray-700">Description</TableHead>
                          <TableHead className="font-bold text-gray-700">Date</TableHead>
                          <TableHead className="font-bold text-gray-700">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {otherExpenses.map((expense, index) => (
                          <TableRow key={index} className="hover:bg-green-50 transition-colors">
                            <TableCell className="text-sm font-medium">{expense.OtherExpense}</TableCell>
                            <TableCell className="text-sm">{expense.OtherExpenseDate}</TableCell>
                            <TableCell className="text-sm font-semibold text-orange-600">
                              ₹{expense.OtherPayment}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Credit Card Repayment Tab */}
            <TabsContent value="repayment" className="space-y-6 mt-10">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Record Credit Card Repayment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-semibold text-sm text-gray-700">Repay Date*</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal border-gray-300",
                            !repayment.RepayDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                          {repayment.RepayDate ? formatDate(repayment.RepayDate) : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={repayment.RepayDate}
                          onSelect={(date) => setRepayment({ ...repayment, RepayDate: date ?? undefined })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-sm text-gray-700">Repay Amount*</label>
                    <Input
                      type="number"
                      value={repayment.RepayAmount}
                      onChange={(e) => setRepayment({ ...repayment, RepayAmount: e.target.value })}
                      placeholder="Enter amount"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddRepayment}
                  className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Add Repayment
                </Button>
              </div>

              {repayments.length > 0 && (
                <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                  <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Repayments ({repayments.length})
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-green-200">
                    <Table className="bg-white">
                      <TableHeader className="bg-green-50">
                        <TableRow>
                          <TableHead className="font-bold text-gray-700">Date</TableHead>
                          <TableHead className="font-bold text-gray-700">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {repayments.map((payment, index) => (
                          <TableRow key={index} className="hover:bg-green-50 transition-colors">
                            <TableCell className="text-sm">{payment.RepayDate}</TableCell>
                            <TableCell className="text-sm font-semibold text-blue-600">
                              ₹{payment.RepayAmount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Chit Payment Tab */}
            <TabsContent value="chit-payment" className="space-y-6 mt-10">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  Record Chit Payment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-semibold text-sm text-gray-700">Chit Date*</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal border-gray-300",
                            !chitPayment.ChitDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                          {chitPayment.ChitDate ? formatDate(chitPayment.ChitDate) : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={chitPayment.ChitDate}
                          onSelect={(date) => setChitPayment({ ...chitPayment, ChitDate: date ?? undefined })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="font-semibold text-sm text-gray-700">Chit Payment*</label>
                    <Input
                      type="number"
                      value={chitPayment.ChitPayment}
                      onChange={(e) => setChitPayment({ ...chitPayment, ChitPayment: e.target.value })}
                      placeholder="Enter amount"
                      className="border-gray-300"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddChitPayment}
                  className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Add Chit Payment
                </Button>
              </div>

              {chitPayments.length > 0 && (
                <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                  <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Chit Payments ({chitPayments.length})
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-green-200">
                    <Table className="bg-white">
                      <TableHeader className="bg-green-50">
                        <TableRow>
                          <TableHead className="font-bold text-gray-700">Date</TableHead>
                          <TableHead className="font-bold text-gray-700">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {chitPayments.map((payment, index) => (
                          <TableRow key={index} className="hover:bg-green-50 transition-colors">
                            <TableCell className="text-sm">{payment.ChitDate}</TableCell>
                            <TableCell className="text-sm font-semibold text-indigo-600">
                              ₹{payment.ChitPayment}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="flex justify-end mt-10">
            <Button
              onClick={handleSubmitAll}
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                isSubmitting ||
                (creditCardExpenses.length === 0 &&
                  repayments.length === 0 &&
                  chitPayments.length === 0 &&
                  otherExpenses.length === 0)
              }
            >
              {isSubmitting ? (
                <>
                  <DollarSign className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit All to Google Sheets
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ExpenseTracker
