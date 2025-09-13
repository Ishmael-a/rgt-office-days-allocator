import { redirect } from "next/navigation";
import getAuthOrRedirect from "./_auth/get-auth-or-redirect";

export default async function Home() {
 try {
    // Check if user is authenticated
    await getAuthOrRedirect();
    // If authenticated, redirect to dashboard
    redirect('/dashboard');
  } catch (error) {
    // If not authenticated, getAuthOrRedirect will handle the redirect to login
    // This catch block may not execute depending on how your auth function works
    redirect('/sign-in');
  }
}
