import { redirect } from "next/navigation";
import User from "@/app/models/User";
import { getCurrentUser } from "@/lib/getCurrentUser";
import EditUserForm from "@/components/admin/EditUserForm";

export default async function EditUserPage({ params }: any) {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  await dbConnect();
  const user = await User.findById(params.id).lean();

  if (!user) redirect("/admin/user");

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>
      <EditUserForm
        currentUser={currentUser}
        user={JSON.parse(JSON.stringify(user))}
      />
    </div>
  );
}