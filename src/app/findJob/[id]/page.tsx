"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building,
  Users,
  Globe,
  Star,
  Bookmark,
  Share2,
  ArrowLeft,
  X,
  Upload,
  FileText,
  CheckCircle,
  Award,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  featured?: boolean;
  remote?: boolean;
  skills?: string[];
  experience?: string;
  fullDescription?: string;
  companyInfo?: {
    description: string;
    founded: string;
    employees: string;
    industry: string;
    website: string;
    benefits: string[];
  };
}

// Application Modal Component
const ApplicationModal = ({
  job,
  isOpen,
  onClose,
}: {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare application data
      const applicationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        coverLetter: formData.coverLetter || undefined,
        resume: formData.resume ? formData.resume.name : undefined,
      };

      // Submit application to backend API
      await axios.post(
        `${API_URL}/jobs/${job.id}/apply`,
        applicationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Reset form and show thank you modal
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        coverLetter: "",
        resume: null,
      });
      setIsThankYouModalOpen(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      if (axios.isAxiosError(error)) {
        setSubmitError(
          error.response?.data?.error || "Failed to submit application"
        );
      } else {
        setSubmitError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-4 fade-in-0"
        style={{
          animation: isOpen ? "slideIn 0.3s ease-out" : "slideOut 0.3s ease-in",
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Apply for {job.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{job.company}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </span>
              <span className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {job.salary}
              </span>
            </div>
          </div>

          {submitError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume/CV *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {formData.resume
                      ? formData.resume.name
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, or DOCX (max 5MB)
                  </p>
                </label>
              </div>
              {formData.resume && (
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <FileText className="h-4 w-4 mr-1" />
                  {formData.resume.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter
              </label>
              <textarea
                rows={4}
                value={formData.coverLetter}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverLetter: e.target.value,
                  }))
                }
                placeholder="Tell us why you're interested in this position..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* npm  You Modal */}
      {isThankYouModalOpen && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 transform transition-all duration-300 ease-out">
            <div className="p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Application Submitted!
              </h2>
              <p className="text-gray-600 mb-4">
                Your application for {job.title} at {job.company} has been
                submitted. We will review your application and get back to you
                shortly.
              </p>
              <button
                onClick={() => {
                  setIsThankYouModalOpen(false);
                  onClose();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const jobId = params.id as string;

        console.log("Fetching job details for ID:", jobId);
        const response = await axios.get(
          `${API_URL}/jobs/${jobId}`
        );

        console.log("Job API Response:", response.data);

        if (response.data.job) {
          // Transform the job data to match frontend expectations
          const transformedJob = {
            ...response.data.job,
            // Add computed fields that the frontend expects
            fullDescription: `
              <h3>About the Role</h3>
              <p>${response.data.job.description}</p>
              
              <h3>Requirements</h3>
              <p>${
                response.data.job.requirements ||
                "Requirements will be provided during the interview process."
              }</p>
              
              <h3>Contact Information</h3>
              <p>Please send your application to: ${
                response.data.job.contactEmail
              }</p>
            `,
            companyInfo: {
              description: `${response.data.job.company} is a dynamic company looking for talented individuals to join their team.`,
              founded: "2020",
              employees: "50+",
              industry: "Technology",
              website: "https://example.com",
              benefits: [
                "Competitive salary",
                "Health insurance",
                "Flexible work hours",
                "Professional development",
                "Team events",
              ],
            },
          };

          setJob(transformedJob);
        } else {
          throw new Error("Job not found");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setError("Job not found");
          } else {
            setError(
              `API Error: ${err.response?.status} - ${
                err.response?.statusText || err.message
              }`
            );
          }
        } else {
          setError(
            err instanceof Error ? err.message : "Failed to fetch job details"
          );
        }
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const toggleSavedJob = (jobId: string) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            Loading job details...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Job Not Found"}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The job you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.push("/findJob")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/findJob")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Jobs
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleSavedJob(job.id)}
                className={`p-2 rounded-lg transition-colors ${
                  savedJobs.includes(job.id)
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="p-2 bg-gray-100 text-gray-400 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">
                    {job.logo}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {job.title}
                    </h1>
                    {job.featured && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Star className="h-4 w-4 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xl text-gray-600 mb-4">{job.company}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="h-5 w-5 mr-2" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{job.posted}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills &&
                      job.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-green-600 font-semibold text-lg">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {job.salary || "Salary not specified"}
                    </div>
                    <button
                      onClick={handleApplyClick}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.fullDescription || "" }}
              />
            </div>

            {/* Company Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About {job.company}
              </h2>
              <p className="text-gray-700 mb-6">
                {job.companyInfo?.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Company Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Building className="h-4 w-4 mr-2" />
                      <span>Founded: {job.companyInfo?.founded}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{job.companyInfo?.employees} employees</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Award className="h-4 w-4 mr-2" />
                      <span>{job.companyInfo?.industry}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe className="h-4 w-4 mr-2" />
                      <a
                        href={job.companyInfo?.website}
                        className="text-blue-600 hover:underline"
                      >
                        {job.companyInfo?.website}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {job.companyInfo?.benefits?.map(
                      (benefit: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>{benefit}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Job Summary
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Salary</span>
                  <span className="font-semibold text-green-600">
                    {job.salary || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold">
                    {job.experience || "Not specified"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-semibold">{job.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">{job.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-semibold">{job.posted}</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <button
                  onClick={handleApplyClick}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold mb-3"
                >
                  Apply for this position
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                  Save Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal job={job} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
