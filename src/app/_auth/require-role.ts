import { NextResponse } from "next/server"
import { getAuth } from "./get-auth"


const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function requireRole(allowedRoles: ("ADMIN" | "MANAGER" | "EMPLOYEE")[]){
  const { user } = await getAuth()
  console.log("User's role", user?.role)

  if (!user) {
    throw NextResponse.redirect(new URL("/sign-in", baseUrl))
  }

  if (!allowedRoles.includes(user.role)) {
    throw NextResponse.redirect(new URL("/unauthorized", baseUrl))
  }

  return user
}