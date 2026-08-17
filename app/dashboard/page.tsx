import { WelcomeBanner } from "@/components/home/WelcomeBanner";
import { StatGrid } from "@/components/home/StatGrid";
import { Recommendations } from "@/components/home/Recommendations";
import { ActivityFeed } from "@/components/home/ActivityFeed";
import { RecentProjects } from "@/components/home/RecentProjects";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <WelcomeBanner />
      <StatGrid />
      <Recommendations />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentProjects />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
