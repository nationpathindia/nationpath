import Ad from "@/app/models/Ad";
import { notFound } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditAdPage({
  params,
}: {
  params: { id: string };
}) {
  await dbConnect();

  const ad = await Ad.findById(params.id).lean();

  if (!ad) return notFound();

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Ad</h1>
      <EditForm ad={JSON.parse(JSON.stringify(ad))} />
    </div>
  );
}