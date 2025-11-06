🧠 Veridia — Full Stack Hiring Platform

Veridia is a modern full-stack hiring platform that connects job seekers and recruiters.
It enables candidates to apply for jobs, upload resumes, and receive automated email updates — while recruiters can post jobs, manage applicants, and update their status seamlessly.

🚀 Features

🧑‍💼 For Candidates

->View and apply for available jobs
->Upload resume (stored securely in AWS S3)
->Submit cover letter
->Receive email confirmation on application submission
->Get notified by email when application status changes

🧑‍💻 For Recruiters

->Create, edit, and delete job listings
->View applicants for each job
->Update application status (Pending, Reviewed, Accepted, Rejected)
->Automatic email notifications sent to applicants


🛠️ Tech Stack

Frontend:

->React.js
->Tailwind CSS
->React Router DOM
->React Hot Toast

Backend:

->Node.js
->Express.js
->MongoDB (Mongoose)
->AWS S3 SDK
->Nodemailer
->JWT Authentication


📂 Project Structure

Veridia/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md


🧩 Setup Instructions
1️⃣ Clone the repository

git clone https://github.com/your-username/veridia-hiring-platform.git
cd veridia-hiring-platform

2️⃣ Backend Setup

cd backend
npm install
npm run dev (to run the backend server)

3️⃣ Frontend Setup

cd frontend
npm install
npm run dev (to display)


📩 Email Automation

->Uses Nodemailer (Gmail SMTP) for sending automated emails
->Sends HTML-formatted emails for:
->Application submission confirmation
->Application status updates


💡 Future Improvements

->Add recruiter dashboard analytics
->Resume parser & AI-based applicant matching
->Use Resend / Brevo for scalable email delivery
->Add pagination & search filters in job listings


👨‍💻 Author

Surya Pratap Singh
Frontend & Full Stack Developer(MERN)

📧 Email: surya2pratap0singh04@gmail.com
🔗 LinkedIn: linkedin.com/in/suryapratapsingh-dev
💻 GitHub: github.com/SuryaPratapSingh2K4


🪶 License
This project is licensed under the MIT License — feel free to modify and use it.