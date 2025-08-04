"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import axios from "axios";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PostJobPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(true);
  const [, setShowJobForm] = useState(false);
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    salary: "",
    description: "",
    requirements: "",
    contactEmail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isLoading) {
      setShowJobForm(true);
      // Pre-fill contact email with user's email
      setJobData((prev) => ({
        ...prev,
        contactEmail: user.email,
      }));
    }
  }, [user, isLoading]);

  const handleAuthSuccess = () => {
    setShowJobForm(true);
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit job to backend API
      const response = await axios.post(
        `${API_URL}/jobs`,
        jobData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Job posted successfully:", response.data);
      setSubmitSuccess(true);
    } catch (err) {
      console.error("Failed to post job:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("You are not authorized. Please log in again.");
          // Redirect to login
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else if (err.response?.data?.errors) {
          // Handle validation errors
          const validationErrors = err.response.data.errors;
          const errorMessages = Object.values(validationErrors).flat();
          setError(errorMessages.join(", "));
        } else {
          setError(
            err.response?.data?.error || "Failed to post job. Please try again."
          );
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign in to Post a Job
            </h1>
            <p className="text-gray-600">
              You need to be logged in to post job listings
            </p>
          </div>
          {showLogin ? (
            <LoginForm
              onSwitchToSignup={() => setShowLogin(false)}
              onSuccess={handleAuthSuccess}
            />
          ) : (
            <SignupForm
              onSwitchToLogin={() => setShowLogin(true)}
              onSuccess={handleAuthSuccess}
            />
          )}
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Job Posted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your job listing has been published and is now visible to potential
            candidates.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setSubmitSuccess(false);
                setJobData({
                  title: "",
                  company: "",
                  location: "",
                  type: "full-time",
                  salary: "",
                  description: "",
                  requirements: "",
                  contactEmail: user.email,
                });
              }}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Post Another Job
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              View Dashboard
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Post a New Job
            </h1>
            <p className="text-gray-600">
              Fill in the details below to create your job listing
            </p>
            <div className="mt-2 text-sm text-gray-500">
              Logged in as: <span className="font-medium">{user.email}</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleJobSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Job Title *
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={jobData.title}
                  onChange={(e) =>
                    setJobData({ ...jobData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Senior React Developer"
                  maxLength={100}
                />
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Company Name *
                </label>
                <input
                  id="company"
                  type="text"
                  required
                  value={jobData.company}
                  onChange={(e) =>
                    setJobData({ ...jobData, company: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Tech Corp"
                  maxLength={100}
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Location *
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  value={jobData.location}
                  onChange={(e) =>
                    setJobData({ ...jobData, location: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., New York, NY or Remote"
                  maxLength={100}
                />
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Job Type *
                </label>
                <select
                  id="type"
                  required
                  value={jobData.type}
                  onChange={(e) =>
                    setJobData({ ...jobData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Salary Range
                </label>
                <input
                  id="salary"
                  type="text"
                  value={jobData.salary}
                  onChange={(e) =>
                    setJobData({ ...jobData, salary: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., $80,000 - $120,000"
                  maxLength={50}
                />
              </div>

              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contact Email *
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  required
                  value={jobData.contactEmail}
                  onChange={(e) =>
                    setJobData({ ...jobData, contactEmail: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="hr@company.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Job Description *
              </label>
              <textarea
                id="description"
                required
                rows={6}
                value={jobData.description}
                onChange={(e) =>
                  setJobData({ ...jobData, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                maxLength={2000}
              />
              <div className="mt-1 text-sm text-gray-500 text-right">
                {jobData.description.length}/2000 characters
              </div>
            </div>

            <div>
              <label
                htmlFor="requirements"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Requirements & Qualifications
              </label>
              <textarea
                id="requirements"
                rows={4}
                value={jobData.requirements}
                onChange={(e) =>
                  setJobData({ ...jobData, requirements: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List the required skills, experience, and qualifications..."
                maxLength={1000}
              />
              <div className="mt-1 text-sm text-gray-500 text-right">
                {jobData.requirements.length}/1000 characters
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Posting Job..." : "Post Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
