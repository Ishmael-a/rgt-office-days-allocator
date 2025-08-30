
import { createSession, setSessionCookie } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { signInSchema } from "@/lib/validations"
import { generateSessionToken } from "@/utils/crypto"
import { comparePassword } from "@/utils/hash-and-compare"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }
    
    const validatedData= await signInSchema.validate({ email, password }, { abortEarly: false })
    
    const user = await prisma.user.findUnique({
        where: {
            email: validatedData.email
        }
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
 

    const validPassword = await comparePassword(validatedData.password, user.passwordHash);
    // Demo password check
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id)
    await setSessionCookie(sessionToken,session.expiresAt)

    return NextResponse.json({ success: true, message: "Logged In Successfully." }, { status: 200 })

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login Failed. Internal server error" }, { status: 500 })
  }

  // redirect(dashboardPath())
}
