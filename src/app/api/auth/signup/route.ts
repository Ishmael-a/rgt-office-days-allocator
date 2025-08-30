import { Prisma } from '../../../../../generated/prisma';
import { createSession, setSessionCookie } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { signupSchema } from "@/lib/validations"
import { generateSessionToken } from "@/utils/crypto"
import { hashPassword } from "@/utils/hash-and-compare"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    if (!email || !password || !username) {
      return NextResponse.json({ error: "Email, Username and password are required" }, { status: 400 })
    }
    
    const validatedData= await signupSchema.validate({ email, password, username }, { abortEarly: false })

    const hashedPassword = await hashPassword(validatedData.password)
    
    const newUser = await prisma.user.create({
        data: {
            email: validatedData.email,
            name: validatedData.username,
            passwordHash: hashedPassword
        }
    })

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, newUser.id)
    await setSessionCookie(sessionToken, session.expiresAt)

    return NextResponse.json({ success: true, message: "Signed Up Successfully." }, { status: 200 })

  } catch (error) {
    console.error("Sign Up error:", error)
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"){
        return NextResponse.json(
            "Either email or username already in use",{ status: 500 }
        );
    }
    return NextResponse.json({ error: "Sign Up Failed. Internal server error" }, { status: 500 })
  }  
}
