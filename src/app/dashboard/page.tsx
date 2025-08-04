"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  X,
  Eye,
  Mail,
  Phone,
  FileText,
  Calendar,
  Star,
  Filter,
  Search,
  ArrowRight,
  Edit,
  Trash2,
  EyeOff,
  Check,
  XCircle,
  UserCheck,
  UserX,
} from "lucide-react";

interface Applicant {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  resume?: string;
  appliedAt: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  reviewedAt?: string;
  notes?: string;
  timeAgo: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string;
  contactEmail: string;
  postedBy: string;
  postedAt: string;
  isActive: boolean;
  totalApplications: number;
  pendingApplications: number;
  shortlistedApplications: number;
  rejectedApplications: number;
  hiredApplications: number;
  posted: string;
  logo: string;
}

interface ApplicationStats {
  total: number;
  pending: number;
  shortlisted: number;
  rejected: number;
  hired: number;
}

const DashboardPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user && !isLoading) {
      fetchUserJobs();
    }
  }, [user, isLoading]);

  const fetchUserJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "http://localhost:5000/api/jobs/user/my-jobs-with-applications",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setJobs(response.data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      if (axios.isAxiosError(err)) {
        setError(
          `API Error: ${err.response?.status} - ${
            err.response?.statusText || err.message
          }`
        );
      } else {
        setError("Failed to fetch jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplications = async (jobId: string) => {
    try {
      setApplicationsLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:5000/api/jobs/${jobId}/applications`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setApplications(response.data.applications);
      setApplicationStats(response.data.stats);
    } catch (err) {
      console.error("Error fetching applications:", err);
      if (axios.isAxiosError(err)) {
        setError(
          `API Error: ${err.response?.status} - ${
            err.response?.statusText || err.message
          }`
        );
      } else {
        setError("Failed to fetch applications");
      }
    } finally {
      setApplicationsLoading(false);
    }
  };

  const updateApplicationStatus = async (
    jobId: string,
    applicationId: string,
    status: string,
    notes?: string
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/jobs/${jobId}/applications/${applicationId}/status`,
        { status, notes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update the application in the local state
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? {
                ...app,
                status: status as any,
                notes,
                reviewedAt: new Date().toISOString(),
              }
            : app
        )
      );

      // Refresh the job applications to update stats
      await fetchJobApplications(jobId);

      return response.data;
    } catch (err) {
      console.error("Error updating application status:", err);
      throw err;
    }
  };

  const handleJobClick = async (job: Job) => {
    setSelectedJob(job);
    await fetchJobApplications(job.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "reviewed":
        return <Eye className="h-4 w-4" />;
      case "shortlisted":
        return <Star className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "hired":
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalJobs = jobs.length;
  const totalApplicants = jobs.reduce(
    (sum, job) => sum + job.totalApplications,
    0
  );
  const activeJobs = jobs.filter((job) => job.isActive).length;

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
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Manage your job postings and applicants
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push("/postJob")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Post New Job
              </button>
              <button
                onClick={() => router.push("/")}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalJobs}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Users className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Applicants
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalApplicants}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {activeJobs}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <Clock className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Reviews
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {jobs.reduce((sum, job) => sum + job.pendingApplications, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jobs List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Your Job Postings
                </h2>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No jobs posted yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by posting your first job to attract candidates
                  </p>
                  <button
                    onClick={() => router.push("/postJob")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className={`p-6 cursor-pointer transition-colors ${
                        selectedJob?.id === job.id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleJobClick(job)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {job.company}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span className="mr-4">{job.location}</span>
                            <span>{job.type}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-blue-600 font-medium">
                                {job.totalApplications} applicants
                              </span>
                              {job.pendingApplications > 0 && (
                                <span className="text-yellow-600 font-medium">
                                  {job.pendingApplications} pending
                                </span>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Applications Panel */}
          <div className="lg:col-span-2">
            {selectedJob ? (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        Applications for {selectedJob.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selectedJob.company}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {applicationStats.total} total applications
                      </span>
                    </div>
                  </div>
                </div>

                {/* Application Stats */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {applicationStats.total}
                      </div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {applicationStats.pending}
                      </div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {applicationStats.shortlisted}
                      </div>
                      <div className="text-sm text-gray-600">Shortlisted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {applicationStats.rejected}
                      </div>
                      <div className="text-sm text-gray-600">Rejected</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {applicationStats.hired}
                      </div>
                      <div className="text-sm text-gray-600">Hired</div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search applicants..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="hired">Hired</option>
                    </select>
                  </div>
                </div>

                {/* Applications List */}
                <div className="divide-y divide-gray-200">
                  {applicationsLoading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">
                        Loading applications...
                      </p>
                    </div>
                  ) : filteredApplications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="text-gray-400 text-4xl mb-4">📄</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No applications found
                      </h3>
                      <p className="text-gray-600">
                        {applications.length === 0
                          ? "No one has applied for this job yet."
                          : "No applications match your current filters."}
                      </p>
                    </div>
                  ) : (
                    filteredApplications.map((application) => (
                      <ApplicationCard
                        key={application.id}
                        application={application}
                        jobId={selectedJob.id}
                        onStatusUpdate={updateApplicationStatus}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a job to view applications
                </h3>
                <p className="text-gray-600">
                  Choose a job from the list to see and manage its applications
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Application Card Component
const ApplicationCard = ({
  application,
  jobId,
  onStatusUpdate,
}: {
  application: Applicant;
  jobId: string;
  onStatusUpdate: (
    jobId: string,
    applicationId: string,
    status: string,
    notes?: string
  ) => Promise<any>;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState(application.notes || "");

  const handleStatusUpdate = async (status: string) => {
    try {
      setIsUpdating(true);
      await onStatusUpdate(jobId, application.id, status, notes);
    } catch (error) {
      console.error("Error updating status:", error);
      // You might want to show an error message here
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "reviewed":
        return <Eye className="h-4 w-4" />;
      case "shortlisted":
        return <Star className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "hired":
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-medium text-gray-900">
              {application.fullName}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                application.status
              )}`}
            >
              {getStatusIcon(application.status)}
              <span className="ml-1 capitalize">{application.status}</span>
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              {application.email}
            </div>
            {application.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                {application.phone}
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {application.timeAgo}
            </div>
          </div>

          {isExpanded && (
            <div className="mt-4 space-y-4">
              {application.coverLetter && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Cover Letter
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {application.coverLetter}
                  </p>
                </div>
              )}

              {application.resume && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Resume
                  </h4>
                  <div className="flex items-center text-sm text-blue-600">
                    <FileText className="h-4 w-4 mr-1" />
                    {application.resume}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Notes
                </h4>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this candidate..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center space-x-2">
        <button
          onClick={() => handleStatusUpdate("shortlisted")}
          disabled={isUpdating || application.status === "shortlisted"}
          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="h-3 w-3 inline mr-1" />
          Shortlist
        </button>

        <button
          onClick={() => handleStatusUpdate("rejected")}
          disabled={isUpdating || application.status === "rejected"}
          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="h-3 w-3 inline mr-1" />
          Reject
        </button>

        <button
          onClick={() => handleStatusUpdate("hired")}
          disabled={isUpdating || application.status === "hired"}
          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserCheck className="h-3 w-3 inline mr-1" />
          Hire
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
