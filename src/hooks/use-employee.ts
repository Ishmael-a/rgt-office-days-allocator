import axios from "axios";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  FetchEmployeeQuery } from "@/types";
import { EmployeeUpsertDTO } from "@/features/employee/schema/employee-schema";
import { toast } from "sonner";

const getAllEmployees = async ({ query = {} }: { query?: FetchEmployeeQuery }) => {
    const response = await axios.get('api/employees', {
        params: {
            ...query
        }
    })

    return response.data;
}

export async function upsertEmployeeApi(dto: EmployeeUpsertDTO) {
  const response = await axios.post("/api/employees", { ...dto })

  return response.data;
}


export const useEmployeesQuery = (props?: { query?: FetchEmployeeQuery }) => {
    const queryParams = props?.query;

    return useQuery({
        queryKey: ['employees', queryParams],
        queryFn: () => getAllEmployees({ query: queryParams }),
    })
}


export function useUpsertEmployee() {
    const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsertEmployeeApi,
    onSuccess: (data) => {
        queryClient.invalidateQueries({
            queryKey: ['employees']
        })
        toast(data.message)
    },
    onError: (err) => {
      toast(err.message);
    },
  })
}
