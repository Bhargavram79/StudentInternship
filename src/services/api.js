// ============ MOCK DATA LAYER ============
// Replaces backend API calls with realistic mock data

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get logged-in user from localStorage
const getCurrentUser = () => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
};

// --- Mock Users (3 admins + 20 students) ---
const defaultUsers = [
    // Admins
    { id: 1, userId: 'ADM-001', name: 'Bhargav Ram', email: 'bhargav@example.com', password: 'admin123', role: 'ADMIN', createdAt: '2026-01-10T10:00:00Z' },
    { id: 2, userId: 'ADM-002', name: 'Vikram Mehta', email: 'vikram@example.com', password: 'admin123', role: 'ADMIN', createdAt: '2026-01-10T10:00:00Z' },
    { id: 3, userId: 'ADM-003', name: 'Lakshmi Nair', email: 'lakshmi@example.com', password: 'admin123', role: 'ADMIN', createdAt: '2026-01-10T10:00:00Z' },
    // Students
    { id: 4, userId: 'STU-001', name: 'Priya Sharma', email: 'priya@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-15T10:00:00Z' },
    { id: 5, userId: 'STU-002', name: 'Arjun Patel', email: 'arjun@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-16T10:00:00Z' },
    { id: 6, userId: 'STU-003', name: 'Sneha Reddy', email: 'sneha@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-17T10:00:00Z' },
    { id: 7, userId: 'STU-004', name: 'Rahul Kumar', email: 'rahul@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-18T10:00:00Z' },
    { id: 8, userId: 'STU-005', name: 'Ananya Gupta', email: 'ananya@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-19T10:00:00Z' },
    { id: 9, userId: 'STU-006', name: 'Karthik Iyer', email: 'karthik@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-20T10:00:00Z' },
    { id: 10, userId: 'STU-007', name: 'Meera Joshi', email: 'meera@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-21T10:00:00Z' },
    { id: 11, userId: 'STU-008', name: 'Aditya Singh', email: 'aditya@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-22T10:00:00Z' },
    { id: 12, userId: 'STU-009', name: 'Divya Menon', email: 'divya@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-23T10:00:00Z' },
    { id: 13, userId: 'STU-010', name: 'Rohan Deshmukh', email: 'rohan@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-24T10:00:00Z' },
    { id: 14, userId: 'STU-011', name: 'Nisha Agarwal', email: 'nisha@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-25T10:00:00Z' },
    { id: 15, userId: 'STU-012', name: 'Siddharth Rao', email: 'siddharth@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-26T10:00:00Z' },
    { id: 16, userId: 'STU-013', name: 'Pooja Verma', email: 'pooja@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-27T10:00:00Z' },
    { id: 17, userId: 'STU-014', name: 'Deepak Choudhary', email: 'deepak@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-28T10:00:00Z' },
    { id: 18, userId: 'STU-015', name: 'Riya Kapoor', email: 'riya@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-29T10:00:00Z' },
    { id: 19, userId: 'STU-016', name: 'Amit Jain', email: 'amit@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-01-30T10:00:00Z' },
    { id: 20, userId: 'STU-017', name: 'Swati Pandey', email: 'swati@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-02-01T10:00:00Z' },
    { id: 21, userId: 'STU-018', name: 'Varun Bhatia', email: 'varun@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-02-02T10:00:00Z' },
    { id: 22, userId: 'STU-019', name: 'Kavya Srinivasan', email: 'kavya@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-02-03T10:00:00Z' },
    { id: 23, userId: 'STU-020', name: 'Harsh Tiwari', email: 'harsh@example.com', password: 'student123', role: 'STUDENT', createdAt: '2026-02-04T10:00:00Z' },
];

// Load saved users from localStorage and merge with defaults
const loadUsers = () => {
    try {
        const saved = JSON.parse(localStorage.getItem('mockUsers'));
        if (saved && Array.isArray(saved)) {
            // Merge: keep defaults, add any saved users not already present
            const defaultEmails = defaultUsers.map(u => u.email);
            const extraUsers = saved.filter(u => !defaultEmails.includes(u.email));
            return [...defaultUsers, ...extraUsers];
        }
    } catch { /* ignore parse errors */ }
    return [...defaultUsers];
};
const mockUsers = loadUsers();

// Save users to localStorage
const saveUsers = () => {
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
};

// Generic load/save helpers for all other mock data
const loadData = (key, defaults) => {
    try {
        const saved = JSON.parse(localStorage.getItem(key));
        if (saved && Array.isArray(saved)) return saved;
    } catch { /* ignore parse errors */ }
    return [...defaults];
};
const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Helper: get user without password
const safeUser = (u) => u ? { id: u.id, userId: u.userId, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt } : null;

// SECURITY: Synchronous validation of user against DB — used by AuthContext to prevent localStorage tampering
export const getValidatedUser = (userId) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? safeUser(user) : null;
};

