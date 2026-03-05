"use client";

import RevenueChart from "./RevenueChart";

export default function RevenueDashboard({
  ads = [],
  totalViews = 0,
  totalClicks = 0,
  totalRevenue = 0,
  activeCampaigns = 0,
  chartData = [],
}: any) {

  const revenueDisplay = "₹" + Number(totalRevenue).toFixed(2);

  const safeAds = Array.isArray(ads) ? ads : [];

  const topAds = safeAds
    .sort((a: any, b: any) => (b?.clicks ?? 0) - (a?.clicks ?? 0))
    .slice(0, 10);

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold">Revenue Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6">

        <StatCard title="Total Ad Views" value={totalViews} />
        <StatCard title="Total Clicks" value={totalClicks} />
        <StatCard title="Estimated Revenue" value={revenueDisplay} />
        <StatCard title="Active Campaigns" value={activeCampaigns} />

      </div>

      <RevenueChart data={chartData} />

      <div className="bg-black/40 border border-white/10 rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-6">
          Ad Performance
        </h2>

        <table className="w-full text-sm">

          <thead className="text-gray-400 border-b border-white/10">
            <tr>
              <th className="text-left py-2">Ad</th>
              <th>Placement</th>
              <th>Views</th>
              <th>Clicks</th>
              <th>CTR</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>

            {topAds.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No ads data available
                </td>
              </tr>
            )}

            {topAds.map((ad: any) => {

              const views = ad?.views ?? 0;
              const clicks = ad?.clicks ?? 0;
              const cpc = ad?.cpc ?? 0;

              const ctr =
                views > 0
                  ? ((clicks / views) * 100).toFixed(2)
                  : "0";

              const revenue = clicks * cpc;

              return (
                <tr key={ad?.id} className="border-b border-white/5">

                  <td className="py-3">{ad?.title}</td>
                  <td>{ad?.placement}</td>
                  <td>{views}</td>
                  <td>{clicks}</td>
                  <td>{ctr}%</td>
                  <td>₹{revenue.toFixed(2)}</td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function StatCard({ title, value }: any) {

  return (
    <div className="bg-black/40 border border-white/10 p-6 rounded-xl">

      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>

    </div>
  );
}