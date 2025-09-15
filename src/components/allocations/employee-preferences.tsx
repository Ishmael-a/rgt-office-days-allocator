"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Settings, Save, Heart } from "lucide-react"
import { mockData } from "@/lib/mock-data"
import {toast} from 'sonner'

interface EmployeePreferencesProps {
  month: number
  year: number
}

export function EmployeePreferences({ month, year }: EmployeePreferencesProps) {
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [preferredDays, setPreferredDays] = useState<string[]>([])
  const [avoidedDays, setAvoidedDays] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const employees = mockData.employees.filter((emp) => emp.workType === "HYBRID")
  const weekdays = [
    { value: "MONDAY", label: "Monday" },
    { value: "TUESDAY", label: "Tuesday" },
    { value: "WEDNESDAY", label: "Wednesday" },
    { value: "THURSDAY", label: "Thursday" },
    { value: "FRIDAY", label: "Friday" },
  ]

  const selectedEmployeeData = employees.find((emp) => emp.id === selectedEmployee)

  const handlePreferredDayToggle = (day: string) => {
    setPreferredDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
    // Remove from avoided if adding to preferred
    if (!preferredDays.includes(day)) {
      setAvoidedDays((prev) => prev.filter((d) => d !== day))
    }
  }

  const handleAvoidedDayToggle = (day: string) => {
    setAvoidedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
    // Remove from preferred if adding to avoided
    if (!avoidedDays.includes(day)) {
      setPreferredDays((prev) => prev.filter((d) => d !== day))
    }
  }

  const handleSavePreferences = async () => {
    if (!selectedEmployee) {
      toast("Please select an employee")
    //   toast({
    //     title: "Error",
    //     description: "Please select an employee",
    //     variant: "destructive",
    //   })
      return
    }

    setIsSaving(true)

    try {
      // Simulate API call - in real app this would save to database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast("Employee preferences saved successfully")
    //   toast({
    //     title: "Success",
    //     description: "Employee preferences saved successfully",
    //   })

      // Reset form
      setSelectedEmployee("")
      setPreferredDays([])
      setAvoidedDays([])
    } catch (error) {
      toast("Failed to save preferences")
      console.log("Failed to save preferences", error)
    //   toast({
    //     title: "Error",
    //     description: "Failed to save preferences",
    //     variant: "destructive",
    //   })
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    // Reset preferences when employee changes
    setPreferredDays([])
    setAvoidedDays([])
  }, [selectedEmployee])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Employee Preferences
        </CardTitle>
        <CardDescription>
          Set soft preferences for employee office days. These are considered during allocation but not guaranteed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Employee</Label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a hybrid employee" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.id} - {employee.department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEmployeeData && (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-green-600" />
                <Label>Preferred Days</Label>
                <Badge variant="secondary">{preferredDays.length} selected</Badge>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {weekdays.map((day) => (
                  <Button
                    key={day.value}
                    variant={preferredDays.includes(day.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePreferredDayToggle(day.value)}
                    className={preferredDays.includes(day.value) ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-red-600"></div>
                <Label>Days to Avoid</Label>
                <Badge variant="secondary">{avoidedDays.length} selected</Badge>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {weekdays.map((day) => (
                  <Button
                    key={day.value}
                    variant={avoidedDays.includes(day.value) ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleAvoidedDayToggle(day.value)}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">How Preferences Work</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Preferred days are prioritized during allocation</li>
                <li>• Avoided days are deprioritized but may still be assigned if needed</li>
                <li>• System constraints (no consecutive days) always take precedence</li>
                <li>• Team collaboration needs may override individual preferences</li>
              </ul>
            </div>

            <Button onClick={handleSavePreferences} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Settings className="mr-2 h-4 w-4 animate-spin" />
                  Saving Preferences...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
