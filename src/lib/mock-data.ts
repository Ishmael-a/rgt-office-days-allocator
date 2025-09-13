export interface User {
  id: string
  email: string
  name: string
  role: "ADMIN" | "MANAGER" | "EMPLOYEE"
}

export interface Department {
  id: string
  name: string
  description?: string
  color: string
}

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  isActive: boolean
}

export interface Employee {
  id: string
  userId: string
  employeeId: string
  departmentId: string
  managerId?: string
  workType: "HYBRID" | "ONSITE" | "REMOTE"
  officedays: number
  isActive: boolean
  user: User
  department: Department
  projects: Project[]
}

export interface Allocation {
  id: string
  employeeId: string
  date: Date
  month: number
  year: number
  isOfficeDay: boolean
  employee: Employee
}

// Mock Users
export const mockUsers: User[] = [
  { id: "1", email: "admin@company.com", name: "Admin User", role: "ADMIN" },
  { id: "2", email: "manager.eng@company.com", name: "Sarah Johnson", role: "MANAGER" },
  { id: "3", email: "manager.design@company.com", name: "Mike Chen", role: "MANAGER" },
  { id: "4", email: "john.doe@company.com", name: "John Doe", role: "EMPLOYEE" },
  { id: "5", email: "jane.smith@company.com", name: "Jane Smith", role: "EMPLOYEE" },
  { id: "6", email: "alex.wilson@company.com", name: "Alex Wilson", role: "EMPLOYEE" },
  { id: "7", email: "emma.brown@company.com", name: "Emma Brown", role: "EMPLOYEE" },
  { id: "8", email: "david.lee@company.com", name: "David Lee", role: "EMPLOYEE" },
  { id: "9", email: "lisa.garcia@company.com", name: "Lisa Garcia", role: "EMPLOYEE" },
]

// Mock Departments
export const mockDepartments: Department[] = [
  { id: "dept-1", name: "Engineering", description: "Software Development", color: "#3b82f6" },
  { id: "dept-2", name: "Design", description: "UI/UX Design", color: "#8b5cf6" },
  { id: "dept-3", name: "Marketing", description: "Marketing & Growth", color: "#10b981" },
  { id: "dept-4", name: "Sales", description: "Sales & Business Development", color: "#f59e0b" },
]

// Mock Projects
export const mockProjects: Project[] = [
  { id: "proj-1", name: "Mobile App", description: "iOS/Android app development", color: "#3b82f6", isActive: true },
  { id: "proj-2", name: "Website Redesign", description: "Company website overhaul", color: "#8b5cf6", isActive: true },
  {
    id: "proj-3",
    name: "Marketing Campaign",
    description: "Q1 marketing initiatives",
    color: "#10b981",
    isActive: true,
  },
  { id: "proj-4", name: "Sales Platform", description: "CRM integration project", color: "#f59e0b", isActive: true },
]

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    userId: "2",
    employeeId: "EMP001",
    departmentId: "dept-1",
    workType: "HYBRID",
    officedays: 3,
    isActive: true,
    user: mockUsers[1],
    department: mockDepartments[0],
    projects: [mockProjects[0], mockProjects[1]],
  },
  {
    id: "emp-2",
    userId: "3",
    employeeId: "EMP002",
    departmentId: "dept-2",
    workType: "HYBRID",
    officedays: 2,
    isActive: true,
    user: mockUsers[2],
    department: mockDepartments[1],
    projects: [mockProjects[1]],
  },
  {
    id: "emp-3",
    userId: "4",
    employeeId: "EMP003",
    departmentId: "dept-1",
    managerId: "emp-1",
    workType: "HYBRID",
    officedays: 3,
    isActive: true,
    user: mockUsers[3],
    department: mockDepartments[0],
    projects: [mockProjects[0]],
  },
  {
    id: "emp-4",
    userId: "5",
    employeeId: "EMP004",
    departmentId: "dept-1",
    managerId: "emp-1",
    workType: "ONSITE",
    officedays: 5,
    isActive: true,
    user: mockUsers[4],
    department: mockDepartments[0],
    projects: [mockProjects[0], mockProjects[3]],
  },
  {
    id: "emp-5",
    userId: "6",
    employeeId: "EMP005",
    departmentId: "dept-2",
    managerId: "emp-2",
    workType: "REMOTE",
    officedays: 0,
    isActive: true,
    user: mockUsers[5],
    department: mockDepartments[1],
    projects: [mockProjects[1]],
  },
  {
    id: "emp-6",
    userId: "7",
    employeeId: "EMP006",
    departmentId: "dept-3",
    workType: "HYBRID",
    officedays: 2,
    isActive: true,
    user: mockUsers[6],
    department: mockDepartments[2],
    projects: [mockProjects[2]],
  },
  {
    id: "emp-7",
    userId: "8",
    employeeId: "EMP007",
    departmentId: "dept-4",
    workType: "HYBRID",
    officedays: 3,
    isActive: true,
    user: mockUsers[7],
    department: mockDepartments[3],
    projects: [mockProjects[3]],
  },
  {
    id: "emp-8",
    userId: "9",
    employeeId: "EMP008",
    departmentId: "dept-3",
    workType: "HYBRID",
    officedays: 2,
    isActive: true,
    user: mockUsers[8],
    department: mockDepartments[2],
    projects: [mockProjects[2]],
  },
]