// --- Mock Internships (28 internships with mode/duration/type) ---
const defaultInternships = [
    { id: 1, title: 'Frontend Developer Intern', company: 'TechNova Solutions', description: 'Build responsive web applications using React and modern CSS.', mode: 'Online', duration: '3 months', type: 'Free', stipend: null, skills: 'React, CSS, JavaScript', postedBy: safeUser(mockUsers[0]), createdAt: '2026-01-18T10:00:00Z' },
    { id: 2, title: 'Backend Engineer Intern', company: 'CloudSync Labs', description: 'Develop RESTful APIs and microservices using Spring Boot and PostgreSQL.', mode: 'Online', duration: '3 months', type: 'Paid', stipend: '₹15,000/mo', skills: 'Java, Spring Boot, SQL', postedBy: safeUser(mockUsers[0]), createdAt: '2026-01-20T10:00:00Z' },
    { id: 3, title: 'UI/UX Design Intern', company: 'PixelCraft Studio', description: 'Design intuitive user interfaces for mobile and web applications.', mode: 'Hybrid', duration: '2 months', type: 'Free', stipend: null, skills: 'Figma, Adobe XD, Prototyping', postedBy: safeUser(mockUsers[0]), createdAt: '2026-01-22T10:00:00Z' },
    { id: 4, title: 'Data Science Intern', company: 'DataVista Analytics', description: 'Analyze large datasets and build predictive models using Python.', mode: 'Online', duration: '3 months', type: 'Paid', stipend: '₹20,000/mo', skills: 'Python, ML, Pandas, TensorFlow', postedBy: safeUser(mockUsers[0]), createdAt: '2026-01-25T10:00:00Z' },
    { id: 5, title: 'Mobile App Developer', company: 'AppForge Inc.', description: 'Develop cross-platform mobile applications using React Native.', mode: 'Offline', duration: '3 months', type: 'Paid', stipend: '₹12,000/mo', skills: 'React Native, TypeScript', postedBy: safeUser(mockUsers[0]), createdAt: '2026-01-28T10:00:00Z' },
    { id: 6, title: 'DevOps Engineer Intern', company: 'InfraScale Tech', description: 'Set up CI/CD pipelines, containerize apps with Docker, deploy to Kubernetes.', mode: 'Online', duration: '3 months', type: 'Free', stipend: null, skills: 'Docker, Kubernetes, AWS, Linux', postedBy: safeUser(mockUsers[0]), createdAt: '2026-02-01T10:00:00Z' },
    { id: 7, title: 'Machine Learning Intern', company: 'AI Nexus Corp', description: 'Build and train ML models for NLP and computer vision applications.', mode: 'Online', duration: '3 months', type: 'Paid', stipend: '₹25,000/mo', skills: 'Python, PyTorch, NLP', postedBy: safeUser(mockUsers[1]), createdAt: '2026-02-02T10:00:00Z' },
    { id: 8, title: 'Cybersecurity Analyst Intern', company: 'SecureNet Solutions', description: 'Perform vulnerability assessments and security audits on web applications.', mode: 'Hybrid', duration: '2 months', type: 'Free', stipend: null, skills: 'Security, OWASP, Penetration Testing', postedBy: safeUser(mockUsers[1]), createdAt: '2026-02-03T10:00:00Z' },
    { id: 9, title: 'Cloud Computing Intern', company: 'SkyBridge Cloud', description: 'Deploy and manage applications on AWS, Azure and GCP platforms.', mode: 'Online', duration: '3 months', type: 'Paid', stipend: '₹18,000/mo', skills: 'AWS, Azure, Terraform', postedBy: safeUser(mockUsers[1]), createdAt: '2026-02-04T10:00:00Z' },
    { id: 10, title: 'Full Stack Developer Intern', company: 'WebStack Labs', description: 'Work on both frontend and backend of a SaaS product using MERN stack.', mode: 'Online', duration: '3 months', type: 'Paid', stipend: '₹20,000/mo', skills: 'MongoDB, Express, React, Node', postedBy: safeUser(mockUsers[0]), createdAt: '2026-02-05T10:00:00Z' },
    { id: 11, title: 'Graphic Design Intern', company: 'CreativeMinds Agency', description: 'Create marketing materials, social media graphics and brand assets.', mode: 'Offline', duration: '1 month', type: 'Free', stipend: null, skills: 'Photoshop, Illustrator, Canva', postedBy: safeUser(mockUsers[2]), createdAt: '2026-02-06T10:00:00Z' },
    { id: 12, title: 'Digital Marketing Intern', company: 'GrowthPulse Digital', description: 'Run SEO campaigns, manage social media accounts and analyze marketing metrics.', mode: 'Online', duration: '2 months', type: 'Free', stipend: null, skills: 'SEO, Google Analytics, Social Media', postedBy: safeUser(mockUsers[2]), createdAt: '2026-02-07T10:00:00Z' },
    { id: 13, title: 'Content Writing Intern', company: 'WordSmith Media', description: 'Write blog posts, articles and copy for various digital platforms.', mode: 'Online', duration: '1 month', type: 'Free', stipend: null, skills: 'Writing, SEO, WordPress', postedBy: safeUser(mockUsers[2]), createdAt: '2026-02-08T10:00:00Z' },
    { id: 14, title: 'Blockchain Developer Intern', company: 'ChainLogic Labs', description: 'Build smart contracts and decentralized applications on Ethereum.', mode: 'Online', duration: '3 months', type: 'Paid', stipend: '₹22,000/mo', skills: 'Solidity, Web3.js, Ethereum', postedBy: safeUser(mockUsers[0]), createdAt: '2026-02-09T10:00:00Z' },
    { id: 15, title: 'Game Development Intern', company: 'PlayForge Studios', description: 'Develop 2D/3D games using Unity engine and C# programming.', mode: 'Offline', duration: '3 months', type: 'Paid', stipend: '₹10,000/mo', skills: 'Unity, C#, Game Design', postedBy: safeUser(mockUsers[1]), createdAt: '2026-02-10T10:00:00Z' },
    { id: 16, title: 'QA Testing Intern', company: 'BugSquash Tech', description: 'Write test cases, perform manual and automated testing on web applications.', mode: 'Online', duration: '2 months', type: 'Free', stipend: null, skills: 'Selenium, Jest, Test Planning', postedBy: safeUser(mockUsers[0]), createdAt: '2026-02-11T10:00:00Z' },
    { id: 17, title: 'Product Management Intern', company: 'ProductLab Inc.', description: 'Assist in product roadmap planning, user research and feature prioritization.', mode: 'Hybrid', duration: '3 months', type: 'Paid', stipend: '₹15,000/mo', skills: 'Jira, User Research, Analytics', postedBy: safeUser(mockUsers[1]), createdAt: '2026-02-12T10:00:00Z' },
    { id: 18, title: 'Embedded Systems Intern', company: 'MicroTech Electronics', description: 'Program microcontrollers and design IoT solutions for smart devices.', mode: 'Offline', duration: '3 months', type: 'Paid', stipend: '₹12,000/mo', skills: 'C, Arduino, IoT, Raspberry Pi', postedBy: safeUser(mockUsers[2]), createdAt: '2026-02-13T10:00:00Z' },
    { id: 19, title: 'Database Administrator Intern', company: 'DataCore Systems', description: 'Manage and optimize MySQL & MongoDB databases for high-traffic applications.', mode: 'Online', duration: '2 months', type: 'Free', stipend: null, skills: 'MySQL, MongoDB, Redis', postedBy: safeUser(mockUsers[0]), createdAt: '2026-02-14T10:00:00Z' },
    { id: 20, title: 'AR/VR Developer Intern', company: 'ImmerseTech Labs', description: 'Build augmented and virtual reality experiences using Unity and ARKit.', mode: 'Offline', duration: '3 months', type: 'Paid', stipend: '₹18,000/mo', skills: 'Unity, ARKit, 3D Modeling', postedBy: safeUser(mockUsers[1]), createdAt: '2026-02-15T10:00:00Z' },
    { id: 21, title: 'Business Analytics Intern', company: 'InsightBridge Co.', description: 'Drive data-driven decisions using BI tools and statistical analysis.', mode: 'Online', duration: '2 months', type: 'Free', stipend: null, skills: 'Power BI, Excel, SQL, Tableau', postedBy: safeUser(mockUsers[2]), createdAt: '2026-02-16T10:00:00Z' },
    { id: 22, title: 'Natural Language Processing Intern', company: 'LingvoAI', description: 'Build NLP pipelines for text classification, sentiment analysis and chatbots.', mode: 'Online', duration: '3 months', type: 'Paid', stipend: '₹20,000/mo', skills: 'Python, spaCy, Transformers', postedBy: safeUser(mockUsers[0]), createdAt: '2026-02-17T10:00:00Z' },
    { id: 23, title: 'Video Editing Intern', company: 'FrameFlow Media', description: 'Edit promotional videos, tutorials and social media reels for clients.', mode: 'Online', duration: '1 month', type: 'Free', stipend: null, skills: 'Premiere Pro, After Effects', postedBy: safeUser(mockUsers[2]), createdAt: '2026-02-18T10:00:00Z' },
    { id: 24, title: 'Network Engineering Intern', company: 'NetPulse Technologies', description: 'Configure routers, switches and firewalls; monitor network performance.', mode: 'Offline', duration: '2 months', type: 'Paid', stipend: '₹10,000/mo', skills: 'Cisco, Networking, TCP/IP', postedBy: safeUser(mockUsers[1]), createdAt: '2026-02-19T10:00:00Z' },
    { id: 25, title: 'Technical Writing Intern', company: 'DocuPrime Solutions', description: 'Write technical documentation, API docs and user guides for software products.', mode: 'Online', duration: '1 month', type: 'Free', stipend: null, skills: 'Markdown, API Docs, Technical Writing', postedBy: safeUser(mockUsers[0]), createdAt: '2026-02-20T10:00:00Z' },
    { id: 26, title: 'Robotics Intern', company: 'RoboWorks Lab', description: 'Build and program robots using ROS framework and computer vision.', mode: 'Offline', duration: '3 months', type: 'Paid', stipend: '₹15,000/mo', skills: 'ROS, Python, Computer Vision', postedBy: safeUser(mockUsers[1]), createdAt: '2026-02-21T10:00:00Z' },
    { id: 27, title: 'iOS Developer Intern', company: 'SwiftApps Studio', description: 'Develop native iOS apps using Swift and SwiftUI with clean architecture.', mode: 'Online', duration: '3 months', type: 'Paid', stipend: '₹18,000/mo', skills: 'Swift, SwiftUI, Xcode', postedBy: safeUser(mockUsers[0]), createdAt: '2026-02-22T10:00:00Z' },
    { id: 28, title: 'Data Engineering Intern', company: 'PipelineIO', description: 'Design and maintain ETL pipelines and data warehouses using Apache Spark.', mode: 'Hybrid', duration: '3 months', type: 'Paid', stipend: '₹22,000/mo', skills: 'Spark, Airflow, SQL, Python', postedBy: safeUser(mockUsers[2]), createdAt: '2026-02-23T10:00:00Z' },
];
const mockInternships = loadData('mockInternships', defaultInternships);

