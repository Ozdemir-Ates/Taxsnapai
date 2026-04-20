"use client"

import { FormError } from "@/components/forms/error"
import { FormInput } from "@/components/forms/simple"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import config from "@/lib/config"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

export function LoginForm({ defaultEmail }: { defaultEmail?: string }) {
  const [email, setEmail] = useState(defaultEmail || "")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isRegistering) {
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        })
        if (result.error) {
          setError(result.error.message || "Failed to create account")
          setIsLoading(false)
          return
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        })
        if (result.error) {
          setError(result.error.message || "Invalid credentials")
          setIsLoading(false)
          return
        }
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {isRegistering && (
        <FormInput
          title="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required={isRegistering}
          disabled={isLoading}
        />
      )}
      
      <FormInput
        title="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      <FormInput
        title="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Please wait..." : isRegistering ? "Sign Up" : "Sign In"}
      </Button>

      {error && <FormError className="text-center">{error}</FormError>}

      {!config.auth.disableSignup && (
        <div className="text-center mt-2">
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
            onClick={() => {
              setIsRegistering(!isRegistering)
              setError(null)
            }}
          >
            {isRegistering
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      )}
    </form>
  )
}
