import { NextResponse } from "next/server"
import { deleteSessionCookie, invalidateSession } from "@/lib/auth";
import { getAuth } from "@/app/_auth/get-auth";
import { redirect } from "next/navigation";
import { signInPath } from "@/app/paths";
// import { SESSION_COOKIE_NAME } from "@/constants";

export async function GET() {
  try {
    const { session } = await getAuth();

    if (!session) {
      redirect(signInPath());
    }

    await invalidateSession(session.id)
    await deleteSessionCookie()
    // const cookieStore = await cookies()
    // cookieStore.delete(SESSION_COOKIE_NAME)

    // return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }

  redirect(signInPath());
}