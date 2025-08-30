import { calendarPath, dashboardPath, employeesPath, schedulePath } from "./app/paths";
import { NavItem } from "./types";



export const SESSION_COOKIE_NAME = "session";
export const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15; // 15 days
export const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2; // 30 days
export const DEFAULTPASSWORD = "demo123"





export const navItems: NavItem[] = [
    {
        title: "Dashboard",
        href: dashboardPath(),
    },
    {
        title: "Employees",
        href: employeesPath(),
    },
    {
        title: "Schedule",
        href: schedulePath(),
    },
    {
        title: "Calendar",
        href: calendarPath(),
    }
]