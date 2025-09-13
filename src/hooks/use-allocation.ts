import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios"
import { AllocationWithEmployee } from "@/features/allocation/types";
import { AllocationQueryParam, ApiResponse } from "@/types";

const generateAllocation = async ({ month, year }:{month: number, year: number}) => {
    const response = await axios.post('api/allocations/generate', { month, year })

    return response.data;
}

const getAllocations = async ({ month, year, query={} }:{
  month: number, 
  year: number, 
  query?: AllocationQueryParam
}):Promise<ApiResponse<AllocationWithEmployee>> => {
    const response = await axios.get(`api/allocations/${month}/${year}`, {
      params: {
        ...query
      } 
    })

    return response.data;
}


export const useAllocationQuery = ({ month, year }:{month: number, year: number}) => {

    return useQuery({
        queryKey: ['allocations', month, year],
        queryFn: () => getAllocations({ month, year }),
    })

}

export const useAllocationQueryByUserId = ({ month, year, query }:{ month: number, year: number, query: AllocationQueryParam }) => {

    return useQuery({
        queryKey: ['allocations', month, year, query],
        queryFn: () => getAllocations({ month, year, query }),
        enabled: !!query.userId,
    })

}

export const useGenerateAllocation = () => {

  const { mutateAsync, ...rest } = useMutation({
    mutationFn: generateAllocation,
    onSuccess: (data) => {
      toast(data.message)
    },
    onError: (err) => {
      toast(err.message);
    },
  });

  return {
    ...rest,
    generateAllocation: mutateAsync,
  };
};