import React from "react";
import {
  ChevronLeft,
  Star,
  TrendingUp,
  Award,
  Target,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
} from "lucide-react";

interface PerformancePageProps {
  onBack: () => void;
}

export function PerformancePage({ onBack }: PerformancePageProps) {
  const stats = [
    {
      label: "Overall Rating",
      value: "4.8",
      icon: Star,
      color: "text-[#f89823]",
      bgColor: "bg-orange-100",
      change: "+0.2",
      period: "vs last month",
    },
    {
      label: "Jobs Completed",
      value: "127",
      icon: Award,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+15",
      period: "this month",
    },
    {
      label: "On-Time Rate",
      value: "98%",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+2%",
      period: "vs last month",
    },
    {
      label: "Avg Response Time",
      value: "12m",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "-3m",
      period: "improvement",
    },
  ];

  const monthlyPerformance = [
    { month: "Jan", jobs: 38, rating: 4.7, earnings: "$12,450" },
    { month: "Feb", jobs: 42, rating: 4.8, earnings: "$14,200" },
    { month: "Mar", jobs: 47, rating: 4.9, earnings: "$15,580" },
  ];

  const ratingBreakdown = [
    { category: "Safety", rating: 4.9, reviews: 127 },
    { category: "Communication", rating: 4.8, reviews: 127 },
    { category: "Professionalism", rating: 4.8, reviews: 127 },
    { category: "Driving & Compliance", rating: 4.7, reviews: 127 },
    { category: "Vehicle & Equipment", rating: 4.9, reviews: 127 },
    { category: "Asset Health", rating: 4.8, reviews: 127 },
  ];

  const topLocations = [
    { city: "Austin, TX", jobs: 45, percentage: 35 },
    { city: "Dallas, TX", jobs: 32, percentage: 25 },
    { city: "Houston, TX", jobs: 28, percentage: 22 },
    { city: "San Antonio, TX", jobs: 22, percentage: 18 },
  ];

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="size-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Performance</h1>
          <div className="w-10" />
        </div>

        {/* Quick Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-0.5">Total Earnings</p>
              <p className="text-2xl font-bold text-white">$45,230</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <DollarSign className="size-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className={`${stat.bgColor} rounded-lg p-2 w-fit mb-2`}>
                    <Icon className={`size-4 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="size-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-400">{stat.period}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Performance */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <Calendar className="size-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Monthly Performance
              </h3>
            </div>
            <div className="space-y-3">
              {monthlyPerformance.map((month, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">
                        {month.month}
                      </p>
                      <p className="text-xs text-gray-500">2024</p>
                    </div>
                    <div className="h-10 w-px bg-gray-200" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {month.jobs} Jobs
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="size-3 text-[#f89823] fill-[#f89823]" />
                        <span className="text-xs text-gray-600">
                          {month.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-green-600">
                    {month.earnings}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-100 rounded-lg p-2">
                <Star className="size-4 text-[#f89823]" />
              </div>
              <h3 className="font-semibold text-gray-900">Rating Breakdown</h3>
            </div>
            <div className="space-y-3">
              {ratingBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{item.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="size-3 text-[#f89823] fill-[#f89823]" />
                      <span className="text-sm font-semibold text-gray-900">
                        {item.rating}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#f89823] to-orange-600 rounded-full"
                      style={{ width: `${(item.rating / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-purple-100 rounded-lg p-2">
                <MapPin className="size-4 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Top Locations</h3>
            </div>
            <div className="space-y-3">
              {topLocations.map((location, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-600">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {location.city}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {location.jobs} jobs
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          
        </div>
      </div>
    </div>
  );
}