import React, { useState } from "react";
import { Input } from "./ui/input";
import {
  ChevronLeft,
  Search,
  ChevronRight,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
} from "lucide-react";

interface HelpCenterPageProps {
  onBack: () => void;
}

export function HelpCenterPage({ onBack }: HelpCenterPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      articles: 12,
    },
    {
      title: "Job Management",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
      articles: 18,
    },
    {
      title: "Video Tutorials",
      icon: Video,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      articles: 8,
    },
    {
      title: "FAQ",
      icon: HelpCircle,
      color: "text-[#f89823]",
      bgColor: "bg-orange-100",
      articles: 24,
    },
  ];

  const popularArticles = [
    {
      title: "How to accept a job assignment",
      category: "Job Management",
      views: "1.2k",
    },
    {
      title: "Understanding the rating system",
      category: "Getting Started",
      views: "980",
    },
    {
      title: "How to submit an invoice",
      category: "Job Management",
      views: "856",
    },
    {
      title: "Using the timer for breaks",
      category: "Job Management",
      views: "745",
    },
    {
      title: "Managing your certifications",
      category: "Getting Started",
      views: "623",
    },
  ];

  const recentlyViewed = [
    {
      title: "Completing a job checklist",
      category: "Job Management",
      readTime: "3 min",
    },
    {
      title: "Adding vehicle documents",
      category: "Getting Started",
      readTime: "2 min",
    },
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
          <h1 className="text-lg font-bold text-white">Help Center</h1>
          <div className="w-10" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
                >
                  <div className={`${category.bgColor} rounded-lg p-2 w-fit mb-2`}>
                    <Icon className={`size-5 ${category.color}`} />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">
                    {category.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {category.articles} articles
                  </p>
                </button>
              );
            })}
          </div>

          {/* Popular Articles */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Popular Articles</h3>
            </div>
            <div className="space-y-2">
              {popularArticles.map((article, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {article.views} views
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-gray-400 flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recently Viewed</h3>
              </div>
              <div className="space-y-2">
                {recentlyViewed.map((article, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {article.readTime} read
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-gray-400 flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-[#f89823] to-orange-600 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <HelpCircle className="size-4 text-white" />
              </div>
              <h3 className="font-semibold text-white">Quick Tip</h3>
            </div>
            <p className="text-sm text-white/90">
              You can start a break timer during any active job by tapping the timer
              icon. This helps track your time accurately for billing.
            </p>
          </div>

          {/* Contact Support */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900 font-medium mb-2">
              Can't find what you're looking for?
            </p>
            <p className="text-sm text-blue-700 mb-3">
              Our support team is here to help you with any questions.
            </p>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Contact Support →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}