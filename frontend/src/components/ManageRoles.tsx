import { useState } from "react";
import {
    useGetAllRolesRolesGet,
    useCreateRoleRolesPost,
    useUpdateRoleRolesRoleIdPut,
    useDeleteRoleRolesRoleIdDelete,
} from "../api/generated";

const PERMISSIONS: Record<string, string> = {
    read_all_posts: "Read All Posts",
    edit_posts: "Edit Posts",
    delete_posts: "Delete Posts",
    update_site_settings: "Admin",
};

export default function ManageRoles() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<any>({ name: "", permissions: [] });

    const {
        data: roles,
        mutate: mutateRoles,
        isLoading,
    } = useGetAllRolesRolesGet();
    const createRole = useCreateRoleRolesPost();

    function resetForm() {
        setFormData({ name: "", permissions: [] });
        setShowForm(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await createRole.trigger(formData);
            await mutateRoles();
            resetForm();
        } catch (err) {
            console.error("Failed to create role", err);
        }
    }

    if (isLoading) return <div>Loading…</div>;

    return (
        <div className="bg-white shadow rounded-lg p-6 mt-20">
            {/* Actions */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    className="px-6 py-2 rounded-md border bg-white hover:bg-gray-200 font-semibold"
                    onClick={() => {
                        setFormData({ name: "", permissions: [] });
                        setShowForm(true);
                    }}
                >
                    Add Role
                </button>
            </div>

            {showForm ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4">New Role</h2>
                    <form className="space-y-4 max-w-xl" onSubmit={handleSubmit}>
                        <div className="flex justify-between items-center">
                            <label className="font-medium">Role Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="px-3 py-2 border rounded w-2/3 bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="font-medium block mb-2">Permissions</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(PERMISSIONS).map(([slug, label]) => (
                                    <label key={slug} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.permissions.includes(slug)}
                                            onChange={(e) => {
                                                const updated = e.target.checked
                                                    ? [...formData.permissions, slug]
                                                    : formData.permissions.filter((p: string) => p !== slug);
                                                setFormData({ ...formData, permissions: updated });
                                            }}
                                        />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-md border bg-green-600 hover:bg-green-700 text-white font-semibold"
                        >
                            Add Role
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
                    <h2 className="text-2xl font-bold mb-4">Roles</h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-3">ID</th>
                                <th className="p-3">Name</th>
                                {Object.values(PERMISSIONS).map((label) => (
                                    <th key={label} className="p-3">
                                        {label}
                                    </th>
                                ))}
                                <th className="p-3">Controls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles?.map((role: any) => (
                                <RoleRow key={role.id} role={role} onChanged={mutateRoles} />
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

function RoleRow({ role, onChanged }: any) {
    const updateRole = useUpdateRoleRolesRoleIdPut(role.id);
    const deleteRole = useDeleteRoleRolesRoleIdDelete(role.id);

    async function togglePermission(permission: string, enabled: boolean) {
        try {
            const updated = enabled
                ? [...role.permissions, permission]
                : role.permissions.filter((p: string) => p !== permission);
            await updateRole.trigger({ permissions: updated });
            await onChanged();
        } catch (err) {
            console.error("Failed to update role", err);
        }
    }

    async function handleDelete() {
        if (role.name === "public") return;
        if (!confirm(`Delete role ${role.name}?`)) return;
        try {
            await deleteRole.trigger({} as any);
            await onChanged();
        } catch (err) {
            console.error("Failed to delete role", err);
        }
    }

    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="p-3">{role.id}</td>
            <td className="p-3 font-semibold">{role.name}</td>
            {Object.keys(PERMISSIONS).map((slug) => (
                <td key={slug} className="p-3 text-center">
                    <input
                        type="checkbox"
                        checked={role.permissions.includes(slug)}
                        onChange={(e) => togglePermission(slug, e.target.checked)}
                    />
                </td>
            ))}
            <td className="p-3 flex gap-3">
                <button
                    onClick={handleDelete}
                    disabled={role.name === "public"}
                    className={`text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    🗑️
                </button>
            </td>
        </tr>
    );
}
