import { useForm } from "react-hook-form"
import { useLogin } from "../hooks/useLogin"

export const LoginForm = () => {
  const { register, handleSubmit } = useForm()
  const loginMutation = useLogin()

  const onSubmit = (data: any) => {
    loginMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("email")}
        placeholder="Email"
        className="w-full border p-2"
      />

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="w-full border p-2"
      />

      <button className="w-full bg-blue-500 text-white p-2">
        Iniciar sesión
      </button>
    </form>
  )
}