import { useLocation } from "wouter";

export default function AdminNav() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex justify-center items-center space-x-4 bg-primary text-2xl text-accent h-32">

      <button
        onClick={() => setLocation("/settings")}
        className="px-12 py-8 bg-accent text-black rounded-lg hover:bg-secondary font-semibold"
      >
        Settings
      </button>
      <button
        onClick={() => setLocation("/manage")}
        className="px-12 py-8 bg-accent text-black rounded-lg hover:bg-secondary font-semibold"
      >
        Manage
      </button>
      <button
        onClick={() => setLocation("/extend")}
        className="px-12 py-8 bg-accent text-black rounded-lg hover:bg-secondary font-semibold"
      >
        Extend
      </button>
    </div>
  );
}
