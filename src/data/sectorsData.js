// Sector Competencies & Future Scope Data Matrix
// Comprehensive industry insights across all major sectors including Software, Service, AI, FinTech, Healthcare, Hardware, Design, and CleanTech

export const SECTORS_DATA = [
  {
    id: "software-engineering",
    name: "Software & Cloud Systems Field",
    category: "Technology",
    tagline: "High-scale distributed systems, cloud-native infrastructure, and API architecture",
    cagr: "+16.8% (2025–2030)",
    marketSize: "$1.4 Trillion",
    demandIndex: 96,
    automationRisk: "Moderate (AI enhances code generation, human architecture & resilience remain vital)",
    overview: "Software engineering is shifting from routine boilerplate writing to high-leverage architectural orchestration, distributed reliability, and AI-augmented systems engineering. Mastery of system design, low-latency communication, observability, and cloud primitives defines top-tier talent.",
    coreCompetencies: [
      {
        name: "Distributed Systems Architecture",
        level: "Senior / Core",
        description: "Designing fault-tolerant, horizontally scalable services, event streaming (Kafka/RabbitMQ), and distributed state coordination.",
        tools: ["Apache Kafka", "Redis Cluster", "gRPC", "Envoy"]
      },
      {
        name: "Full-Stack Web & Modern Frameworks",
        level: "Foundational / High Demand",
        description: "Single-page and server-rendered reactive interfaces, resilient state management, and type-safe backend microservices.",
        tools: ["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL"]
      },
      {
        name: "Cloud-Native Infrastructure & DevOps",
        level: "Core Industry Standard",
        description: "Containerization, infrastructure as code, CI/CD pipeline automation, and multi-cloud deployment.",
        tools: ["Docker", "Kubernetes", "Terraform", "AWS / GCP", "GitHub Actions"]
      },
      {
        name: "API Design & Security Standards",
        level: "Core Industry Standard",
        description: "RESTful, GraphQL, and RPC standards, OAuth2/OIDC, mTLS, rate limiting, and defensive endpoint security.",
        tools: ["OpenAPI", "GraphQL", "OAuth2", "JWT", "Postman"]
      },
      {
        name: "Observability & Site Reliability",
        level: "High Value",
        description: "Telemetry, distributed tracing, structured logging, SLA/SLO tracking, and incident post-mortem analysis.",
        tools: ["Prometheus", "Grafana", "OpenTelemetry", "Datadog"]
      }
    ],
    emergingCompetencies: [
      {
        name: "AI Tooling Integration & Agents",
        description: "Embedding LLMs into system pipelines, semantic vector search, function calling, and autonomous tool workflows."
      },
      {
        name: "Edge Computing & WebAssembly",
        description: "Executing low-latency logic on Cloudflare Workers, Fastly Compute, and client-side Wasm modules."
      },
      {
        name: "Zero-Trust Architecture",
        description: "Identity-aware network perimeters, ephemeral credentials, and software supply-chain security (SBOMs)."
      }
    ],
    futureScope: {
      outlook: "By 2030, traditional manual coding will be 60% accelerated by LLM agents. However, demand for engineers with deep understanding of distributed consistency, data modeling, concurrency, and security will rise by over 35%. The competitive advantage will belong to 'system architects' who can evaluate trade-offs, manage complex cloud topologies, and guarantee uptime.",
      keyTrends: [
        "Transition toward platform engineering and internal developer platforms (IDPs)",
        "Deep integration of autonomous coding agents requiring rigorous testing and verification",
        "Cost-optimization in cloud computing (FinOps) as cloud spend surpasses infrastructure budgets",
        "Rise of Rust and Go in high-performance cloud backends and low-level networking"
      ]
    },
    rolesAndSalaries: [
      { role: "Junior Software Engineer", exp: "0–2 yrs", salary: "$78,000 – $115,000", focus: "Feature implementation, unit testing, bug remediation, code review" },
      { role: "Senior Full-Stack Engineer", exp: "3–6 yrs", salary: "$135,000 – $185,000", focus: "Architecture decisions, complex backend APIs, performance optimization" },
      { role: "Staff / Principal Cloud Architect", exp: "7+ yrs", salary: "$195,000 – $310,000+", focus: "Enterprise infrastructure, multi-region failover, tech vision, mentoring" }
    ],
    recommendedCertifications: [
      "AWS Certified Solutions Architect – Associate / Professional",
      "Certified Kubernetes Administrator (CKA)",
      "Google Cloud Professional Cloud Architect",
      "Meta Front-End / Back-End Professional Certificate"
    ],
    projectBlueprints: [
      "Real-time collaborative markdown editor with WebSockets and Operational Transformation / CRDTs",
      "High-throughput transactional payment processor simulation with idempotent webhook handling and Redis lock mechanisms",
      "Multi-tenant SaaS boilerplate with role-based access control, Stripe billing, and Dockerized microservices"
    ],
    graphSkills: ["JavaScript", "React", "Node.js", "Databases", "System Design", "Algorithms", "Git", "Testing", "API Design", "Cloud Deployment"]
  },
  {
    id: "service-consulting",
    name: "Service Sector & Enterprise Consulting",
    category: "Professional Services",
    tagline: "IT services management, digital transformation, business analysis, and consulting delivery",
    cagr: "+12.4% (2025–2030)",
    marketSize: "$1.8 Trillion",
    demandIndex: 91,
    automationRisk: "Low to Moderate (Client relationship, complex organizational problem solving, & negotiation cannot be automated)",
    overview: "The professional service sector encompasses IT advisory, digital transformation consultancy, enterprise software deployment (ERP, CRM), and customer success engineering. It bridges technical capability with business ROI, stakeholder alignment, and change management.",
    coreCompetencies: [
      {
        name: "Enterprise Solution Architecture & ITIL",
        level: "Core Leadership",
        description: "Mapping legacy organizational processes into scalable modern cloud service workflows, SLA management, and ITIL framework governance.",
        tools: ["ServiceNow", "Jira Service Management", "Salesforce", "SAP / Workday"]
      },
      {
        name: "Business Analysis & Requirements Engineering",
        level: "Foundational / High Demand",
        description: "Translating ambiguous client business challenges into concrete functional specifications, user stories, and acceptance criteria.",
        tools: ["Figma / Miro", "BPMN 2.0", "Confluence", "Visio"]
      },
      {
        name: "Client Stakeholder Communication & Change Management",
        level: "Executive Standard",
        description: "Leading steering committees, executive briefings, budget proposals, change adoption curves, and conflict resolution.",
        tools: ["Executive Dashboards", "Prosci ADKAR", "PowerBI"]
      },
      {
        name: "Data-Driven Process Optimization (Lean / Six Sigma)",
        level: "Core Competency",
        description: "Root cause analysis, cycle time reduction, workflow bottleneck detection, and operational efficiency tracking.",
        tools: ["Celonis (Process Mining)", "Excel / Tableau", "SQL Analytics"]
      },
      {
        name: "Vendor & Cloud Contract Governance",
        level: "Strategic",
        description: "Vendor evaluation, SLA negotiation, compliance adherence (SOC2, GDPR, HIPAA), and cloud ROI assessment.",
        tools: ["Spend Management", "Security Auditing Frameworks"]
      }
    ],
    emergingCompetencies: [
      {
        name: "GenAI Process Automation Consulting",
        description: "Guiding Fortune 500 firms through safe adoption of internal LLMs, governance policies, and custom knowledge assistants."
      },
      {
        name: "Sustainability & ESG Advisory Tech",
        description: "Implementing digital carbon accounting, supply-chain transparency, and CSRD compliance reporting systems."
      },
      {
        name: "Human-in-the-Loop Operational Systems",
        description: "Designing workflows where AI triages tickets and humans provide critical authorization and relationship handling."
      }
    ],
    futureScope: {
      outlook: "Consulting and service firms (Accenture, Deloitte, McKinsey Digital, Infosys, Wipro) are experiencing massive client demand to modernize technical debt. Routine paperwork and data entry are automated, shifting the premium to consultants who possess hybrid acumen: deep software fluency paired with exceptional client empathy and strategic structuring.",
      keyTrends: [
        "Shift from pure staff augmentation to outcome-based and shared-risk consulting engagements",
        "Rise of 'AI Transformation' practices helping non-tech enterprises modernize operations",
        "Process Mining (Celonis) becoming standard for diagnosing operational waste before software rollouts",
        "Surge in Customer Success Operations (CSOps) retaining high-value subscription accounts"
      ]
    },
    rolesAndSalaries: [
      { role: "Business / Technology Analyst", exp: "0–2 yrs", salary: "$72,000 – $105,000", focus: "Requirement gathering, process maps, user acceptance testing, client demo presentations" },
      { role: "Senior Technology Consultant", exp: "3–6 yrs", salary: "$125,000 – $170,000", focus: "Solution blueprinting, managing implementation squads, executive stakeholder reporting" },
      { role: "Engagement Director / Partner", exp: "7+ yrs", salary: "$190,000 – $320,000+", focus: "Account P&L, multi-million dollar transformation programs, strategic advisory" }
    ],
    recommendedCertifications: [
      "ITIL 4 Foundation / Managing Professional",
      "Project Management Professional (PMP) or PMI-ACP",
      "Certified Scrum Product Owner (CSPO)",
      "Salesforce Certified Administrator / Consultant",
      "ServiceNow Certified System Administrator (CSA)"
    ],
    projectBlueprints: [
      "Comprehensive Digital Transformation Blueprint for a regional healthcare provider migrating from on-prem to cloud",
      "Process Mining simulation analyzing 10,000 service tickets with actionable cycle-time reduction strategies",
      "Interactive ROI Calculator and business case presentation for an enterprise SaaS deployment"
    ],
    graphSkills: ["System Design", "Testing", "API Design", "Databases", "Git"]
  },
  {
    id: "ai-data-science",
    name: "Artificial Intelligence & Data Systems",
    category: "Deep Tech & Intelligence",
    tagline: "Generative AI, Large Language Models, MLOps, deep learning pipelines, and predictive analytics",
    cagr: "+28.2% (2025–2030)",
    marketSize: "$1.35 Trillion",
    demandIndex: 98,
    automationRisk: "Low (AI researchers and engineers are the architects building the automation)",
    overview: "From foundational model training to RAG pipelines, fine-tuning, and production MLOps, AI has transformed every layer of the economy. Real-world competency requires moving beyond toy notebook models into deterministic evaluation, latency optimization, and robust data hygiene.",
    coreCompetencies: [
      {
        name: "LLM Orchestration & RAG Pipelines",
        level: "Hyper In-Demand",
        description: "Chunking strategies, hybrid vector + keyword search, re-ranking, and context window management for enterprise data.",
        tools: ["LangChain", "LlamaIndex", "Pinecone", "ChromaDB", "Gemini API"]
      },
      {
        name: "Deep Learning & Model Training",
        level: "Core Advanced",
        description: "Backpropagation dynamics, transformer attention mechanisms, quantization (GGUF/AWQ), and fine-tuning (LoRA/QLoRA).",
        tools: ["PyTorch", "Hugging Face", "CUDA", "TensorFlow", "vLLM"]
      },
      {
        name: "Production MLOps & Model Serving",
        level: "Core Industry Standard",
        description: "Model registry, continuous evaluation, drift detection, GPU cluster scaling, and low-latency inference endpoints.",
        tools: ["MLflow", "Triton Inference Server", "Ray", "Kubeflow"]
      },
      {
        name: "Statistical Analysis & Feature Engineering",
        level: "Foundational",
        description: "Hypothesis testing, causal inference, time-series forecasting, and high-dimensional data visualization.",
        tools: ["Pandas", "NumPy", "Scikit-Learn", "SciPy", "Matplotlib"]
      }
    ],
    emergingCompetencies: [
      {
        name: "Autonomous Agent Architectures",
        description: "Multi-agent systems (CrewAI, AutoGen) with planning, long-term memory retrieval, and tool execution feedback loops."
      },
      {
        name: "Multimodal Processing",
        description: "Synchronous analysis of audio, video, sensor signals, and images in real-time edge environments."
      },
      {
        name: "AI Safety & Red-Teaming",
        description: "Adversarial prompt injection testing, hallucination mitigations, and compliance with EU AI Act standards."
      }
    ],
    futureScope: {
      outlook: "The initial generative AI novelty wave has subsided into enterprise ROI demands. Companies will not fund speculative science projects; they seek engineers who can deploy fast, cost-efficient, grounded models that reliably solve concrete business workflows without hallucination.",
      keyTrends: [
        "Small Language Models (SLMs) running locally on mobile and edge devices",
        "Compound AI systems (combining search, databases, deterministic logic, and models)",
        "Synthetic data generation for fine-tuning specialized domain models"
      ]
    },
    rolesAndSalaries: [
      { role: "Data / AI Engineer", exp: "0–2 yrs", salary: "$90,000 – $130,000", focus: "Data pipeline ingestion, feature storage, baseline evaluation" },
      { role: "Machine Learning / Applied Scientist", exp: "3–6 yrs", salary: "$150,000 – $215,000", focus: "Model training, architecture selection, hyperparameter tuning, RAG optimization" },
      { role: "Staff AI Systems Architect", exp: "7+ yrs", salary: "$220,000 – $380,000+", focus: "GPU infrastructure strategy, research-to-production pipeline, ethical AI governance" }
    ],
    recommendedCertifications: [
      "DeepLearning.AI Deep Learning Specialization",
      "TensorFlow Developer Certificate / PyTorch Certified Engineer",
      "AWS Certified Machine Learning – Specialty",
      "Google Cloud Professional Data Engineer"
    ],
    projectBlueprints: [
      "Enterprise Hybrid RAG System with semantic cache, document citation verification, and latency benchmarks",
      "Fine-tuned Small Language Model (Llama 3 / Mistral) using LoRA for legal or medical terminology extraction",
      "Real-time fraud anomaly detector processing streaming synthetic transaction records with Kafka and Scikit-Learn"
    ],
    graphSkills: ["Algorithms", "Databases", "Testing", "API Design", "JavaScript", "System Design"]
  },
  {
    id: "fintech-finance",
    name: "FinTech & Financial Services",
    category: "Finance & Quantitative Systems",
    tagline: "Algorithmic trading, payment rails, cryptographic ledgers, and automated risk systems",
    cagr: "+19.7% (2025–2030)",
    marketSize: "$920 Billion",
    demandIndex: 94,
    automationRisk: "Low (Regulatory constraints and fiduciary responsibility require human sign-off)",
    overview: "Financial technology demands near-zero margin for error. Latency, auditability, data integrity, and strict adherence to banking regulations (PCI-DSS, Basel III) distinguish financial engineering from standard consumer applications.",
    coreCompetencies: [
      {
        name: "Financial Data Engineering & Ledger Integrity",
        level: "Mission-Critical",
        description: "Double-entry bookkeeping systems, immutable transaction logs, idempotency, and ACID database guarantees.",
        tools: ["PostgreSQL (Serializable)", "Apache Flink", "TigerBeetle", "Kafka"]
      },
      {
        name: "Payment Gateways & Real-Time Settlement",
        level: "Core Industry Standard",
        description: "Integrating global payment rails (ACH, SEPA, FedNow, Pix, Stripe), currency exchange, and multi-party payout mechanics.",
        tools: ["Stripe Connect", "Adyen", "ISO 20022", "Plaid"]
      },
      {
        name: "Algorithmic Risk & Fraud Detection",
        level: "High Value",
        description: "Real-time behavioral telemetry, velocity checks, anti-money laundering (AML), and identity verification (KYC).",
        tools: ["Sardine", "Socure", "Graph Databases (Neo4j)", "XGBoost"]
      },
      {
        name: "Regulatory Compliance & Security Hardening",
        level: "Mandatory Standard",
        description: "PCI-DSS compliance, tokenization of payment credentials, encryption at rest/transit, and SOC1/SOC2 audit trails.",
        tools: ["HashiCorp Vault", "AWS KMS", "Hardware Security Modules (HSM)"]
      }
    ],
    emergingCompetencies: [
      {
        name: "Instant Cross-Border Settlement",
        description: "Tokenized deposits, stablecoin settlement rails, and FedNow automated clearing integration."
      },
      {
        name: "Decentralized Finance (DeFi) & Smart Contract Security",
        description: "Solidity / EVM formal verification, reentrancy guards, and MEV (Maximal Extractable Value) mitigation."
      }
    ],
    futureScope: {
      outlook: "Traditional banks and FinTech disruptors are converging. The rollout of instant payment networks (FedNow in the US, UPI in India, Pix in Brazil) has eliminated the legacy 3-day settlement float, creating enormous demand for engineers who understand real-time ledger consistency and instant fraud scoring.",
      keyTrends: [
        "Widespread adoption of FedNow and open-banking APIs",
        "Embedded finance in non-financial apps (Shopify, Uber, Apple)",
        "Zero-knowledge proofs (ZKP) for private regulatory compliance verification"
      ]
    },
    rolesAndSalaries: [
      { role: "FinTech Software Engineer", exp: "0–2 yrs", salary: "$88,000 – $125,000", focus: "Payment API integrations, transaction validation, automated unit test suites" },
      { role: "Senior Risk & Ledger Engineer", exp: "3–6 yrs", salary: "$145,000 – $200,000", focus: "Double-entry balance engines, high-concurrency wallet systems, compliance reviews" },
      { role: "VP of Financial Systems Engineering", exp: "7+ yrs", salary: "$210,000 – $340,000+", focus: "Regulatory licensing technical audit, treasury tech, banking partner architecture" }
    ],
    recommendedCertifications: [
      "Chartered Financial Analyst (CFA) Level 1 (for Quants)",
      "Certified Information Systems Security Professional (CISSP)",
      "Stripe Certified Professional Architect",
      "Blockchain Developer Professional (ConsenSys / Cornell)"
    ],
    projectBlueprints: [
      "Double-entry multi-currency balance ledger with atomic ACID transfers and automated reconciliation report",
      "Instant fraud risk evaluator rating credit card events under 80 milliseconds using streaming ML heuristics",
      "Peer-to-peer escrow transaction engine with webhook notifications and dispute resolution workflow"
    ],
    graphSkills: ["Databases", "System Design", "Testing", "API Design", "JavaScript", "Algorithms"]
  },
  {
    id: "healthcare-biotech",
    name: "Healthcare, MedTech & BioTech",
    category: "Life Sciences & Digital Health",
    tagline: "Clinical informatics, bioinformatics pipelines, HIPAA-compliant telehealth, and medical AI",
    cagr: "+21.3% (2025–2030)",
    marketSize: "$780 Billion",
    demandIndex: 93,
    automationRisk: "Extremely Low (High regulatory scrutiny, human patient outcomes, medical ethics)",
    overview: "HealthTech and computational biology unite digital software with human physiological data. Professionals must navigate rigorous regulatory bodies (FDA, EMA), privacy mandates (HIPAA, HITECH), and healthcare interoperability standards (HL7, FHIR).",
    coreCompetencies: [
      {
        name: "Health Data Standards (FHIR / HL7 / DICOM)",
        level: "Core Industry Standard",
        description: "Parsing, serializing, and exchanging electronic health records (EHR) securely between hospital systems and consumer devices.",
        tools: ["FHIR API", "HL7 v2/v3", "HAPI FHIR", "Orthanc DICOM"]
      },
      {
        name: "HIPAA Compliance & Clinical Security",
        level: "Mandatory Standard",
        description: "Protected Health Information (PHI) segregation, audit logging, BAA compliance, and end-to-end patient encryption.",
        tools: ["AWS HealthLake", "Google Cloud Healthcare API", "Azure Health Data"]
      },
      {
        name: "Computational Genomics & Bioinformatics Pipelines",
        level: "Specialized Deep Tech",
        description: "High-throughput Next-Generation Sequencing (NGS) alignment, variant calling, and molecular structure simulation.",
        tools: ["Biopython", "Nextflow / Snakemake", "GATK", "AlphaFold"]
      },
      {
        name: "Medical Image Analysis & Computer Vision",
        level: "High Value",
        description: "Semantic segmentation of CT, MRI, and X-ray scans with explainable AI overlays for radiologist assist.",
        tools: ["MONAI", "PyTorch", "OpenCV", "SimpleITK"]
      }
    ],
    emergingCompetencies: [
      {
        name: "Ambient Clinical Documentation AI",
        description: "Real-time doctor-patient conversation listening, medical code (ICD-10, CPT) extraction, and automatic SOAP notes."
      },
      {
        name: "Digital Therapeutics & Remote Patient Monitoring (RPM)",
        description: "Continuous Bluetooth medical peripheral data sync (CGM, pulse oximeters, smart ECGs) with proactive alerting."
      }
    ],
    futureScope: {
      outlook: "Healthcare is transitioning from episodic hospital visits to continuous preventative remote monitoring. Software that can integrate cleanly into Epic and Cerner EHR systems while reducing physician burnout is experiencing historic capital investment.",
      keyTrends: [
        "Universal adoption of SMART on FHIR app integrations in primary care",
        "AI-accelerated pharmaceutical drug discovery shaving years off pre-clinical trials",
        "Stricter FDA Software as a Medical Device (SaMD) validation frameworks"
      ]
    },
    rolesAndSalaries: [
      { role: "Health Informatics Developer", exp: "0–2 yrs", salary: "$75,000 – $110,000", focus: "FHIR data adapters, patient portal features, HIPAA access log validation" },
      { role: "Senior Bioinformatician / HealthTech Eng", exp: "3–6 yrs", salary: "$130,000 – $180,000", focus: "Genomic data processing pipelines, EHR clinical decision support integration" },
      { role: "Director of Digital Health Engineering", exp: "7+ yrs", salary: "$190,000 – $290,000+", focus: "FDA clearance audits, hospital network security, telemedicine clinical operations" }
    ],
    recommendedCertifications: [
      "Certified Professional in Healthcare Information and Management Systems (CPHIMS)",
      "HL7 FHIR Fundamentals Certification",
      "HealthCare Information Security and Privacy Practitioner (HCISPP)",
      "AWS Certified Data Analytics – Specialty"
    ],
    projectBlueprints: [
      "SMART on FHIR Patient Dashboard retrieving vitals and lab results with interactive historical charts",
      "HIPAA-compliant Telehealth consultation room with encrypted video and automated patient check-in queue",
      "Genomic variant analysis script parsing VCF files to identify drug interaction warnings"
    ],
    graphSkills: ["Databases", "Testing", "API Design", "System Design", "JavaScript"]
  },
  {
    id: "hardware-robotics",
    name: "Hardware, Embedded Systems & Robotics",
    category: "Physical & Cyber-Physical Systems",
    tagline: "Microcontrollers, RTOS, autonomous mobile robots, ROS2, and industrial IoT automation",
    cagr: "+23.5% (2025–2030)",
    marketSize: "$650 Billion",
    demandIndex: 90,
    automationRisk: "Low (Physical hardware assembly, sensor calibration, and physical-world debugging)",
    overview: "Hardware and robotics bring software into physical reality. Engineers write real-time deterministic code, interface directly with registers and electrical buses (I2C, SPI, CAN), and deploy autonomous navigation stacks.",
    coreCompetencies: [
      {
        name: "Low-Level Embedded C / C++ & Rust",
        level: "Core Engineering",
        description: "Memory-constrained firmware, interrupt service routines, bare-metal hardware drivers, and deterministic concurrency.",
        tools: ["C / Modern C++", "Embedded Rust", "ARM Cortex-M", "ESP32", "STM32"]
      },
      {
        name: "Real-Time Operating Systems (RTOS)",
        level: "Core Standard",
        description: "Priority preemptive scheduling, task queues, mutexes, semaphores, and real-time execution guarantees.",
        tools: ["FreeRTOS", "Zephyr OS", "RT-Thread"]
      },
      {
        name: "Robotics Middleware & Autonomous Navigation",
        level: "Advanced Robotics",
        description: "Robot Operating System (ROS2), SLAM (Simultaneous Localization and Mapping), sensor fusion (LiDAR, IMU, camera).",
        tools: ["ROS2 (Humble/Iron)", "Gazebo Simulator", "Nav2", "Cartographer"]
      },
      {
        name: "Hardware Communication Protocols & Telemetry",
        level: "Foundational",
        description: "Serial communication, CAN bus for automotive, BLE, Zigbee, LoRaWAN, and MQTT for industrial IoT.",
        tools: ["CAN / OBD-II", "I2C / SPI / UART", "MQTT / Protobuf"]
      }
    ],
    emergingCompetencies: [
      {
        name: "Physical AI & Humanoid Robot Kinematics",
        description: "Inverse kinematics, dynamic balance stabilization, sim-to-real reinforcement learning, and tactile sensor skin."
      },
      {
        name: "TinyML (Machine Learning on Edge MCUs)",
        description: "Running quantized neural networks directly on microcontrollers consuming under 10 milliwatts of power."
      }
    ],
    futureScope: {
      outlook: "Manufacturing reshoring, warehouse logistics automation (Amazon, DHL), and autonomous vehicles have created an acute shortage of embedded engineers who understand both hardware schematics and modern software testing practices.",
      keyTrends: [
        "Rapid replacement of legacy C codebases with memory-safe Embedded Rust",
        "Adoption of ROS2 across warehouse AGVs and agricultural robotics",
        "Widespread industrial condition monitoring using vibration TinyML sensors"
      ]
    },
    rolesAndSalaries: [
      { role: "Junior Firmware Engineer", exp: "0–2 yrs", salary: "$76,000 – $112,000", focus: "Sensor driver bring-up, peripheral debugging with oscilloscopes, test fixtures" },
      { role: "Senior Robotics Software Engineer", exp: "3–6 yrs", salary: "$138,000 – $190,000", focus: "ROS2 navigation stack, SLAM tuning, motion planning, safety-critical interlocking" },
      { role: "Lead Systems Architect (Physical Tech)", exp: "7+ yrs", salary: "$195,000 – $285,000+", focus: "PCB architecture, hardware-software integration, thermal/power budget signoff" }
    ],
    recommendedCertifications: [
      "Arm System-on-Chip & Embedded Architecture Certification",
      "ROS2 Developer Certified Associate",
      "Certified Wireless IoT Solutions Professional (CWISP)"
    ],
    projectBlueprints: [
      "ESP32-based environmental monitoring station streaming sensor telemetry over MQTT to a web dashboard",
      "Autonomous 2D mapping robot simulation in ROS2 Gazebo utilizing LiDAR and Nav2 obstacle avoidance",
      "TinyML gesture recognition model running on an Arduino Nano 33 BLE Sense using accelerometer data"
    ],
    graphSkills: ["Algorithms", "Testing", "System Design", "Git"]
  },
  {
    id: "creative-design",
    name: "Creative Media, UI/UX & Spatial Design",
    category: "Design & Interaction",
    tagline: "Enterprise design systems, spatial computing (AR/VR), user research, and interactive WebGL",
    cagr: "+14.1% (2025–2030)",
    marketSize: "$420 Billion",
    demandIndex: 88,
    automationRisk: "Moderate (AI assists visual mockups; deep user empathy and brand identity require human vision)",
    overview: "Product design today transcends static screens. Designers define living design token architectures, accessibility compliance (WCAG AAA), ergonomic information hierarchies, and immersive spatial experiences.",
    coreCompetencies: [
      {
        name: "Design Systems & Token Architecture",
        level: "Core Industry Standard",
        description: "Multi-brand, multi-theme design tokens syncing automatically between Figma and front-end code repositories.",
        tools: ["Figma Tokens / Variables", "Storybook", "Tailwind CSS", "Style Dictionary"]
      },
      {
        name: "User Research & Cognitive Usability Testing",
        level: "Foundational",
        description: "Qualitative interviews, quantitative usability benchmarking, card sorting, and accessibility audits.",
        tools: ["Maze", "UserTesting", "Hotjar", "Dovetail"]
      },
      {
        name: "Spatial Computing & Immersive 3D Interfaces",
        level: "Emerging High Value",
        description: "Designing for Apple Vision Pro, Meta Quest, WebXR, and interactive 3D WebGL interfaces.",
        tools: ["Three.js / React Three Fiber", "Spline", "Blender", "Unity / Unreal"]
      },
      {
        name: "Interaction Prototyping & Micro-Animations",
        level: "Core Standard",
        description: "Physics-based gestural animations, tactile haptic feedback planning, and high-fidelity prototype flows.",
        tools: ["Protopie", "Framer", "Motion (Framer Motion)", "Lottie"]
      }
    ],
    emergingCompetencies: [
      {
        name: "AI-Assisted Generative UI Design",
        description: "Prompt-driven adaptive UI components that rearrange dynamically based on individual user intent and cognitive load."
      },
      {
        name: "Voice & Multimodal Interface Ergonomics",
        description: "Designing conversational voice flows, auditory indicators, and hands-free interaction for smart hardware."
      }
    ],
    futureScope: {
      outlook: "As software experiences become pervasive on glasses, wearables, and ambient displays, designers who can code interactive prototypes and understand behavioral psychology will command premium leadership roles.",
      keyTrends: [
        "Convergence of design tokens directly into production CI/CD pipelines",
        "Strict regulatory enforcement of accessibility standards across government and commercial apps",
        "Growth of 3D immersive web commerce"
      ]
    },
    rolesAndSalaries: [
      { role: "Product / UI/UX Designer", exp: "0–2 yrs", salary: "$70,000 – $100,000", focus: "User flow diagrams, wireframing, component library maintenance, prototype testing" },
      { role: "Senior Design Systems Lead", exp: "3–6 yrs", salary: "$128,000 – $175,000", focus: "Cross-platform token architecture, accessibility compliance, product feature strategy" },
      { role: "Head of Product Design / VP UX", exp: "7+ yrs", salary: "$180,000 – $270,000+", focus: "Brand visual identity, team leadership, executive product vision, design culture" }
    ],
    recommendedCertifications: [
      "Nielsen Norman Group UX Master Certified (NN/g)",
      "Google UX Design Professional Certificate",
      "Certified Professional in Accessibility Core Competencies (CPACC)"
    ],
    projectBlueprints: [
      "Accessible Enterprise Design System with token variables for dark/light mode and automated contrast validation",
      "Interactive 3D Product Customizer built with React Three Fiber and physics-based interaction states",
      "Comprehensive User Journey & Usability Research Case Study redesigning a complex B2B workflow"
    ],
    graphSkills: ["React", "JavaScript", "Testing", "Git"]
  },
  {
    id: "energy-cleantech",
    name: "Energy, ClimateTech & Smart Grid",
    category: "Sustainability & CleanTech",
    tagline: "Renewable energy storage analytics, smart grid distribution, carbon accounting, and EV infrastructure",
    cagr: "+25.1% (2025–2030)",
    marketSize: "$980 Billion",
    demandIndex: 92,
    automationRisk: "Extremely Low (Physical grid assets, regulatory power transmission mandates)",
    overview: "The global energy transition requires massive software intelligence. Balancing intermittent solar and wind generation, virtual power plants (VPPs), smart meters, and battery energy storage systems (BESS) relies heavily on software optimization.",
    coreCompetencies: [
      {
        name: "Time-Series Data Engineering & SCADA Telemetry",
        level: "Core Engineering",
        description: "Ingesting millions of high-frequency power readings per second from utility inverters, smart meters, and transformers.",
        tools: ["TimescaleDB", "InfluxDB", "Modbus", "DNP3 / IEC 61850"]
      },
      {
        name: "Grid Optimization & Forecasting Models",
        level: "Advanced Analytics",
        description: "Day-ahead renewable weather forecasting, battery degradation algorithms, and dynamic spot pricing dispatch.",
        tools: ["Python (Pandas, SciPy)", "PuLP / Pyomo (Linear Programming)", "Gurobi"]
      },
      {
        name: "EV Charging Infrastructure (OCPP)",
        level: "High Demand",
        description: "Open Charge Point Protocol (OCPP), smart charging load management, and vehicle-to-grid (V2G) bidirectional flows.",
        tools: ["OCPP 1.6 / 2.0.1", "ISO 15118", "AWS IoT Core"]
      },
      {
        name: "Carbon Accounting & Scope 1/2/3 Measurement",
        level: "Compliance Standard",
        description: "GHG Protocol emission factors, automated supply chain carbon audits, and ESG compliance report generation.",
        tools: ["Watershed API", "Persefoni", "Life Cycle Assessment (LCA) tools"]
      }
    ],
    emergingCompetencies: [
      {
        name: "Virtual Power Plant (VPP) Software",
        description: "Aggregating thousands of distributed residential solar and home batteries into a single dispatchable power reserve."
      },
      {
        name: "Hydrogen & Carbon Capture Digital Twin Simulation",
        description: "Fluid dynamics simulation, predictive maintenance on carbon capture membranes, and leakage detection."
      }
    ],
    futureScope: {
      outlook: "Trillions of dollars in global infrastructure acts (IRA in the US, EU Green Deal) are driving unprecedented growth. Power utilities and renewables operators urgently need modern full-stack and data engineers to modernize ancient grid control rooms.",
      keyTrends: [
        "Rapid rollout of battery energy storage facilities (BESS) requiring sub-second algorithmic dispatch",
        "Universal smart meter deployment generating petabytes of consumer energy consumption data",
        "Stricter corporate disclosure laws requiring audited, real-time carbon telemetry"
      ]
    },
    rolesAndSalaries: [
      { role: "CleanTech Software Engineer", exp: "0–2 yrs", salary: "$78,000 – $115,000", focus: "Inverter API sync, energy time-series dashboards, anomaly detection alerts" },
      { role: "Senior Grid Optimization Engineer", exp: "3–6 yrs", salary: "$135,000 – $185,000", focus: "BESS charge/discharge scheduling algorithms, virtual power plant orchestration" },
      { role: "VP of Energy Intelligence & Systems", exp: "7+ yrs", salary: "$195,000 – $300,000+", focus: "Utility interconnection compliance, energy trading software architecture, grid resilience" }
    ],
    recommendedCertifications: [
      "Certified Energy Manager (CEM)",
      "LEED Green Associate",
      "AWS Certified Solutions Architect – Energy & Utilities Track"
    ],
    projectBlueprints: [
      "Real-time Solar & Battery Storage Dashboard predicting next-day kilowatt output from weather API forecasts",
      "Virtual Power Plant Dispatch Simulator calculating optimal battery arbitrage on fluctuating hourly electricity prices",
      "Automated Corporate Carbon Footprint Calculator generating auditable Scope 1, 2, and 3 GHG reports"
    ],
    graphSkills: ["Databases", "Algorithms", "Testing", "System Design", "JavaScript"]
  }
];
