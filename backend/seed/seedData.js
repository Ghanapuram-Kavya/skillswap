// ============================================================================
// SkillSwap - Realistic Dataset for Graph Seeding & In-Memory Engine
// ============================================================================

const seedData = {
  categories: [
    { categoryId: 'cat-prog', name: 'Programming Languages', icon: 'Code' },
    { categoryId: 'cat-web', name: 'Web Development', icon: 'Globe' },
    { categoryId: 'cat-mobile', name: 'Mobile App Development', icon: 'Smartphone' },
    { categoryId: 'cat-aiml', name: 'AI & Data Science', icon: 'Brain' },
    { categoryId: 'cat-cloud', name: 'Cloud & DevOps', icon: 'Cloud' },
    { categoryId: 'cat-db', name: 'Databases & Storage', icon: 'Database' },
    { categoryId: 'cat-design', name: 'UI/UX & Creative Design', icon: 'Palette' },
    { categoryId: 'cat-soft', name: 'Soft Skills & Leadership', icon: 'Users' }
  ],

  skills: [
    // Programming
    { skillId: 'skl-python', name: 'Python', categoryId: 'cat-prog', category: 'Programming Languages', icon: '🐍', level: 'Beginner to Advanced', description: 'General-purpose programming language widely used in AI, scripting, and web backends.' },
    { skillId: 'skl-js', name: 'JavaScript', categoryId: 'cat-prog', category: 'Programming Languages', icon: '⚡', level: 'All Levels', description: 'The fundamental language of the web, powering dynamic frontend and backend systems.' },
    { skillId: 'skl-ts', name: 'TypeScript', categoryId: 'cat-prog', category: 'Programming Languages', icon: '🔷', level: 'Intermediate', description: 'Typed superset of JavaScript that compiles to plain JavaScript for enterprise scale.' },
    { skillId: 'skl-java', name: 'Java', categoryId: 'cat-prog', category: 'Programming Languages', icon: '☕', level: 'Intermediate', description: 'Robust, object-oriented language for enterprise backend and Android systems.' },
    { skillId: 'skl-golang', name: 'Go (Golang)', categoryId: 'cat-prog', category: 'Programming Languages', icon: '🐹', level: 'Intermediate to Advanced', description: 'Fast, statically typed compiled language designed for concurrency and microservices.' },
    { skillId: 'skl-rust', name: 'Rust', categoryId: 'cat-prog', category: 'Programming Languages', icon: '🦀', level: 'Advanced', description: 'Systems programming language focused on memory safety, speed, and concurrency.' },
    { skillId: 'skl-cpp', name: 'C++', categoryId: 'cat-prog', category: 'Programming Languages', icon: '⚙️', level: 'Advanced', description: 'High-performance systems programming language for game engines and core computing.' },

    // Web Dev
    { skillId: 'skl-angular', name: 'Angular', categoryId: 'cat-web', category: 'Web Development', icon: '🅰️', level: 'Intermediate', description: 'Comprehensive Google-backed TypeScript framework for building scalable SPA web apps.' },
    { skillId: 'skl-react', name: 'React', categoryId: 'cat-web', category: 'Web Development', icon: '⚛️', level: 'Beginner to Advanced', description: 'Component-driven declarative UI library for interactive web and mobile applications.' },
    { skillId: 'skl-nextjs', name: 'Next.js', categoryId: 'cat-web', category: 'Web Development', icon: '▲', level: 'Intermediate', description: 'React framework featuring server-side rendering, static generation, and edge API routes.' },
    { skillId: 'skl-nodejs', name: 'Node.js', categoryId: 'cat-web', category: 'Web Development', icon: '🟢', level: 'Beginner to Advanced', description: 'Asynchronous event-driven JavaScript runtime built on Chrome V8 engine.' },
    { skillId: 'skl-html', name: 'HTML5', categoryId: 'cat-web', category: 'Web Development', icon: '🌐', level: 'Beginner', description: 'Standard markup language for structuring web pages and web applications.' },
    { skillId: 'skl-css', name: 'CSS3 & Tailwind', categoryId: 'cat-web', category: 'Web Development', icon: '🎨', level: 'Beginner to Intermediate', description: 'Modern styling and utility-first CSS framework for crafting responsive interfaces.' },
    { skillId: 'skl-fastapi', name: 'FastAPI', categoryId: 'cat-web', category: 'Web Development', icon: '⚡', level: 'Intermediate', description: 'Modern, high-performance Python web framework for building REST APIs with auto OpenAPI docs.' },

    // Mobile
    { skillId: 'skl-flutter', name: 'Flutter & Dart', categoryId: 'cat-mobile', category: 'Mobile App Development', icon: '📱', level: 'Intermediate', description: 'Cross-platform UI toolkit by Google for crafting natively compiled iOS and Android apps.' },
    { skillId: 'skl-reactnative', name: 'React Native', categoryId: 'cat-mobile', category: 'Mobile App Development', icon: '📲', level: 'Intermediate', description: 'Framework for building native mobile apps using React and JavaScript.' },
    { skillId: 'skl-swift', name: 'Swift & SwiftUI', categoryId: 'cat-mobile', category: 'Mobile App Development', icon: '🍎', level: 'Intermediate', description: 'Apple programming language and declarative UI framework for iOS and macOS apps.' },
    { skillId: 'skl-kotlin', name: 'Kotlin & Jetpack', categoryId: 'cat-mobile', category: 'Mobile App Development', icon: '🤖', level: 'Intermediate', description: 'Modern, concise programming language officially recommended for Android development.' },

    // AI & Data Science
    { skillId: 'skl-ml', name: 'Machine Learning', categoryId: 'cat-aiml', category: 'AI & Data Science', icon: '🤖', level: 'Intermediate to Advanced', description: 'Supervised and unsupervised statistical learning algorithms, scikit-learn, and model evaluation.' },
    { skillId: 'skl-dl', name: 'Deep Learning & PyTorch', categoryId: 'cat-aiml', category: 'AI & Data Science', icon: '🧠', level: 'Advanced', description: 'Neural networks, CNNs, transformers, and tensor computation using PyTorch and GPU acceleration.' },
    { skillId: 'skl-data', name: 'Data Analysis & SQL', categoryId: 'cat-aiml', category: 'AI & Data Science', icon: '📊', level: 'Beginner to Intermediate', description: 'Exploratory data analysis using Pandas, NumPy, statistical charting, and SQL queries.' },
    { skillId: 'skl-genai', name: 'Generative AI & LLMs', categoryId: 'cat-aiml', category: 'AI & Data Science', icon: '✨', level: 'Intermediate to Advanced', description: 'Prompt engineering, LangChain, RAG architectures, and fine-tuning foundation models.' },

    // Cloud & DevOps
    { skillId: 'skl-aws', name: 'AWS Cloud', categoryId: 'cat-cloud', category: 'Cloud & DevOps', icon: '☁️', level: 'Intermediate', description: 'Amazon Web Services infrastructure including EC2, S3, Lambda, IAM, and VPC networking.' },
    { skillId: 'skl-docker', name: 'Docker & Containers', categoryId: 'cat-cloud', category: 'Cloud & DevOps', icon: '🐳', level: 'Beginner to Intermediate', description: 'Application containerization, Dockerfiles, multi-stage builds, and container networking.' },
    { skillId: 'skl-k8s', name: 'Kubernetes (K8s)', categoryId: 'cat-cloud', category: 'Cloud & DevOps', icon: '☸️', level: 'Advanced', description: 'Automating deployment, scaling, service meshes, and management of containerized apps.' },
    { skillId: 'skl-ci-cd', name: 'CI/CD Pipelines', categoryId: 'cat-cloud', category: 'Cloud & DevOps', icon: '🔄', level: 'Intermediate', description: 'GitHub Actions, automated test suites, artifact packaging, and zero-downtime deployment.' },

    // Databases
    { skillId: 'skl-postgres', name: 'PostgreSQL', categoryId: 'cat-db', category: 'Databases & Storage', icon: '🐘', level: 'Intermediate', description: 'Advanced open-source relational database with JSONB indexing and ACID compliance.' },
    { skillId: 'skl-mongo', name: 'MongoDB', categoryId: 'cat-db', category: 'Databases & Storage', icon: '🍃', level: 'Beginner to Intermediate', description: 'Document-based NoSQL database for flexible JSON schemas and horizontal sharding.' },
    { skillId: 'skl-redis', name: 'Redis', categoryId: 'cat-db', category: 'Databases & Storage', icon: '🔴', level: 'Intermediate', description: 'In-memory data structure store used as a distributed cache, message broker, and queue.' },
    { skillId: 'skl-graphdb', name: 'Graph Databases (CognoDB / Cypher)', categoryId: 'cat-db', category: 'Databases & Storage', icon: '🕸️', level: 'Intermediate', description: 'Connected graph data modeling, property graphs, and multi-hop openCypher traversals.' },

    // Design & UI/UX
    { skillId: 'skl-figma', name: 'Figma & UI Design', categoryId: 'cat-design', category: 'UI/UX & Creative Design', icon: '🎨', level: 'Beginner to Advanced', description: 'Vector interface design, interactive prototyping, auto-layout, and design token systems.' },
    { skillId: 'skl-ux', name: 'UX Research & Wireframing', categoryId: 'cat-design', category: 'UI/UX & Creative Design', icon: '📐', level: 'Beginner to Intermediate', description: 'User persona creation, journey mapping, usability testing, and information architecture.' },

    // Soft Skills & Career
    { skillId: 'skl-speaking', name: 'Public Speaking', categoryId: 'cat-soft', category: 'Soft Skills & Leadership', icon: '🎤', level: 'All Levels', description: 'Presentation confidence, audience engagement, slide storytelling, and keynote delivery.' },
    { skillId: 'skl-interview', name: 'Tech Interview Prep', categoryId: 'cat-soft', category: 'Soft Skills & Leadership', icon: '💼', level: 'All Levels', description: 'System design interviews, coding problem patterns, behavioral STAR method, and mock tests.' },
    { skillId: 'skl-writing', name: 'Technical Writing', categoryId: 'cat-soft', category: 'Soft Skills & Leadership', icon: '✍️', level: 'All Levels', description: 'Documentation clarity, API specifications, RFC proposals, and developer guides.' }
  ],

  users: [
    {
      userId: 'usr-kavya',
      name: 'Kavya Nair',
      email: 'kavya.nair@skillswap.io',
      bio: 'Full-stack web enthusiast passionate about Angular & modern frontend architectures. Eager to master Python & backend AI pipelines!',
      experienceLevel: 'Intermediate',
      location: 'Bengaluru, India',
      rating: 4.9,
      avatar: '👩‍💻'
    },
    {
      userId: 'usr-rahul',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@skillswap.io',
      bio: 'Senior Backend Engineer with 4+ years in Python, FastAPI & Machine Learning. Looking to level up my Angular & frontend UI design skills.',
      experienceLevel: 'Advanced',
      location: 'Pune, India',
      rating: 4.95,
      avatar: '👨‍💻'
    },
    {
      userId: 'usr-anjali',
      name: 'Anjali Verma',
      email: 'anjali.verma@skillswap.io',
      bio: 'MERN stack developer specialized in MongoDB, Express & React. Want to learn DevOps, Docker containerization & AWS cloud deployment.',
      experienceLevel: 'Intermediate',
      location: 'Delhi, India',
      rating: 4.85,
      avatar: '👩‍🔬'
    },
    {
      userId: 'usr-arjun',
      name: 'Arjun Patel',
      email: 'arjun.patel@skillswap.io',
      bio: 'DevOps & SRE Specialist managing Kubernetes clusters and AWS infrastructure. Eager to learn React & fullstack web application development.',
      experienceLevel: 'Advanced',
      location: 'Mumbai, India',
      rating: 4.9,
      avatar: '👨‍🔧'
    },
    {
      userId: 'usr-priya',
      name: 'Priya Sundaram',
      email: 'priya.sundaram@skillswap.io',
      bio: 'Lead Product Designer proficient in Figma, Design Systems & UX Research. Looking for mentorship in JavaScript, CSS animations & React.',
      experienceLevel: 'Expert',
      location: 'Chennai, India',
      rating: 5.0,
      avatar: '👩‍🎨'
    },
    {
      userId: 'usr-alex',
      name: 'Alex Chen',
      email: 'alex.chen@skillswap.io',
      bio: 'Enterprise Java Spring Boot developer building microservices. Keen to explore Python, data science & Generative AI workflows.',
      experienceLevel: 'Advanced',
      location: 'Singapore',
      rating: 4.75,
      avatar: '👨‍💼'
    },
    {
      userId: 'usr-sophia',
      name: 'Sophia Liu',
      email: 'sophia.liu@skillswap.io',
      bio: 'Mobile App Developer building beautiful Flutter & Dart cross-platform apps. Looking to learn native iOS Swift & SwiftUI architectures.',
      experienceLevel: 'Intermediate',
      location: 'San Francisco, USA',
      rating: 4.88,
      avatar: '👩‍💼'
    },
    {
      userId: 'usr-marcus',
      name: 'Marcus Vance',
      email: 'marcus.vance@skillswap.io',
      bio: 'Native iOS Engineer with deep SwiftUI & Swift experience. Eager to pick up cross-platform Flutter and Dart development.',
      experienceLevel: 'Advanced',
      location: 'London, UK',
      rating: 4.92,
      avatar: '👨‍🎨'
    },
    {
      userId: 'usr-elena',
      name: 'Elena Rostova',
      email: 'elena.rostova@skillswap.io',
      bio: 'Distributed systems engineer in Go (Golang), Kafka & Redis. Looking to exchange knowledge on Rust systems programming.',
      experienceLevel: 'Expert',
      location: 'Berlin, Germany',
      rating: 4.97,
      avatar: '👩‍💻'
    },
    {
      userId: 'usr-david',
      name: 'David Kim',
      email: 'david.kim@skillswap.io',
      bio: 'Data Analyst & SQL specialist with 3 years in BI dashboards. Looking to learn Deep Learning, PyTorch, and NLP models.',
      experienceLevel: 'Intermediate',
      location: 'Seoul, South Korea',
      rating: 4.7,
      avatar: '👨‍💻'
    },
    {
      userId: 'usr-aisha',
      name: 'Aisha Khan',
      email: 'aisha.khan@skillswap.io',
      bio: 'Senior Technical Recruiter & Career Coach. I help engineers ace mock interviews & system design communication in exchange for Data Analysis.',
      experienceLevel: 'Expert',
      location: 'Dubai, UAE',
      rating: 4.98,
      avatar: '👩‍💼'
    },
    {
      userId: 'usr-carlos',
      name: 'Carlos Mendez',
      email: 'carlos.mendez@skillswap.io',
      bio: 'Keynote speaker and public speaking coach. Looking to learn Technical Writing and API Documentation.',
      experienceLevel: 'Advanced',
      location: 'Austin, USA',
      rating: 4.82,
      avatar: '👨‍🏫'
    }
  ],

  // User -[:HAS_SKILL]-> Skill
  userSkillsTaught: [
    // Kavya teaches: Angular, HTML, CSS, JavaScript
    { userId: 'usr-kavya', skillId: 'skl-angular', proficiency: 'Advanced', experienceYears: 3 },
    { userId: 'usr-kavya', skillId: 'skl-html', proficiency: 'Expert', experienceYears: 4 },
    { userId: 'usr-kavya', skillId: 'skl-css', proficiency: 'Advanced', experienceYears: 3 },
    { userId: 'usr-kavya', skillId: 'skl-js', proficiency: 'Intermediate', experienceYears: 3 },

    // Rahul teaches: Python, FastAPI, Machine Learning, PostgreSQL
    { userId: 'usr-rahul', skillId: 'skl-python', proficiency: 'Expert', experienceYears: 4 },
    { userId: 'usr-rahul', skillId: 'skl-fastapi', proficiency: 'Advanced', experienceYears: 3 },
    { userId: 'usr-rahul', skillId: 'skl-ml', proficiency: 'Advanced', experienceYears: 3 },
    { userId: 'usr-rahul', skillId: 'skl-postgres', proficiency: 'Advanced', experienceYears: 4 },

    // Anjali teaches: MongoDB, React, Node.js
    { userId: 'usr-anjali', skillId: 'skl-mongo', proficiency: 'Advanced', experienceYears: 3 },
    { userId: 'usr-anjali', skillId: 'skl-react', proficiency: 'Advanced', experienceYears: 3 },
    { userId: 'usr-anjali', skillId: 'skl-nodejs', proficiency: 'Intermediate', experienceYears: 2 },

    // Arjun teaches: AWS, Docker, Kubernetes, CI/CD
    { userId: 'usr-arjun', skillId: 'skl-aws', proficiency: 'Expert', experienceYears: 5 },
    { userId: 'usr-arjun', skillId: 'skl-docker', proficiency: 'Expert', experienceYears: 4 },
    { userId: 'usr-arjun', skillId: 'skl-k8s', proficiency: 'Advanced', experienceYears: 3 },
    { userId: 'usr-arjun', skillId: 'skl-ci-cd', proficiency: 'Advanced', experienceYears: 4 },

    // Priya teaches: Figma, UX Research, CSS
    { userId: 'usr-priya', skillId: 'skl-figma', proficiency: 'Expert', experienceYears: 5 },
    { userId: 'usr-priya', skillId: 'skl-ux', proficiency: 'Expert', experienceYears: 5 },
    { userId: 'usr-priya', skillId: 'skl-css', proficiency: 'Advanced', experienceYears: 4 },

    // Alex teaches: Java, PostgreSQL
    { userId: 'usr-alex', skillId: 'skl-java', proficiency: 'Expert', experienceYears: 6 },
    { userId: 'usr-alex', skillId: 'skl-postgres', proficiency: 'Advanced', experienceYears: 4 },

    // Sophia teaches: Flutter
    { userId: 'usr-sophia', skillId: 'skl-flutter', proficiency: 'Advanced', experienceYears: 3 },

    // Marcus teaches: Swift & SwiftUI
    { userId: 'usr-marcus', skillId: 'skl-swift', proficiency: 'Expert', experienceYears: 5 },

    // Elena teaches: Go, Redis
    { userId: 'usr-elena', skillId: 'skl-golang', proficiency: 'Expert', experienceYears: 5 },
    { userId: 'usr-elena', skillId: 'skl-redis', proficiency: 'Advanced', experienceYears: 4 },

    // David teaches: Data Analysis, PostgreSQL
    { userId: 'usr-david', skillId: 'skl-data', proficiency: 'Advanced', experienceYears: 3 },
    { userId: 'usr-david', skillId: 'skl-postgres', proficiency: 'Intermediate', experienceYears: 2 },

    // Aisha teaches: Tech Interview Prep
    { userId: 'usr-aisha', skillId: 'skl-interview', proficiency: 'Expert', experienceYears: 6 },

    // Carlos teaches: Public Speaking
    { userId: 'usr-carlos', skillId: 'skl-speaking', proficiency: 'Expert', experienceYears: 7 }
  ],

  // User -[:WANTS_TO_LEARN]-> Skill
  userSkillsWanted: [
    // Kavya wants: Python, Node.js, MongoDB, AWS
    { userId: 'usr-kavya', skillId: 'skl-python', priority: 'High', currentLevel: 'Beginner' },
    { userId: 'usr-kavya', skillId: 'skl-nodejs', priority: 'Medium', currentLevel: 'Beginner' },
    { userId: 'usr-kavya', skillId: 'skl-mongo', priority: 'Medium', currentLevel: 'None' },
    { userId: 'usr-kavya', skillId: 'skl-aws', priority: 'High', currentLevel: 'None' },

    // Rahul wants: Angular, React, TypeScript, Figma
    { userId: 'usr-rahul', skillId: 'skl-angular', priority: 'High', currentLevel: 'Beginner' },
    { userId: 'usr-rahul', skillId: 'skl-react', priority: 'Medium', currentLevel: 'Beginner' },
    { userId: 'usr-rahul', skillId: 'skl-ts', priority: 'Medium', currentLevel: 'Beginner' },
    { userId: 'usr-rahul', skillId: 'skl-figma', priority: 'Low', currentLevel: 'None' },

    // Anjali wants: AWS, Docker, Kubernetes
    { userId: 'usr-anjali', skillId: 'skl-aws', priority: 'High', currentLevel: 'Beginner' },
    { userId: 'usr-anjali', skillId: 'skl-docker', priority: 'High', currentLevel: 'None' },
    { userId: 'usr-anjali', skillId: 'skl-k8s', priority: 'Medium', currentLevel: 'None' },

    // Arjun wants: React, Node.js, Figma
    { userId: 'usr-arjun', skillId: 'skl-react', priority: 'High', currentLevel: 'Beginner' },
    { userId: 'usr-arjun', skillId: 'skl-nodejs', priority: 'Medium', currentLevel: 'Beginner' },
    { userId: 'usr-arjun', skillId: 'skl-figma', priority: 'Medium', currentLevel: 'None' },

    // Priya wants: JavaScript, React
    { userId: 'usr-priya', skillId: 'skl-js', priority: 'High', currentLevel: 'Beginner' },
    { userId: 'usr-priya', skillId: 'skl-react', priority: 'High', currentLevel: 'Beginner' },

    // Alex wants: Python, Machine Learning
    { userId: 'usr-alex', skillId: 'skl-python', priority: 'High', currentLevel: 'Beginner' },
    { userId: 'usr-alex', skillId: 'skl-ml', priority: 'High', currentLevel: 'None' },

    // Sophia wants: Swift & SwiftUI
    { userId: 'usr-sophia', skillId: 'skl-swift', priority: 'High', currentLevel: 'None' },

    // Marcus wants: Flutter
    { userId: 'usr-marcus', skillId: 'skl-flutter', priority: 'High', currentLevel: 'None' },

    // Elena wants: Rust
    { userId: 'usr-elena', skillId: 'skl-rust', priority: 'High', currentLevel: 'Beginner' },

    // David wants: Deep Learning, Generative AI
    { userId: 'usr-david', skillId: 'skl-dl', priority: 'High', currentLevel: 'Beginner' },
    { userId: 'usr-david', skillId: 'skl-genai', priority: 'Medium', currentLevel: 'None' },

    // Aisha wants: Data Analysis
    { userId: 'usr-aisha', skillId: 'skl-data', priority: 'High', currentLevel: 'Beginner' },

    // Carlos wants: Technical Writing
    { userId: 'usr-carlos', skillId: 'skl-writing', priority: 'High', currentLevel: 'None' }
  ],

  // Skill -[:RELATED_TO]-> Skill
  skillRelations: [
    { from: 'skl-js', to: 'skl-ts' },
    { from: 'skl-js', to: 'skl-react' },
    { from: 'skl-js', to: 'skl-nodejs' },
    { from: 'skl-html', to: 'skl-css' },
    { from: 'skl-python', to: 'skl-fastapi' },
    { from: 'skl-python', to: 'skl-ml' },
    { from: 'skl-python', to: 'skl-data' },
    { from: 'skl-ml', to: 'skl-dl' },
    { from: 'skl-ml', to: 'skl-genai' },
    { from: 'skl-docker', to: 'skl-k8s' },
    { from: 'skl-docker', to: 'skl-ci-cd' },
    { from: 'skl-aws', to: 'skl-docker' },
    { from: 'skl-flutter', to: 'skl-reactnative' },
    { from: 'skl-swift', to: 'skl-kotlin' },
    { from: 'skl-figma', to: 'skl-ux' },
    { from: 'skl-speaking', to: 'skl-interview' },
    { from: 'skl-postgres', to: 'skl-data' }
  ],

  // Skill -[:REQUIRES]-> Skill (Prerequisites)
  skillPrerequisites: [
    { skill: 'skl-angular', requires: 'skl-ts' },
    { skill: 'skl-ts', requires: 'skl-js' },
    { skill: 'skl-react', requires: 'skl-js' },
    { skill: 'skl-nextjs', requires: 'skl-react' },
    { skill: 'skl-fastapi', requires: 'skl-python' },
    { skill: 'skl-ml', requires: 'skl-python' },
    { skill: 'skl-dl', requires: 'skl-ml' },
    { skill: 'skl-genai', requires: 'skl-dl' },
    { skill: 'skl-k8s', requires: 'skl-docker' }
  ],

  // SkillSwap Requests (Sample Active Exchanges)
  swapRequests: [
    {
      swapId: 'swp-1',
      senderId: 'usr-kavya',
      receiverId: 'usr-rahul',
      offeredSkillId: 'skl-angular',
      wantedSkillId: 'skl-python',
      message: 'Hi Rahul! I saw you have deep expertise in Python and are looking to learn Angular. I would love to do a 1-on-1 skill exchange session!',
      status: 'ACCEPTED',
      createdAt: '2026-08-25T10:30:00Z'
    },
    {
      swapId: 'swp-2',
      senderId: 'usr-anjali',
      receiverId: 'usr-arjun',
      offeredSkillId: 'skl-react',
      wantedSkillId: 'skl-aws',
      message: 'Hey Arjun, I can teach you advanced React components & state management in exchange for AWS container deployment guides!',
      status: 'ACCEPTED',
      createdAt: '2026-08-25T14:15:00Z'
    },
    {
      swapId: 'swp-3',
      senderId: 'usr-priya',
      receiverId: 'usr-kavya',
      offeredSkillId: 'skl-figma',
      wantedSkillId: 'skl-js',
      message: 'Hi Kavya! Would love to trade Figma UI design systems for JavaScript fundamentals.',
      status: 'PENDING',
      createdAt: '2026-08-26T09:00:00Z'
    },
    {
      swapId: 'swp-4',
      senderId: 'usr-sophia',
      receiverId: 'usr-marcus',
      offeredSkillId: 'skl-flutter',
      wantedSkillId: 'skl-swift',
      message: 'Hello Marcus, I specialize in Flutter and want to pick up native iOS SwiftUI from an expert.',
      status: 'ACCEPTED',
      createdAt: '2026-08-24T16:00:00Z'
    },
    {
      swapId: 'swp-5',
      senderId: 'usr-david',
      receiverId: 'usr-rahul',
      offeredSkillId: 'skl-data',
      wantedSkillId: 'skl-ml',
      message: 'Hi Rahul! I have 3 years of SQL & Data Analysis experience and want to learn hands-on Machine Learning models.',
      status: 'PENDING',
      createdAt: '2026-08-26T11:20:00Z'
    }
  ],

  // Learning Sessions
  sessions: [
    {
      sessionId: 'ses-1',
      swapId: 'swp-1',
      teacherId: 'usr-kavya',
      learnerId: 'usr-rahul',
      skillId: 'skl-angular',
      date: '2026-08-28',
      time: '18:00 IST',
      mode: 'Google Meet / Online',
      meetingLink: 'https://meet.google.com/dev-swap-kavya-rahul',
      status: 'SCHEDULED'
    },
    {
      sessionId: 'ses-2',
      swapId: 'swp-1',
      teacherId: 'usr-rahul',
      learnerId: 'usr-kavya',
      skillId: 'skl-python',
      date: '2026-08-30',
      time: '19:00 IST',
      mode: 'Google Meet / Online',
      meetingLink: 'https://meet.google.com/dev-swap-rahul-kavya',
      status: 'SCHEDULED'
    },
    {
      sessionId: 'ses-3',
      swapId: 'swp-2',
      teacherId: 'usr-arjun',
      learnerId: 'usr-anjali',
      skillId: 'skl-aws',
      date: '2026-08-24',
      time: '17:00 IST',
      mode: 'Zoom / Online',
      meetingLink: 'https://zoom.us/j/skillswap-arjun-anjali',
      status: 'COMPLETED'
    },
    {
      sessionId: 'ses-4',
      swapId: 'swp-2',
      teacherId: 'usr-anjali',
      learnerId: 'usr-arjun',
      skillId: 'skl-react',
      date: '2026-08-25',
      time: '17:00 IST',
      mode: 'Zoom / Online',
      meetingLink: 'https://zoom.us/j/skillswap-anjali-arjun',
      status: 'COMPLETED'
    }
  ],

  // Reviews
  reviews: [
    {
      reviewId: 'rev-1',
      authorId: 'usr-anjali',
      targetUserId: 'usr-arjun',
      rating: 5,
      comment: 'Arjun explained AWS VPC networking, IAM security, and ECS containers so effortlessly! Highly recommended mentor.',
      createdAt: '2026-08-24T19:00:00Z'
    },
    {
      reviewId: 'rev-2',
      authorId: 'usr-arjun',
      targetUserId: 'usr-anjali',
      rating: 5,
      comment: 'Anjali is an outstanding React tutor. She walked me through custom hooks and context API with live coding examples.',
      createdAt: '2026-08-25T19:00:00Z'
    },
    {
      reviewId: 'rev-3',
      authorId: 'usr-alex',
      targetUserId: 'usr-rahul',
      rating: 5,
      comment: 'Rahul gave me the clearest breakdown of FastAPI async endpoints and ML model serving. Great teacher!',
      createdAt: '2026-08-23T15:30:00Z'
    }
  ]
};

module.exports = seedData;
