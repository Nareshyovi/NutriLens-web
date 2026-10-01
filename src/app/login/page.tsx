'use client'

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { login } from "./actions";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 max-w-[400px] w-full mx-auto p-4 flex flex-col justify-center h-screen">
      <header className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-extrabold text-[var(--color-primary)] mb-2">NutriLens</h1>
        <p className="text-[var(--color-on-surface-variant)]">Welcome back</p>
      </header>

      <Card className="flex flex-col gap-6 w-full">
        <form action={handleSubmit} className="flex flex-col gap-4">
          <Input 
            label="Email" 
            name="email" 
            type="email" 
            placeholder="you@example.com" 
            required 
          />
          <Input 
            label="Password" 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
          
          {error && <div className="text-[var(--color-error)] text-sm bg-[var(--color-error-container)] p-3 rounded-lg">{error}</div>}
          
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="text-center text-sm text-[var(--color-on-surface-variant)]">
          Don't have an account? <Link href="/register" className="text-[var(--color-primary)] font-semibold">Sign up</Link>
        </div>
      </Card>
    </div>
  );
}
