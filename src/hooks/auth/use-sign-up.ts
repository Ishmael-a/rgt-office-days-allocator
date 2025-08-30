import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const signUp = async ({email, password, username}:{email: string, password: string, username: string}) => {
    const response = await axios.post('api/auth/signup',{ email, password, username })

    return response.data;
}

export const useSignUp = () => {
  const router = useRouter()

  const { mutate, ...rest } = useMutation({
    mutationFn: signUp,
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
    signup: mutate,
  };
};