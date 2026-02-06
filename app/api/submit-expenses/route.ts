export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data } = body

    console.log("[v0] Received data from client:", JSON.stringify(data, null, 2))

    if (!data || !Array.isArray(data)) {
      return Response.json(
        { error: "Invalid data format. Expected an array." },
        { status: 400 }
      )
    }

    // SheetDB API endpoint
    const sheetDbUrl = "https://sheetdb.io/api/v1/si5qkk2bym6hc"
    
    console.log("[v0] Sending to SheetDB URL:", sheetDbUrl)
    console.log("[v0] Data being sent:", JSON.stringify({ data }, null, 2))

    // Send data to SheetDB - send each record individually for better reliability
    const responses: any[] = []
    let successCount = 0
    let failureCount = 0

    for (let i = 0; i < data.length; i++) {
      try {
        const response = await fetch(sheetDbUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: data[i] }),
        })

        const result = await response.json()
        console.log(`[v0] SheetDB Response ${i + 1}:`, result)

        if (response.ok) {
          successCount++
          responses.push({ index: i, success: true, data: result })
        } else {
          failureCount++
          responses.push({ 
            index: i, 
            success: false, 
            error: result.error || "Unknown error",
            status: response.status 
          })
          console.error(`[v0] SheetDB Error for record ${i + 1}:`, result)
        }
      } catch (error) {
        failureCount++
        responses.push({ 
          index: i, 
          success: false, 
          error: String(error) 
        })
        console.error(`[v0] Error submitting record ${i + 1}:`, error)
      }
    }

    console.log(`[v0] Summary - Success: ${successCount}, Failed: ${failureCount}`)

    if (failureCount === 0) {
      return Response.json({ 
        success: true, 
        message: `All ${successCount} records submitted successfully`,
        details: responses 
      })
    } else if (successCount > 0) {
      return Response.json({ 
        success: true, 
        message: `${successCount} records submitted successfully, ${failureCount} failed`,
        details: responses 
      }, { status: 207 })
    } else {
      return Response.json(
        { 
          error: "All records failed to submit", 
          details: responses 
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[v0] API Error:", error)
    return Response.json(
      { error: "Internal server error: " + String(error) },
      { status: 500 }
    )
  }
}
