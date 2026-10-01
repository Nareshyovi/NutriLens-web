import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 max-w-[600px] w-full mx-auto p-4 flex flex-col gap-8">
      <header className="py-8 text-center">
        <h1 className="font-heading text-4xl font-extrabold text-[var(--color-primary)] mb-2">NutriLens</h1>
        <p className="text-[var(--color-on-surface-variant)]">AI Calorie Tracker & Nutrition</p>
      </header>

      <main className="flex flex-col gap-6">
        <Card className="flex flex-col items-center text-center gap-4">
          <h2 className="font-heading text-2xl font-bold">Welcome to NutriLens</h2>
          <p className="text-[var(--color-on-surface-variant)] mb-4">
            Track your meals effortlessly using AI and camera scans. Build a positive relationship with your nutrition.
          </p>
          <div className="flex flex-col w-full gap-3">
            <Link href="/login" className="w-full">
              <Button fullWidth>Log In</Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button variant="secondary" fullWidth>Create Account</Button>
            </Link>
          </div>
        </Card>
      </main>

      <footer className="mt-auto py-8 text-center text-xs text-[var(--color-outline)]">
        Estimates only. Not medical advice.
      </footer>
    </div>
  );
}