// In-memory storage for allocations
export let mockAllocations: Allocation[] = []

// Helper functions
export function findUserByEmail(email: string): User | undefined {
  return mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase())
}

export function findEmployeeByUserId(userId: string): Employee | undefined {
  return mockEmployees.find((emp) => emp.userId === userId)
}

export function getEmployeesByManager(managerId: string): Employee[] {
  return mockEmployees.filter((emp) => emp.managerId === managerId)
}

export function getAllocationsForMonth(month: number, year: number): Allocation[] {
  return mockAllocations.filter((alloc) => alloc.month === month && alloc.year === year)
}

export function generateMockAllocations(month: number, year: number): Allocation[] {
  const allocations: Allocation[] = []
  const daysInMonth = new Date(year, month, 0).getDate()

  // Generate working days (Monday to Friday)
  const workingDays: Date[] = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      workingDays.push(date)
    }
  }

  mockEmployees.forEach((employee) => {
    workingDays.forEach((date, index) => {
      let isOfficeDay = false

      // Determine office day based on work type
      if (employee.workType === "ONSITE") {
        isOfficeDay = true
      } else if (employee.workType === "HYBRID") {
        // Simple pattern: alternate days with some randomness to avoid consecutive days
        const dayOfWeek = date.getDay()
        const weekOfMonth = Math.floor(index / 5)

        // Different patterns for different employees to avoid everyone on same days
        const employeeOffset = Number.parseInt(employee.id.split("-")[1]) || 0
        const pattern = (dayOfWeek + weekOfMonth + employeeOffset) % 5

        if (employee.officedays === 3) {
          isOfficeDay = pattern === 0 || pattern === 2 || pattern === 4
        } else if (employee.officedays === 2) {
          isOfficeDay = pattern === 1 || pattern === 3
        }
      }
      // REMOTE employees stay false (no office days)

      allocations.push({
        id: `alloc-${employee.id}-${date.getTime()}`,
        employeeId: employee.id,
        date: new Date(date),
        month,
        year,
        isOfficeDay,
        employee,
      })
    })
  })

  return allocations
}

// Initialize with current month allocations
const now = new Date()
const currentMonth = now.getMonth() + 1
const currentYear = now.getFullYear()
mockAllocations = generateMockAllocations(currentMonth, currentYear)

export const mockData = {
  users: mockUsers,
  departments: mockDepartments,
  projects: mockProjects,
  employees: mockEmployees,
  allocations: mockAllocations,
}
