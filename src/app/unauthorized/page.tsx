import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getAuth } from "../_auth/get-auth"
import getPathPerRole from "../_auth/get-path-per-role"

export default async function UnauthorizedPage() {
  const { user } = await getAuth()
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-destructive">Access Denied</CardTitle>
          <CardDescription>You don&apos;t have permission to access this page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={getPathPerRole(user?.role || null)}>Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
