import { useState } from "react";
import { useLoginAuthLoginPost, type UserRead } from "../api/generated";
import type { AxiosError } from "axios";
import { useAuthStore } from "../state/auth";

export default function LoginPage() {
  const { trigger: login } = useLoginAuthLoginPost()
  const authStore = useAuthStore()

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [result, setResult] = useState<string | null>(null);

  async function handleLogin() {
    setResult(null)

    if (!username || !password) {
      setResult("Please enter both username and password.")
      return
    }

    try {
      const res = await login({
        username,
        password,
      })

      const user = (res as { user: UserRead })?.user ?? null

      authStore.setAccountInformation(user)
      authStore.setLoggedIn(user !== null)
    } catch (error: AxiosError | any) {
      setResult(error?.response?.data?.detail ?? "Unknown error!")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-black p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Login
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Username"
            className="border rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Login
          </button>
          {result && <p className="text-red-500 text-center">{result}</p>}
        </form>
      </div>
    </div>
  );
}
