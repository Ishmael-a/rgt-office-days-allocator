import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios"

const signIn = async ({email, password}:{email: string, password: string}) => {
    const response = await axios.post('api/auth/login',{ email, password })

    return response.data;
}

export const useSignIn = () => {
  const router = useRouter()

  const { mutateAsync, ...rest } = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      toast(data.message)
      router.push("/dashboard")
      router.refresh()
    },
    onError: (err) => {
      toast(err.message);
    },
  });

  return {
    ...rest,
    login: mutateAsync,
  };
};