// --- Applications (spread across students) ---
const defaultApplications = [
    { id: 1, student: safeUser(mockUsers[3]), internship: mockInternships[0], status: 'ACCEPTED', appliedAt: '2026-01-20T12:00:00Z' },
    { id: 2, student: safeUser(mockUsers[4]), internship: mockInternships[1], status: 'ACCEPTED', appliedAt: '2026-01-22T14:00:00Z' },
    { id: 3, student: safeUser(mockUsers[5]), internship: mockInternships[0], status: 'ACCEPTED', appliedAt: '2026-01-24T09:00:00Z' },
    { id: 4, student: safeUser(mockUsers[6]), internship: mockInternships[2], status: 'REJECTED', appliedAt: '2026-01-26T16:00:00Z' },
    { id: 5, student: safeUser(mockUsers[7]), internship: mockInternships[3], status: 'ACCEPTED', appliedAt: '2026-01-28T11:00:00Z' },
    { id: 6, student: safeUser(mockUsers[8]), internship: mockInternships[4], status: 'PENDING', appliedAt: '2026-02-01T10:00:00Z' },
    { id: 7, student: safeUser(mockUsers[9]), internship: mockInternships[5], status: 'ACCEPTED', appliedAt: '2026-02-02T08:00:00Z' },
    { id: 8, student: safeUser(mockUsers[10]), internship: mockInternships[6], status: 'PENDING', appliedAt: '2026-02-03T13:00:00Z' },
    { id: 9, student: safeUser(mockUsers[11]), internship: mockInternships[7], status: 'ACCEPTED', appliedAt: '2026-02-04T09:00:00Z' },
    { id: 10, student: safeUser(mockUsers[12]), internship: mockInternships[8], status: 'PENDING', appliedAt: '2026-02-05T14:00:00Z' },
    { id: 11, student: safeUser(mockUsers[13]), internship: mockInternships[9], status: 'ACCEPTED', appliedAt: '2026-02-06T10:00:00Z' },
    { id: 12, student: safeUser(mockUsers[14]), internship: mockInternships[10], status: 'PENDING', appliedAt: '2026-02-07T11:00:00Z' },
    { id: 13, student: safeUser(mockUsers[15]), internship: mockInternships[11], status: 'ACCEPTED', appliedAt: '2026-02-08T09:00:00Z' },
    { id: 14, student: safeUser(mockUsers[16]), internship: mockInternships[12], status: 'REJECTED', appliedAt: '2026-02-09T15:00:00Z' },
    { id: 15, student: safeUser(mockUsers[17]), internship: mockInternships[13], status: 'ACCEPTED', appliedAt: '2026-02-10T10:00:00Z' },
    { id: 16, student: safeUser(mockUsers[18]), internship: mockInternships[14], status: 'PENDING', appliedAt: '2026-02-11T12:00:00Z' },
    { id: 17, student: safeUser(mockUsers[19]), internship: mockInternships[15], status: 'ACCEPTED', appliedAt: '2026-02-12T08:00:00Z' },
    { id: 18, student: safeUser(mockUsers[20]), internship: mockInternships[16], status: 'PENDING', appliedAt: '2026-02-13T14:00:00Z' },
    { id: 19, student: safeUser(mockUsers[21]), internship: mockInternships[17], status: 'ACCEPTED', appliedAt: '2026-02-14T10:00:00Z' },
    { id: 20, student: safeUser(mockUsers[22]), internship: mockInternships[18], status: 'PENDING', appliedAt: '2026-02-15T09:00:00Z' },
    // Additional applications (some students apply to multiple)
    { id: 21, student: safeUser(mockUsers[3]), internship: mockInternships[6], status: 'PENDING', appliedAt: '2026-02-16T10:00:00Z' },
    { id: 22, student: safeUser(mockUsers[5]), internship: mockInternships[9], status: 'ACCEPTED', appliedAt: '2026-02-17T11:00:00Z' },
    { id: 23, student: safeUser(mockUsers[7]), internship: mockInternships[13], status: 'PENDING', appliedAt: '2026-02-18T13:00:00Z' },
    { id: 24, student: safeUser(mockUsers[9]), internship: mockInternships[19], status: 'ACCEPTED', appliedAt: '2026-02-19T09:00:00Z' },
];
const mockApplications = loadData('mockApplications', defaultApplications);

