import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Project, ProjectWithEmployees } from "@/features/project/types";
import { ApiResponse, FetchProjectQuery } from "@/types";
import { ProjectUpsertDTO } from "@/features/project/schema/project-schema";
import { toast } from "sonner";

const getAllProjects = async ({ query = {} }: { query?: FetchProjectQuery }):Promise<ApiResponse<Project|ProjectWithEmployees>> => {
    const response = await axios.get('api/projects', {
        params: {...query}
    })

    return response.data;
}

export async function upsertProjectApi(dto: ProjectUpsertDTO) {
  const response = await axios.post("/api/projects", { ...dto })

  return response.data;
}

export async function deleteProjectByIdApi(id: string) {
  const response = await axios.delete(`/api/projects/${id}`)

  return response.data;
}


export const useProjectsQuery = (props?: { query?: FetchProjectQuery }) => {
    const queryParams = props?.query;

    return useQuery({
        queryKey: ['projects', queryParams],
        queryFn: () => getAllProjects({ query: queryParams }),
    })
}

export function useUpsertProjects() {
    const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsertProjectApi,
    onSuccess: (data) => {
        queryClient.invalidateQueries({
            queryKey: ['projects']
        })
        toast(data.message)
    },
    onError: (err) => {
      toast(err.message);
    },
  })
}

export function useDeleteProject() {
    const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProjectByIdApi,
    onSuccess: (data) => {
        queryClient.invalidateQueries({
            queryKey: ['projects']
        })
        toast(data.message)
    },
    onError: (err) => {
      toast(err.message);
    },
  })
}
