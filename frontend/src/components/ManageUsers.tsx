import { useState } from "react";
import {
    useListUsersUsersGet,
    useGetAllRolesRolesGet,
    useAddUserUsersPost,
    useUpdateUserUsersUserIdPut,
    useDeleteUserUsersUserIdDelete,
    updateUserUsersUserIdPut,
} from "../api/generated";

export default function ManageUsers() {
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [formData, setFormData] = useState<any>({});

    const {
        data: users,
        mutate: mutateUsers,
        isLoading: isLoadingUsers,
    } = useListUsersUsersGet();
    const { data: roles } = useGetAllRolesRolesGet();
    const addUser = useAddUserUsersPost();

    function resetForm() {
        setFormData({});
        setEditingUser(null);
        setShowForm(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            if (editingUser) {
                await updateUserUsersUserIdPut(editingUser.id, formData);
            } else {
                await addUser.trigger(formData);
            }
            await mutateUsers();
            resetForm();
        } catch (err) {
            console.error("Failed to save user", err);
        }
    }

    if (isLoadingUsers) return <div>Loading…</div>;

    return (
        <div className="bg-white shadow rounded-lg p-6 mt-20">
            {/* Search + Actions */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    className="px-6 py-2 rounded-md border bg-white hover:bg-gray-200 font-semibold"
                    onClick={() => {
                        setEditingUser(null);
                        setFormData({});
                        setShowForm(true);
                    }}
                >
                    Add User
                </button>
            </div>

            {showForm ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        {editingUser ? "Edit User" : "New User"}
                    </h2>
                    <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
                        <div className="flex justify-between items-center">
                            <label className="font-medium">Username</label>
                            <input
                                type="text"
                                value={formData.username || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, username: e.target.value })
                                }
                                required
                                className="px-3 py-2 border rounded w-2/3 bg-gray-100"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="font-medium">Email</label>
                            <input
                                type="email"
                                value={formData.email || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                                className="px-3 py-2 border rounded w-2/3 bg-gray-100"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="font-medium">Role</label>
                            <select
                                value={formData.role_name || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, role_name: e.target.value })
                                }
                                required
                                className="px-3 py-2 border rounded w-2/3 bg-gray-100"
                            >
                                <option value="">Select a role</option>
                                {roles?.map((role: any) => (
                                    <option key={role.name} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="font-medium">Password</label>
                            <input
                                type="password"
                                value={formData.password || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                className="px-3 py-2 border rounded w-2/3 bg-gray-100"
                                required={!editingUser}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="font-medium">Confirm</label>
                            <input
                                type="password"
                                value={formData.confirmPassword || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, confirmPassword: e.target.value })
                                }
                                className="px-3 py-2 border rounded w-2/3 bg-gray-100"
                                required={!editingUser}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="font-medium">Full Name (optional)</label>
                            <input
                                type="text"
                                value={formData.display_name || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, display_name: e.target.value })
                                }
                                className="px-3 py-2 border rounded w-2/3 bg-gray-100"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-md border bg-green-600 hover:bg-green-700 text-white font-semibold"
                        >
                            {editingUser ? "Update User" : "Add User"}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="ml-4 px-6 py-2 rounded-md border bg-gray-300 hover:bg-gray-400 font-semibold"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-4">Users</h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left ">
                                <th className="p-3">Login (name)</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Joined</th>
                                <th className="p-3">Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user: any) => (
                                <UserRow
                                    key={user.id}
                                    user={user}
                                    roles={roles || []}
                                    onEdit={() => {
                                        setEditingUser(user);
                                        setFormData({
                                            username: user.username,
                                            email: user.email,
                                            role_name: user.role?.name || "",
                                            display_name: user.display_name || "",
                                        });
                                        setShowForm(true);
                                    }}
                                    onChanged={mutateUsers}
                                />
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

function UserRow({ user, onEdit, onChanged }: any) {
    const updateUser = useUpdateUserUsersUserIdPut(user.id);
    const deleteUser = useDeleteUserUsersUserIdDelete(user.id);

    async function handleDelete() {
        if (!confirm(`Delete user ${user.username}?`)) return;
        try {
            await deleteUser.trigger({} as any);
            await onChanged();
        } catch (err) {
            console.error("Failed to delete user", err);
        }
    }

    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="p-3 text-blue-600 underline cursor-pointer">
                {user.username}
            </td>
            <td className="p-3">{user.role?.name || user.role_name || "—"}</td>
            <td className="p-3">{user.created_at?.split("T")[0] || "—"}</td>
            <td className="p-3 flex gap-3">
                <button
                    onClick={onEdit}
                    className="text-gray-600 hover:text-black"
                >
                    ✏️
                </button>
                <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800"
                >
                    🗑️
                </button>
            </td>
        </tr>
    );
}