// --- Tasks (assigned to accepted students) ---
const defaultTasks = [
    // Priya (STU-001) - Frontend intern
    { id: 1, title: 'Setup Development Environment', description: 'Install Node.js, React, and configure project structure with linting.', internship: mockInternships[0], assignedTo: safeUser(mockUsers[3]), status: 'DONE', dueDate: '2026-02-01', createdAt: '2026-01-22T10:00:00Z' },
    { id: 2, title: 'Build Login Page UI', description: 'Create a responsive login page with form validation and animations.', internship: mockInternships[0], assignedTo: safeUser(mockUsers[3]), status: 'DONE', dueDate: '2026-02-10', createdAt: '2026-01-25T10:00:00Z' },
    { id: 3, title: 'Implement Dashboard Components', description: 'Build reusable dashboard components including stats cards and charts.', internship: mockInternships[0], assignedTo: safeUser(mockUsers[3]), status: 'IN_PROGRESS', dueDate: '2026-02-28', createdAt: '2026-02-01T10:00:00Z' },
    // Arjun (STU-002) - Backend intern
    { id: 4, title: 'Design REST API Endpoints', description: 'Define and document REST API endpoints using OpenAPI specification.', internship: mockInternships[1], assignedTo: safeUser(mockUsers[4]), status: 'DONE', dueDate: '2026-02-15', createdAt: '2026-01-24T10:00:00Z' },
    { id: 5, title: 'Build User Auth Module', description: 'Implement JWT-based authentication with login, register and refresh.', internship: mockInternships[1], assignedTo: safeUser(mockUsers[4]), status: 'IN_PROGRESS', dueDate: '2026-03-01', createdAt: '2026-02-01T10:00:00Z' },
    // Sneha (STU-003) - Frontend + Full Stack
    { id: 6, title: 'Create Wireframes', description: 'Design wireframes for all key screens including dashboard and profile.', internship: mockInternships[0], assignedTo: safeUser(mockUsers[5]), status: 'DONE', dueDate: '2026-02-20', createdAt: '2026-01-26T10:00:00Z' },
    { id: 7, title: 'Unit Testing for Auth', description: 'Write comprehensive unit tests for the authentication module.', internship: mockInternships[0], assignedTo: safeUser(mockUsers[5]), status: 'IN_PROGRESS', dueDate: '2026-03-05', createdAt: '2026-02-05T10:00:00Z' },
    // Ananya (STU-005) - Data Science
    { id: 8, title: 'Data Cleaning Pipeline', description: 'Build automated data cleaning pipeline using Pandas.', internship: mockInternships[3], assignedTo: safeUser(mockUsers[7]), status: 'IN_PROGRESS', dueDate: '2026-03-01', createdAt: '2026-02-01T10:00:00Z' },
    { id: 9, title: 'Build ML Model Prototype', description: 'Train a classification model on the cleaned dataset.', internship: mockInternships[3], assignedTo: safeUser(mockUsers[7]), status: 'TODO', dueDate: '2026-03-15', createdAt: '2026-02-10T10:00:00Z' },
    // Meera (STU-007) - DevOps
    { id: 10, title: 'Setup CI/CD Pipeline', description: 'Create GitHub Actions workflows for build, test and deploy.', internship: mockInternships[5], assignedTo: safeUser(mockUsers[9]), status: 'DONE', dueDate: '2026-02-20', createdAt: '2026-02-05T10:00:00Z' },
    { id: 11, title: 'Containerize Application', description: 'Write Dockerfiles and docker-compose for the application stack.', internship: mockInternships[5], assignedTo: safeUser(mockUsers[9]), status: 'IN_PROGRESS', dueDate: '2026-03-01', createdAt: '2026-02-12T10:00:00Z' },
    // Divya (STU-009) - Cybersecurity
    { id: 12, title: 'Vulnerability Assessment', description: 'Perform OWASP Top 10 vulnerability scan on the web application.', internship: mockInternships[7], assignedTo: safeUser(mockUsers[11]), status: 'DONE', dueDate: '2026-02-25', createdAt: '2026-02-06T10:00:00Z' },
    // Nisha (STU-011) - Full Stack
    { id: 13, title: 'Build REST API for Users', description: 'Create CRUD API endpoints for user management module.', internship: mockInternships[9], assignedTo: safeUser(mockUsers[13]), status: 'IN_PROGRESS', dueDate: '2026-03-01', createdAt: '2026-02-08T10:00:00Z' },
    { id: 14, title: 'Implement Frontend Forms', description: 'Build React forms with validation for user management.', internship: mockInternships[9], assignedTo: safeUser(mockUsers[13]), status: 'TODO', dueDate: '2026-03-10', createdAt: '2026-02-15T10:00:00Z' },
    // Pooja (STU-013) - Digital Marketing
    { id: 15, title: 'SEO Audit Report', description: 'Conduct a comprehensive SEO audit and prepare improvement report.', internship: mockInternships[11], assignedTo: safeUser(mockUsers[15]), status: 'DONE', dueDate: '2026-02-22', createdAt: '2026-02-09T10:00:00Z' },
    // Riya (STU-015) - Blockchain
    { id: 16, title: 'Write Smart Contract', description: 'Develop an ERC-20 token smart contract in Solidity.', internship: mockInternships[13], assignedTo: safeUser(mockUsers[17]), status: 'IN_PROGRESS', dueDate: '2026-03-05', createdAt: '2026-02-12T10:00:00Z' },
    // Swati (STU-017) - QA
    { id: 17, title: 'Write Test Plan', description: 'Create comprehensive test plan document covering all modules.', internship: mockInternships[15], assignedTo: safeUser(mockUsers[19]), status: 'DONE', dueDate: '2026-02-25', createdAt: '2026-02-13T10:00:00Z' },
    { id: 18, title: 'Automate Login Tests', description: 'Write Selenium automation scripts for login flow testing.', internship: mockInternships[15], assignedTo: safeUser(mockUsers[19]), status: 'TODO', dueDate: '2026-03-10', createdAt: '2026-02-20T10:00:00Z' },
    // Kavya (STU-019) - Embedded Systems
    { id: 19, title: 'Program Arduino Sensor Module', description: 'Write firmware for temperature and humidity sensor module.', internship: mockInternships[17], assignedTo: safeUser(mockUsers[21]), status: 'DONE', dueDate: '2026-02-28', createdAt: '2026-02-15T10:00:00Z' },
    { id: 20, title: 'Build IoT Dashboard', description: 'Create a web dashboard to display real-time sensor data.', internship: mockInternships[17], assignedTo: safeUser(mockUsers[21]), status: 'IN_PROGRESS', dueDate: '2026-03-10', createdAt: '2026-02-20T10:00:00Z' },
];
const mockTasks = loadData('mockTasks', defaultTasks);

// --- Reports ---
const defaultReports = [
    { id: 1, student: safeUser(mockUsers[3]), task: mockTasks[0], content: 'Successfully set up the development environment with Vite and React 19. All team members can now clone and run.', submittedAt: '2026-02-01T15:00:00Z' },
    { id: 2, student: safeUser(mockUsers[3]), task: mockTasks[1], content: 'Completed the login page with modern design, form validation and toast notifications.', submittedAt: '2026-02-09T17:00:00Z' },
    { id: 3, student: safeUser(mockUsers[4]), task: mockTasks[3], content: 'Defined 15 API endpoints covering auth, internships, tasks and feedback. Documentation is complete.', submittedAt: '2026-02-14T11:00:00Z' },
    { id: 4, student: safeUser(mockUsers[5]), task: mockTasks[5], content: 'Created initial wireframes for 8 screens. Dashboard layout finalized based on mentor feedback.', submittedAt: '2026-02-19T14:00:00Z' },
    { id: 5, student: safeUser(mockUsers[9]), task: mockTasks[9], content: 'CI/CD pipeline set up with GitHub Actions. Auto-deploys on push to main branch.', submittedAt: '2026-02-19T16:00:00Z' },
    { id: 6, student: safeUser(mockUsers[11]), task: mockTasks[11], content: 'Completed vulnerability assessment. Found 3 medium-severity issues and documented remediation steps.', submittedAt: '2026-02-24T10:00:00Z' },
    { id: 7, student: safeUser(mockUsers[15]), task: mockTasks[14], content: 'SEO audit completed. Identified 12 improvement areas. Report with actionable recommendations submitted.', submittedAt: '2026-02-21T12:00:00Z' },
    { id: 8, student: safeUser(mockUsers[19]), task: mockTasks[16], content: 'Test plan document created covering 45 test cases across 6 modules. Peer reviewed and approved.', submittedAt: '2026-02-24T14:00:00Z' },
    { id: 9, student: safeUser(mockUsers[21]), task: mockTasks[18], content: 'Arduino firmware completed. Sensor readings accurate within 0.5° tolerance. Power optimization done.', submittedAt: '2026-02-27T09:00:00Z' },
];
const mockReports = loadData('mockReports', defaultReports);

