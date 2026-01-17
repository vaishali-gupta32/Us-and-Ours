import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-4xl font-hand font-bold text-rose-900 mb-4 animate-float">
        Our Love Journal ❤️
      </h1>
      <p className="text-rose-700/60 max-w-md mb-8">
        A private digital home for our memories, plans, and moments together.
        Distance means so little when someone means so much.
      </p>

      <Link href="/login">
        <Button className="rounded-full px-8 py-4 text-lg">
          Enter Our World
        </Button>
      </Link>
    </div>
  );
}
