# Job Board Application

A modern job board application built with Next.js, TypeScript, and Tailwind CSS that allows users to post jobs and apply for positions.

## Features

### For Job Posters

- **Authentication**: Sign up or login with email and password
- **Job Posting**: Create detailed job listings with:
  - Job title, company, location
  - Job type (Full-time, Part-time, Contract, Internship)
  - Salary range
  - Detailed description and requirements
  - Contact email
- **Dashboard**: View all posted jobs and manage applicants
- **Applicant Management**: Review applications, contact candidates, and view resumes

### For Job Seekers

- **Job Search**: Browse available positions with search and filtering
- **Job Applications**: Apply to jobs with resume upload and cover letter
- **Job Details**: View comprehensive job information
- **Save Jobs**: Bookmark interesting positions

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Data Storage**: localStorage (for demo purposes)
- **Icons**: Lucide React

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Application Flow

### Job Poster Flow

1. Click "Post a Job" on the homepage
2. Sign up or login with email/password
3. Fill out the job posting form
4. Submit the job listing
5. Access dashboard to view posted jobs and applicants

### Job Seeker Flow

1. Browse jobs on the homepage or "Find Jobs" page
2. Use search and filters to find relevant positions
3. Click on a job to view details
4. Apply with resume and cover letter
5. Track saved jobs

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Job poster dashboard
│   ├── findJob/          # Job search and listing
│   ├── login/            # Login page
│   ├── postJob/          # Job posting form
│   └── signup/           # Signup page
├── components/           # Reusable components
│   ├── Hero.tsx         # Homepage hero section
│   ├── LoginForm.tsx    # Login form component
│   ├── Navigation.tsx   # Main navigation
│   ├── SignupForm.tsx   # Signup form component
│   └── Whyus.tsx        # Why choose us section
└── lib/                 # Utilities and context
    ├── auth-context.tsx # Authentication context
    ├── sample-data.ts   # Sample data initialization
    └── utils.ts         # Utility functions
```

## Features in Detail

### Authentication

- Email/password authentication
- Persistent login state using localStorage
- Protected routes for job posting and dashboard

### Job Posting

- Comprehensive job form with validation
- Real-time form updates
- Success confirmation with navigation options

### Job Search

- Search by job title, company, or skills
- Filter by location, job type, remote work, and featured status
- Pagination for large result sets
- Responsive design for all devices

### Dashboard

- Overview statistics (total jobs, applicants, active jobs)
- List of all posted jobs with applicant counts
- Modal view for detailed applicant information
- Contact and resume viewing capabilities

### Application System

- File upload for resumes
- Cover letter submission
- Application tracking for job posters

## Demo Data

The application includes sample job data that is automatically loaded on first visit. This includes:

- 5 sample job postings
- Sample applicants with cover letters
- Various job types and locations

## Future Enhancements

- Backend API integration
- Database storage (PostgreSQL/MongoDB)
- Email notifications
- Advanced search filters
- Job alerts and notifications
- Company profiles
- Resume parsing
- Interview scheduling
- Analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
