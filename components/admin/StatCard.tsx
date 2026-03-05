interface Props {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: Props) {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:scale-105 transition">
      <h4 className="text-sm text-gray-400 mb-2">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
