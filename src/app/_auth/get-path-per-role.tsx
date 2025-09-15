import { UserRole } from '@/types'
import { allocationsPath, calendarPath, dashboardPath, signInPath } from '../paths'

const getPathPerRole = (role:`${UserRole}`|null) => {
    switch(role){
        case UserRole.ADMIN:
            return dashboardPath()
        case UserRole.MANAGER:
            return allocationsPath()
        case UserRole.EMPLOYEE:
            return calendarPath()
        default:
            return signInPath()
    }  
}

export default getPathPerRole
