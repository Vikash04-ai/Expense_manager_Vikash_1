export async function GET() {
  try {
    console.log("[v0] Testing SheetDB connection...")

    const testData = {
      "Expense on": "Test Entry",
      "Expense Date": "2026-02-07",
      "Expense Amount": "100",
      "Repay Date": "",
      "Repay Amount": "",
      "Chit Date": "",
      "Chit Payment": "",
      "Other Expense": "",
      "Other Expense Date": "",
      "Other Payment": "",
    }

    const sheetDbUrl = "https://sheetdb.io/api/v1/si5qkk2bym6hc"

    console.log("[v0] Sending test request to:", sheetDbUrl)
    console.log("[v0] Test data:", JSON.stringify(testData, null, 2))

    const response = await fetch(sheetDbUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: testData }),
    })

    console.log("[v0] SheetDB Response Status:", response.status)
    console.log("[v0] Response Headers:", Object.fromEntries(response.headers))

    const result = await response.json()
    console.log("[v0] SheetDB Response Body:", result)

    if (response.ok) {
      return Response.json({
        success: true,
        message: "SheetDB connection is working!",
        response: result,
      })
    } else {
      return Response.json(
        {
          success: false,
          error: result.error || "SheetDB returned an error",
          response: result,
          status: response.status,
        },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error("[v0] Test Error:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to connect to SheetDB: " + String(error),
      },
      { status: 500 }
    )
  }
}
