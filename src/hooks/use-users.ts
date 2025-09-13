import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types";
import { User } from "@/features/users/types";

const getAllUsers = async ():Promise<ApiResponse<User>> => {
    const response = await axios.get('api/auth/users')

    return response.data;
}


export const useUsersQuery = () => {

    return useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
    })
}