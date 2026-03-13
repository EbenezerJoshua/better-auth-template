"use client";

import { Button } from "@/components/ui/button";

export default function Home() {

  const handleClick = () => {
    window.location.href = "/login";
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button variant="outline" onClick={handleClick}>Login</Button>
    </div>
  );
}
