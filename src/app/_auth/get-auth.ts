'use server'

import { SESSION_COOKIE_NAME } from "@/constants"
import { validateSession } from "@/lib/auth"
import { cookies } from "next/headers"
import { cache } from "react"



export const getAuth = cache(async () => {

    const cookieStore = await cookies()

    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null

    if(!sessionToken){
        return {
            user: null,
            session: null
        }
    }

    return await validateSession(sessionToken)
})