"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Edit3, Save, RotateCcw } from "lucide-react"
import { toast } from "sonner"

interface EmployeeReassignmentProps {
  month: number
  year: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allocations: any[]
  onReassignmentComplete: () => void
}

export function EmployeeReassignment({ month, year, allocations, onReassignmentComplete }: EmployeeReassignmentProps) {
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [reason, setReason] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const selectedAllocation = allocations.find((a) => a.employee?.id === selectedEmployee)

  // Get working days for the month
  const getWorkingDays = () => {
    const days = []
    const lastDay = new Date(year, month, 0).getDate()

    for (let day = 1; day <= lastDay; day++) {
      const currentDate = new Date(year, month - 1, day)
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Exclude weekends
        days.push(day)
      }
    }
    return days
  }

  const workingDays = getWorkingDays()

  const handleDayToggle = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b),
    )
  }

  const handleReassign = async () => {
    if (!selectedEmployee || selectedDays.length === 0) {
      toast("Please select an employee and at least one office day")
      return
    }

    // Check for consecutive days
    const hasConsecutiveDays = selectedDays.some((day, index) => index > 0 && day === selectedDays[index - 1] + 1)

    if (hasConsecutiveDays) {
      toast("Consecutive office days are not allowed")
      return
    }

    setIsUpdating(true)

    try {
      const response = await fetch("/api/allocations/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          month,
          year,
          officeDays: selectedDays,
          reason: reason || "Manager reassignment",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onReassignmentComplete()
        setSelectedEmployee("")
        setSelectedDays([])
        setReason("")
      } else {
        toast(data.error || "Failed to update allocation")
      }
    } catch (error) {
      toast("An error occurred while updating allocation")
      console.log("An error occurred while updating allocation", error)

    } finally {
      setIsUpdating(false)
    }
  }

  const resetToOriginal = () => {
    if (selectedAllocation) {
      setSelectedDays([...(selectedAllocation.officeDays || [])])
    }
  }

  useEffect(() => {
    if (selectedAllocation) {
      setSelectedDays([...(selectedAllocation.officeDays || [])])
    } else {
      setSelectedDays([])
    }
  }, [selectedEmployee, selectedAllocation])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          Reassign Employee Days
        </CardTitle>
        <CardDescription>
          Modify individual employee office day assignments. System will automatically reshuffle to maintain balance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Employee</Label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an employee to reassign" />
            </SelectTrigger>
            <SelectContent>
              {allocations.map((allocation) => (
                <SelectItem key={allocation.employee?.id} value={allocation.employee?.id}>
                  {allocation.employee?.name || "Unknown"} - {allocation.employee?.department?.name || "Unknown"} (
                  {allocation.employee?.workType || "Unknown"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAllocation && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Office Days Selection</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={resetToOriginal}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Badge variant="secondary">{selectedDays.length} days selected</Badge>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {workingDays.map((day) => {
                  const date = new Date(year, month - 1, day)
                  const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
                  const isSelected = selectedDays.includes(day)
                  const isOriginal = (selectedAllocation.officeDays || []).includes(day)

                  return (
                    <Button
                      key={day}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDayToggle(day)}
                      className={`flex flex-col p-2 h-auto ${
                        isOriginal && !isSelected ? "border-orange-300 bg-orange-50" : ""
                      }`}
                    >
                      <span className="text-xs">{dayName}</span>
                      <span className="font-medium">{day}</span>
                    </Button>
                  )
                })}
              </div>

              <div className="text-xs text-muted-foreground">
                <span className="inline-block w-3 h-3 bg-orange-100 border border-orange-300 rounded mr-2"></span>
                Original assignment
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reason for Change (Optional)</Label>
              <Textarea
                placeholder="Enter reason for reassignment..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            <Button onClick={handleReassign} disabled={isUpdating} className="w-full">
              {isUpdating ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Updating & Reshuffling...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Assignment
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
