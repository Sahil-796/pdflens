import { redirect } from "next/navigation"

export default function Page() {

  redirect('/generate')
  return (
    <div className="min-h-screen w-full">
      Landing
    </div>
  );
}