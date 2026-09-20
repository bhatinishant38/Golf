import { useContext } from "react";
import { Target, Ticket, Heart } from "lucide-react";
import { AppContext } from "../context/AppContext";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import LatestScores from "../components/LatestScores";
import NextDraw from "../components/NextDraw";
import CharityBanner from "../components/CharityBanner";

// Mock data. Replace with the response from your backend (see useEffect below).
const mockData = {
  user: { name: "Nishant", image: "" },
  stats: { totalScores: 5, drawEntries: 3, charityContribution: 25 },
  scores: [
    { date: "15 Sep 2026", score: 32 },
    { date: "10 Sep 2026", score: 28 },
    { date: "05 Sep 2026", score: 30 },
    { date: "28 Aug 2026", score: 26 },
    { date: "20 Aug 2026", score: 31 },
  ],
  nextDraw: { date: "01 Oct 2026", prize: "$1,25,000" },
  charity: { name: "Clean Water For All", percent: 10, image: "" },
};

const Dashboard = () => {
  const { setToken } = useContext(AppContext);
  const data = mockData;

  const { user, stats, scores, nextDraw, charity } = data;

  return (
    <div className="flex min-h-screen bg-[#F4F7F5]">
      <Sidebar setToken={setToken} />

      <main className="flex-1 space-y-6 p-8">
        <Header user={user} />

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            icon={Target}
            label="Total Scores"
            value={stats.totalScores}
            note="(Last 5 entries)"
          />
          <StatCard
            icon={Ticket}
            label="Draw Entries"
            value={stats.drawEntries}
            note="This month"
          />
          <StatCard
            icon={Heart}
            label="Charity Contribution"
            value={`$${stats.charityContribution}`}
            note="This month"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LatestScores scores={scores} />
          </div>
          <NextDraw date={nextDraw.date} prize={nextDraw.prize} />
        </div>

        <CharityBanner
          name={charity.name}
          percent={charity.percent}
          image={charity.image}
        />
      </main>
    </div>
  );
};

export default Dashboard;
