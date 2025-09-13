import { allocationsPath, calendarPath, dashboardPath, departmentsPath, employeesPath, projectsPath,  } from "./app/paths";
import { NavItem } from "./types";



export const SESSION_COOKIE_NAME = "session";
export const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15; // 15 days
export const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2; // 30 days
export const DEFAULTPASSWORD = "demo123"


export const colorOptions = [
    "#1f2937",
    "#dc2626",
    "#ea580c",
    "#d97706",
    "#65a30d",
    "#059669",
    "#0891b2",
    "#2563eb",
    "#7c3aed",
    "#c026d3",
  ]

    export const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  export const weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]


export const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: dashboardPath(),
    },
    {
        title: "Calendar",
        href: calendarPath(),
    },
    {
        title: "Allocations",
        href: allocationsPath(),
    },
    {
        title: "Employees",
        href: employeesPath(),
    },
    {
        title: "Departments",
        href: departmentsPath(),
    },
    {
        title: "Projects",
        href: projectsPath(),
    },
]