"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Users, Clock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Time zone options
const timeZones = [
  "IST (Indian Standard Time)",
  "SGT (Singapore Standard Time)",
  "GMT (Greenwich Mean Time)",
  "EST (Eastern Time)",
  "CST (Central Time)",
  "AKST (Alaska Time)",
  "PST (Pacific Time)",
  "SAST (South Africa Standard Time)",
]

// Helper function to format date as DD/MM/YYYY
const formatDate = (date: Date | undefined | null) => {
  if (!date) return ""
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const InterviewSlots = () => {
  const initialFormState = {
    PanelName: "",
    date: undefined as Date | undefined,
    TimeSlot: "9:00 AM - 10:00 AM",
    TimeZone: "",
  }

  const [form, setForm] = useState(initialFormState)
  const [slots, setSlots] = useState<{ PanelName: string; date: string; TimeSlot: string; TimeZone: string }[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (name: string, value: string | Date | undefined) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleAddSlot = () => {
    if (!form.PanelName || !form.date || !form.TimeZone) {
      alert("Please fill in all required fields (Panel Name, Date, Time Slot, and Time Zone)")
      return
    }

    setSlots([
      ...slots,
      {
        PanelName: form.PanelName,
        date: formatDate(form.date),
        TimeSlot: form.TimeSlot,
        TimeZone: form.TimeZone,
      },
    ])
    setForm(initialFormState)
  }

  const handleSubmit = async () => {
    if (slots.length === 0) {
      alert("No slots to submit.")
      return
    }

    setIsSubmitting(true)

    try {
      const formattedSlots = slots.map((slot) => ({
        "Panel Name": slot.PanelName,
        Date: slot.date,
        "Time Slot": slot.TimeSlot,
        "Time Zone": slot.TimeZone,
      }))

      const response = await fetch("https://sheetdb.io/api/v1/dauarym6qj4fp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: formattedSlots }),
      })

      const result = await response.json()
      console.log("SheetDB Response:", result)

      if (response.ok) {
        alert("Slots submitted successfully to Google Sheets!")
        setSlots([])
      } else {
        alert("Error submitting slots: " + (result.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error submitting slots. Check console for details.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Create time slots that start every 30 minutes but span 1 hour each
  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "9:30 AM - 10:30 AM",
    "10:00 AM - 11:00 AM",
    "10:30 AM - 11:30 AM",
    "11:00 AM - 12:00 PM",
    "11:30 AM - 12:30 PM",
    "12:00 PM - 1:00 PM",
    "12:30 PM - 1:30 PM",
    "1:00 PM - 2:00 PM",
    "1:30 PM - 2:30 PM",
    "2:00 PM - 3:00 PM",
    "2:30 PM - 3:30 PM",
    "3:00 PM - 4:00 PM",
    "3:30 PM - 4:30 PM",
    "4:00 PM - 5:00 PM",
    "4:30 PM - 5:30 PM",
    "5:00 PM - 6:00 PM",
    "5:30 PM - 6:30 PM",
    "6:00 PM - 7:00 PM",
    "6:30 PM - 7:30 PM",
    "7:00 PM - 8:00 PM",
    "7:30 PM - 8:30 PM",
    "8:00 PM - 9:00 PM",
    "8:30 PM - 9:30 PM",
    "9:00 PM - 10:00 PM",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <Card className="w-full max-w-5xl mx-auto shadow-xl">
        {/* Enhanced Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8" />
              <div>
                <CardTitle className="text-2xl sm:text-3xl">Interviewer Availability</CardTitle>
                <p className="text-blue-100 text-sm mt-1">Schedule your panel interview slots</p>
              </div>
            </div>
            <div className="relative h-12 w-32 hidden sm:block">
              <Image
                src="/images/verticurl-logo.png"
                alt="Verticurl Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Add New Availability Slot
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="font-semibold text-sm text-gray-700">Panel Name*</label>
                <Input
                  value={form.PanelName}
                  onChange={(e) => handleChange("PanelName", e.target.value)}
                  placeholder="e.g., Senior Developer Panel"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm text-gray-700">Date*</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-300",
                        !form.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-blue-600" />
                      {form.date ? formatDate(form.date) : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.date}
                      onSelect={(date) => handleChange("date", date ?? undefined)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm text-gray-700">Time Slot*</label>
                <Select value={form.TimeSlot} onValueChange={(value) => handleChange("TimeSlot", value)}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {timeSlots.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm text-gray-700">Time Zone*</label>
                <Select value={form.TimeZone} onValueChange={(value) => handleChange("TimeZone", value)}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleAddSlot}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-all"
            >
              <Clock className="w-4 h-4 mr-2" />
              Add Slot
            </Button>
          </div>

          {/* Slots Table Section */}
          {slots.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Scheduled Slots ({slots.length})</h3>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <Table className="bg-white">
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                      <TableHead className="font-bold text-gray-700">Panel Name</TableHead>
                      <TableHead className="font-bold text-gray-700">Date</TableHead>
                      <TableHead className="font-bold text-gray-700">Time Slot</TableHead>
                      <TableHead className="font-bold text-gray-700">Time Zone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slots.map((slot, index) => (
                      <TableRow key={index} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="text-sm font-medium text-gray-800">{slot.PanelName}</TableCell>
                        <TableCell className="text-sm text-gray-700">{slot.date}</TableCell>
                        <TableCell className="text-sm text-gray-700">{slot.TimeSlot}</TableCell>
                        <TableCell className="text-sm text-gray-600">{slot.TimeZone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-8 rounded-lg transition-all disabled:opacity-50"
              disabled={isSubmitting || slots.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit to Google Sheets
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InterviewSlots
