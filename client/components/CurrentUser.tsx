// app/components/CurrentUser.tsx
import { currentUser } from "@clerk/nextjs/server";

export default async function CurrentUser() {
  const user = await currentUser();

  if (!user) return <div className="text-white mt-10">No user logged in</div>;

  console.log("Current User:", user); // ✅ Will log on the server side

  return (
    <div className="text-white mt-10">
      <p>Welcome, {user.firstName}!</p>
      <p>Email: {user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress}</p>
    </div>
  );
}