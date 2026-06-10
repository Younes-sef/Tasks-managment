'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '@/lib/auth-api'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, LogIn, Mail, Lock } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState<string>("")

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setGeneralError("")
    try {
      const res = await login(data)
      if (res.token && res.user) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('name', res.user.name)
      }        router.push('/dashboard')

    } catch (error) {
      console.error(error)
      setError('email', { message: 'Invalid email or password' })
      setGeneralError('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <Card className="w-full max-w-md shadow-none border-0 bg-white/95 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your TaskFlow account
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
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email"
                  className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                  {...register('password')}
                  placeholder="Enter your password"
                  className="pl-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/register")}
                className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors"
              >
                Create one
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