// --- Feedback (at least one per student) ---
const defaultFeedback = [
    // Priya
    { id: 1, mentor: safeUser(mockUsers[0]), student: safeUser(mockUsers[3]), task: mockTasks[0], rating: 5, comment: 'Excellent work on environment setup! Well-documented and thorough.', createdAt: '2026-02-02T10:00:00Z' },
    { id: 2, mentor: safeUser(mockUsers[0]), student: safeUser(mockUsers[3]), task: mockTasks[1], rating: 4, comment: 'Very good UI. The design looks premium. Minor: add password strength indicator.', createdAt: '2026-02-11T10:00:00Z' },
    // Arjun
    { id: 3, mentor: safeUser(mockUsers[0]), student: safeUser(mockUsers[4]), task: mockTasks[3], rating: 3, comment: 'API design is functional but needs consistency in naming. Follow RESTful best practices.', createdAt: '2026-02-16T10:00:00Z' },
    // Sneha
    { id: 4, mentor: safeUser(mockUsers[0]), student: safeUser(mockUsers[5]), task: mockTasks[5], rating: 4, comment: 'Good wireframes. Dashboard layout is intuitive. Add more whitespace between sections.', createdAt: '2026-02-20T10:00:00Z' },
    // Rahul
    { id: 5, mentor: safeUser(mockUsers[0]), student: safeUser(mockUsers[6]), task: null, rating: 2, comment: 'Application rejected. Please improve portfolio and reapply with stronger skills.', createdAt: '2026-01-28T10:00:00Z' },
    // Ananya
    { id: 6, mentor: safeUser(mockUsers[0]), student: safeUser(mockUsers[7]), task: mockTasks[7], rating: 4, comment: 'Good progress on data pipeline. Code is clean. Add more error handling for edge cases.', createdAt: '2026-02-15T10:00:00Z' },
    // Karthik
    { id: 7, mentor: safeUser(mockUsers[1]), student: safeUser(mockUsers[8]), task: null, rating: 3, comment: 'Application under review. Your skills look promising. We will get back soon.', createdAt: '2026-02-03T10:00:00Z' },
    // Meera
    { id: 8, mentor: safeUser(mockUsers[1]), student: safeUser(mockUsers[9]), task: mockTasks[9], rating: 5, comment: 'Outstanding CI/CD setup! The pipeline is robust and well-configured. Excellent initiative.', createdAt: '2026-02-21T10:00:00Z' },
    // Aditya
    { id: 9, mentor: safeUser(mockUsers[1]), student: safeUser(mockUsers[10]), task: null, rating: 3, comment: 'Your ML skills are developing. Focus on practical projects to strengthen your portfolio.', createdAt: '2026-02-05T10:00:00Z' },
    // Divya
    { id: 10, mentor: safeUser(mockUsers[1]), student: safeUser(mockUsers[11]), task: mockTasks[11], rating: 5, comment: 'Excellent vulnerability assessment. Thorough analysis with clear remediation steps.', createdAt: '2026-02-25T10:00:00Z' },
    // Rohan
    { id: 11, mentor: safeUser(mockUsers[0]), student: safeUser(mockUsers[12]), task: null, rating: 3, comment: 'Cloud computing skills are adequate. Work on getting AWS certification for next steps.', createdAt: '2026-02-07T10:00:00Z' },
    // Nisha
    { id: 12, mentor: safeUser(mockUsers[0]), student: safeUser(mockUsers[13]), task: mockTasks[12], rating: 4, comment: 'Good API implementation. Code structure is clean. Add input validation middleware.', createdAt: '2026-02-18T10:00:00Z' },
    // Siddharth
    { id: 13, mentor: safeUser(mockUsers[2]), student: safeUser(mockUsers[14]), task: null, rating: 3, comment: 'Graphic design portfolio shows potential. Focus on brand consistency in your work.', createdAt: '2026-02-09T10:00:00Z' },
    // Pooja
    { id: 14, mentor: safeUser(mockUsers[2]), student: safeUser(mockUsers[15]), task: mockTasks[14], rating: 5, comment: 'Outstanding SEO audit! Very thorough analysis with actionable recommendations.', createdAt: '2026-02-23T10:00:00Z' },
    // Deepak
    { id: 15, mentor: safeUser(mockUsers[2]), student: safeUser(mockUsers[16]), task: null, rating: 2, comment: 'Content writing needs improvement. Work on grammar and SEO-friendly writing techniques.', createdAt: '2026-02-11T10:00:00Z' },
    // Riya
    { id: 16, mentor: safeUser(mockUsers[0]), student: safeUser(mockUsers[17]), task: mockTasks[15], rating: 4, comment: 'Smart contract code is well-structured. Add more comments and gas optimization.', createdAt: '2026-02-20T10:00:00Z' },
    // Amit
    { id: 17, mentor: safeUser(mockUsers[1]), student: safeUser(mockUsers[18]), task: null, rating: 3, comment: 'Game development concepts are solid. Focus more on performance optimization.', createdAt: '2026-02-13T10:00:00Z' },
    // Swati
    { id: 18, mentor: safeUser(mockUsers[0]), student: safeUser(mockUsers[19]), task: mockTasks[16], rating: 5, comment: 'Excellent test plan! Comprehensive coverage with well-defined test cases. Great work!', createdAt: '2026-02-26T10:00:00Z' },
    // Varun
    { id: 19, mentor: safeUser(mockUsers[1]), student: safeUser(mockUsers[20]), task: null, rating: 3, comment: 'Product management skills developing well. Focus on quantitative user research methods.', createdAt: '2026-02-15T10:00:00Z' },
    // Kavya
    { id: 20, mentor: safeUser(mockUsers[2]), student: safeUser(mockUsers[21]), task: mockTasks[18], rating: 5, comment: 'Impressive firmware code! Sensor accuracy is excellent. Power optimization is well thought out.', createdAt: '2026-02-28T10:00:00Z' },
    // Harsh
    { id: 21, mentor: safeUser(mockUsers[0]), student: safeUser(mockUsers[22]), task: null, rating: 4, comment: 'Good database skills. Your MongoDB queries are efficient. Learn about indexing strategies.', createdAt: '2026-02-17T10:00:00Z' },
];
const mockFeedback = loadData('mockFeedback', defaultFeedback);

