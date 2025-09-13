import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Department } from "@/features/department/types";
import { ApiResponse, FetchDepartmentQuery } from "@/types";
import { DepartmentUpsertDTO } from "@/features/department/schema/department-schema";
import { toast } from "sonner";

const getAllDepartments = async ({ query = {} }: { query?: FetchDepartmentQuery }):Promise<ApiResponse<Department>> => {
    const response = await axios.get('api/departments',{
        params: {...query}
    } )

    return response.data;
}

export async function upsertDepartmentApi(dto: DepartmentUpsertDTO) {
  const response = await axios.post("/api/departments", { ...dto })

  return response.data;
}


export const useDepartmentsQuery = (props?: { query?: FetchDepartmentQuery }) => {
    const queryParams = props?.query;
    return useQuery({
        queryKey: ['departments', queryParams],
        queryFn: () => getAllDepartments({
            query: queryParams
        }),
    })
}


export function useUpsertDepartment() {
    const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsertDepartmentApi,
    onSuccess: (data) => {
        queryClient.invalidateQueries({
            queryKey: ['departments']
        })
        toast(data.message)
    },
    onError: (err) => {
      toast(err.message);
    },
  })
}