type LoginPageProps = {
  onLogin: () => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-black p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Login
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(); // fake login
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Username"
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
