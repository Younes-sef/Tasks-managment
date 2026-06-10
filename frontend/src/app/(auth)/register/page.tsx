"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { register as apiRegister } from "@/lib/auth-api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserPlus, Mail, Lock, Shield } from "lucide-react"

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "user",
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState<string>("")

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setGeneralError("")

    try {
      const res = await apiRegister({ ...data, name: data.username })
      if (res.token && res.user) {
        localStorage.setItem("token", res.token)
        localStorage.setItem("name", res.user.name)
      }        router.push("/dashboard")

    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        if (error.message.includes("username")) {
          setError("username", { message: "Username already exists" })
        } else if (error.message.includes("email")) {
          setError("email", { message: "Email already exists" })
        } else {
          setGeneralError("Registration failed. Please try again.")
        }
      } else {
        setGeneralError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-none border-0 bg-white/95 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Join TaskFlow</CardTitle>
          <CardDescription className="text-gray-600">
            Create your account to start managing tasks efficiently
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {generalError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{generalError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="Enter your username"
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Create a password"
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Role
              </Label>
              <Select onValueChange={(value) => setValue("role", value as "user" | "admin")} defaultValue="user">
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Select your role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      User
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
