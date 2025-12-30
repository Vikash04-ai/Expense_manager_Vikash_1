import ExpenseTracker from "../components/expense-tracker"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gray-50">
      <ExpenseTracker />
    </main>
  )
}
