import { SESSION_COOKIE_NAME, SESSION_MAX_DURATION_MS, SESSION_REFRESH_INTERVAL_MS } from "@/constants";
import { hashToken } from "@/utils/crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";



export async function setSessionCookie(sessionToken: string, expiresAt: Date){

    const cookie = {
        name: SESSION_COOKIE_NAME,
        value: sessionToken,
        attributes: {
            httpOnly: true,
            sameSite: "lax" as const,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            expires: expiresAt,
        }
    }

    const cookieStore = await cookies();
    cookieStore.set(cookie.name, cookie.value, cookie.attributes)

    return cookie.value
}


export const createSession = async (sessionToken: string, userId: string) => {
    const sessionId = hashToken(sessionToken);
  
    const session = {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS),
    };
  
    await prisma.session.create({
      data: session,
    });
    console.log("Created Session", sessionId)
    return session;
};

export const deleteSessionCookie = async () => {
  const cookie = {
    name: SESSION_COOKIE_NAME,
    value: "",
    attributes: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    },
  };

  (await cookies()).set(cookie.name, cookie.value, cookie.attributes);
};


export const validateSession = async (sessionToken:string) => {
    const sessionId = hashToken(sessionToken);

    const result = await prisma.session.findUnique({
        where: {
           id: sessionId
        },
        include: {
            user: true
        }
    })

    if(!result){
        return { session: null , user: null }
    }

    const { user, ...session } = result;

    if(Date.now() >= session.expiresAt.getTime()){
        await prisma.session.delete({
            where: {
                id: sessionId
            }
        })

        return { session: null, user: null}
    }


    if(Date.now() >= session.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS){
        session.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);

        await prisma.session.update({
            where: {
                id: sessionId
            },
            data: {
                expiresAt: session.expiresAt
            }
        })
    }

    return { session, user }
}


  export const invalidateSession = async (sessionId: string) => {
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });
  };