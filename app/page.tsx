import { currentUser } from "@clerk/nextjs/server";
import Guest from "./components/Guest";



export default async function HomePage() {
  const user = await currentUser();
  if (!user) {
    return (
      <Guest />
    )
  }
  return (
    <div>
      <h1 className="bg-red-400">Home Page</h1>
    </div>
  );
}