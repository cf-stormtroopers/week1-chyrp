"use client";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "../state/auth";
import { updateUserUsersUserIdPut } from "../api/generated";

export default function ControlsPage() {
  const authStore = useAuthStore()
  const [, navigate] = useLocation();
  const [, setLocation] = useLocation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(""); // prefilled like your screenshot
  // const [website, setWebsite] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    if (authStore.accountInformation) {
      setFullName(authStore.accountInformation.display_name || "");
      setEmail(authStore.accountInformation.email || "");
    }
  }, [authStore.accountInformation])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password && password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      if (!authStore.accountInformation) {
        alert("No account information found.");
        return;
      }

      await updateUserUsersUserIdPut(authStore.accountInformation.id, {
        display_name: fullName,
        password: password || undefined,
      });

      authStore.mutate();

      alert("Profile updated successfully!");

      // Navigate back to home
      navigate("/");
    } catch (e) {
      alert("An error occurred while updating profile.");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center text-black p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6">
        {/* Back Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setLocation("/")}
            className="text-black hover:text-dark text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <h2 className="text-4xl font-bold mb-6">Account</h2>

        <form className="space-y-4" onSubmit={handleUpdate}>
          {/* Email */}
          <div className="cursor-not-allowed">
            <label className="block font-medium text-dark mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled
            />
          </div>

          {/* Full name */}
          <div>
            <label className="block font-medium text-black mb-1">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>



          {changePassword ? <>
            {/* New password */}
            <div>
              <button
                type="button"
                onClick={() => setChangePassword(false)}
                className="text-sm text-dark underline mb-4"
              >
                Cancel
              </button>
              <label className="block font-medium mb-1">New password?</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            {/* Confirm */}
            <div>
              <label className="block font-medium mb-1">Confirm</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </> : (
            <button
              type="button"
              onClick={() => setChangePassword(true)}
              className="text-sm text-dark underline"
            >
              Change Password
            </button>
          )}

          {/* Update button */}
          <button
            type="submit"
            className="w-full bg-primary text-dark text-lg font-bold py-2 rounded hover:bg-secondary"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