// --- Notifications ---
const defaultNotifications = [
    { id: 1, type: 'application', message: 'Karthik Iyer applied for Mobile App Developer', read: false, createdAt: '2026-02-01T10:00:00Z', forRole: 'ADMIN' },
    { id: 2, type: 'feedback', message: 'You received new feedback on "Setup Dev Environment"', read: false, createdAt: '2026-02-02T10:00:00Z', forRole: 'STUDENT', forUserId: 4 },
    { id: 3, type: 'task', message: 'New task assigned: "Build Login Page UI"', read: true, createdAt: '2026-01-25T10:00:00Z', forRole: 'STUDENT', forUserId: 4 },
    { id: 4, type: 'application', message: 'Aditya Singh applied for Machine Learning Intern', read: false, createdAt: '2026-02-03T13:00:00Z', forRole: 'ADMIN' },
    { id: 5, type: 'accepted', message: 'Your application for Frontend Developer was accepted!', read: false, createdAt: '2026-01-21T10:00:00Z', forRole: 'STUDENT', forUserId: 4 },
    { id: 6, type: 'application', message: 'Rohan Deshmukh applied for Cloud Computing Intern', read: false, createdAt: '2026-02-05T14:00:00Z', forRole: 'ADMIN' },
    { id: 7, type: 'report', message: 'Priya Sharma submitted report for "Build Login Page UI"', read: true, createdAt: '2026-02-09T17:00:00Z', forRole: 'ADMIN' },
    { id: 8, type: 'feedback', message: 'You received 5★ feedback on "Write Test Plan"', read: false, createdAt: '2026-02-26T10:00:00Z', forRole: 'STUDENT', forUserId: 20 },
    { id: 9, type: 'task', message: 'New task assigned: "Automate Login Tests"', read: false, createdAt: '2026-02-20T10:00:00Z', forRole: 'STUDENT', forUserId: 20 },
    { id: 10, type: 'application', message: 'Siddharth Rao applied for Graphic Design Intern', read: true, createdAt: '2026-02-07T11:00:00Z', forRole: 'ADMIN' },
    { id: 11, type: 'accepted', message: 'Your application for Data Science was accepted!', read: false, createdAt: '2026-01-29T10:00:00Z', forRole: 'STUDENT', forUserId: 8 },
    { id: 12, type: 'feedback', message: 'You received 4★ feedback on "Data Cleaning Pipeline"', read: false, createdAt: '2026-02-15T10:00:00Z', forRole: 'STUDENT', forUserId: 8 },
];
const mockNotifications = loadData('mockNotifications', defaultNotifications);

// Starter tasks auto-created when an application is accepted
const starterTaskTemplates = [
    { title: 'Complete Onboarding Checklist', description: 'Review company guidelines, set up tools, and complete the onboarding form.' },
    { title: 'Meet Your Mentor', description: 'Schedule an introductory meeting with your assigned mentor.' },
    { title: 'First Week Learning Plan', description: 'Study the assigned resources and complete the initial learning module.' },
];

// ====================== SECURITY HELPERS ======================
const requireAuth = () => {
    const user = getCurrentUser();
    if (!user) throw { response: { data: { message: 'You must be logged in to perform this action' } } };
    // Validate user still exists in the database
    const dbUser = mockUsers.find(u => u.id === user.id);
    if (!dbUser) {
        localStorage.removeItem('user');
        throw { response: { data: { message: 'Your session is invalid. Please log in again.' } } };
    }
    return { ...user, role: dbUser.role }; // Always use role from DB, not from localStorage
};

const requireAdmin = () => {
    const user = requireAuth();
    if (user.role !== 'ADMIN') {
        throw { response: { data: { message: 'Access denied. Admin privileges required.' } } };
    }
    return user;
};

// ====================== AUTH API ======================
// Public registration — ALWAYS creates STUDENT accounts only
export const register = async (data) => {
    await delay(500);
    // Check for duplicate email
    const existing = mockUsers.find(u => u.email === data.email);
    if (existing) {
        throw { response: { data: { message: 'An account with this email already exists' } } };
    }
    // SECURITY: Force STUDENT role — admin accounts can only be created by existing admins
    const role = 'STUDENT';
    const newId = mockUsers.length + 1;
    const count = mockUsers.filter(u => u.role === role).length + 1;
    const userId = `STU-${String(count).padStart(3, '0')}`;
    const newUser = { id: newId, userId, name: data.name, email: data.email, password: data.password || 'password123', role, createdAt: new Date().toISOString() };
    mockUsers.push(newUser);
    saveUsers();
    const safe = safeUser(newUser);
    return { data: { ...safe, token: 'mock-jwt-token-' + newId } };
};

export const login = async (data) => {
    await delay(500);
    const user = mockUsers.find(u => u.email === data.email);
    if (!user) {
        throw { response: { data: { message: 'No account found with this email' } } };
    }
    // Validate password
    if (user.password !== data.password) {
        throw { response: { data: { message: 'Incorrect password' } } };
    }
    const safe = safeUser(user);
    return { data: { ...safe, token: 'mock-jwt-token-' + user.id } };
};

// ====================== INTERNSHIPS ======================
export const getInternships = async () => { await delay(300); return { data: [...mockInternships] }; };
export const getInternship = async (id) => { await delay(200); return { data: mockInternships.find(i => i.id === id) }; };
export const createInternship = async (data) => {
    await delay(400);
    const admin = requireAdmin();
    const newItem = { ...data, id: Date.now(), postedBy: safeUser(mockUsers.find(u => u.id === admin.id) || mockUsers[0]), createdAt: new Date().toISOString() };
    mockInternships.push(newItem);
    saveData('mockInternships', mockInternships);
    return { data: newItem };
};
export const updateInternship = async (id, data) => {
    await delay(300);
    requireAdmin();
    const idx = mockInternships.findIndex(i => i.id === id);
    if (idx > -1) Object.assign(mockInternships[idx], data);
    saveData('mockInternships', mockInternships);
    return { data: { ...data, id } };
};
export const deleteInternship = async (id) => {
    await delay(300);
    requireAdmin();
    const idx = mockInternships.findIndex(i => i.id === id);
    if (idx > -1) mockInternships.splice(idx, 1);
    saveData('mockInternships', mockInternships);
    return { data: {} };
};

// ====================== APPLICATIONS ======================
export const applyToInternship = async (internshipId) => {
    await delay(400);
    const currentUser = requireAuth();
    const student = safeUser(mockUsers.find(u => u.id === currentUser.id));
    if (!student) throw { response: { data: { message: 'User not found' } } };
    // Prevent duplicate applications
    const alreadyApplied = mockApplications.find(a => a.student.id === currentUser.id && a.internship?.id === internshipId);
    if (alreadyApplied) {
        throw { response: { data: { message: 'You have already applied to this internship' } } };
    }
    const newApp = { id: Date.now(), student, internship: mockInternships.find(i => i.id === internshipId), status: 'PENDING', appliedAt: new Date().toISOString() };
    mockApplications.push(newApp);
    saveData('mockApplications', mockApplications);
    // Add notification for admins
    mockNotifications.push({ id: Date.now(), type: 'application', message: `${student.name} applied for ${newApp.internship?.title}`, read: false, createdAt: new Date().toISOString(), forRole: 'ADMIN' });
    saveData('mockNotifications', mockNotifications);
    return { data: newApp };
};
export const getMyApplications = async () => {
    await delay(300);
    const currentUser = getCurrentUser();
    const uid = currentUser?.id || 4;
    return { data: mockApplications.filter(a => a.student.id === uid) };
};
export const getAllApplications = async () => { await delay(300); requireAdmin(); return { data: [...mockApplications] }; };
export const updateApplicationStatus = async (id, status) => {
    await delay(300);
    requireAdmin();
    const app = mockApplications.find(a => a.id === id);
    if (app) {
        app.status = status;
        // Auto-create starter tasks when accepted
        if (status === 'ACCEPTED' && app.student && app.internship) {
            starterTaskTemplates.forEach((tmpl, i) => {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 7 * (i + 1));
                const newTask = {
                    id: Date.now() + i,
                    title: tmpl.title,
                    description: tmpl.description,
                    internship: app.internship,
                    assignedTo: app.student,
                    status: 'TODO',
                    dueDate: dueDate.toISOString().split('T')[0],
                    createdAt: new Date().toISOString(),
                };
                mockTasks.push(newTask);
            });
            saveData('mockTasks', mockTasks);
            // Notify student
            mockNotifications.push({
                id: Date.now() + 100,
                type: 'accepted',
                message: `Your application for ${app.internship.title} was accepted! Tasks have been assigned.`,
                read: false,
                createdAt: new Date().toISOString(),
                forRole: 'STUDENT',
                forUserId: app.student.id,
            });
            saveData('mockNotifications', mockNotifications);
        }
        saveData('mockApplications', mockApplications);
    }
    return { data: app };
};

