"use client";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

// Simple Button component since we don't have a UI library
const Button = ({
  children,
  size = "md",
  variant = "default",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline";
  className?: string;
  [key: string]: unknown;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    default:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm bg-white/10",
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Input component
const Input = ({
  className = "",
  ...props
}: {
  className?: string;
  [key: string]: unknown;
}) => {
  return (
    <input
      className={`w-full rounded-lg px-4 py-3 text-base ${className}`}
      {...props}
    />
  );
};

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const router = useRouter();
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
              '<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></g></svg>'
            )}")`,
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
              🚀 Your Career Journey Starts Here
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Find Your Dream Job
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              and get Hired
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore thousands of job listings or find the perfect candidate from
            top companies worldwide
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => router.push("/findJob")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Find Jobs
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/postJob")}
              className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm bg-white/10 hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Post a Job
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                    }
                    className="pl-10 h-12 bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        const params = new URLSearchParams();
                        if (searchTerm) params.append("q", searchTerm);
                        if (locationFilter) params.append("location", locationFilter);
                        router.push(`/findJob?${params.toString()}`);
                      }
                    }}
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Location"
                    value={locationFilter}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLocationFilter(e.target.value)
                    }
                    className="pl-10 h-12 bg-white/90 border-0 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        const params = new URLSearchParams();
                        if (searchTerm) params.append("q", searchTerm);
                        if (locationFilter) params.append("location", locationFilter);
                        router.push(`/findJob?${params.toString()}`);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Company Logos */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-8 uppercase tracking-wider">
              Trusted by leading companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              <div className="text-2xl font-bold text-white">Google</div>
              <div className="text-2xl font-bold text-white">Microsoft</div>
              <div className="text-2xl font-bold text-white">Meta</div>
              <div className="text-2xl font-bold text-white">Netflix</div>
              <div className="text-2xl font-bold text-white">Tesla</div>
              <div className="text-2xl font-bold text-white">Apple</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
    </div>
  );
}
