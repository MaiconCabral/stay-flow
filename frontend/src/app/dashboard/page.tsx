import StatsCards from './_components/stats-cards'
import RevenueChart from './_components/revenue-chart'
import RecentBookings from './_components/recent-bookings'
import UpcomingEvents from './_components/upcoming-events'
import PropertyOverview from './_components/property-overview'

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <UpcomingEvents />
        </div>
      </div>
      <RecentBookings />
      <PropertyOverview />
    </div>
  )
}