// ====================== TASKS ======================
export const createTask = async (data) => {
    await delay(400);
    requireAdmin();
    const newTask = { ...data, id: Date.now(), status: 'TODO', createdAt: new Date().toISOString(), internship: mockInternships.find(i => i.id === data.internshipId), assignedTo: safeUser(mockUsers.find(u => u.id === data.assignedToId)) };
    mockTasks.push(newTask);
    saveData('mockTasks', mockTasks);
    // Notify student
    if (newTask.assignedTo) {
        mockNotifications.push({ id: Date.now() + 1, type: 'task', message: `New task assigned: "${newTask.title}"`, read: false, createdAt: new Date().toISOString(), forRole: 'STUDENT', forUserId: newTask.assignedTo.id });
        saveData('mockNotifications', mockNotifications);
    }
    return { data: newTask };
};
export const getAllTasks = async () => { await delay(300); requireAdmin(); return { data: [...mockTasks] }; };
export const getMyTasks = async () => {
    await delay(300);
    const currentUser = getCurrentUser();
    const uid = currentUser?.id || 4;
    return { data: mockTasks.filter(t => t.assignedTo?.id === uid) };
};
export const updateTaskStatus = async (id, status) => {
    await delay(300);
    const task = mockTasks.find(t => t.id === id);
    if (task) task.status = status;
    saveData('mockTasks', mockTasks);
    return { data: task };
};
export const deleteTask = async (id) => {
    await delay(300);
    requireAdmin();
    const idx = mockTasks.findIndex(t => t.id === id);
    if (idx > -1) mockTasks.splice(idx, 1);
    saveData('mockTasks', mockTasks);
    return { data: {} };
};

// ====================== REPORTS ======================
export const submitReport = async (data) => {
    await delay(400);
    const currentUser = getCurrentUser();
    const student = currentUser ? safeUser(mockUsers.find(u => u.id === currentUser.id) || mockUsers[3]) : safeUser(mockUsers[3]);
    const newReport = { ...data, id: Date.now(), student, task: mockTasks.find(t => t.id === data.taskId), submittedAt: new Date().toISOString() };
    mockReports.push(newReport);
    saveData('mockReports', mockReports);
    mockNotifications.push({ id: Date.now() + 1, type: 'report', message: `${student.name} submitted report for "${newReport.task?.title}"`, read: false, createdAt: new Date().toISOString(), forRole: 'ADMIN' });
    saveData('mockNotifications', mockNotifications);
    return { data: newReport };
};
export const getAllReports = async () => { await delay(300); requireAdmin(); return { data: [...mockReports] }; };
export const getMyReports = async () => {
    await delay(300);
    const currentUser = getCurrentUser();
    const uid = currentUser?.id || 4;
    return { data: mockReports.filter(r => r.student.id === uid) };
};

// ====================== FEEDBACK ======================
export const submitFeedback = async (data) => {
    await delay(400);
    const admin = requireAdmin();
    const newFb = { ...data, id: Date.now(), mentor: safeUser(mockUsers.find(u => u.id === admin.id) || mockUsers[0]), student: safeUser(mockUsers.find(u => u.id === data.studentId)), task: data.taskId ? mockTasks.find(t => t.id === data.taskId) : null, createdAt: new Date().toISOString() };
    mockFeedback.push(newFb);
    saveData('mockFeedback', mockFeedback);
    mockNotifications.push({ id: Date.now() + 1, type: 'feedback', message: `You received ${newFb.rating}★ feedback${newFb.task ? ' on "' + newFb.task.title + '"' : ''}`, read: false, createdAt: new Date().toISOString(), forRole: 'STUDENT', forUserId: data.studentId });
    saveData('mockNotifications', mockNotifications);
    return { data: newFb };
};
export const getAllFeedback = async () => { await delay(300); requireAdmin(); return { data: [...mockFeedback] }; };
export const getMyFeedback = async () => {
    await delay(300);
    const currentUser = getCurrentUser();
    const uid = currentUser?.id || 4;
    return { data: mockFeedback.filter(f => f.student?.id === uid) };
};

// ====================== USERS ======================
export const getStudents = async () => {
    await delay(200);
    requireAdmin();
    return { data: mockUsers.filter(u => u.role === 'STUDENT').map(safeUser) };
};
export const getUsers = async () => { await delay(200); requireAdmin(); return { data: mockUsers.map(safeUser) }; };

// Admin-only: Create a new user with any role (ADMIN or STUDENT)
export const createUser = async (data) => {
    await delay(500);
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
        throw { response: { data: { message: 'Only administrators can create user accounts' } } };
    }
    const existing = mockUsers.find(u => u.email === data.email);
    if (existing) {
        throw { response: { data: { message: 'An account with this email already exists' } } };
    }
    const role = data.role || 'STUDENT';
    const newId = mockUsers.length + 1;
    const prefix = role === 'ADMIN' ? 'ADM' : 'STU';
    const count = mockUsers.filter(u => u.role === role).length + 1;
    const userId = `${prefix}-${String(count).padStart(3, '0')}`;
    const newUser = { id: newId, userId, name: data.name, email: data.email, password: data.password || 'password123', role, createdAt: new Date().toISOString() };
    mockUsers.push(newUser);
    saveUsers();
    return { data: safeUser(newUser) };
};

// Admin-only: Delete a user
export const deleteUser = async (id) => {
    await delay(300);
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN') {
        throw { response: { data: { message: 'Only administrators can delete user accounts' } } };
    }
    // Prevent deleting yourself
    if (currentUser.id === id) {
        throw { response: { data: { message: 'You cannot delete your own account' } } };
    }
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx > -1) mockUsers.splice(idx, 1);
    saveUsers();
    return { data: {} };
};

