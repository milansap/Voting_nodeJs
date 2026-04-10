'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginSchema } from '@/lib/zodSchema'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormProvider } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { citizenship_no: '', password: '' },
  })

  const onSubmit = async (values: LoginSchema) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error('Login failed')

      const result = await response.json()
      console.log('Login successful:', result)
      // Handle redirect or token storage here
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Citizenship No. Field */}
        <FormField
          control={form.control}
          name="citizenship_no"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>CitizenShip No.</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter your Citizenship No."
                    className={`pl-10 ${
                      fieldState?.error ? "border-red-500 bg-red-50" : ""
                    }`}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`pl-10 pr-12 ${
                      fieldState?.error ? "border-red-500 bg-red-50" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#059669] hover:bg-[#047857] dark:bg-[#10B981] dark:hover:bg-[#059669] text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </FormProvider>
  )
}
