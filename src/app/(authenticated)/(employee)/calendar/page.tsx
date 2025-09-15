import getAuthOrRedirect from "@/app/_auth/get-auth-or-redirect";
import { CalendarView } from "@/components/calendar/calendar-view"

const page = async () => {
  const { user } = await getAuthOrRedirect();
  return (
    <div>
      <CalendarView user={user}/>
    </div>
  )
}

export default page