// ====================== NOTIFICATIONS ======================
export const getNotifications = async () => {
    await delay(200);
    const currentUser = getCurrentUser();
    if (!currentUser) return { data: [] };
    const filtered = mockNotifications.filter(n => {
        if (currentUser.role === 'ADMIN') return n.forRole === 'ADMIN';
        return n.forRole === 'STUDENT' && n.forUserId === currentUser.id;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { data: filtered };
};
export const markNotificationRead = async (id) => {
    await delay(100);
    const n = mockNotifications.find(n => n.id === id);
    if (n) n.read = true;
    saveData('mockNotifications', mockNotifications);
    return { data: n };
};
export const markAllNotificationsRead = async () => {
    await delay(100);
    const currentUser = getCurrentUser();
    if (!currentUser) return { data: [] };
    mockNotifications.forEach(n => {
        if (currentUser.role === 'ADMIN' && n.forRole === 'ADMIN') n.read = true;
        if (currentUser.role === 'STUDENT' && n.forRole === 'STUDENT' && n.forUserId === currentUser.id) n.read = true;
    });
    saveData('mockNotifications', mockNotifications);
    return { data: [] };
};

// ====================== PROFILE / SETTINGS ======================
export const updateProfile = async (data) => {
    await delay(400);
    const currentUser = requireAuth();
    const user = mockUsers.find(u => u.id === currentUser.id);
    if (user) {
        if (data.name) user.name = data.name;
        saveUsers(); // Persist to mockUsers in localStorage
        const safe = safeUser(user);
        localStorage.setItem('user', JSON.stringify({ ...safe, token: currentUser.token }));
        return { data: safe };
    }
    throw { response: { data: { message: 'User not found' } } };
};
export const changePassword = async (data) => {
    await delay(400);
    const currentUser = requireAuth();
    const user = mockUsers.find(u => u.id === currentUser.id);
    if (!user) throw { response: { data: { message: 'User not found' } } };
    // Validate current password
    if (data.currentPassword && user.password !== data.currentPassword) {
        throw { response: { data: { message: 'Current password is incorrect' } } };
    }
    // Update password
    if (data.newPassword) {
        if (data.newPassword.length < 6) {
            throw { response: { data: { message: 'New password must be at least 6 characters' } } };
        }
        user.password = data.newPassword;
        saveUsers();
    }
    return { data: { message: 'Password changed successfully' } };
};

// ====================== ANNOUNCEMENTS ======================
const defaultAnnouncements = [
    { id: 1, title: 'Welcome to InternHub!', message: 'We are excited to launch our internship management platform. All students can now browse and apply for internships.', priority: 'normal', author: safeUser(mockUsers[0]), createdAt: '2026-01-15T10:00:00Z' },
    { id: 2, title: 'New Internships Added', message: 'We have added 15+ new internships across various domains including AI/ML, Cybersecurity, and Cloud Computing. Check them out!', priority: 'normal', author: safeUser(mockUsers[0]), createdAt: '2026-02-01T10:00:00Z' },
    { id: 3, title: '⚠️ Deadline Reminder: Submit Reports', message: 'All interns must submit their progress reports by February 28th. Late submissions will affect your evaluation score.', priority: 'urgent', author: safeUser(mockUsers[0]), createdAt: '2026-02-20T10:00:00Z' },
    { id: 4, title: 'Mentor Feedback Sessions', message: 'One-on-one mentor feedback sessions are scheduled for the first week of March. Check your notifications for your slot.', priority: 'normal', author: safeUser(mockUsers[1]), createdAt: '2026-02-22T10:00:00Z' },
    { id: 5, title: 'Platform Maintenance — March 5th', message: 'InternHub will undergo scheduled maintenance on March 5th from 2:00 AM to 6:00 AM IST. The platform may be unavailable during this time.', priority: 'urgent', author: safeUser(mockUsers[2]), createdAt: '2026-02-24T10:00:00Z' },
    { id: 6, title: 'Certificate Distribution', message: 'Completion certificates for January cohort interns are now ready. Check the Certificates section in your dashboard.', priority: 'normal', author: safeUser(mockUsers[0]), createdAt: '2026-02-25T08:00:00Z' },
];
const mockAnnouncements = loadData('mockAnnouncements', defaultAnnouncements);

export const getAnnouncements = async () => { await delay(200); return { data: [...mockAnnouncements].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) }; };
export const createAnnouncement = async (data) => {
    await delay(400);
    const admin = requireAdmin();
    const newAnnouncement = { id: Date.now(), ...data, author: safeUser(mockUsers.find(u => u.id === admin.id) || mockUsers[0]), createdAt: new Date().toISOString() };
    mockAnnouncements.push(newAnnouncement);
    saveData('mockAnnouncements', mockAnnouncements);
    return { data: newAnnouncement };
};
export const deleteAnnouncement = async (id) => {
    await delay(300);
    requireAdmin();
    const idx = mockAnnouncements.findIndex(a => a.id === id);
    if (idx > -1) mockAnnouncements.splice(idx, 1);
    saveData('mockAnnouncements', mockAnnouncements);
    return { data: {} };
};

// ====================== CERTIFICATES ======================
const defaultCertificates = [
    { id: 1, student: safeUser(mockUsers[3]), internship: mockInternships[0], issuedBy: safeUser(mockUsers[0]), grade: 'A', issuedAt: '2026-02-20T10:00:00Z' },
    { id: 2, student: safeUser(mockUsers[4]), internship: mockInternships[1], issuedBy: safeUser(mockUsers[0]), grade: 'B+', issuedAt: '2026-02-22T10:00:00Z' },
    { id: 3, student: safeUser(mockUsers[9]), internship: mockInternships[5], issuedBy: safeUser(mockUsers[1]), grade: 'A+', issuedAt: '2026-02-23T10:00:00Z' },
    { id: 4, student: safeUser(mockUsers[11]), internship: mockInternships[7], issuedBy: safeUser(mockUsers[1]), grade: 'A', issuedAt: '2026-02-24T10:00:00Z' },
    { id: 5, student: safeUser(mockUsers[15]), internship: mockInternships[11], issuedBy: safeUser(mockUsers[2]), grade: 'A+', issuedAt: '2026-02-24T10:00:00Z' },
    { id: 6, student: safeUser(mockUsers[19]), internship: mockInternships[15], issuedBy: safeUser(mockUsers[0]), grade: 'A', issuedAt: '2026-02-25T10:00:00Z' },
    { id: 7, student: safeUser(mockUsers[21]), internship: mockInternships[17], issuedBy: safeUser(mockUsers[2]), grade: 'A+', issuedAt: '2026-02-25T10:00:00Z' },
    { id: 8, student: safeUser(mockUsers[5]), internship: mockInternships[0], issuedBy: safeUser(mockUsers[0]), grade: 'B', issuedAt: '2026-02-25T10:00:00Z' },
];
const mockCertificates = loadData('mockCertificates', defaultCertificates);

export const getCertificates = async () => { await delay(200); return { data: [...mockCertificates].sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt)) }; };
export const getMyCertificates = async () => {
    await delay(200);
    const currentUser = getCurrentUser();
    const uid = currentUser?.id || 4;
    return { data: mockCertificates.filter(c => c.student.id === uid) };
};
export const issueCertificate = async (data) => {
    await delay(400);
    const admin = requireAdmin();
    const newCert = {
        id: Date.now(),
        student: safeUser(mockUsers.find(u => u.id === data.studentId)),
        internship: mockInternships.find(i => i.id === data.internshipId),
        issuedBy: safeUser(mockUsers.find(u => u.id === admin.id) || mockUsers[0]),
        grade: data.grade || 'B',
        issuedAt: new Date().toISOString(),
    };
    mockCertificates.push(newCert);
    saveData('mockCertificates', mockCertificates);
    // Notify student
    mockNotifications.push({ id: Date.now() + 1, type: 'accepted', message: `You received a completion certificate for ${newCert.internship?.title}!`, read: false, createdAt: new Date().toISOString(), forRole: 'STUDENT', forUserId: data.studentId });
    saveData('mockNotifications', mockNotifications);
    return { data: newCert };
};

export default {};
