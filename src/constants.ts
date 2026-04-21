import { Role, Section, SurveySchema, ClientSurveySchema, SupportSurveySchema, FullSurveySchema } from "./types";

export const TASK_EXPERIENCE_COLUMNS = [
  "No experience",
  "Exposure only (observed or assisted)",
  "Basic experience (can perform with guidance)",
  "Moderate experience (can perform independently)",
  "Advanced experience (can perform confidently and handle complex scenarios)",
];

export const EXPERIENCE_OPTIONS = [
  "No prior healthcare experience",
  "No prior Business VA experience",
  "Less than 1 year",
  "1–2 years",
  "3–4 years",
  "5+ years",
];

export const TRAINING_PREFERENCES = [
  "Live webinar",
  "Self-paced video modules",
  "Written guides/manuals",
  "One-on-one coaching",
  "Group workshops",
  "Interactive simulations",
];

export const WORKLOAD_OPTIONS = [
  "Very light",
  "Manageable",
  "Busy but manageable",
  "Overloaded",
  "Consistently overwhelmed",
];

const MICRO_MODULES_OPTIONS = [
  "Medical Receptionist",
  "Medical Admin",
  "Medical Biller",
  "Medical Scribe",
  "Health Educator",
  "Dental Receptionist",
  "Dental Biller",
  "Executive Assistant VA",
  "General Business VA",
];

const MICRO_MODULES_BY_ROLE: Record<string, string[]> = {
  "Medical Receptionist": [
    "Call Handling & Patient Communication (includes basic + difficult conversations & escalations)",
    "Appointment Scheduling & Calendar Management (includes cancellations, no-shows, and same-day changes)",
    "Patient Intake, Data Entry & Medical Records (HIPAA)",
    "Insurance Verification & Benefits Breakdown",
    "Patient Financial Communication & Billing Inquiries (OOP, Copay, Estimates)",
    "EMR/EHR Navigation, Workflow Efficiency & Referral/Authorization Coordination",
    "Other",
  ],
  "Medical Admin": [
    "Inbox, Email & Communication Management (prioritization, routing, professional written communication)",
    "Calendar, Scheduling & Meeting Coordination (provider schedules, appointments, meeting support)",
    "Document Management, File Organization & Medical Records (HIPAA/ROI)",
    "Task Management, Follow-Ups & Provider Workflow Support (pre-visit prep, task queues)",
    "Insurance Verification, Prior Authorizations & Referral Coordination",
    "Billing Support & Form Processing (copays, statements, patient inquiries, FMLA/disability forms)",
    "Other",
  ],
  "Medical Biller": [
    "Charge Entry, Coding Accuracy & Documentation Review (CPT, ICD-10, modifiers)",
    "Claim Submission & Clearinghouse Management (clean claims, rejections, resubmissions)",
    "Payment Posting & EOB/ERA Interpretation (adjustments, underpayments, accuracy)",
    "AR Follow-Up, Aging Management & Recovery Strategies (30–90+ days, prioritization)",
    "Denial Management & Appeals (identification, resolution, advanced handling)",
    "Insurance, Authorizations & Billing Communication (eligibility for billing, prior auths, patient billing)",
    "Other",
  ],
  "Medical Scribe": [
    "Live Scribing & Real-Time Documentation Accuracy (listening, speed, accuracy during encounters)",
    "Medical Terminology, Abbreviations & Clinical Language",
    "Charting Structure & Note Completion (HPI, ROS, PE, A&P)",
    "Pre-Charting & Post-Visit Documentation Workflow",
    "EMR/EHR Navigation, Templates & Documentation Tools",
    "Provider Communication, Workflow Support & Task Coordination",
    "Other",
  ],
  "Health Educator": [
    "Patient Education & Health Coaching Communication (explaining concepts clearly, motivational support)",
    "Lifestyle Coaching (Nutrition, Sleep, Exercise Guidance)",
    "Care Plan Support, Goal Setting & Progress Tracking",
    "Patient Engagement, Follow-Ups & Behavior Change Support",
    "Documentation, Reporting & EMR/EHR Updates",
    "Program Coordination, Scheduling & Resource Support",
    "Other",
  ],
  "Dental Receptionist": [
    "Call Handling & Patient Communication (includes new patient calls, confirmations, and difficult conversations)",
    "Appointment Scheduling & Calendar Optimization (provider alignment, procedures, cancellations, no-shows)",
    "Patient Intake, Chart Review & Documentation Accuracy (medical history, alerts, odontogram basics)",
    "Dental Insurance Verification & Benefits Breakdown (PPO, frequencies, limitations)",
    "Treatment Estimates, Billing & Patient Financial Communication (OOP, copay, payment plans)",
    "Dental PMS Navigation & Workflow Management (Dentrix/Eaglesoft, scheduling, ledger, treatment planner)",
    "Other",
  ],
  "Dental Biller": [
    "Charge Entry, CDT Coding & Documentation Accuracy",
    "Claim Submission & Dental Insurance Processing (primary/secondary, attachments, e-claims)",
    "Payment Posting & EOB Interpretation (insurance + patient portions, adjustments)",
    "AR Follow-Up, Aging Management & Collections (outstanding claims, patient balances)",
    "Denial Management, Appeals & Insurance Follow-Ups",
    "Insurance Verification, Treatment Estimates & Patient Billing Communication (benefits, frequencies, OOP)",
    "Other",
  ],
  "Executive Assistant VA": [
    "Inbox & Executive Communication Management (email prioritization, drafting, stakeholder communication)",
    "Calendar Management, Scheduling & Travel Coordination",
    "Task Management, Follow-Ups & Executive Support Workflow",
    "Meeting Coordination, Minutes & Documentation Preparation",
    "Document Creation, File Management & Reporting Support (presentations, reports, organization)",
    "Research, Data Gathering & Business Support Tasks",
    "Other",
  ],
  "General Business VA": [
    "Lead Generation, Research & CRM Management (prospecting, data entry, pipeline tracking)",
    "Outbound Outreach & Sales Follow-Ups (email, calls, LinkedIn, nurturing leads)",
    "Customer Communication & Support Management (inquiries, issue resolution, relationship handling)",
    "Order Processing, Logistics & Vendor Coordination (orders, shipments, inventory, suppliers)",
    "Marketing Support & Content Coordination (social media, email campaigns, basic analytics)",
    "Administrative Support, Reporting & Workflow Management",
    "Other",
  ],
};

const getCompetenciesSection = (rolePrefix: string): Section => ({
  id: `${rolePrefix}-competencies-skills`,
  title: "Part III – Competencies / Skills",
  questions: [
    {
      id: `${rolePrefix}_micro_modules`,
      type: "checkbox",
      label: "Where would additional short, focused training (micro-modules) help your Virtual Assistant be more effective?",
      description: "(Select the skills or task areas that would have the most impact to your business)",
      options: MICRO_MODULES_OPTIONS,
      optionsWithCheckboxes: MICRO_MODULES_BY_ROLE,
      required: true,
    },
  ],
});

const getLongTermSuccessSection = (roleId: string): Section => ({
  id: `${roleId}-long-term-success`,
  title: "Part VI - Long-Term VA Success",
  questions: [
    {
      id: `${roleId}_common_frustrations`,
      type: "checkbox",
      label: "What are the most common frustrations you experience when working with VAs in general?\n(Select up to 3)",
      options: [
        "Lack of initiative or proactiveness",
        "Communication gaps or misunderstandings",
        "Inconsistent quality of work",
        "Slow turnaround time",
        "Need for frequent supervision or reminders",
        "Difficulty adapting to my workflow or tools",
        "Limited problem-solving ability",
        "Lack of long-term ownership of tasks",
        "No major frustrations",
        "Other"
      ],
      optionsWithInputs: ["Other"],
      maxSelections: 3,
      required: true,
    },
    {
      id: `${roleId}_upskilling_value`,
      type: "radio",
      label: "If we offered a structured upskilling program for your VA, how valuable would this be for you?\n(Select one)",
      options: [
        "Extremely valuable – I would strongly encourage my VA to participate",
        "Valuable – I would support it if it aligns with my VA’s role",
        "Somewhat valuable – Depends on the content and time commitment",
        "Not very valuable – I prefer my VA to focus only on daily work tasks",
        "Not valuable at all – I don’t see the need for additional training"
      ],
      required: true,
    },
    {
      id: `${roleId}_training_time_commitment`,
      type: "radio",
      label: "How much time per week would you realistically be comfortable with your VA dedicating to training or upskilling?\n(Select one)",
      options: [
        "Less than 1 hour per week",
        "1–2 hours per week",
        "2–3 hours per week",
        "3–5 hours per week",
        "Only during slower periods or when workload allows",
        "I would prefer no dedicated training time"
      ],
      required: true,
    },
    {
      id: `${roleId}_visibility_preference`,
      type: "radio",
      label: "Would you want visibility into your VA’s learning progress if they participate in an upskilling program?\n(Select one)",
      options: [
        "Yes – I would like regular updates or progress reports",
        "Yes – but only high-level summaries",
        "Maybe – only if it directly impacts performance",
        "No – I trust the process and don’t need updates"
      ],
      required: true,
    },
    {
      id: `${roleId}_program_success_criteria`,
      type: "checkbox",
      label: "What would need to happen for you to say that a VA upskilling program was truly worth it?\n(Select all that apply)",
      options: [
        "My VA becomes more proactive and independent",
        "My VA completes tasks faster and more accurately",
        "My VA requires less supervision",
        "My VA can take on more complex responsibilities",
        "My VA communicates more confidently and professionally",
        "My VA understands my workflow better",
        "My VA can suggest improvements or solutions",
        "Other"
      ],
      optionsWithInputs: ["Other"],
      required: true,
    },
    {
      id: `${roleId}_retention_factors`,
      type: "checkbox",
      label: "What would make you want to keep a VA for 3–5 years instead of 1–2 years?\n(Select up to 3)",
      options: [
        "Consistently reliable and accurate work",
        "Strong communication and professionalism",
        "Proactive problem-solving and initiative",
        "Deep understanding of my business or workflow",
        "Ability to grow into more complex responsibilities",
        "Trust and strong working relationship",
        "Ability to manage tasks with minimal supervision",
        "Other"
      ],
      optionsWithInputs: ["Other"],
      maxSelections: 3,
      required: true,
    }
  ]
});

const getCommunicationSkillsSection = (roleId: string, roleName: string): Section => ({
  id: `${roleId}-communication-skills`,
  title: "Part IV - Communication Skills",
  questions: [
    {
      id: `${roleId}_comm_proficiency`,
      type: "grid",
      label: "How effectively does your Virtual Assistant communicate when performing the following tasks?",
      description: "Legend:\nNA – Not applicable: Not part of your VA’s responsibilities\n1 – Requires close guidance: Communication may need clarification or follow-up\n2 – With occasional support: Communication is generally clear with some guidance\n3 – Works independently: Communication is clear and appropriate in most situations\n4 – Highly effective: Communication is clear, structured, and proactive",
      rows: [
        "Handling client calls → Communicating clearly, professionally, and confidently during calls",
        "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
        "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
        "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
        "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
        "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
      ],
      columns: ["NA", "1", "2", "3", "4"],
      required: true,
    },
    {
      id: `${roleId}_comm_essentiality`,
      type: "grid",
      label: "For each task, how important is it for your Virtual Assistant to handle it effectively in your day-to-day operations?",
      description: "Legend:\nCore to the role – A key responsibility for your VA\nImportant – Adds value to your workflow but can be developed over time\nNice to have – Helpful, but not required for your VA’s role",
      rows: [
        "Handling client calls → Clear and professional verbal communication",
        "Responding to client emails/messages → Timely and accurate written communication",
        "Posting updates on group chats / team channels → Effective team communication and coordination",
        "Preparing and submitting reports → Clear reporting and information sharing",
        "Managing appointment scheduling & changes → Accurate coordination of schedules and expectations",
        "Updating documentation & records accurately → Reliable and clear documentation for workflow continuity"
      ],
      columns: ["Core to the role", "Important", "Nice to have"],
      required: true,
    },
    {
      id: `${roleId}_verbal_comm_importance`,
      type: "radio",
      label: `How important is clear verbal communication for your Virtual Assistant to perform effectively in their role?\n(e.g., being easily understood during calls or voice interactions)`,
      options: [
        "Core to the role – Clear and easily understood verbal communication is essential for client/patient interactions",
        "Important – Clear communication is preferred; minor variations in speech are manageable",
        "Nice to have – Verbal communication is not a primary requirement for this role"
      ],
      required: true,
    }
  ],
});

const getAIEssentialsSection = (roleId: string): Section => ({
  id: `${roleId}-ai-essentials`,
  title: "Part V - AI Essentials",
  questions: [
    {
      id: `${roleId}_ai_automation_level`,
      type: "radio",
      label: "To what extent is AI currently used in your workflow?",
      options: [
        "Minimal – Most tasks are done manually",
        "Some use – AI supports certain tasks, with VAs handling most of the work",
        "Significant use – AI supports many tasks, with VAs overseeing and executing key steps",
        "Extensive use – AI is embedded across workflows, with VAs focusing on oversight and coordination"
      ],
      required: true,
    },
    {
      id: `${roleId}_ai_tool_proficiency`,
      type: "grid",
      label: "What level of capability would you like your VA to have when using the following AI tools?",
      description: "Legend:\n1 – Guided: Uses the tool with instructions or support\n2 – Assisted: Uses the tool independently for standard tasks\n3 – Independent: Uses the tool to improve efficiency and output\n4 – Advanced: Uses the tool to optimize workflows and enhance outcomes",
      rows: [
        "Generative AI (e.g., ChatGPT, Claude, Gemini)",
        "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
        "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
        "Task & workflow automation AI (e.g., scheduling bots, reminders)",
        "Other AI tools"
      ],
      rowsWithInputs: ["Other AI tools"],
      columns: ["1", "2", "3", "4"],
      required: true,
    },
    {
      id: `${roleId}_ai_future_support`,
      type: "checkbox",
      label: "How do you see AI supporting your VA’s role over the next 6–12 months? (Select all that apply)",
      options: [
        "AI will support specific tasks, with VAs continuing to manage core responsibilities",
        "AI will handle more routine work, allowing VAs to focus on higher-value tasks",
        "AI will be more integrated into workflows, with VAs coordinating and overseeing processes",
        "Workflows will remain mostly manual, with limited AI involvement",
        "Not sure / still exploring how AI fits into our workflow"
      ],
      required: true,
    }
  ],
});

const getOtherRoleSections = (): Section[] => [
  getCommunicationSkillsSection("other", "Other Role"),
  getAIEssentialsSection("other"),
  getLongTermSuccessSection("other"),
];

const getMedicalReceptionistSections = (): Section[] => {
  const role: Role = "Medical Receptionist";
  const tasks = [
    "Call handling",
    "Appointment scheduling",
    "Insurance verification",
    "Patient intake/registration",
    "Follow-up calls",
    "Payment collection",
    "Referral management",
    "Medical records management",
  ];

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "Primary Care",
            "Specialty Clinics (Cardio, Ortho, etc.)",
            "Behavioral Health",
            "Urgent Care",
            "Telehealth",
            "Multi-specialty",
            "Other",
          ],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Athenahealth",
            "Kareo / Tebra",
            "AdvancedMD",
            "eClinicalWorks",
            "NextGen",
            "Epic",
            "Availity / Clearinghouses",
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-task-experience`,
      title: "Task Experience",
      description: `Rate your hands-on proficiency in the core tasks expected of a ${role}.`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "What is your level of hands-on experience in performing the following tasks?",
          rows: tasks,
          columns: TASK_EXPERIENCE_COLUMNS,
          required: true,
        },
      ],
    },
    {
      id: `${role}-daily-responsibilities`,
      title: "Daily Responsibilities",
      description: `Help us understand your typical day-to-day workflow and time management as a ${role}.`,
      questions: [
        {
          id: "daily_tasks",
          type: "checkbox",
          label: "Which of these tasks do you perform on a daily basis?",
          options: tasks,
          required: true,
        },
        {
          id: "main_task",
          type: "radio",
          label: "Which task takes up most of your time during your daily work?",
          options: [
            "Call handling",
            "Appointment scheduling",
            "Insurance verification",
            "Patient Intake/Registration",
            "Payment Collection",
            "Referral Management",
            "Medical Records Management",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-challenges`,
      title: "Challenges & Pain Points",
      description: `Identify the specific obstacles and pressure points you encounter in your role as a ${role}.`,
      questions: [
        {
          id: "daily_challenges",
          type: "checkbox",
          variant: "grid",
          label: "Which areas do you find most challenging in your daily work? (Select up to 3)",
          options: [
            "Scheduling conflicts or double bookings",
            "Managing provider schedules",
            "Referral coordination",
            "Handling difficult or upset patients",
            "Explaining insurance or visit-related questions",
            "Payment collection and discussing balances",
            "Insurance verification (basic or detailed)",
            "Incomplete or missing patient information",
            "Managing high call volume",
            "Multi-tasking across systems/tools",
            "Other",
          ],
          maxSelections: 3,
          required: true,
        },
        {
          id: "challenge_reasons",
          type: "checkbox",
          label: "What makes these areas challenging for you? (Select all that apply)",
          options: [
            "Lack of structured training or clear guidelines",
            "Limited hands-on experience",
            "Difficulty understanding real-world scenarios",
            "Inconsistent workflows across clients",
            "Lack of clear SOPs or workflows",
            "Lack of feedback or coaching",
            "Too many systems/tools to manage",
            "Limited access to systems for practice",
            "High workload or time pressure",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-scenarios`,
      title: "Real-World Scenarios",
      description: `Share your experience with complex, high-pressure situations common to the ${role} role.`,
      questions: [
        {
          id: "workflow_slowdowns",
          type: "checkbox",
          label: "What slows down your workflow the most? (Select up to 2)",
          options: [
            "High call volume",
            "Missing or incomplete patient information",
            "Manual processes / lack of automation",
            "Switching between multiple systems",
            "System performance issues (slow or unreliable tools)",
            "Lack of clear workflows or SOPs",
            "Delays in provider/client responses",
            "Other",
          ],
          maxSelections: 2,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-skill`,
      title: "Training & Confidence",
      description: `Assess your current confidence levels and identify specific areas where specialized training would benefit your growth as a ${role}.`,
      questions: [
        {
          id: "overall_confidence",
          type: "scale",
          label: "How would you rate your overall confidence in your current role?",
          min: 1,
          max: 5,
          minLabel: "Not confident",
          maxLabel: "Very confident",
          required: true,
        },
        {
          id: "specialized_training_needs",
          type: "checkbox",
          label: "What areas would you like to receive more specialized training in? Select all that apply.",
          options: [
            "Call handling & communication skills",
            "Appointment scheduling strategies",
            "Insurance basics & eligibility verification",
            "Patient interaction & empathy",
            "Workflow and time management",
            "Handling difficult or sensitive situations",
            "System/software training (EMR, phone systems, tools)",
            "HIPAA & compliance",
            "Other",
          ],
          required: true,
        },
        {
          id: "priority_training",
          type: "textarea",
          label: "Which ONE area should be prioritized for training first?",
          required: true,
        },
      ],
    },
    {
      id: `${role}-preferences`,
      title: "Training Preferences",
      description: `Tell us how you prefer to learn and what elements make a training program effective for you as a ${role}.`,
      questions: [
        {
          id: "training_preference",
          type: "checkbox",
          label: "What is your preferred method of training? (Select up to 2)",
          options: TRAINING_PREFERENCES,
          maxSelections: 2,
          required: true,
        },
        {
          id: "effective_training_elements",
          type: "checkbox",
          label: "If a training program were designed for you, what would make it most effective? (Select all that apply)",
          options: [
            "Certification program",
            "Step-by-step workflows (SOP-based)",
            "Real claim walkthroughs (start to finish)",
            "Denial case studies with solutions",
            "Hands-on practice using actual scenarios",
            "Live coaching or feedback sessions",
            "Templates/scripts for AR and appeals",
            "System training (Athena, Availity, etc.)",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getMedicalBillerSections = (): Section[] => {
  const role: Role = "Medical Biller";
  const tasks = [
    "Insurance verification",
    "Coding accuracy",
    "Claim submission",
    "Payment posting",
    "Denial management",
    "Accounts Receivable (AR)",
    "Prior authorization",
    "Patient billing",
    "Payer rules & policies",
    "Clearinghouse workflows",
  ];

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "Primary Care",
            "Specialty Clinics (Cardio, Ortho, etc.)",
            "Behavioral Health",
            "Urgent Care",
            "Telehealth",
            "Multi-specialty",
            "Other",
          ],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Athenahealth",
            "Kareo / Tebra",
            "AdvancedMD",
            "eClinicalWorks",
            "NextGen",
            "Epic",
            "Availity / Clearinghouses",
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-task-experience`,
      title: "Task Experience",
      description: `Rate your hands-on proficiency in the core tasks expected of a ${role}.`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "What is your level of hands-on experience in performing the following tasks?",
          rows: tasks,
          columns: TASK_EXPERIENCE_COLUMNS,
          required: true,
        },
      ],
    },
    {
      id: `${role}-daily-responsibilities`,
      title: "Daily Responsibilities",
      description: `Help us understand your typical day-to-day workflow and time management as a ${role}.`,
      questions: [
        {
          id: "daily_tasks",
          type: "checkbox",
          label: "Which of these tasks do you perform on a daily basis?",
          options: tasks,
          required: true,
        },
        {
          id: "main_task",
          type: "radio",
          label: "Which task takes up most of your time during your daily work?",
          options: tasks,
          required: true,
        },
      ],
    },
    {
      id: `${role}-challenges`,
      title: "Challenges & Pain Points",
      description: `Identify the specific obstacles and pressure points you encounter in your role as a ${role}.`,
      questions: [
        {
          id: "daily_challenges",
          type: "checkbox",
          label: "Which areas of medical billing do you find most challenging? (Select up to 3)",
          options: [
            "Denial management (understanding reasons, writing appeals)",
            "Insurance verification & benefits interpretation",
            "Coding accuracy (ICD-10, CPT, modifiers)",
            "Claim submission (clean claim process, rejections)",
            "Payment posting (ERA/EOB interpretation, adjustments, reconciliation)",
            "Accounts Receivable (AR follow-ups & aging management)",
            "Prior authorization processes",
            "Patient billing & explaining balances",
            "Understanding payer rules & policies",
            "Clearinghouse workflows (rejections, edits)",
            "Other",
          ],
          maxSelections: 3,
          required: true,
        },
        {
          id: "challenge_reasons",
          type: "checkbox",
          label: "What makes these areas challenging for you? (Select all that apply)",
          options: [
            "Lack of structured training or clear guidelines",
            "Limited hands-on experience",
            "Inconsistent workflows across clients",
            "Difficulty understanding real-world scenarios",
            "Lack of feedback or coaching",
            "Too many payer-specific rules to remember",
            "Limited access to systems for practice",
            "Other",
          ],
          required: true,
        },
        {
          id: "least_confident_tasks",
          type: "checkbox",
          label: "When handling billing issues, where do you feel least confident? (Select up to 2)",
          options: [
            "Identifying the root cause of denials",
            "Communicating with insurance/payers",
            "Reviewing and correcting claims",
            "Interpreting EOBs/ERAs",
            "Handling complex billing scenarios",
            "Managing AR and follow-ups",
            "Explaining charges to patients",
            "Other",
          ],
          maxSelections: 2,
          required: true,
        },
      ],
    },
    {
      id: `${role}-scenarios`,
      title: "Real-World Scenarios",
      description: `Share your experience with complex, high-pressure situations common to the ${role} role.`,
      questions: [
        {
          id: "struggle_scenarios",
          type: "checkbox",
          label: "What types of real-world scenarios do you struggle with the most? (Select all that apply)",
          options: [
            "Rejected claims and resubmissions",
            "Denials due to coding errors",
            "Authorization-related denials",
            "Timely filing issues",
            "Coordination of benefits (COB)",
            "Patient balance disputes",
            "Underpayments from insurance",
            "Multi-claim follow-ups in AR",
            "Other",
          ],
          required: true,
        },
        {
          id: "workflow_slowdowns",
          type: "checkbox",
          label: "What slows down your workflow the most? (Select up to 2)",
          options: [
            "Waiting for insurance responses",
            "Missing or incomplete documentation",
            "Manual processes / lack of automation",
            "Switching between multiple systems",
            "Lack of clear SOPs",
            "Delays in provider/client responses",
            "Other",
          ],
          maxSelections: 2,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-skill`,
      title: "Training & Confidence",
      description: `Assess your current confidence levels and identify specific areas where specialized training would benefit your growth as a ${role}.`,
      questions: [
        {
          id: "overall_confidence",
          type: "scale",
          label: "How confident are you in your current billing skills?",
          min: 1,
          max: 5,
          minLabel: "Not confident",
          maxLabel: "Very confident",
          required: true,
        },
        {
          id: "specialized_training_needs",
          type: "checkbox",
          label: "What areas would you like to receive more specialized training in? Select all that apply.",
          options: [
            "Insurance verification (advanced)",
            "Coding basics (ICD-10, CPT, modifiers)",
            "Claim submission workflows",
            "Denial management & appeals",
            "AR management strategies",
            "Payment posting accuracy",
            "Patient billing communication",
            "Prior authorization processes",
            "Reading EOB/ERA",
            "Clearinghouse workflows",
            "HIPAA & compliance",
            "Other",
          ],
          required: true,
        },
        {
          id: "priority_training",
          type: "textarea",
          label: "Which ONE area should be prioritized for training first?",
          required: true,
        },
      ],
    },
    {
      id: `${role}-preferences`,
      title: "Training Preferences",
      description: `Tell us how you prefer to learn and what elements make a training program effective for you as a ${role}.`,
      questions: [
        {
          id: "training_preference",
          type: "checkbox",
          label: "What is your preferred method of training? (Select up to 2)",
          options: TRAINING_PREFERENCES,
          maxSelections: 2,
          required: true,
        },
        {
          id: "effective_training_elements",
          type: "checkbox",
          label: "If a training program were designed for you, what would make it most effective? (Select all that apply)",
          options: [
            "Certification program",
            "Step-by-step workflows (SOP-based)",
            "Real claim walkthroughs (start to finish)",
            "Denial case studies with solutions",
            "Hands-on practice using actual scenarios",
            "Live coaching or feedback sessions",
            "Templates/scripts for AR and appeals",
            "System training (Athena, Availity, etc.)",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getMedicalScribeSections = (): Section[] => {
  const role: Role = "Medical Scribe";
  const tasks = [
    "Live scribing",
    "Transcribing",
    "Assessment & plan recording",
    "Patient history entry",
    "Pre/post charting",
    "Order entry assistance",
    "Clinical alert monitoring",
    "Workflow support",
    "EHR template management",
  ];

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "Primary Care",
            "Specialty Clinics (Cardio, Ortho, etc.)",
            "Behavioral Health",
            "Urgent Care",
            "Telehealth",
            "Multi-specialty",
            "Other",
          ],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Athenahealth",
            "Kareo / Tebra",
            "AdvancedMD",
            "eClinicalWorks",
            "NextGen",
            "Epic",
            "Availity / Clearinghouses",
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-task-experience`,
      title: "Task Experience",
      description: `Rate your hands-on proficiency in the core tasks expected of a ${role}.`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "What is your level of hands-on experience in performing the following tasks?",
          rows: tasks,
          columns: TASK_EXPERIENCE_COLUMNS,
          required: true,
        },
      ],
    },
    {
      id: `${role}-daily-responsibilities`,
      title: "Daily Responsibilities",
      description: `Help us understand your typical day-to-day workflow and time management as a ${role}.`,
      questions: [
        {
          id: "daily_tasks",
          type: "checkbox",
          label: "Which of these tasks do you perform on a daily basis?",
          options: tasks,
          required: true,
        },
        {
          id: "main_task",
          type: "radio",
          label: "Which single task takes up the most of your time?",
          options: tasks,
          required: true,
        },
      ],
    },
    {
      id: `${role}-challenges`,
      title: "Challenges & Pain Points",
      description: `Identify the specific obstacles and pressure points you encounter in your role as a ${role}.`,
      questions: [
        {
          id: "daily_challenges",
          type: "checkbox",
          label: "Which areas do you find most challenging in your daily work? (Select up to 3)",
          options: [
            "Live scribing during patient encounters",
            "Assessment & plan documentation",
            "Patient history entry (HPI, ROS, etc.)",
            "Pre-charting and post-charting",
            "Understanding medical terminology",
            "Recognizing important clinical details",
            "Interpreting provider instructions or dictation",
            "Keeping up with provider pace during live scribing",
            "Managing multiple charts/tasks",
            "Using EMR systems efficiently",
            "Other",
          ],
          maxSelections: 3,
          required: true,
        },
        {
          id: "challenge_reasons",
          type: "checkbox",
          label: "What makes these areas challenging for you? (Select all that apply)",
          options: [
            "Lack of structured training or clear guidelines",
            "Limited hands-on experience",
            "Difficulty understanding real-world clinical scenarios",
            "Time pressure during live scribing",
            "Limited access to systems for practice",
            "Too many systems/tools to manage",
            "Lack of feedback or coaching",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-scenarios`,
      title: "Real-World Scenarios",
      description: `Share your experience with complex, high-pressure situations common to the ${role} role.`,
      questions: [
        {
          id: "struggle_scenarios",
          type: "checkbox",
          label: "What types of real-world scenarios do you struggle with the most? (Select all that apply)",
          options: [
            "Fast-paced or complex patient encounters",
            "Difficulty understanding dictation or instructions",
            "Multiple patients or charts at the same time",
            "Lack of familiarity with EMR templates",
            "Complex cases with multiple conditions",
            "Adjusting to different provider documentation styles",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-skill`,
      title: "Training & Confidence",
      description: `Assess your current confidence levels and identify specific areas where specialized training would benefit your growth as a ${role}.`,
      questions: [
        {
          id: "overall_confidence",
          type: "scale",
          label: "How confident are you in your current medical scribing skills?",
          min: 1,
          max: 5,
          minLabel: "Not confident",
          maxLabel: "Very confident",
          required: true,
        },
        {
          id: "specialized_training_needs",
          type: "checkbox",
          label: "What areas would you like to receive more specialized training in? Select all that apply.",
          options: [
            "Live scribing during patient encounters",
            "Coding basics (ICD-10, CPT, modifiers)",
            "Medical terminology and abbreviations",
            "Identifying relevant clinical details",
            "Managing multiple charts/tasks",
            "EMR/EHR navigation and documentation",
            "Assessment & plan documentation",
            "Patient history documentation (HPI, ROS, etc.)",
            "Pre-charting and post-charting workflow",
            "Other",
          ],
          required: true,
        },
        {
          id: "priority_training",
          type: "textarea",
          label: "Which ONE area should be prioritized for training first?",
          required: true,
        },
      ],
    },
    {
      id: `${role}-preferences`,
      title: "Training Preferences",
      description: `Tell us how you prefer to learn and what elements make a training program effective for you as a ${role}.`,
      questions: [
        {
          id: "training_preference",
          type: "checkbox",
          label: "What is your preferred method of training? (Select up to 2)",
          options: TRAINING_PREFERENCES,
          maxSelections: 2,
          required: true,
        },
        {
          id: "effective_training_elements",
          type: "checkbox",
          label: "If a training program were designed for you, what would make it most effective? (Select all that apply)",
          options: [
            "Certification program",
            "Step-by-step workflows (SOP-based)",
            "Real claim walkthroughs (start to finish)",
            "Denial case studies with solutions",
            "Hands-on practice using actual scenarios",
            "Live coaching or feedback sessions",
            "Templates/scripts for AR and appeals",
            "System training (Athena, Availity, etc.)",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getHealthEducatorSections = (): Section[] => {
  const role: Role = "Health Educator";
  const tasks = [
    "Patient education support",
    "Call/message handling",
    "Follow-up communication",
    "Clinical content research and validation",
    "Scheduling and coordination",
    "Educational content creation",
    "Data entry and documentation",
    "Program evaluation and reporting",
    "Health screening tool administration",
    "Administrative assistance",
  ];

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "Primary Care",
            "Specialty Clinics (Cardio, Ortho, etc.)",
            "Behavioral Health",
            "Urgent Care",
            "Telehealth",
            "Multi-specialty",
            "Other",
          ],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Athenahealth",
            "Kareo / Tebra",
            "AdvancedMD",
            "eClinicalWorks",
            "NextGen",
            "Epic",
            "Availity / Clearinghouses",
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-task-experience`,
      title: "Task Experience",
      description: `Rate your hands-on proficiency in the core tasks expected of a ${role}.`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "What is your level of hands-on experience in performing the following tasks?",
          rows: tasks,
          columns: TASK_EXPERIENCE_COLUMNS,
          required: true,
        },
      ],
    },
    {
      id: `${role}-daily-responsibilities`,
      title: "Daily Responsibilities",
      description: `Help us understand your typical day-to-day workflow and time management as a ${role}.`,
      questions: [
        {
          id: "daily_tasks",
          type: "checkbox",
          label: "Which of these tasks do you perform on a daily basis?",
          options: tasks,
          required: true,
        },
        {
          id: "main_task",
          type: "radio",
          label: "Which single task takes up the most of your time?",
          options: tasks,
          required: true,
        },
      ],
    },
    {
      id: `${role}-challenges`,
      title: "Challenges & Pain Points",
      description: `Identify the specific obstacles and pressure points you encounter in your role as a ${role}.`,
      questions: [
        {
          id: "daily_challenges",
          type: "checkbox",
          label: "Which areas do you find most challenging in your daily work? (Select up to 3)",
          options: [
            "Providing patient education and explaining health concepts",
            "Follow-up communication and engagement",
            "Handling unresponsive or disengaged patients",
            "Scheduling and coordinating patient sessions",
            "Managing multiple patients or programs",
            "Ensuring patient adherence to programs",
            "Clinical content research and validation",
            "Simplifying complex health information for patients",
            "Creating educational content",
            "Managing multiple systems/tools",
            "Other",
          ],
          maxSelections: 3,
          required: true,
        },
        {
          id: "challenge_reasons",
          type: "checkbox",
          label: "What makes these areas challenging for you? (Select all that apply)",
          options: [
            "Lack of structured training or clear guidelines",
            "Limited hands-on experience",
            "Difficulty explaining complex health concepts",
            "Inconsistent workflows across clients/programs",
            "Limited access to systems for practice",
            "Too many systems/tools to manage",
            "Lack of feedback or coaching",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-scenarios`,
      title: "Real-World Scenarios",
      description: `Share your experience with complex, high-pressure situations common to the ${role} role.`,
      questions: [
        {
          id: "struggle_scenarios",
          type: "checkbox",
          label: "What types of real-world scenarios do you struggle with the most? (Select all that apply)",
          options: [
            "Educating patients on health-related topics",
            "Explaining complex health information",
            "Patients not following recommendations",
            "Handling sensitive or emotional conversations",
            "Managing multiple patients at the same time",
            "Adjusting communication based on patient needs",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-skill`,
      title: "Training & Confidence",
      description: `Assess your current confidence levels and identify specific areas where specialized training would benefit your growth as a ${role}.`,
      questions: [
        {
          id: "overall_confidence",
          type: "scale",
          label: "How confident are you in your current health educator skills?",
          min: 1,
          max: 5,
          minLabel: "Not confident",
          maxLabel: "Very confident",
          required: true,
        },
        {
          id: "specialized_training_needs",
          type: "checkbox",
          label: "What areas would you like to receive more specialized training in? Select all that apply.",
          options: [
            "Patient education techniques",
            "Communication and engagement skills",
            "Handling difficult or unresponsive patients",
            "Scheduling and coordination",
            "Managing multiple patients/programs",
            "EMR/EHR navigation and documentation",
            "Clinical content understanding",
            "Simplifying medical/health information",
            "Educational content creation",
            "Program evaluation and reporting",
            "Health screening tools",
            "Other",
          ],
          required: true,
        },
        {
          id: "priority_training",
          type: "textarea",
          label: "Which ONE area should be prioritized for training first?",
          required: true,
        },
      ],
    },
    {
      id: `${role}-preferences`,
      title: "Training Preferences",
      description: `Tell us how you prefer to learn and what elements make a training program effective for you as a ${role}.`,
      questions: [
        {
          id: "training_preference",
          type: "checkbox",
          label: "What is your preferred method of training? (Select up to 2)",
          options: TRAINING_PREFERENCES,
          maxSelections: 2,
          required: true,
        },
        {
          id: "effective_training_elements",
          type: "checkbox",
          label: "If a training program were designed for you, what would make it most effective? (Select all that apply)",
          options: [
            "Certification program",
            "Step-by-step workflows (SOP-based)",
            "Real claim walkthroughs (start to finish)",
            "Denial case studies with solutions",
            "Hands-on practice using actual scenarios",
            "Live coaching or feedback sessions",
            "Templates/scripts for AR and appeals",
            "System training (Athena, Availity, etc.)",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getDentalReceptionistSections = (): Section[] => {
  const role: Role = "Dental Receptionist";
  const tasks = [
    "Front desk (virtual)",
    "Insurance verification",
    "Patient follow-up",
    "Manage treatment estimates",
    "Payment processing",
    "Team coordination",
    "Records management",
  ];

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "General Dentistry",
            "Orthodontics",
            "Periodontics",
            "Endodontics",
            "Oral Surgery",
            "Pediatric Dentistry",
            "Other",
          ],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Curve Dental",
            "SoftDent",
            "PracticeWeb",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-task-experience`,
      title: "Task Experience",
      description: `Rate your hands-on proficiency in the core tasks expected of a ${role}.`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "What is your level of hands-on experience in performing the following tasks?",
          rows: tasks,
          columns: TASK_EXPERIENCE_COLUMNS,
          required: true,
        },
      ],
    },
    {
      id: `${role}-daily-responsibilities`,
      title: "Daily Responsibilities",
      description: `Help us understand your typical day-to-day workflow and time management as a ${role}.`,
      questions: [
        {
          id: "daily_tasks",
          type: "checkbox",
          label: "Which of these tasks do you perform on a daily basis?",
          options: tasks,
          required: true,
        },
        {
          id: "main_task",
          type: "radio",
          label: "Which single task takes up the most of your time?",
          options: tasks,
          required: true,
        },
      ],
    },
    {
      id: `${role}-challenges`,
      title: "Challenges & Pain Points",
      description: `Identify the specific obstacles and pressure points you encounter in your role as a ${role}.`,
      questions: [
        {
          id: "daily_challenges",
          type: "checkbox",
          label: "Which areas do you find most challenging in your daily work? (Select up to 3)",
          options: [
            "Front desk support (virtual check-in, calls, patient inquiries)",
            "Handling difficult or anxious dental patients",
            "Patient follow-up and recall communication",
            "Appointment scheduling and provider coordination",
            "Team coordination (dentist, hygienist, assistants)",
            "Insurance verification (dental benefits breakdown)",
            "Explaining coverage, co-pays, and limitations",
            "Managing treatment estimates",
            "Payment processing",
            "Discussing balances and financial options",
            "Other",
          ],
          maxSelections: 3,
          required: true,
        },
        {
          id: "challenge_reasons",
          type: "checkbox",
          label: "What makes these areas challenging for you? (Select all that apply)",
          options: [
            "Lack of structured training or clear guidelines",
            "Limited hands-on experience",
            "Difficulty understanding dental insurance",
            "Inconsistent workflows across clients/programs",
            "Limited access to systems for practice",
            "Too many systems/tools to manage",
            "Lack of feedback or coaching",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-scenarios`,
      title: "Real-World Scenarios",
      description: `Share your experience with complex, high-pressure situations common to the ${role} role.`,
      questions: [
        {
          id: "struggle_scenarios",
          type: "checkbox",
          label: "What types of real-world scenarios do you struggle with the most? (Select all that apply)",
          options: [
            "Patients questioning treatment costs",
            "Scheduling conflicts or last-minute changes",
            "Managing treatment estimates",
            "Managing multiple providers or schedules",
            "Communicating with patients about costs",
            "Handling upset or anxious patients",
            "Coordinating with dental team members",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-skill`,
      title: "Training & Confidence",
      description: `Assess your current confidence levels and identify specific areas where specialized training would benefit your growth as a ${role}.`,
      questions: [
        {
          id: "overall_confidence",
          type: "scale",
          label: "How confident are you in your current dental billing skills?",
          min: 1,
          max: 5,
          minLabel: "Not confident",
          maxLabel: "Very confident",
          required: true,
        },
        {
          id: "specialized_training_needs",
          type: "checkbox",
          label: "What areas would you like to receive more specialized training in? Select all that apply.",
          options: [
            "Call handling and patient communication",
            "Appointment scheduling strategies",
            "Team coordination",
            "Dental insurance verification and breakdown",
            "Treatment estimate preparation",
            "Payment processing",
            "Discussing patient balances and options",
            "Dental software training (Dentrix, Eaglesoft, OpenDental, etc.)",
            "Other",
          ],
          required: true,
        },
        {
          id: "priority_training",
          type: "textarea",
          label: "Which ONE area should be prioritized for training first?",
          required: true,
        },
      ],
    },
    {
      id: `${role}-preferences`,
      title: "Training Preferences",
      description: `Tell us how you prefer to learn and what elements make a training program effective for you as a ${role}.`,
      questions: [
        {
          id: "training_preference",
          type: "checkbox",
          label: "What is your preferred method of training? (Select up to 2)",
          options: TRAINING_PREFERENCES,
          maxSelections: 2,
          required: true,
        },
        {
          id: "effective_training_elements",
          type: "checkbox",
          label: "If a training program were designed for you, what would make it most effective? (Select all that apply)",
          options: [
            "Certification program",
            "Step-by-step workflows (SOP-based)",
            "Real claim walkthroughs (start to finish)",
            "Denial case studies with solutions",
            "Hands-on practice using actual scenarios",
            "Live coaching or feedback sessions",
            "Templates/scripts for AR and appeals",
            "System training (Athena, Availity, etc.)",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getDentalBillerSections = (): Section[] => {
  const role: Role = "Dental Biller";
  const tasks = [
    "Claim submission",
    "Denial management",
    "Payment posting",
    "Insurance verification",
    "CDT code entry",
    "Code updates",
    "Patient billing",
    "Claim tracking",
    "Record keeping",
  ];

  return [
    {
      id: `${role}-background`,
      title: "Background & Experience",
      description: `Tell us about your professional background and the environment you work in as a ${role}.`,
      questions: [
        {
          id: "experience_type",
          type: "radio",
          label: "What type of experience do you have?",
          options: [
            "BPO experience",
            "Direct Client / Independent VA (working directly with U.S. providers or practices)",
            "Mixed experience (combination of the above)",
            "First time VA",
          ],
          required: true,
        },
        {
          id: "practice_types",
          type: "checkbox",
          label: "What type of practices do you support? (Select all that apply)",
          options: [
            "General Dentistry",
            "Orthodontics",
            "Periodontics",
            "Endodontics",
            "Oral Surgery",
            "Pediatric Dentistry",
            "Other",
          ],
          required: true,
        },
        {
          id: "software_tools",
          type: "checkbox",
          label: "Which software or tools do you use regularly? (Select all that apply)",
          options: [
            "Dentrix",
            "Eaglesoft",
            "Open Dental",
            "Curve Dental",
            "SoftDent",
            "PracticeWeb",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-task-experience`,
      title: "Task Experience",
      description: `Rate your hands-on proficiency in the core tasks expected of a ${role}.`,
      questions: [
        {
          id: "task_grid",
          type: "grid",
          label: "What is your level of hands-on experience in performing the following tasks?",
          rows: tasks,
          columns: TASK_EXPERIENCE_COLUMNS,
          required: true,
        },
      ],
    },
    {
      id: `${role}-daily-responsibilities`,
      title: "Daily Responsibilities",
      description: `Help us understand your typical day-to-day workflow and time management as a ${role}.`,
      questions: [
        {
          id: "daily_tasks",
          type: "checkbox",
          label: "Which of these tasks do you perform on a daily basis?",
          options: tasks,
          required: true,
        },
        {
          id: "main_task",
          type: "radio",
          label: "Which single task takes up the most of your time?",
          options: tasks,
          required: true,
        },
      ],
    },
    {
      id: `${role}-challenges`,
      title: "Challenges & Pain Points",
      description: `Identify the specific obstacles and pressure points you encounter in your role as a ${role}.`,
      questions: [
        {
          id: "daily_challenges",
          type: "checkbox",
          label: "Which areas do you find most challenging in your daily work? (Select up to 3)",
          options: [
            "Claim submission (accurate and timely)",
            "Claim tracking and follow-ups",
            "Handling rejected or returned claims",
            "Denial management and appeals",
            "Accounts Receivable (AR) follow-ups",
            "Identifying root causes of unpaid claims",
            "Insurance verification (dental benefits breakdown)",
            "Understanding coverage limitations and frequency rules",
            "Coordination of benefits (COB)",
            "Payment posting (EOB/ERA interpretation)",
            "Reconciling payments and adjustments",
            "CDT code entry and accuracy",
            "Patient billing and statements",
            "Other",
          ],
          maxSelections: 3,
          required: true,
        },
        {
          id: "challenge_reasons",
          type: "checkbox",
          label: "What makes these areas challenging for you? (Select all that apply)",
          options: [
            "Lack of structured training or clear guidelines",
            "Limited hands-on experience",
            "Difficulty understanding dental insurance policies",
            "Inconsistent workflows across clients/programs",
            "Limited access to systems for practice",
            "Too many systems/tools to manage",
            "Lack of feedback or coaching",
            "High volume of claims or accounts",
            "Time pressure to meet billing targets",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-scenarios`,
      title: "Real-World Scenarios",
      description: `Share your experience with complex, high-pressure situations common to the ${role} role.`,
      questions: [
        {
          id: "struggle_scenarios",
          type: "checkbox",
          label: "What types of real-world scenarios do you struggle with the most? (Select all that apply)",
          options: [
            "Rejected claims and resubmissions",
            "Denials due to coding or documentation errors",
            "Frequency or limitation denials",
            "Coordination of benefits (COB) issues",
            "Underpayments from insurance",
            "Patient balance disputes",
            "Multi-claim AR follow-ups",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-skill`,
      title: "Training & Confidence",
      description: `Assess your current confidence levels and identify specific areas where specialized training would benefit your growth as a ${role}.`,
      questions: [
        {
          id: "overall_confidence",
          type: "scale",
          label: "How confident are you in your current dental receptionist skills?",
          min: 1,
          max: 5,
          minLabel: "Not confident",
          maxLabel: "Very confident",
          required: true,
        },
        {
          id: "specialized_training_needs",
          type: "checkbox",
          label: "What areas would you like to receive more specialized training in? Select all that apply.",
          options: [
            "Claim submission workflows",
            "Clearinghouse processes",
            "Denial management and appeals",
            "AR management strategies",
            "Root cause analysis for denials",
            "Dental insurance verification",
            "Coordination of benefits (COB)",
            "Payment posting accuracy",
            "Reading and interpreting EOB/ERA",
            "CDT coding basics and updates",
            "Dental software training (Dentrix, Eaglesoft, OpenDental, etc.)",
            "Other",
          ],
          required: true,
        },
        {
          id: "priority_training",
          type: "textarea",
          label: "Which ONE area should be prioritized for training first?",
          required: true,
        },
      ],
    },
    {
      id: `${role}-preferences`,
      title: "Training Preferences",
      description: `Tell us how you prefer to learn and what elements make a training program effective for you as a ${role}.`,
      questions: [
        {
          id: "training_preference",
          type: "checkbox",
          label: "What is your preferred method of training? (Select up to 2)",
          options: TRAINING_PREFERENCES,
          maxSelections: 2,
          required: true,
        },
        {
          id: "effective_training_elements",
          type: "checkbox",
          label: "If a training program were designed for you, what would make it most effective? (Select all that apply)",
          options: [
            "Certification program",
            "Step-by-step workflows (SOP-based)",
            "Real claim walkthroughs (start to finish)",
            "Denial case studies with solutions",
            "Hands-on practice using actual scenarios",
            "Live coaching or feedback sessions",
            "Templates/scripts for AR and appeals",
            "System training (Athena, Availity, etc.)",
            "Other",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-final`,
      title: "Final Open Feedback",
      description: `Your final thoughts on how we can better support your success in the ${role} role.`,
      questions: [
        {
          id: "biggest_challenge",
          type: "textarea",
          label: "What is your biggest challenge in your current role?",
          required: true,
        },
        {
          id: "skill_improvement",
          type: "textarea",
          label: "If you could improve one skill right now, what would it be and why?",
          required: true,
        },
      ],
    },
  ];
};

const getGeneralBusinessVASections = (): Section[] => {
  const role: Role = "General Business VA";
  
  return [
    {
      id: `${role}-background`,
      title: "Background Information",
      description: "Tell us about your professional background and the type of experience you have as a Business VA.",
      questions: [
        {
          id: "experience_function",
          type: "radio",
          label: "Which function best matches your experience? (Select one)",
          options: [
            "Sales VA",
            "Logistics / Operations VA",
            "Marketing VA",
            "Multi-function (handled multiple areas)",
          ],
          required: true,
        },
        {
          id: "client_types_supported",
          type: "checkbox",
          label: "What type of clients have you supported? (Select all that apply)",
          options: [
            "E-commerce",
            "Logistics / Supply Chain",
            "Marketing / Agency",
            "Real Estate",
            "SaaS / Tech",
            "Coaching / Consulting",
            "Healthcare",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
      ],
    },
    {
      id: `${role}-task-experience`,
      title: "Task Experience",
      description: "What is your level of experience performing the following tasks? Select the most accurate level for each task.",
      questions: [
        {
          id: "sales_tasks_grid",
          type: "grid",
          label: "🔹 Sales Tasks",
          rows: [
            "Lead generation",
            "CRM management",
            "Outreach (email/calls/messages)",
            "Appointment setting",
            "Follow-ups / lead nurturing",
          ],
          columns: [
            "No experience",
            "Exposure only",
            "Basic (with guidance)",
            "Intermediate (independent)",
            "Advanced (can train others)",
          ],
          required: true,
        },
        {
          id: "logistics_tasks_grid",
          type: "grid",
          label: "🔹 Logistics / Operations Tasks",
          rows: [
            "Order processing",
            "Shipment coordination",
            "Vendor coordination",
            "Inventory tracking",
            "Operations workflow support",
          ],
          columns: [
            "No experience",
            "Exposure only",
            "Basic (with guidance)",
            "Intermediate (independent)",
            "Advanced (can train others)",
          ],
          required: true,
        },
        {
          id: "marketing_tasks_grid",
          type: "grid",
          label: "🔹 Marketing Tasks",
          rows: [
            "Social media management",
            "Content creation",
            "Email marketing",
            "Campaign tracking",
            "Market research",
          ],
          columns: [
            "No experience",
            "Exposure only",
            "Basic (with guidance)",
            "Intermediate (independent)",
            "Advanced (can train others)",
          ],
          required: true,
        },
        {
          id: "cross_functional_tasks_grid",
          type: "grid",
          label: "🔹 Cross-Functional Tasks",
          rows: [
            "Data entry / system updates",
            "Reporting / dashboards",
            "Client communication",
            "Task / project management",
          ],
          columns: [
            "No experience",
            "Exposure only",
            "Basic (with guidance)",
            "Intermediate (independent)",
            "Advanced (can train others)",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-confidence`,
      title: "Confidence Level",
      description: "How confident are you in performing the following tasks independently? (1 = Not confident, 4 = Very confident)",
      questions: [
        {
          id: "confidence_grid",
          type: "grid",
          label: "Task Confidence",
          rows: [
            "Managing CRM and data",
            "Handling client communication",
            "Managing multiple tasks/projects",
            "Following workflows and processes",
            "Using business tools/software",
          ],
          columns: ["1", "2", "3", "4"],
          required: true,
        },
      ],
    },
    {
      id: `${role}-tools`,
      title: "Tools & Systems",
      description: "Tell us about the tools you've used and your proficiency level.",
      questions: [
        {
          id: "tools_used",
          type: "checkbox",
          label: "Which tools have you used? (Select all that apply)",
          options: [
            "CRM (HubSpot, Salesforce, etc.)",
            "Google Workspace",
            "Microsoft Office",
            "Project management tools (Asana, ClickUp, Trello)",
            "Marketing tools (Mailchimp, Meta Ads, etc.)",
            "E-commerce platforms (Shopify, Amazon, etc.)",
            "Logistics tools (inventory/shipping systems)",
            "Communication tools (Slack, Zoom)",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "tools_proficiency",
          type: "radio",
          label: "What is your level of proficiency with these tools?",
          options: [
            "No experience",
            "Basic",
            "Intermediate",
            "Advanced",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-challenges`,
      title: "Challenges & Pain Points",
      description: "Identify the challenges and difficult tasks you face in your role.",
      questions: [
        {
          id: "common_challenges",
          type: "checkbox",
          label: "What challenges do you commonly face in your role? (Select top 3)",
          options: [
            "Managing multiple tasks",
            "Unclear instructions from clients",
            "Lack of process or workflow",
            "Communication challenges",
            "Lack of system/tool familiarity",
            "Difficulty prioritizing tasks",
            "Handling high workload",
            "Adapting to new tools",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
        {
          id: "difficult_tasks",
          type: "checkbox",
          label: "Which tasks do you find most difficult? (Select up to 3)",
          options: [
            "Lead generation / outreach",
            "CRM management",
            "Order/logistics coordination",
            "Content creation / marketing tasks",
            "Reporting / analytics",
            "Client communication",
            "Task/project management",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-core`,
      title: "Training Needs (Core Skills)",
      description: "Which core skills do you need more training in?",
      questions: [
        {
          id: "core_training_needs",
          type: "checkbox",
          label: "Which core skills do you need more training in? (Select up to 3)",
          options: [
            "Data entry accuracy → Maintaining correct information",
            "CRM/system updates → Keeping records updated",
            "Communication → Professional and clear responses",
            "Time management → Handling multiple tasks",
            "Following workflows → Understanding processes",
            "Tool navigation → Using systems efficiently",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-specialized`,
      title: "Training Needs (Specialized Skills)",
      description: "Which specialized skills would you like to improve?",
      questions: [
        {
          id: "specialized_training_needs",
          type: "checkbox",
          label: "Which specialized skills would you like to improve? (Select up to 3)",
          options: [
            "Sales: Lead qualification",
            "Sales: Sales outreach strategy",
            "Sales: Pipeline management",
            "Sales: Sales reporting",
            "Logistics: Operations coordination",
            "Logistics: Inventory management",
            "Logistics: Vendor coordination",
            "Logistics: Shipment tracking optimization",
            "Marketing: Content strategy",
            "Marketing: Social media growth",
            "Marketing: Email marketing strategy",
            "Marketing: Campaign analytics",
            "Cross-Functional: Process improvement",
            "Cross-Functional: Automation tools (AI, workflows)",
            "Cross-Functional: Reporting & analytics",
            "Cross-Functional: Project coordination",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-readiness`,
      title: "Readiness & Career Growth",
      description: "Tell us about your readiness to handle clients and what would help you grow.",
      questions: [
        {
          id: "client_readiness",
          type: "radio",
          label: "Do you feel ready to handle a client independently?",
          options: ["Yes", "Somewhat", "Not yet"],
          required: true,
        },
        {
          id: "readiness_help",
          type: "checkbox",
          label: "What would help you become more client-ready? (Select up to 3)",
          options: [
            "More hands-on training",
            "Real-world scenarios/practice",
            "Better understanding of tools",
            "Communication training",
            "Workflow/process training",
            "Coaching or mentorship",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-final`,
      title: "Final Insights",
      description: "Your final thoughts on succeeding as a Business VA.",
      questions: [
        {
          id: "important_skills",
          type: "textarea",
          label: "What skills do you believe are most important to succeed as a Business VA?",
          required: true,
        },
        {
          id: "additional_training",
          type: "textarea",
          label: "What additional training would help you improve your performance?",
          required: true,
        },
      ],
    },
  ];
};

const getExecutiveAssistantVASections = (): Section[] => {
  const role: Role = "Executive Assistant VA";
  
  return [
    {
      id: `${role}-background`,
      title: "Background Information",
      description: "Tell us about your professional background and the type of support you have provided as an Executive Assistant.",
      questions: [
        {
          id: "client_types_supported",
          type: "checkbox",
          label: "What type of clients have you supported? (Select all that apply)",
          options: [
            "Healthcare / Medical",
            "Dental",
            "E-commerce",
            "Real Estate",
            "Coaching / Consulting",
            "Marketing / Agency",
            "Logistics / Operations",
            "SaaS / Tech",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "support_type",
          type: "radio",
          label: "What type of support have you primarily provided? (Select one)",
          options: [
            "Executive Assistant (direct executive support)",
            "Administrative Assistant",
            "Operations Support",
            "Multi-role",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-task-experience`,
      title: "Task Experience (Hands-On Level)",
      description: "What is your level of experience performing the following tasks? Select the most accurate level for each task.",
      questions: [
        {
          id: "core_ea_tasks_grid",
          type: "grid",
          label: "🔹 Core EA Tasks",
          rows: [
            "Inbox/email management",
            "Calendar management",
            "Meeting coordination",
            "Task tracking / to-do management",
            "Data entry / reporting",
            "Client communication",
          ],
          columns: [
            "No experience",
            "Exposure only",
            "Basic (with guidance)",
            "Intermediate (independent)",
            "Advanced (can train others)",
          ],
          required: true,
        },
        {
          id: "admin_support_tasks_grid",
          type: "grid",
          label: "🔹 Administrative & Support Tasks",
          rows: [
            "Document preparation (reports, presentations)",
            "Research (data gathering, information lookup)",
            "CRM updates",
            "Travel planning",
            "File management / organization",
          ],
          columns: [
            "No experience",
            "Exposure only",
            "Basic (with guidance)",
            "Intermediate (independent)",
            "Advanced (can train others)",
          ],
          required: true,
        },
        {
          id: "advanced_ea_tasks_grid",
          type: "grid",
          label: "🔹 Advanced / Executive-Level Tasks",
          rows: [
            "Prioritization of executive tasks",
            "Managing executive workflows",
            "Project coordination",
            "Process improvement",
            "Handling confidential information",
          ],
          columns: [
            "No experience",
            "Exposure only",
            "Basic (with guidance)",
            "Intermediate (independent)",
            "Advanced (can train others)",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-confidence`,
      title: "Confidence Level (Execution)",
      description: "How confident are you in performing the following tasks independently? (1 = Not confident, 4 = Very confident)",
      questions: [
        {
          id: "confidence_grid",
          type: "grid",
          label: "Task Confidence",
          rows: [
            "Managing inbox and communication",
            "Managing calendars and schedules",
            "Handling multiple priorities",
            "Coordinating meetings and tasks",
            "Using tools and systems",
          ],
          columns: ["1", "2", "3", "4"],
          required: true,
        },
      ],
    },
    {
      id: `${role}-tools`,
      title: "Tools & Systems",
      description: "Tell us about the tools you've used and your proficiency level.",
      questions: [
        {
          id: "tools_used",
          type: "checkbox",
          label: "Which tools have you used? (Select all that apply)",
          options: [
            "Google Workspace (Gmail, Calendar, Docs)",
            "Microsoft Office (Outlook, Excel, Teams)",
            "Project management tools (Asana, ClickUp, Trello)",
            "CRM systems (HubSpot, Salesforce, etc.)",
            "Communication tools (Slack, Zoom)",
            "Automation tools (Zapier, AI tools)",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          required: true,
        },
        {
          id: "tools_proficiency",
          type: "radio",
          label: "What is your level of proficiency with these tools?",
          options: [
            "No experience",
            "Basic",
            "Intermediate",
            "Advanced",
          ],
          required: true,
        },
      ],
    },
    {
      id: `${role}-challenges`,
      title: "Challenges & Pain Points",
      description: "Identify the challenges and difficult tasks you face in your role.",
      questions: [
        {
          id: "common_challenges",
          type: "checkbox",
          label: "What challenges do you commonly face as an EA? (Select top 3)",
          options: [
            "Managing multiple priorities",
            "Unclear instructions from executives",
            "Communication gaps",
            "Lack of structured workflows",
            "Handling urgent requests",
            "Time management challenges",
            "Tool/system limitations",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
        {
          id: "difficult_tasks",
          type: "checkbox",
          label: "Which tasks do you find most difficult? (Select up to 3)",
          options: [
            "Inbox/email management",
            "Calendar coordination",
            "Task prioritization",
            "Project coordination",
            "Client communication",
            "Reporting / documentation",
            "Managing executive expectations",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-core`,
      title: "Training Needs (Core Skills)",
      description: "Which core skills do you need more training in?",
      questions: [
        {
          id: "core_training_needs",
          type: "checkbox",
          label: "Which core skills do you need more training in? (Select up to 3)",
          options: [
            "Email management → Organizing and responding efficiently",
            "Calendar management → Scheduling and avoiding conflicts",
            "Task tracking → Managing to-dos and deadlines",
            "Communication → Professional and clear messaging",
            "Data accuracy → Maintaining correct information",
            "System navigation → Using tools efficiently",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-training-specialized`,
      title: "Training Needs (Specialized Skills)",
      description: "Which specialized skills would you like to improve?",
      questions: [
        {
          id: "specialized_training_needs",
          type: "checkbox",
          label: "Which specialized skills would you like to improve? (Select up to 3)",
          options: [
            "Prioritization & decision support → Managing executive priorities",
            "Project coordination → Managing timelines and deliverables",
            "Process improvement → Streamlining workflows",
            "Advanced reporting → Creating insights and summaries",
            "CRM management → Managing client or business data",
            "Client-facing communication → Handling stakeholders",
            "Research & analysis → Supporting decision-making",
            "Automation tools → Using AI/tools to improve efficiency",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-readiness`,
      title: "Readiness & Career Growth",
      description: "Tell us about your readiness to support an executive and what would help you grow.",
      questions: [
        {
          id: "client_readiness",
          type: "radio",
          label: "Do you feel ready to support an executive independently?",
          options: ["Yes", "Somewhat", "Not yet"],
          required: true,
        },
        {
          id: "readiness_help",
          type: "checkbox",
          label: "What would help you become more client-ready? (Select up to 3)",
          options: [
            "More hands-on training",
            "Real-world scenarios/practice",
            "Better tool/system training",
            "Communication training",
            "Workflow/process training",
            "Coaching or mentorship",
            "Other",
          ],
          optionsWithInputs: ["Other"],
          maxSelections: 3,
          required: true,
        },
      ],
    },
    {
      id: `${role}-final`,
      title: "Final Insights",
      description: "Your final thoughts on succeeding as an Executive Assistant.",
      questions: [
        {
          id: "important_skills",
          type: "textarea",
          label: "What skills do you believe are most important to succeed as an Executive Assistant?",
          required: true,
        },
        {
          id: "additional_training",
          type: "textarea",
          label: "What additional training would help you improve your performance?",
          required: true,
        },
      ],
    },
  ];
};

const getStandardSections = (role: Role, tasks: string[]): Section[] => [
  {
    id: `${role}-background`,
    title: "Background & Experience",
    description: `Tell us about your professional background and the environment you work in as a ${role}.`,
    questions: [
      {
        id: "experience_type",
        type: "radio",
        label: "What type of experience do you have?",
        options: [
          "BPO experience",
          "Direct Client / Independent VA (working directly with U.S. providers or practices)",
          "Mixed experience (combination of the above)",
          "First time VA",
        ],
        required: true,
      },
      {
        id: "practice_types",
        type: "checkbox",
        label: "What type of practices do you support? (Select all that apply)",
        options: [
          "Primary Care",
          "Specialty Clinics (Cardio, Ortho, etc.)",
          "Behavioral Health",
          "Urgent Care",
          "Telehealth",
          "Multi-specialty",
          "Other",
        ],
        required: true,
      },
      {
        id: "software_tools",
        type: "checkbox",
        label: "Which software or tools do you use regularly? (Select all that apply)",
        options: [
          "Athenahealth",
          "Kareo / Tebra",
          "AdvancedMD",
          "eClinicalWorks",
          "NextGen",
          "Epic",
          "Availity / Clearinghouses",
          "Dentrix",
          "Eaglesoft",
          "Open Dental",
          "Other",
        ],
        required: true,
      },
    ],
  },
  {
    id: `${role}-task-experience`,
    title: "Task Experience",
    description: `Rate your hands-on proficiency in the core tasks expected of a ${role}.`,
    questions: [
      {
        id: "task_grid",
        type: "grid",
        label: "What is your level of hands-on experience in performing the following tasks?",
        rows: tasks,
        columns: TASK_EXPERIENCE_COLUMNS,
        required: true,
      },
    ],
  },
  {
    id: `${role}-daily-responsibilities`,
    title: "Daily Responsibilities",
    description: `Help us understand your typical day-to-day workflow and time management as a ${role}.`,
    questions: [
      {
        id: "daily_tasks",
        type: "checkbox",
        label: "Which of these tasks do you perform on a daily basis?",
        options: tasks,
        required: true,
      },
      {
        id: "main_task",
        type: "radio",
        label: "Which single task takes up the most of your time?",
        options: tasks,
        required: true,
      },
    ],
  },
  {
    id: `${role}-challenges`,
    title: "Challenges & Pain Points",
    description: `Identify the specific obstacles and pressure points you encounter in your role as a ${role}.`,
    questions: [
      {
        id: "daily_challenges",
        type: "checkbox",
        label: "Which areas do you find most challenging in your daily work? (Select up to 3)",
        options: [
          "Communicating with patients (calls/messages)",
          "Explaining insurance or authorization requirements",
          "Managing multiple providers or calendars",
          "Coordinating between patients, providers, and insurance",
          "Insurance verification (detailed eligibility & benefits)",
          "Prior authorization processes",
          "Following up with insurance/payers",
          "Organizing and managing medical records",
          "Managing high workload or multiple tasks",
          "Multi-tasking across systems/tools",
          "Other",
        ],
        maxSelections: 3,
        required: true,
      },
      {
        id: "challenge_reasons",
        type: "checkbox",
        label: "What makes these areas challenging for you? (Select all that apply)",
        options: [
          "Lack of structured training or clear guidelines",
          "Limited hands-on experience",
          "Difficulty understanding real-world scenarios",
          "Inconsistent workflows across clients",
          "Lack of clear SOPs or workflows",
          "Lack of feedback or coaching",
          "Too many systems/tools to manage",
          "Limited access to systems for practice",
          "High workload or time pressure",
          "Other",
        ],
        required: true,
      },
      {
        id: "least_confident_tasks",
        type: "checkbox",
        label: "When handling administrative tasks, where do you feel least confident? (Select up to 2)",
        options: [
          "Submitting prior authorizations",
          "Following up with insurance/payers",
          "Coordinating with providers or teams",
          "Reviewing and organizing documentation",
          "Handling urgent or time-sensitive requests",
          "Communicating with patients or clients",
          "Managing multiple tasks simultaneously",
          "Other",
        ],
        maxSelections: 2,
        required: true,
      },
    ],
  },
  {
    id: `${role}-scenarios`,
    title: "Real-World Scenarios",
    description: `Share your experience with complex, high-pressure situations common to the ${role} role.`,
    questions: [
      {
        id: "struggle_scenarios",
        type: "checkbox",
        label: "What types of real-world scenarios do you struggle with the most? (Select all that apply)",
        options: [
          "Prior authorization denials or delays",
          "Delayed insurance responses",
          "Urgent scheduling or coordination issues",
          "Managing multiple clients or providers",
          "Escalations from providers or patients",
          "Handling complex insurance requirements",
          "Other",
        ],
        required: true,
      },
    ],
  },
  {
    id: `${role}-training-skill`,
    title: "Training & Confidence",
    description: `Assess your current confidence levels and identify specific areas where specialized training would benefit your growth as a ${role}.`,
    questions: [
      {
        id: "overall_confidence",
        type: "scale",
        label: "How would you rate your overall confidence in your current role?",
        min: 1,
        max: 5,
        minLabel: "Not confident",
        maxLabel: "Very confident",
        required: true,
      },
      {
        id: "specialized_training_needs",
        type: "checkbox",
        label: "What areas would you like to receive more specialized training in? Select all that apply.",
        options: [
          "Insurance verification (detailed eligibility & benefits)",
          "Prior authorization processes",
          "Appointment scheduling & provider coordination",
          "Front office coordination & operations",
          "Workflow and task management across multiple clients",
          "Medical records management & organization",
          "System/software training (EMR, portals, tools)",
          "Basic billing support (claims follow-up, inquiries)",
          "Other",
        ],
        required: true,
      },
      {
        id: "priority_training",
        type: "textarea",
        label: "Which ONE area should be prioritized for training first?",
        required: true,
      },
    ],
  },
  {
    id: `${role}-preferences`,
    title: "Training Preferences",
    description: `Tell us how you prefer to learn and what elements make a training program effective for you as a ${role}.`,
    questions: [
      {
        id: "training_preference",
        type: "checkbox",
        label: "What is your preferred method of training? (Select up to 2)",
        options: TRAINING_PREFERENCES,
        maxSelections: 2,
        required: true,
      },
      {
        id: "effective_training_elements",
        type: "checkbox",
        label: "If a training program were designed for you, what would make it most effective? (Select all that apply)",
        options: [
          "Certification program",
          "Step-by-step workflows (SOP-based)",
          "Real claim walkthroughs (start to finish)",
          "Denial case studies with solutions",
          "Hands-on practice using actual scenarios",
          "Live coaching or feedback sessions",
          "Templates/scripts for AR and appeals",
          "System training (Athena, Availity, etc.)",
          "Other",
        ],
        required: true,
      },
    ],
  },
  {
    id: `${role}-final`,
    title: "Final Open Feedback",
    description: `Your final thoughts on how we can better support your success in the ${role} role.`,
    questions: [
      {
        id: "biggest_challenge",
        type: "textarea",
        label: "What is your biggest challenge in your current role?",
        required: true,
      },
      {
        id: "skill_improvement",
        type: "textarea",
        label: "If you could improve one skill right now, what would it be and why?",
        required: true,
      },
    ],
  },
];

export const VA_SURVEY_SCHEMA: SurveySchema = {
  profile: {
    id: "profile",
    title: "Profile Information",
    questions: [
      {
        id: "full_name",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "email",
        type: "text",
        label: "Email Address",
        required: true,
      },
      {
        id: "role",
        type: "radio",
        label: "What is your primary VA role?",
        options: [
          "Medical Receptionist",
          "Medical Administrative Assistant",
          "Medical Biller",
          "Medical Scribe",
          "Health Educator",
          "Dental Receptionist",
          "Dental Biller",
          "Executive Assistant VA",
          "General Business VA",
        ],
        required: true,
      },
      {
        id: "experience_years",
        type: "radio",
        label: "Years of healthcare experience",
        options: EXPERIENCE_OPTIONS,
        required: true,
      },
    ],
  },
  roleSections: {
    "Medical Receptionist": getMedicalReceptionistSections(),
    "Medical Administrative Assistant": getStandardSections("Medical Administrative Assistant", [
      "Appointment scheduling",
      "Insurance verification",
      "Prior authorization",
      "EA support",
      "Front office coordination",
      "Records management",
      "Billing support",
      "Patient correspondence",
    ]),
    "Medical Biller": getMedicalBillerSections(),
    "Medical Scribe": getMedicalScribeSections(),
    "Health Educator": getHealthEducatorSections(),
    "Dental Receptionist": getDentalReceptionistSections(),
    "Dental Biller": getDentalBillerSections(),
    "Executive Assistant VA": getExecutiveAssistantVASections(),
    "General Business VA": getGeneralBusinessVASections(),
    "Other": getOtherRoleSections(),
  },
};

export const CLIENT_SURVEY_SCHEMA: ClientSurveySchema = {
  initial: {
    id: "client-initial",
    title: "Client Information",
    description: "Dear Client, \n\nWe’re excited to announce that we’re designing a VA Upskilling Program to help your VAs grow, become more confident, and deliver even more impact for your business!\n\nWe’d love your feedback to make sure the program hits the mark and focuses on what truly matters for your team.\n\nBy sharing your insights, you’ll help us:\n• Tailor task-specific training to your workflows\n• Identify the skills that matter most for your team’s success\n• Empower your VAs to be ready, confident, and fully supported\n\nYour input is key — together, we can equip your VAs to thrive and deliver their best every day!\n\nThis will take about 10 minutes to complete.\n\nThank you!",
    questions: [
      {
        id: "full_name",
        type: "text",
        label: "Full Name (First Name, Last Name)*",
        required: true,
      },
      {
        id: "email",
        type: "text",
        label: "Email Address",
        required: true,
      },
      {
        id: "practice_type",
        type: "radio",
        label: "Type of Practice/Industry",
        options: [
          "Dental",
          "Medical",
          "Business",
          "E-commerce",
          "Real Estate",
          "Other"
        ],
        optionsWithInputs: ["Other"],
        required: true,
      },
      {
        id: "va_count",
        type: "text",
        label: "How many VAs do you have from MMM?",
        required: true,
      },
      {
        id: "va_role_feedback",
        type: "checkbox",
        label: "Which VA role are you providing feedback on? (Select all that apply)",
        options: [
          "Medical Receptionist",
          "Medical Administrative Assistant",
          "Medical Biller",
          "Medical Scribe",
          "Health Educator",
          "Dental Receptionist",
          "Dental Biller",
          "Executive Assistant VA",
          "General Business VA",
          "Other",
        ],
        optionsWithInputs: ["Other"],
        required: true,
      },
    ],
  },
  roleSections: {
    "Medical Biller": [
      {
        id: "biller-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "biller_proficiency_grid",
            type: "grid",
            label: "In general, how would you describe the level of support your VAs currently provide in the following areas?",
            description: "Legend:\nNA – Not part of your VA’s current responsibilities\n1 – Guided support: Performs tasks with guidance or direction\n2 – Assisted support: Performs tasks with occasional guidance\n3 – Independent support: Performs tasks independently in most cases\n4 – Advanced support: Performs complex tasks independently",
            rows: [
              "Charge Entry, Coding & Pre-Billing Review → Entering CPT, ICD-10, modifiers; validating documentation and scrubbing claims before submission",
              "Insurance Verification (Billing-Focused) → Validating coverage, payer requirements, and eligibility before billing",
              "Claim Creation, Submission & Rejection Handling → Submitting claims (CMS 1500 / UB-04) and correcting clearinghouse rejections",
              "Payer Portal Navigation & Claim Tracking → Monitoring claim status via Availity and payer portals",
              "Payment Posting & Reconciliation → Posting EOB/ERA and identifying underpayments",
              "Denial Management, Appeals & AR Follow-Up → Resolving denials, submitting appeals, and following up on unpaid claims",
              "Aging & Work Queue Management → Prioritizing claims based on aging buckets (30/60/90+)",
              "Patient Billing & Financial Communication → Managing statements, explaining balances, OOP costs, and payment options",
              "Billing Reports, Compliance & Process Improvement → Tracking KPIs, ensuring HIPAA compliance, and optimizing workflows"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: false,
          },
          {
            id: "biller_crucial_tasks",
            type: "checkbox",
            label: "What are the most crucial, business impacting tasks for your Medical Biller? (Select up to 3)",
            options: [
              "Claim Submission Accuracy & Volume → Clean claims, minimal rejections, timely submission",
              "Denial Management & Resolution → Reducing denials and recovering lost revenue",
              "Accounts Receivable (AR) Follow-Up → Driving collections and reducing aging",
              "Payment Posting Accuracy → Ensuring correct revenue tracking and reconciliation",
              "Clearinghouse Rejection Management → Preventing delays before claims reach payer",
              "Insurance Verification (Billing Impact) → Preventing eligibility-related denials",
              "Patient Billing & Collections → Improving patient payments and reducing outstanding balances",
              "Reporting & Revenue Insights → Identifying trends and improving financial performance",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "biller_tool_proficiency",
            type: "grid",
            label: "How does your Virtual Assistant currently support you when using the following tools?",
            description: "Legend:\nNA – Not applicable: This tool is not part of your VA’s responsibilities\n1 – Guided: Performs tasks with guidance or direction\n2 – Assisted: Performs tasks with occasional guidance\n3 – Independent: Performs tasks independently in most cases\n4 – Advanced: Performs complex tasks independently",
            gridInstruction: "You are not required to complete all rows in the grid. Please select only the tools that apply to your experience or only check the items that apply. You may leave the rest blank.",
            rows: [
              "Electronic Medical Record",
              "Dental PMS",
              "Insurance & Eligibility Tools",
              "Other"
            ],
            rowsWithCheckboxes: {
              "Electronic Medical Record": [
                "Athena (AthenaOne / AthenaNet)",
                "Practice Fusion",
                "eClinicalWorks (eCW)",
                "Epic",
                "Cerner",
                "NextGen Healthcare",
                "Kareo / Tebra",
                "DrChrono",
                "AdvancedMD",
                "Office Ally",
                "Meditech",
                "Allscripts",
                "Other"
              ],
              "Dental PMS": [
                "Dentrix",
                "Eaglesoft",
                "Open Dental",
                "Curve Dental",
                "ClearDent",
                "ABELDent",
                "Tracker",
                "Other"
              ],
              "Insurance & Eligibility Tools": [
                "Availity",
                "NaviNet",
                "Waystar",
                "Change Healthcare",
                "Other"
              ]
            },
            rowsWithInputs: ["Other"],
            columns: ["NA", "1", "2", "3", "4"],
            rateSubOptions: true,
            required: false,
          },
          {
            id: "biller_other_tools",
            type: "checkbox",
            label: "What other systems or tools does your VA use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other tools"
            ],
            optionsWithInputs: ["Other tools"],
            required: true,
          }
        ],
      },
      getCompetenciesSection("biller"),
      {
        id: "biller-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "biller_comm_proficiency",
            type: "grid",
            label: "How effectively does your Virtual Assistant communicate when performing the following tasks?",
            description: "Legend:\nNA – Not applicable: Not part of your VA’s responsibilities\n1 – Requires close guidance: Communication may need clarification or follow-up\n2 – With occasional support: Communication is generally clear with some guidance\n3 – Works independently: Communication is clear and appropriate in most situations\n4 – Highly effective: Communication is clear, structured, and proactive",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "biller_comm_essentiality",
            type: "grid",
            label: "For each task, how important is it for your Virtual Assistant to handle it effectively in your day-to-day operations?",
            description: "Legend:\nCore to the role – A key responsibility for your VA\nImportant – Adds value to your workflow but can be developed over time\nNice to have – Helpful, but not required for your VA’s role",
            rows: [
              "Handling client calls → Clear and professional verbal communication",
              "Responding to client emails/messages → Timely and accurate written communication",
              "Posting updates on group chats / team channels → Effective team communication and coordination",
              "Preparing and submitting reports → Clear reporting and information sharing",
              "Managing appointment scheduling & changes → Accurate coordination of schedules and expectations",
              "Updating documentation & records accurately → Reliable and clear documentation for workflow continuity"
            ],
            columns: ["Core to the role", "Important", "Nice to have"],
            required: true,
          },
          {
            id: "biller_verbal_comm_importance",
            type: "radio",
            label: "How important is clear verbal communication for your Virtual Assistant to perform effectively in their role?\n(e.g., being easily understood during calls or voice interactions)",
            options: [
              "Core to the role – Clear and easily understood verbal communication is essential for client/patient interactions",
              "Important – Clear communication is preferred; minor variations in speech are manageable",
              "Nice to have – Verbal communication is not a primary requirement for this role"
            ],
            required: true,
          }
        ],
      },
      {
        id: "biller-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "biller_ai_automation_level",
            type: "radio",
            label: "To what extent is AI currently used in your workflow?",
            options: [
              "Minimal – Most tasks are done manually",
              "Some use – AI supports certain tasks, with VAs handling most of the work",
              "Significant use – AI supports many tasks, with VAs overseeing and executing key steps",
              "Extensive use – AI is embedded across workflows, with VAs focusing on oversight and coordination"
            ],
            required: true,
          },
          {
            id: "biller_ai_tool_proficiency",
            type: "grid",
            label: "What level of capability would you like your VA to have when using the following AI tools?",
            description: "Legend:\n1 – Guided: Uses the tool with instructions or support\n2 – Assisted: Uses the tool independently for standard tasks\n3 – Independent: Uses the tool to improve efficiency and output\n4 – Advanced: Uses the tool to optimize workflows and enhance outcomes",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)",
              "Other AI tools"
            ],
            rowsWithInputs: ["Other AI tools"],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "biller_ai_future_support",
            type: "checkbox",
            label: "How do you see AI supporting your VA’s role over the next 6–12 months? (Select all that apply)",
            options: [
              "AI will support specific tasks, with VAs continuing to manage core responsibilities",
              "AI will handle more routine work, allowing VAs to focus on higher-value tasks",
              "AI will be more integrated into workflows, with VAs coordinating and overseeing processes",
              "Workflows will remain mostly manual, with limited AI involvement",
              "Not sure / still exploring how AI fits into our workflow"
            ],
            required: true,
          }
        ],
      },
      getLongTermSuccessSection("biller"),
    ],
    "Medical Receptionist": [
      {
        id: "receptionist-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "receptionist_proficiency_grid",
            type: "grid",
            label: "In general, how would you describe the level of support your VAs currently provide in the following areas?",
            description: "Legend:\nNA – Not part of your VA’s current responsibilities\n1 – Guided support: Performs tasks with guidance or direction\n2 – Assisted support: Performs tasks with occasional guidance\n3 – Independent support: Performs tasks independently in most cases\n4 – Advanced support: Performs complex tasks independently",
            rows: [
              "Appointment scheduling → Booking and managing appointments",
              "Patient calls and inquiries → Answering calls and assisting patients",
              "Insurance verification → Checking eligibility and benefits",
              "Patient intake → Collecting and entering patient information",
              "Appointment reminders & follow-ups → Confirmations and recalls",
              "Data entry / record updates → Updating patient information",
              "Payment collection → Collecting co-pays and payments",
              "Referral coordination → Sending and tracking referrals",
              "Medical records handling → Managing records and requests",
              "Team coordination → Communicating with providers and staff"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: false,
          },
          {
            id: "receptionist_crucial_tasks",
            type: "checkbox",
            label: "What are the most crucial, business impacting tasks for your Medical Receptionist? (Select up to 3)",
            options: [
              "Appointment scheduling → Managing bookings and changes",
              "Patient calls and inquiries → Handling high call volume",
              "Insurance verification → Checking coverage and benefits",
              "Patient intake → Entering patient details",
              "Appointment reminders & follow-ups → Managing confirmations",
              "Managing no-shows → Tracking and rescheduling patients",
              "Data entry / updates → Maintaining accurate records",
              "Payment collection → Processing patient payments",
              "Referral coordination → Managing referrals",
              "Medical records handling → Processing records requests",
              "Team coordination → Communicating with staff",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "receptionist_tool_proficiency",
            type: "grid",
            label: "How does your Virtual Assistant currently support you when using the following tools?",
            description: "Legend:\nNA – Not applicable: This tool is not part of your VA’s responsibilities\n1 – Guided: Performs tasks with guidance or direction\n2 – Assisted: Performs tasks with occasional guidance\n3 – Independent: Performs tasks independently in most cases\n4 – Advanced: Performs complex tasks independently",
            gridInstruction: "You are not required to complete all rows in the grid. Please select only the tools that apply to your experience or only check the items that apply. You may leave the rest blank.",
            rows: [
              "Electronic Medical Record",
              "Dental PMS",
              "Insurance & Eligibility Tools",
              "Other"
            ],
            rowsWithCheckboxes: {
              "Electronic Medical Record": [
                "Athena (AthenaOne / AthenaNet)",
                "Practice Fusion",
                "eClinicalWorks (eCW)",
                "Epic",
                "Cerner",
                "NextGen Healthcare",
                "Kareo / Tebra",
                "DrChrono",
                "AdvancedMD",
                "Office Ally",
                "Meditech",
                "Allscripts",
                "Other"
              ],
              "Dental PMS": [
                "Dentrix",
                "Eaglesoft",
                "Open Dental",
                "Curve Dental",
                "ClearDent",
                "ABELDent",
                "Tracker",
                "Other"
              ],
              "Insurance & Eligibility Tools": [
                "Availity",
                "NaviNet",
                "Waystar",
                "Change Healthcare",
                "Other"
              ]
            },
            rowsWithInputs: ["Other"],
            columns: ["NA", "1", "2", "3", "4"],
            rateSubOptions: true,
            required: false,
          },
          {
            id: "receptionist_other_tools",
            type: "checkbox",
            label: "What other systems or tools does your VA use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other tools"
            ],
            optionsWithInputs: ["Other tools"],
            required: true,
          }
        ],
      },
      getCompetenciesSection("receptionist"),
      {
        id: "receptionist-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "receptionist_comm_proficiency",
            type: "grid",
            label: "How effectively does your Virtual Assistant communicate when performing the following tasks?",
            description: "Legend:\nNA – Not applicable: Not part of your VA’s responsibilities\n1 – Requires close guidance: Communication may need clarification or follow-up\n2 – With occasional support: Communication is generally clear with some guidance\n3 – Works independently: Communication is clear and appropriate in most situations\n4 – Highly effective: Communication is clear, structured, and proactive",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "receptionist_comm_essentiality",
            type: "grid",
            label: "For each task, how important is it for your Virtual Assistant to handle it effectively in your day-to-day operations?",
            description: "Legend:\nCore to the role – A key responsibility for your VA\nImportant – Adds value to your workflow but can be developed over time\nNice to have – Helpful, but not required for your VA’s role",
            rows: [
              "Handling client calls → Clear and professional verbal communication",
              "Responding to client emails/messages → Timely and accurate written communication",
              "Posting updates on group chats / team channels → Effective team communication and coordination",
              "Preparing and submitting reports → Clear reporting and information sharing",
              "Managing appointment scheduling & changes → Accurate coordination of schedules and expectations",
              "Updating documentation & records accurately → Reliable and clear documentation for workflow continuity"
            ],
            columns: ["Core to the role", "Important", "Nice to have"],
            required: true,
          },
          {
            id: "receptionist_verbal_comm_importance",
            type: "radio",
            label: "How important is clear verbal communication for your Virtual Assistant to perform effectively in their role?\n(e.g., being easily understood during calls or voice interactions)",
            options: [
              "Core to the role – Clear and easily understood verbal communication is essential for client/patient interactions",
              "Important – Clear communication is preferred; minor variations in speech are manageable",
              "Nice to have – Verbal communication is not a primary requirement for this role"
            ],
            required: true,
          }
        ],
      },
      {
        id: "receptionist-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "receptionist_ai_automation_level",
            type: "radio",
            label: "To what extent is AI currently used in your workflow?",
            options: [
              "Minimal – Most tasks are done manually",
              "Some use – AI supports certain tasks, with VAs handling most of the work",
              "Significant use – AI supports many tasks, with VAs overseeing and executing key steps",
              "Extensive use – AI is embedded across workflows, with VAs focusing on oversight and coordination"
            ],
            required: true,
          },
          {
            id: "receptionist_ai_tool_proficiency",
            type: "grid",
            label: "What level of capability would you like your VA to have when using the following AI tools?",
            description: "Legend:\n1 – Guided: Uses the tool with instructions or support\n2 – Assisted: Uses the tool independently for standard tasks\n3 – Independent: Uses the tool to improve efficiency and output\n4 – Advanced: Uses the tool to optimize workflows and enhance outcomes",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)",
              "Other AI tools"
            ],
            rowsWithInputs: ["Other AI tools"],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "receptionist_ai_future_support",
            type: "checkbox",
            label: "How do you see AI supporting your VA’s role over the next 6–12 months? (Select all that apply)",
            options: [
              "AI will support specific tasks, with VAs continuing to manage core responsibilities",
              "AI will handle more routine work, allowing VAs to focus on higher-value tasks",
              "AI will be more integrated into workflows, with VAs coordinating and overseeing processes",
              "Workflows will remain mostly manual, with limited AI involvement",
              "Not sure / still exploring how AI fits into our workflow"
            ],
            required: true,
          }
        ],
      },
      getLongTermSuccessSection("receptionist"),
    ],
    "Medical Administrative Assistant": [
      {
        id: "admin-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "admin_proficiency_grid",
            type: "grid",
            label: "In general, how would you describe the level of support your VAs currently provide in the following areas?",
            description: "Legend:\nNA – Not part of your VA’s current responsibilities\n1 – Guided support: Performs tasks with guidance or direction\n2 – Assisted support: Performs tasks with occasional guidance\n3 – Independent support: Performs tasks independently in most cases\n4 – Advanced support: Performs complex tasks independently",
            rows: [
              "Inbox/email management → Managing emails and communication",
              "Scheduling & coordination → Organizing meetings, calendars, tasks",
              "Patient coordination → Communicating with patients for updates",
              "Insurance support → Assisting with verification and follow-ups",
              "Billing support → Collecting co-pays, handling invoices, and basic reconciliations",
              "Documentation & reports → Preparing reports and records",
              "Data entry / system updates → Maintaining accurate information",
              "Medical records handling → Managing files and documentation",
              "Prior authorization support → Assisting with authorization requests",
              "Team coordination → Supporting internal workflow"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: false,
          },
          {
            id: "admin_crucial_tasks",
            type: "checkbox",
            label: "What are the most crucial, business impacting tasks for your Medical Admin? (Select up to 3)",
            options: [
              "Appointment scheduling → Managing bookings and changes",
              "Patient calls and inquiries → Handling high call volume",
              "Insurance verification → Checking coverage and benefits",
              "Patient intake → Entering patient details",
              "Appointment reminders & follow-ups → Managing confirmations",
              "Managing no-shows → Tracking and rescheduling patients",
              "Data entry / updates → Maintaining accurate records",
              "Payment collection → Processing patient payments",
              "Referral coordination → Managing referrals",
              "Medical records handling → Processing records requests",
              "Team coordination → Communicating with staff",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "admin_tool_proficiency",
            type: "grid",
            label: "How does your Virtual Assistant currently support you when using the following tools?",
            description: "Legend:\nNA – Not applicable: This tool is not part of your VA’s responsibilities\n1 – Guided: Performs tasks with guidance or direction\n2 – Assisted: Performs tasks with occasional guidance\n3 – Independent: Performs tasks independently in most cases\n4 – Advanced: Performs complex tasks independently",
            gridInstruction: "You are not required to complete all rows in the grid. Please select only the tools that apply to your experience or only check the items that apply. You may leave the rest blank.",
            rows: [
              "Electronic Medical Record",
              "Dental PMS",
              "Insurance & Eligibility Tools",
              "Other"
            ],
            rowsWithCheckboxes: {
              "Electronic Medical Record": [
                "Athena (AthenaOne / AthenaNet)",
                "Practice Fusion",
                "eClinicalWorks (eCW)",
                "Epic",
                "Cerner",
                "NextGen Healthcare",
                "Kareo / Tebra",
                "DrChrono",
                "AdvancedMD",
                "Office Ally",
                "Meditech",
                "Allscripts",
                "Other"
              ],
              "Dental PMS": [
                "Dentrix",
                "Eaglesoft",
                "Open Dental",
                "Curve Dental",
                "ClearDent",
                "ABELDent",
                "Tracker",
                "Other"
              ],
              "Insurance & Eligibility Tools": [
                "Availity",
                "NaviNet",
                "Waystar",
                "Change Healthcare",
                "Other"
              ]
            },
            rowsWithInputs: ["Other"],
            columns: ["NA", "1", "2", "3", "4"],
            rateSubOptions: true,
            required: false,
          },
          {
            id: "admin_other_tools",
            type: "checkbox",
            label: "What other systems or tools does your VA use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other tools"
            ],
            optionsWithInputs: ["Other tools"],
            required: true,
          }
        ],
      },
      getCompetenciesSection("admin"),
      {
        id: "admin-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "admin_comm_proficiency",
            type: "grid",
            label: "How effectively does your Virtual Assistant communicate when performing the following tasks?",
            description: "Legend:\nNA – Not applicable: Not part of your VA’s responsibilities\n1 – Requires close guidance: Communication may need clarification or follow-up\n2 – With occasional support: Communication is generally clear with some guidance\n3 – Works independently: Communication is clear and appropriate in most situations\n4 – Highly effective: Communication is clear, structured, and proactive",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "admin_comm_essentiality",
            type: "grid",
            label: "For each task, how important is it for your Virtual Assistant to handle it effectively in your day-to-day operations?",
            description: "Legend:\nCore to the role – A key responsibility for your VA\nImportant – Adds value to your workflow but can be developed over time\nNice to have – Helpful, but not required for your VA’s role",
            rows: [
              "Handling client calls → Clear and professional verbal communication",
              "Responding to client emails/messages → Timely and accurate written communication",
              "Posting updates on group chats / team channels → Effective team communication and coordination",
              "Preparing and submitting reports → Clear reporting and information sharing",
              "Managing appointment scheduling & changes → Accurate coordination of schedules and expectations",
              "Updating documentation & records accurately → Reliable and clear documentation for workflow continuity"
            ],
            columns: ["Core to the role", "Important", "Nice to have"],
            required: true,
          },
          {
            id: "admin_verbal_comm_importance",
            type: "radio",
            label: "How important is clear verbal communication for your Virtual Assistant to perform effectively in their role?\n(e.g., being easily understood during calls or voice interactions)",
            options: [
              "Core to the role – Clear and easily understood verbal communication is essential for client/patient interactions",
              "Important – Clear communication is preferred; minor variations in speech are manageable",
              "Nice to have – Verbal communication is not a primary requirement for this role"
            ],
            required: true,
          }
        ],
      },
      {
        id: "admin-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "admin_ai_automation_level",
            type: "radio",
            label: "To what extent is AI currently used in your workflow?",
            options: [
              "Minimal – Most tasks are done manually",
              "Some use – AI supports certain tasks, with VAs handling most of the work",
              "Significant use – AI supports many tasks, with VAs overseeing and executing key steps",
              "Extensive use – AI is embedded across workflows, with VAs focusing on oversight and coordination"
            ],
            required: true,
          },
          {
            id: "admin_ai_tool_proficiency",
            type: "grid",
            label: "What level of capability would you like your VA to have when using the following AI tools?",
            description: "Legend:\n1 – Guided: Uses the tool with instructions or support\n2 – Assisted: Uses the tool independently for standard tasks\n3 – Independent: Uses the tool to improve efficiency and output\n4 – Advanced: Uses the tool to optimize workflows and enhance outcomes",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)",
              "Other AI tools"
            ],
            rowsWithInputs: ["Other AI tools"],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "admin_ai_future_support",
            type: "checkbox",
            label: "How do you see AI supporting your VA’s role over the next 6–12 months? (Select all that apply)",
            options: [
              "AI will support specific tasks, with VAs continuing to manage core responsibilities",
              "AI will handle more routine work, allowing VAs to focus on higher-value tasks",
              "AI will be more integrated into workflows, with VAs coordinating and overseeing processes",
              "Workflows will remain mostly manual, with limited AI involvement",
              "Not sure / still exploring how AI fits into our workflow"
            ],
            required: true,
          }
        ],
      },
      getLongTermSuccessSection("admin"),
    ],
    "Medical Scribe": [
      {
        id: "scribe-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "scribe_proficiency_grid",
            type: "grid",
            label: "In general, how would you describe the level of support your VAs currently provide in the following areas?",
            description: "Legend:\nNA – Not part of your VA’s current responsibilities\n1 – Guided support: Performs tasks with guidance or direction\n2 – Assisted support: Performs tasks with occasional guidance\n3 – Independent support: Performs tasks independently in most cases\n4 – Advanced support: Performs complex tasks independently",
            rows: [
              "Pre-Charting & Chart Setup → Reviewing history, notes, meds, and preparing templates",
              "Real-Time Scribing & Transcription → Documenting visits and converting audio to notes",
              "Clinical Note Structuring & Terminology → Accurate HPI, ROS, PE, A&P with proper medical terms",
              "Active Listening & Information Filtering → Capturing relevant details during encounters",
              "Chart Completion, Editing & TAT → Finalizing, proofreading, and completing notes on time",
              "Order Entry & Task Management → Supporting labs, imaging, prescriptions, and EMR tasks",
              "Care Coordination Support → Communicating follow-ups with clinical team",
              "HIPAA & Documentation Standards → Ensuring privacy, accuracy, and provider-specific formatting"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: false,
          },
          {
            id: "scribe_crucial_tasks",
            type: "checkbox",
            label: "What are the most crucial, business impacting tasks for your Medical Scribe? (Select up to 3)",
            options: [
              "Accurate Real-Time Scribing (Live Documentation) → Reduces provider documentation burden during visits",
              "Medical Transcription Accuracy & Turnaround Time → Ensures timely and precise conversion of dictations into billable notes",
              "Documentation Accuracy (HPI, A&P, Clinical Details) → Critical for compliance, billing, and patient safety",
              "Chart Completion & Turnaround Time (TAT) → Enables faster billing and continuity of care",
              "Pre-Charting & Chart Readiness → Improves visit efficiency and provider preparedness",
              "Medical Terminology & Structured Note Writing → Ensures professional, compliant, and readable documentation",
              "Order Entry & Clinical Task Support → Prevents missed orders and improves workflow",
              "EMR Task & Alert Management → Ensures follow-ups and clinical actions are completed",
              "Compliance & HIPAA Adherence → Protects patient data and reduces legal risk",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "scribe_tool_proficiency",
            type: "grid",
            label: "How does your Virtual Assistant currently support you when using the following tools?",
            description: "Legend:\nNA – Not applicable: This tool is not part of your VA’s responsibilities\n1 – Guided: Performs tasks with guidance or direction\n2 – Assisted: Performs tasks with occasional guidance\n3 – Independent: Performs tasks independently in most cases\n4 – Advanced: Performs complex tasks independently",
            gridInstruction: "You are not required to complete all rows in the grid. Please select only the tools that apply to your experience or only check the items that apply. You may leave the rest blank.",
            rows: [
              "Electronic Medical Record",
              "Dental PMS",
              "Insurance & Eligibility Tools",
              "Other"
            ],
            rowsWithCheckboxes: {
              "Electronic Medical Record": [
                "Athena (AthenaOne / AthenaNet)",
                "Practice Fusion",
                "eClinicalWorks (eCW)",
                "Epic",
                "Cerner",
                "NextGen Healthcare",
                "Kareo / Tebra",
                "DrChrono",
                "AdvancedMD",
                "Office Ally",
                "Meditech",
                "Allscripts",
                "Other"
              ],
              "Dental PMS": [
                "Dentrix",
                "Eaglesoft",
                "Open Dental",
                "Curve Dental",
                "ClearDent",
                "ABELDent",
                "Tracker",
                "Other"
              ],
              "Insurance & Eligibility Tools": [
                "Availity",
                "NaviNet",
                "Waystar",
                "Change Healthcare",
                "Other"
              ]
            },
            rowsWithInputs: ["Other"],
            columns: ["NA", "1", "2", "3", "4"],
            rateSubOptions: true,
            required: false,
          },
          {
            id: "scribe_other_tools",
            type: "checkbox",
            label: "What other systems or tools does your VA use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other tools"
            ],
            optionsWithInputs: ["Other tools"],
            required: true,
          }
        ],
      },
      getCompetenciesSection("scribe"),
      {
        id: "scribe-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "scribe_comm_proficiency",
            type: "grid",
            label: "How effectively does your Virtual Assistant communicate when performing the following tasks?",
            description: "Legend:\nNA – Not applicable: Not part of your VA’s responsibilities\n1 – Requires close guidance: Communication may need clarification or follow-up\n2 – With occasional support: Communication is generally clear with some guidance\n3 – Works independently: Communication is clear and appropriate in most situations\n4 – Highly effective: Communication is clear, structured, and proactive",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "scribe_comm_essentiality",
            type: "grid",
            label: "For each task, how important is it for your Virtual Assistant to handle it effectively in your day-to-day operations?",
            description: "Legend:\nCore to the role – A key responsibility for your VA\nImportant – Adds value to your workflow but can be developed over time\nNice to have – Helpful, but not required for your VA’s role",
            rows: [
              "Handling client calls → Clear and professional verbal communication",
              "Responding to client emails/messages → Timely and accurate written communication",
              "Posting updates on group chats / team channels → Effective team communication and coordination",
              "Preparing and submitting reports → Clear reporting and information sharing",
              "Managing appointment scheduling & changes → Accurate coordination of schedules and expectations",
              "Updating documentation & records accurately → Reliable and clear documentation for workflow continuity"
            ],
            columns: ["Core to the role", "Important", "Nice to have"],
            required: true,
          },
          {
            id: "scribe_verbal_comm_importance",
            type: "radio",
            label: "How important is clear verbal communication for your Virtual Assistant to perform effectively in their role?\n(e.g., being easily understood during calls or voice interactions)",
            options: [
              "Core to the role – Clear and easily understood verbal communication is essential for client/patient interactions",
              "Important – Clear communication is preferred; minor variations in speech are manageable",
              "Nice to have – Verbal communication is not a primary requirement for this role"
            ],
            required: true,
          }
        ],
      },
      {
        id: "scribe-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "scribe_ai_automation_level",
            type: "radio",
            label: "To what extent is AI currently used in your workflow?",
            options: [
              "Minimal – Most tasks are done manually",
              "Some use – AI supports certain tasks, with VAs handling most of the work",
              "Significant use – AI supports many tasks, with VAs overseeing and executing key steps",
              "Extensive use – AI is embedded across workflows, with VAs focusing on oversight and coordination"
            ],
            required: true,
          },
          {
            id: "scribe_ai_tool_proficiency",
            type: "grid",
            label: "What level of capability would you like your VA to have when using the following AI tools?",
            description: "Legend:\n1 – Guided: Uses the tool with instructions or support\n2 – Assisted: Uses the tool independently for standard tasks\n3 – Independent: Uses the tool to improve efficiency and output\n4 – Advanced: Uses the tool to optimize workflows and enhance outcomes",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)",
              "Other AI tools"
            ],
            rowsWithInputs: ["Other AI tools"],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "scribe_ai_future_support",
            type: "checkbox",
            label: "How do you see AI supporting your VA’s role over the next 6–12 months? (Select all that apply)",
            options: [
              "AI will support specific tasks, with VAs continuing to manage core responsibilities",
              "AI will handle more routine work, allowing VAs to focus on higher-value tasks",
              "AI will be more integrated into workflows, with VAs coordinating and overseeing processes",
              "Workflows will remain mostly manual, with limited AI involvement",
              "Not sure / still exploring how AI fits into our workflow"
            ],
            required: true,
          }
        ],
      },
      getLongTermSuccessSection("scribe"),
    ],
    "Health Educator": [
      {
        id: "health-educator-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "health_educator_proficiency_grid",
            type: "grid",
            label: "In general, how would you describe the level of support your VAs currently provide in the following areas?",
            description: "Legend:\nNA – Not part of your VA’s current responsibilities\n1 – Guided support: Performs tasks with guidance or direction\n2 – Assisted support: Performs tasks with occasional guidance\n3 – Independent support: Performs tasks independently in most cases\n4 – Advanced support: Performs complex tasks independently",
            rows: [
              "Patient Education Delivery → Explaining conditions, care plans, and instructions clearly",
              "Health Coaching & Behavior Change → Supporting lifestyle goals (diet, exercise, habits)",
              "Follow-Up Calls & Check-Ins → Monitoring progress, adherence, and addressing barriers",
              "Care Plan Reinforcement → Simplifying provider recommendations for patient understanding",
              "Documentation & Progress Tracking → Recording notes, updates, and outcomes in EMR/CRM",
              "Care Coordination → Communicating patient updates or risks to the clinical team",
              "Program Monitoring & Reporting → Tracking engagement metrics and updating dashboards",
              "Resource Delivery → Sharing educational materials, guides, or program content"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "health_educator_crucial_tasks",
            type: "checkbox",
            label: "What are the most crucial, business impacting tasks for your Health educator? (Select up to 3)",
            options: [
              "Patient Education Delivery (Clear & Effective Communication) → Core driver of patient understanding and program value",
              "Patient Engagement & Follow-Ups → Directly impacts retention, adherence, and outcomes",
              "Health Coaching & Behavior Change Support → Drives measurable lifestyle improvements",
              "Documentation Accuracy & Progress Tracking → Ensures continuity of care and program evaluation",
              "Care Plan Reinforcement → Improves adherence to provider recommendations",
              "Coordination with Clinical Team → Prevents gaps in care and improves patient experience",
              "Program Reporting & Outcome Tracking → Supports business insights and client reporting",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "health_educator_tool_proficiency",
            type: "grid",
            label: "How does your Virtual Assistant currently support you when using the following tools?",
            description: "Legend:\nNA – Not applicable: This tool is not part of your VA’s responsibilities\n1 – Guided: Performs tasks with guidance or direction\n2 – Assisted: Performs tasks with occasional guidance\n3 – Independent: Performs tasks independently in most cases\n4 – Advanced: Performs complex tasks independently",
            gridInstruction: "You are not required to complete all rows in the grid. Please select only the tools that apply to your experience or only check the items that apply. You may leave the rest blank.",
            rows: [
              "Electronic Medical Record",
              "Dental PMS",
              "Insurance & Eligibility Tools",
              "Other"
            ],
            rowsWithCheckboxes: {
              "Electronic Medical Record": [
                "Athena (AthenaOne / AthenaNet)",
                "Practice Fusion",
                "eClinicalWorks (eCW)",
                "Epic",
                "Cerner",
                "NextGen Healthcare",
                "Kareo / Tebra",
                "DrChrono",
                "AdvancedMD",
                "Office Ally",
                "Meditech",
                "Allscripts",
                "Other"
              ],
              "Dental PMS": [
                "Dentrix",
                "Eaglesoft",
                "Open Dental",
                "Curve Dental",
                "ClearDent",
                "ABELDent",
                "Tracker",
                "Other"
              ],
              "Insurance & Eligibility Tools": [
                "Availity",
                "NaviNet",
                "Waystar",
                "Change Healthcare",
                "Other"
              ]
            },
            rowsWithInputs: ["Other"],
            columns: ["NA", "1", "2", "3", "4"],
            rateSubOptions: true,
            required: false,
          },
          {
            id: "health_educator_other_tools",
            type: "checkbox",
            label: "What other systems or tools does your VA use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other tools"
            ],
            optionsWithInputs: ["Other tools"],
            required: true,
          }
        ],
      },
      getCompetenciesSection("educator"),
      {
        id: "health-educator-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "health_educator_comm_proficiency",
            type: "grid",
            label: "How effectively does your Virtual Assistant communicate when performing the following tasks?",
            description: "Legend:\nNA – Not applicable: Not part of your VA’s responsibilities\n1 – Requires close guidance: Communication may need clarification or follow-up\n2 – With occasional support: Communication is generally clear with some guidance\n3 – Works independently: Communication is clear and appropriate in most situations\n4 – Highly effective: Communication is clear, structured, and proactive",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "health_educator_comm_essentiality",
            type: "grid",
            label: "For each task, how important is it for your Virtual Assistant to handle it effectively in your day-to-day operations?",
            description: "Legend:\nCore to the role – A key responsibility for your VA\nImportant – Adds value to your workflow but can be developed over time\nNice to have – Helpful, but not required for your VA’s role",
            rows: [
              "Handling client calls → Clear and professional verbal communication",
              "Responding to client emails/messages → Timely and accurate written communication",
              "Posting updates on group chats / team channels → Effective team communication and coordination",
              "Preparing and submitting reports → Clear reporting and information sharing",
              "Managing appointment scheduling & changes → Accurate coordination of schedules and expectations",
              "Updating documentation & records accurately → Reliable and clear documentation for workflow continuity"
            ],
            columns: ["Core to the role", "Important", "Nice to have"],
            required: true,
          },
          {
            id: "health_educator_verbal_comm_importance",
            type: "radio",
            label: "How important is clear verbal communication for your Virtual Assistant to perform effectively in their role?\n(e.g., being easily understood during calls or voice interactions)",
            options: [
              "Core to the role – Clear and easily understood verbal communication is essential for client/patient interactions",
              "Important – Clear communication is preferred; minor variations in speech are manageable",
              "Nice to have – Verbal communication is not a primary requirement for this role"
            ],
            required: true,
          }
        ],
      },
      {
        id: "health-educator-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "health_educator_ai_automation_level",
            type: "radio",
            label: "To what extent is AI currently used in your workflow?",
            options: [
              "Minimal – Most tasks are done manually",
              "Some use – AI supports certain tasks, with VAs handling most of the work",
              "Significant use – AI supports many tasks, with VAs overseeing and executing key steps",
              "Extensive use – AI is embedded across workflows, with VAs focusing on oversight and coordination"
            ],
            required: true,
          },
          {
            id: "health_educator_ai_tool_proficiency",
            type: "grid",
            label: "What level of capability would you like your VA to have when using the following AI tools?",
            description: "Legend:\n1 – Guided: Uses the tool with instructions or support\n2 – Assisted: Uses the tool independently for standard tasks\n3 – Independent: Uses the tool to improve efficiency and output\n4 – Advanced: Uses the tool to optimize workflows and enhance outcomes",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)",
              "Other AI tools"
            ],
            rowsWithInputs: ["Other AI tools"],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "health_educator_ai_future_support",
            type: "checkbox",
            label: "How do you see AI supporting your VA’s role over the next 6–12 months? (Select all that apply)",
            options: [
              "AI will support specific tasks, with VAs continuing to manage core responsibilities",
              "AI will handle more routine work, allowing VAs to focus on higher-value tasks",
              "AI will be more integrated into workflows, with VAs coordinating and overseeing processes",
              "Workflows will remain mostly manual, with limited AI involvement",
              "Not sure / still exploring how AI fits into our workflow"
            ],
            required: true,
          }
        ],
      },
      getLongTermSuccessSection("educator"),
    ],
    "Dental Receptionist": [
      {
        id: "dental-receptionist-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "dental_receptionist_proficiency_grid",
            type: "grid",
            label: "In general, how would you describe the level of support your VAs currently provide in the following areas?",
            description: "Legend:\nNA – Not part of your VA’s current responsibilities\n1 – Guided support: Performs tasks with guidance or direction\n2 – Assisted support: Performs tasks with occasional guidance\n3 – Independent support: Performs tasks independently in most cases\n4 – Advanced support: Performs complex tasks independently",
            rows: [
              "Appointment scheduling & calendar optimization → Managing bookings and maximizing productivity",
              "Patient calls and inquiries → Handling inbound/outbound calls and assisting patients",
              "Insurance verification (Dental-specific) → Checking eligibility, frequencies, and limitations",
              "Patient intake & registration → Collecting and verifying patient information",
              "Treatment plan coordination & scheduling → Booking recommended procedures and tracking acceptance",
              "Patient financial communication → Explaining OOP costs, estimates, and payment options",
              "Payment collection & posting → Collecting co-pays and recording payments",
              "Recall system management → Tracking hygiene recalls and rebooking patients",
              "Document management → Organizing patient records, forms, and consents",
              "Team coordination → Supporting internal workflow and clinical readiness"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "dental_receptionist_crucial_tasks",
            type: "checkbox",
            label: "What are the most crucial, business impacting tasks for your Dental Receptionist? (Select up to 3)",
            options: [
              "Appointment Scheduling & Calendar Optimization → Directly impacts production and provider utilization",
              "Insurance Verification (Accuracy & Completeness) → Prevents billing issues and patient dissatisfaction",
              "Patient Financial Communication (Estimates & OOP) → Drives case acceptance and reduces confusion",
              "Treatment Plan Scheduling & Case Acceptance Support → Converts recommended treatments into booked production",
              "Recall Management (Hygiene & Continuing Care) → Ensures recurring revenue and patient retention",
              "Handling Cancellations & Backfilling the Schedule → Minimizes downtime and lost revenue",
              "Patient Intake & Chart Accuracy → Prevents delays and errors during visits",
              "Payment Collection Support → Improves cash flow and reduces outstanding balances",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "dental_receptionist_tool_proficiency",
            type: "grid",
            label: "How does your Virtual Assistant currently support you when using the following tools?",
            description: "Legend:\nNA – Not applicable: This tool is not part of your VA’s responsibilities\n1 – Guided: Performs tasks with guidance or direction\n2 – Assisted: Performs tasks with occasional guidance\n3 – Independent: Performs tasks independently in most cases\n4 – Advanced: Performs complex tasks independently",
            gridInstruction: "You are not required to complete all rows in the grid. Please select only the tools that apply to your experience or only check the items that apply. You may leave the rest blank.",
            rows: [
              "Electronic Medical Record",
              "Dental PMS",
              "Insurance & Eligibility Tools",
              "Other"
            ],
            rowsWithCheckboxes: {
              "Electronic Medical Record": [
                "Athena (AthenaOne / AthenaNet)",
                "Practice Fusion",
                "eClinicalWorks (eCW)",
                "Epic",
                "Cerner",
                "NextGen Healthcare",
                "Kareo / Tebra",
                "DrChrono",
                "AdvancedMD",
                "Office Ally",
                "Meditech",
                "Allscripts",
                "Other"
              ],
              "Dental PMS": [
                "Dentrix",
                "Eaglesoft",
                "Open Dental",
                "Curve Dental",
                "ClearDent",
                "ABELDent",
                "Tracker",
                "Other"
              ],
              "Insurance & Eligibility Tools": [
                "Availity",
                "NaviNet",
                "Waystar",
                "Change Healthcare",
                "Other"
              ]
            },
            rowsWithInputs: ["Other"],
            columns: ["NA", "1", "2", "3", "4"],
            rateSubOptions: true,
            required: false,
          },
          {
            id: "dental_receptionist_other_tools",
            type: "checkbox",
            label: "What other systems or tools does your VA use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other tools"
            ],
            optionsWithInputs: ["Other tools"],
            required: true,
          }
        ],
      },
      getCompetenciesSection("dental_receptionist"),
      {
        id: "dental-receptionist-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "dental_receptionist_comm_proficiency",
            type: "grid",
            label: "How effectively does your Virtual Assistant communicate when performing the following tasks?",
            description: "Legend:\nNA – Not applicable: Not part of your VA’s responsibilities\n1 – Requires close guidance: Communication may need clarification or follow-up\n2 – With occasional support: Communication is generally clear with some guidance\n3 – Works independently: Communication is clear and appropriate in most situations\n4 – Highly effective: Communication is clear, structured, and proactive",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "dental_receptionist_comm_essentiality",
            type: "grid",
            label: "For each task, how important is it for your Virtual Assistant to handle it effectively in your day-to-day operations?",
            description: "Legend:\nCore to the role – A key responsibility for your VA\nImportant – Adds value to your workflow but can be developed over time\nNice to have – Helpful, but not required for your VA’s role",
            rows: [
              "Handling client calls → Clear and professional verbal communication",
              "Responding to client emails/messages → Timely and accurate written communication",
              "Posting updates on group chats / team channels → Effective team communication and coordination",
              "Preparing and submitting reports → Clear reporting and information sharing",
              "Managing appointment scheduling & changes → Accurate coordination of schedules and expectations",
              "Updating documentation & records accurately → Reliable and clear documentation for workflow continuity"
            ],
            columns: ["Core to the role", "Important", "Nice to have"],
            required: true,
          },
          {
            id: "dental_receptionist_verbal_comm_importance",
            type: "radio",
            label: "How important is clear verbal communication for your Virtual Assistant to perform effectively in their role?\n(e.g., being easily understood during calls or voice interactions)",
            options: [
              "Core to the role – Clear and easily understood verbal communication is essential for client/patient interactions",
              "Important – Clear communication is preferred; minor variations in speech are manageable",
              "Nice to have – Verbal communication is not a primary requirement for this role"
            ],
            required: true,
          }
        ],
      },
      {
        id: "dental-receptionist-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "dental_receptionist_ai_automation_level",
            type: "radio",
            label: "To what extent is AI currently used in your workflow?",
            options: [
              "Minimal – Most tasks are done manually",
              "Some use – AI supports certain tasks, with VAs handling most of the work",
              "Significant use – AI supports many tasks, with VAs overseeing and executing key steps",
              "Extensive use – AI is embedded across workflows, with VAs focusing on oversight and coordination"
            ],
            required: true,
          },
          {
            id: "dental_receptionist_ai_tool_proficiency",
            type: "grid",
            label: "What level of capability would you like your VA to have when using the following AI tools?",
            description: "Legend:\n1 – Guided: Uses the tool with instructions or support\n2 – Assisted: Uses the tool independently for standard tasks\n3 – Independent: Uses the tool to improve efficiency and output\n4 – Advanced: Uses the tool to optimize workflows and enhance outcomes",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)",
              "Other AI tools"
            ],
            rowsWithInputs: ["Other AI tools"],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "dental_receptionist_ai_future_support",
            type: "checkbox",
            label: "How do you see AI supporting your VA’s role over the next 6–12 months? (Select all that apply)",
            options: [
              "AI will support specific tasks, with VAs continuing to manage core responsibilities",
              "AI will handle more routine work, allowing VAs to focus on higher-value tasks",
              "AI will be more integrated into workflows, with VAs coordinating and overseeing processes",
              "Workflows will remain mostly manual, with limited AI involvement",
              "Not sure / still exploring how AI fits into our workflow"
            ],
            required: true,
          }
        ],
      },
      getLongTermSuccessSection("dental_receptionist"),
    ],
    "Dental Biller": [
      {
        id: "dental-biller-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "dental_biller_proficiency_grid",
            type: "grid",
            label: "In general, how would you describe the level of support your VAs currently provide in the following areas?",
            description: "Legend:\nNA – Not part of your VA’s current responsibilities\n1 – Guided support: Performs tasks with guidance or direction\n2 – Assisted support: Performs tasks with occasional guidance\n3 – Independent support: Performs tasks independently in most cases\n4 – Advanced support: Performs complex tasks independently",
            rows: [
              "Insurance verification (Dental-specific) → Checking eligibility, frequencies, and limitations",
              "Treatment estimate preparation → Creating accurate estimates based on coverage",
              "Claim creation & submission (CDT codes) → Preparing and submitting clean claims",
              "Attachment management (X-rays, narratives) → Ensuring required documentation is included",
              "Insurance payment posting (EOB/ERA) → Accurately posting payments and adjustments",
              "Denial management & resolution → Reviewing, correcting, and resubmitting denied claims",
              "Accounts Receivable (AR) follow-up → Following up on unpaid or delayed claims",
              "Aging report management → Prioritizing claims based on aging (30/60/90+ days)",
              "Patient billing & statements → Generating and sending patient statements",
              "Billing reports & KPI tracking → Monitoring collections, AR, and denial trends"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "dental_biller_crucial_tasks",
            type: "checkbox",
            label: "What are the most crucial, business impacting tasks for your Dental Biller? (Select up to 3)",
            options: [
              "Claim Submission Accuracy (Clean Claims with Attachments) → Directly impacts approval rate and reimbursement speed",
              "Denial Management & Resolution → Recovers lost revenue and reduces write-offs",
              "Accounts Receivable (AR) Follow-Up → Drives collections and reduces aging",
              "Insurance Verification & Accurate Estimates → Prevents claim denials and patient dissatisfaction",
              "Payment Posting Accuracy (Insurance & Patient) → Ensures financial accuracy and reporting integrity",
              "Attachment Management (X-rays, Narratives) → Critical for approval of major procedures",
              "Appeals & Resubmissions → Recovers high-value denied claims",
              "Patient Billing & Collections Support → Improves cash flow and reduces outstanding balances",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "dental_biller_tool_proficiency",
            type: "grid",
            label: "How does your Virtual Assistant currently support you when using the following tools?",
            description: "Legend:\nNA – Not applicable: This tool is not part of your VA’s responsibilities\n1 – Guided: Performs tasks with guidance or direction\n2 – Assisted: Performs tasks with occasional guidance\n3 – Independent: Performs tasks independently in most cases\n4 – Advanced: Performs complex tasks independently",
            gridInstruction: "You are not required to complete all rows in the grid. Please select only the tools that apply to your experience or only check the items that apply. You may leave the rest blank.",
            rows: [
              "Electronic Medical Record",
              "Dental PMS",
              "Insurance & Eligibility Tools",
              "Other"
            ],
            rowsWithCheckboxes: {
              "Electronic Medical Record": [
                "Athena (AthenaOne / AthenaNet)",
                "Practice Fusion",
                "eClinicalWorks (eCW)",
                "Epic",
                "Cerner",
                "NextGen Healthcare",
                "Kareo / Tebra",
                "DrChrono",
                "AdvancedMD",
                "Office Ally",
                "Meditech",
                "Allscripts",
                "Other"
              ],
              "Dental PMS": [
                "Dentrix",
                "Eaglesoft",
                "Open Dental",
                "Curve Dental",
                "ClearDent",
                "ABELDent",
                "Tracker",
                "Other"
              ],
              "Insurance & Eligibility Tools": [
                "Availity",
                "NaviNet",
                "Waystar",
                "Change Healthcare",
                "Other"
              ]
            },
            rowsWithInputs: ["Other"],
            columns: ["NA", "1", "2", "3", "4"],
            rateSubOptions: true,
            required: false,
          },
          {
            id: "dental_biller_other_tools",
            type: "checkbox",
            label: "What other systems or tools does your VA use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other tools"
            ],
            optionsWithInputs: ["Other tools"],
            required: true,
          }
        ],
      },
      getCompetenciesSection("dental_biller"),
      {
        id: "dental-biller-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "dental_biller_comm_proficiency",
            type: "grid",
            label: "How effectively does your Virtual Assistant communicate when performing the following tasks?",
            description: "Legend:\nNA – Not applicable: Not part of your VA’s responsibilities\n1 – Requires close guidance: Communication may need clarification or follow-up\n2 – With occasional support: Communication is generally clear with some guidance\n3 – Works independently: Communication is clear and appropriate in most situations\n4 – Highly effective: Communication is clear, structured, and proactive",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "dental_biller_comm_essentiality",
            type: "grid",
            label: "For each task, how important is it for your Virtual Assistant to handle it effectively in your day-to-day operations?",
            description: "Legend:\nCore to the role – A key responsibility for your VA\nImportant – Adds value to your workflow but can be developed over time\nNice to have – Helpful, but not required for your VA’s role",
            rows: [
              "Handling client calls → Clear and professional verbal communication",
              "Responding to client emails/messages → Timely and accurate written communication",
              "Posting updates on group chats / team channels → Effective team communication and coordination",
              "Preparing and submitting reports → Clear reporting and information sharing",
              "Managing appointment scheduling & changes → Accurate coordination of schedules and expectations",
              "Updating documentation & records accurately → Reliable and clear documentation for workflow continuity"
            ],
            columns: ["Core to the role", "Important", "Nice to have"],
            required: true,
          },
          {
            id: "dental_biller_verbal_comm_importance",
            type: "radio",
            label: "How important is clear verbal communication for your Virtual Assistant to perform effectively in their role?\n(e.g., being easily understood during calls or voice interactions)",
            options: [
              "Core to the role – Clear and easily understood verbal communication is essential for client/patient interactions",
              "Important – Clear communication is preferred; minor variations in speech are manageable",
              "Nice to have – Verbal communication is not a primary requirement for this role"
            ],
            required: true,
          }
        ],
      },
      {
        id: "dental-biller-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "dental_biller_ai_automation_level",
            type: "radio",
            label: "To what extent is AI currently used in your workflow?",
            options: [
              "Minimal – Most tasks are done manually",
              "Some use – AI supports certain tasks, with VAs handling most of the work",
              "Significant use – AI supports many tasks, with VAs overseeing and executing key steps",
              "Extensive use – AI is embedded across workflows, with VAs focusing on oversight and coordination"
            ],
            required: true,
          },
          {
            id: "dental_biller_ai_tool_proficiency",
            type: "grid",
            label: "What level of capability would you like your VA to have when using the following AI tools?",
            description: "Legend:\n1 – Guided: Uses the tool with instructions or support\n2 – Assisted: Uses the tool independently for standard tasks\n3 – Independent: Uses the tool to improve efficiency and output\n4 – Advanced: Uses the tool to optimize workflows and enhance outcomes",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)",
              "Other AI tools"
            ],
            rowsWithInputs: ["Other AI tools"],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "dental_biller_ai_future_support",
            type: "checkbox",
            label: "How do you see AI supporting your VA’s role over the next 6–12 months? (Select all that apply)",
            options: [
              "AI will support specific tasks, with VAs continuing to manage core responsibilities",
              "AI will handle more routine work, allowing VAs to focus on higher-value tasks",
              "AI will be more integrated into workflows, with VAs coordinating and overseeing processes",
              "Workflows will remain mostly manual, with limited AI involvement",
              "Not sure / still exploring how AI fits into our workflow"
            ],
            required: true,
          }
        ],
      },
      getLongTermSuccessSection("dental_biller"),
    ],
    "Executive Assistant VA": [
      {
        id: "ea-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "ea_proficiency_grid",
            type: "grid",
            label: "In general, how would you describe the level of support your VAs currently provide in the following areas?",
            description: "Legend:\nNA – Not part of your VA’s current responsibilities\n1 – Guided support: Performs tasks with guidance or direction\n2 – Assisted support: Performs tasks with occasional guidance\n3 – Independent support: Performs tasks independently in most cases\n4 – Advanced support: Performs complex tasks independently",
            rows: [
              "Calendar & Priority Management → Managing executive calendar, meetings, and priorities",
              "Inbox & Communication Management → Organizing inbox, drafting replies, and prioritizing messages",
              "Meeting Coordination → Scheduling across multiple stakeholders and time zones",
              "Document & Report Preparation → Creating reports, presentations, and maintaining files",
              "Task Tracking & Follow-Up → Monitoring action items, deadlines, and deliverables",
              "Project Coordination Support → Assisting in managing projects and stakeholder updates",
              "Research & Information Gathering → Conducting research to support decision-making",
              "Travel & Logistics Coordination → Booking travel and organizing meeting details"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "ea_crucial_tasks",
            type: "checkbox",
            label: "What are the most crucial, business impacting tasks for your Executive Assistant? (Select up to 3)",
            options: [
              "Calendar & Priority Management → Directly impacts executive productivity and time utilization",
              "Inbox & Communication Management → Ensures timely responses and effective communication flow",
              "Task Tracking & Follow-Up Management → Prevents missed deadlines and ensures execution",
              "Meeting Coordination & Preparation → Keeps operations organized and efficient",
              "Executive Briefing & Reporting → Supports decision-making with clear insights",
              "Cross-Functional Coordination → Ensures alignment across teams and projects",
              "Document & Information Management → Maintains organization and accessibility of key information",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "ea_tool_proficiency",
            type: "grid",
            label: "How does your Virtual Assistant currently support you when using the following tools?",
            description: "Legend:\nNA – Not applicable: This tool is not part of your VA’s responsibilities\n1 – Guided: Performs tasks with guidance or direction\n2 – Assisted: Performs tasks with occasional guidance\n3 – Independent: Performs tasks independently in most cases\n4 – Advanced: Performs complex tasks independently",
            gridInstruction: "You are not required to complete all rows in the grid. Please select only the tools that apply to your experience or only check the items that apply. You may leave the rest blank.",
            rows: [
              "Electronic Medical Record",
              "Dental PMS",
              "Insurance & Eligibility Tools",
              "Other"
            ],
            rowsWithCheckboxes: {
              "Electronic Medical Record": [
                "Athena (AthenaOne / AthenaNet)",
                "Practice Fusion",
                "eClinicalWorks (eCW)",
                "Epic",
                "Cerner",
                "NextGen Healthcare",
                "Kareo / Tebra",
                "DrChrono",
                "AdvancedMD",
                "Office Ally",
                "Meditech",
                "Allscripts",
                "Other"
              ],
              "Dental PMS": [
                "Dentrix",
                "Eaglesoft",
                "Open Dental",
                "Curve Dental",
                "ClearDent",
                "ABELDent",
                "Tracker",
                "Other"
              ],
              "Insurance & Eligibility Tools": [
                "Availity",
                "NaviNet",
                "Waystar",
                "Change Healthcare",
                "Other"
              ]
            },
            rowsWithInputs: ["Other"],
            columns: ["NA", "1", "2", "3", "4"],
            rateSubOptions: true,
            required: true,
          },
          {
            id: "ea_other_tools",
            type: "checkbox",
            label: "What other systems or tools does your VA use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other tools"
            ],
            optionsWithInputs: ["Other tools"],
            required: true,
          }
        ],
      },
      getCompetenciesSection("ea"),
      {
        id: "ea-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "ea_comm_proficiency",
            type: "grid",
            label: "How effectively does your Virtual Assistant communicate when performing the following tasks?",
            description: "Legend:\nNA – Not applicable: Not part of your VA’s responsibilities\n1 – Requires close guidance: Communication may need clarification or follow-up\n2 – With occasional support: Communication is generally clear with some guidance\n3 – Works independently: Communication is clear and appropriate in most situations\n4 – Highly effective: Communication is clear, structured, and proactive",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "ea_comm_essentiality",
            type: "grid",
            label: "For each task, how important is it for your Virtual Assistant to handle it effectively in your day-to-day operations?",
            description: "Legend:\nCore to the role – A key responsibility for your VA\nImportant – Adds value to your workflow but can be developed over time\nNice to have – Helpful, but not required for your VA’s role",
            rows: [
              "Handling client calls → Clear and professional verbal communication",
              "Responding to client emails/messages → Timely and accurate written communication",
              "Posting updates on group chats / team channels → Effective team communication and coordination",
              "Preparing and submitting reports → Clear reporting and information sharing",
              "Managing appointment scheduling & changes → Accurate coordination of schedules and expectations",
              "Updating documentation & records accurately → Reliable and clear documentation for workflow continuity"
            ],
            columns: ["Core to the role", "Important", "Nice to have"],
            required: true,
          },
          {
            id: "ea_verbal_comm_importance",
            type: "radio",
            label: "How important is clear verbal communication for your Virtual Assistant to perform effectively in their role?\n(e.g., being easily understood during calls or voice interactions)",
            options: [
              "Core to the role – Clear and easily understood verbal communication is essential for client/patient interactions",
              "Important – Clear communication is preferred; minor variations in speech are manageable",
              "Nice to have – Verbal communication is not a primary requirement for this role"
            ],
            required: true,
          }
        ],
      },
      {
        id: "ea-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "ea_ai_automation_level",
            type: "radio",
            label: "To what extent is AI currently used in your workflow?",
            options: [
              "Minimal – Most tasks are done manually",
              "Some use – AI supports certain tasks, with VAs handling most of the work",
              "Significant use – AI supports many tasks, with VAs overseeing and executing key steps",
              "Extensive use – AI is embedded across workflows, with VAs focusing on oversight and coordination"
            ],
            required: true,
          },
          {
            id: "ea_ai_tool_proficiency",
            type: "grid",
            label: "What level of capability would you like your VA to have when using the following AI tools?",
            description: "Legend:\n1 – Guided: Uses the tool with instructions or support\n2 – Assisted: Uses the tool independently for standard tasks\n3 – Independent: Uses the tool to improve efficiency and output\n4 – Advanced: Uses the tool to optimize workflows and enhance outcomes",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)",
              "Other AI tools"
            ],
            rowsWithInputs: ["Other AI tools"],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "ea_ai_future_support",
            type: "checkbox",
            label: "How do you see AI supporting your VA’s role over the next 6–12 months? (Select all that apply)",
            options: [
              "AI will support specific tasks, with VAs continuing to manage core responsibilities",
              "AI will handle more routine work, allowing VAs to focus on higher-value tasks",
              "AI will be more integrated into workflows, with VAs coordinating and overseeing processes",
              "Workflows will remain mostly manual, with limited AI involvement",
              "Not sure / still exploring how AI fits into our workflow"
            ],
            required: true,
          }
        ],
      },
      getLongTermSuccessSection("ea"),
    ],
    "General Business VA": [
      {
        id: "gb-tasks-workflow",
        title: "PART II - Tasks and Workflow",
        questions: [
          {
            id: "gb_proficiency_grid",
            type: "grid",
            label: "In general, how would you describe the level of support your VAs currently provide in the following areas?",
            description: "Legend:\nNA – Not part of your VA’s current responsibilities\n1 – Guided support: Performs tasks with guidance or direction\n2 – Assisted support: Performs tasks with occasional guidance\n3 – Independent support: Performs tasks independently in most cases\n4 – Advanced support: Performs complex tasks independently",
            rows: [
              "Calendar & Priority Management → Managing executive calendar, meetings, and priorities",
              "Inbox & Communication Management → Organizing inbox, drafting replies, and prioritizing messages",
              "Meeting Coordination → Scheduling across multiple stakeholders and time zones",
              "Document & Report Preparation → Creating reports, presentations, and maintaining files",
              "Task Tracking & Follow-Up → Monitoring action items, deadlines, and deliverables",
              "Project Coordination Support → Assisting in managing projects and stakeholder updates",
              "Research & Information Gathering → Conducting research to support decision-making",
              "Travel & Logistics Coordination → Booking travel and organizing meeting details"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "gb_crucial_tasks",
            type: "checkbox",
            label: "What are the most crucial, business impacting tasks for your General Business VA? (Select up to 3)",
            options: [
              "Calendar & Priority Management → Directly impacts executive productivity and time utilization",
              "Inbox & Communication Management → Ensures timely responses and effective communication flow",
              "Task Tracking & Follow-Up Management → Prevents missed deadlines and ensures execution",
              "Meeting Coordination & Preparation → Keeps operations organized and efficient",
              "Executive Briefing & Reporting → Supports decision-making with clear insights",
              "Cross-Functional Coordination → Ensures alignment across teams and projects",
              "Document & Information Management → Maintains organization and accessibility of key information",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "gb_tool_proficiency",
            type: "grid",
            label: "How does your Virtual Assistant currently support you when using the following tools?",
            description: "Legend:\nNA – Not applicable: This tool is not part of your VA’s responsibilities\n1 – Guided: Performs tasks with guidance or direction\n2 – Assisted: Performs tasks with occasional guidance\n3 – Independent: Performs tasks independently in most cases\n4 – Advanced: Performs complex tasks independently",
            gridInstruction: "You are not required to complete all rows in the grid. Please select only the tools that apply to your experience or only check the items that apply. You may leave the rest blank.",
            rows: [
              "Electronic Medical Record",
              "Dental PMS",
              "Insurance & Eligibility Tools",
              "Other"
            ],
            rowsWithCheckboxes: {
              "Electronic Medical Record": [
                "Athena (AthenaOne / AthenaNet)",
                "Practice Fusion",
                "eClinicalWorks (eCW)",
                "Epic",
                "Cerner",
                "NextGen Healthcare",
                "Kareo / Tebra",
                "DrChrono",
                "AdvancedMD",
                "Office Ally",
                "Meditech",
                "Allscripts",
                "Other"
              ],
              "Dental PMS": [
                "Dentrix",
                "Eaglesoft",
                "Open Dental",
                "Curve Dental",
                "ClearDent",
                "ABELDent",
                "Tracker",
                "Other"
              ],
              "Insurance & Eligibility Tools": [
                "Availity",
                "NaviNet",
                "Waystar",
                "Change Healthcare",
                "Other"
              ]
            },
            rowsWithInputs: ["Other"],
            columns: ["NA", "1", "2", "3", "4"],
            rateSubOptions: true,
            required: true,
          },
          {
            id: "gb_other_tools",
            type: "checkbox",
            label: "What other systems or tools does your VA use in your workflow? (Select all that apply)",
            options: [
              "VoIP / Phone Systems",
              "CRM Systems",
              "Reporting / Analytics Tools",
              "Spreadsheets (Google Sheets, Excel)",
              "Project Management Tools",
              "Scheduling / Calendar Tools",
              "HRIS / HR Management Systems",
              "Email Management Tools",
              "File Management / Cloud Storage (Google Drive, Dropbox)",
              "Internal Communication Tools (Slack, Microsoft Teams)",
              "Task Management Tools",
              "Documentation / Knowledge Base Tools",
              "Other tools"
            ],
            optionsWithInputs: ["Other tools"],
            required: true,
          }
        ],
      },
      getCompetenciesSection("gb"),
      {
        id: "gb-communication-skills",
        title: "Part IV - Communication Skills",
        questions: [
          {
            id: "gb_comm_proficiency",
            type: "grid",
            label: "How effectively does your Virtual Assistant communicate when performing the following tasks?",
            description: "Legend:\nNA – Not applicable: Not part of your VA’s responsibilities\n1 – Requires close guidance: Communication may need clarification or follow-up\n2 – With occasional support: Communication is generally clear with some guidance\n3 – Works independently: Communication is clear and appropriate in most situations\n4 – Highly effective: Communication is clear, structured, and proactive",
            rows: [
              "Handling client calls → Communicating clearly, professionally, and confidently during calls",
              "Responding to client emails/messages → Providing timely, accurate, and well-written responses",
              "Posting updates on group chats / team channels → Sharing clear, concise, and actionable updates with the team",
              "Preparing and submitting reports → Presenting information, updates, and data in a clear and organized manner",
              "Managing appointment scheduling & changes → Communicating schedules, updates, and changes accurately and clearly",
              "Updating documentation & records accurately → Recording complete, accurate, and easy-to-understand information"
            ],
            columns: ["NA", "1", "2", "3", "4"],
            required: true,
          },
          {
            id: "gb_comm_essentiality",
            type: "grid",
            label: "For each task, how important is it for your Virtual Assistant to handle it effectively in your day-to-day operations?",
            description: "Legend:\nCore to the role – A key responsibility for your VA\nImportant – Adds value to your workflow but can be developed over time\nNice to have – Helpful, but not required for your VA’s role",
            rows: [
              "Handling client calls → Clear and professional verbal communication",
              "Responding to client emails/messages → Timely and accurate written communication",
              "Posting updates on group chats / team channels → Effective team communication and coordination",
              "Preparing and submitting reports → Clear reporting and information sharing",
              "Managing appointment scheduling & changes → Accurate coordination of schedules and expectations",
              "Updating documentation & records accurately → Reliable and clear documentation for workflow continuity"
            ],
            columns: ["Core to the role", "Important", "Nice to have"],
            required: true,
          },
          {
            id: "gb_verbal_comm_importance",
            type: "radio",
            label: "How important is clear verbal communication for your Virtual Assistant to perform effectively in their role?\n(e.g., being easily understood during calls or voice interactions)",
            options: [
              "Core to the role – Clear and easily understood verbal communication is essential for client/patient interactions",
              "Important – Clear communication is preferred; minor variations in speech are manageable",
              "Nice to have – Verbal communication is not a primary requirement for this role"
            ],
            required: true,
          }
        ],
      },
      {
        id: "gb-ai-essentials",
        title: "Part V - AI Essentials",
        questions: [
          {
            id: "gb_ai_automation_level",
            type: "radio",
            label: "To what extent is AI currently used in your workflow?",
            options: [
              "Minimal – Most tasks are done manually",
              "Some use – AI supports certain tasks, with VAs handling most of the work",
              "Significant use – AI supports many tasks, with VAs overseeing and executing key steps",
              "Extensive use – AI is embedded across workflows, with VAs focusing on oversight and coordination"
            ],
            required: true,
          },
          {
            id: "gb_ai_tool_proficiency",
            type: "grid",
            label: "What level of capability would you like your VA to have when using the following AI tools?",
            description: "Legend:\n1 – Guided: Uses the tool with instructions or support\n2 – Assisted: Uses the tool independently for standard tasks\n3 – Independent: Uses the tool to improve efficiency and output\n4 – Advanced: Uses the tool to optimize workflows and enhance outcomes",
            rows: [
              "Generative AI (e.g., ChatGPT, Claude, Gemini)",
              "Healthcare-specific AI / EMR systems (e.g., Dentrix, Epic, Athenahealth)",
              "Data analysis & reporting tools with AI (e.g., Excel / Sheets AI features, dashboards)",
              "Task & workflow automation AI (e.g., scheduling bots, reminders)",
              "Other AI tools"
            ],
            rowsWithInputs: ["Other AI tools"],
            columns: ["1", "2", "3", "4"],
            required: true,
          },
          {
            id: "gb_ai_future_support",
            type: "checkbox",
            label: "How do you see AI supporting your VA’s role over the next 6–12 months? (Select all that apply)",
            options: [
              "AI will support specific tasks, with VAs continuing to manage core responsibilities",
              "AI will handle more routine work, allowing VAs to focus on higher-value tasks",
              "AI will be more integrated into workflows, with VAs coordinating and overseeing processes",
              "Workflows will remain mostly manual, with limited AI involvement",
              "Not sure / still exploring how AI fits into our workflow"
            ],
            required: true,
          }
        ],
      },
      getLongTermSuccessSection("gb"),
    ],
    "Other": getOtherRoleSections(),
  },
};

export const SUPPORT_SURVEY_SCHEMA: SupportSurveySchema = {
  initial: {
    id: "support-role",
    title: "Support Role Information",
    questions: [
      {
        id: "support_name",
        type: "text",
        label: "Your Name",
        required: true,
      },
      {
        id: "support_role",
        type: "radio",
        label: "What is your role in MMM Support?",
        options: ["CDVO and OS", "Sales and Placement"],
        required: true,
      },
    ],
  },
  roleSections: {
    "CDVO and OS": [
      {
        id: "cdvo-performance",
        title: "VA READINESS & PERFORMANCE",
        questions: [
          {
            id: "va_readiness_rating",
            type: "scale",
            label: "How would you rate the overall readiness of VAs endorsed to clients since January 2026?",
            description: "(1 = Not ready, 4 = Fully client-ready)",
            min: 1,
            max: 4,
            required: true,
          },
          {
            id: "common_gaps_post_placement",
            type: "checkbox",
            label: "What are the most common gaps you observe in VAs after placement? (Select up to 3)",
            options: [
              "Communication skills",
              "Technical skills (role-specific tasks)",
              "System/tool proficiency (EMR, portals)",
              "Understanding of workflows",
              "Attention to detail",
              "Time management",
              "Ability to follow instructions",
              "Proactiveness / initiative",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "struggling_roles",
            type: "checkbox",
            label: "Which VA roles tend to struggle the most post-placement? (Select up to 3)",
            options: [
              "Medical Receptionist",
              "Medical Administrative Assistant",
              "Medical Biller",
              "Medical Scribe",
              "Health Educator",
              "Dental Receptionist",
              "Dental Biller"
            ],
            maxSelections: 3,
            required: true,
          }
        ]
      },
      {
        id: "cdvo-expectations",
        title: "CLIENT EXPECTATION VS VA PERFORMANCE",
        questions: [
          {
            id: "mismatch_areas",
            type: "checkbox",
            label: "Where do you see the biggest mismatch between client expectations and VA performance? (Select up to 3)",
            options: [
              "Communication skills",
              "Technical skills",
              "Speed of execution",
              "Accuracy of work",
              "Workflow understanding",
              "System proficiency",
              "Ability to work independently",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "common_client_complaints",
            type: "checkbox",
            label: "What are the most common client complaints or feedback? (Select up to 3)",
            options: [
              "Poor communication or language barriers",
              "Errors in tasks (scheduling, billing, etc.)",
              "Slow turnaround time",
              "Lack of initiative",
              "Difficulty understanding instructions",
              "Inconsistent performance",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "high_performer_feedback",
            type: "textarea",
            label: "What feedback do clients most frequently give about high-performing VAs?",
            required: true,
          }
        ]
      },
      {
        id: "cdvo-onboarding",
        title: "ONBOARDING & PLACEMENT CHALLENGES",
        questions: [
          {
            id: "onboarding_challenges",
            type: "checkbox",
            label: "What challenges do you encounter during onboarding or placement? (Select up to 3)",
            options: [
              "VA not fully prepared for client workflow",
              "Lack of role-specific knowledge",
              "Communication issues",
              "Misalignment of expectations",
              "Limited client onboarding information",
              "Difficulty matching VA skill level to client needs",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "mismatch_frequency",
            type: "radio",
            label: "How often do you see mismatches between VA skills and client requirements?",
            options: ["Very often", "Sometimes", "Rarely"],
            required: true,
          },
          {
            id: "missing_placement_info",
            type: "textarea",
            label: "What information is often missing or unclear during placement?",
            required: true,
          }
        ]
      },
      {
        id: "cdvo-cancellation",
        title: "CANCELLATION INSIGHTS",
        questions: [
          {
            id: "roles_most_cancelled",
            type: "checkbox",
            label: "Which VA roles do you consider to be at the highest risk for cancellations? (Select up to 3)",
            options: [
              "Medical Receptionist",
              "Medical Administrative Assistant",
              "Medical Biller",
              "Medical Scribe",
              "Health Educator",
              "Dental Receptionist",
              "Dental Biller"
            ],
            maxSelections: 3,
            required: true,
          },
          {
            id: "cancellation_reasons",
            type: "checkbox",
            label: "What are the most common reasons VAs get cancelled? (Select up to 3)",
            options: [
              "Poor communication skills",
              "Lack of technical skills",
              "Inability to work independently",
              "Slow task completion",
              "Errors or inaccuracy in tasks",
              "Poor understanding of workflows",
              "Low confidence",
              "Client expectation mismatch",
              "Attendance or reliability issues",
              "Improper use or over-reliance on AI tools",
              "Client shifted to AI tools / automation (AI takeover)",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "cancellation_stage",
            type: "radio",
            label: "At what stage do cancellations most commonly happen? (Select one)",
            options: [
              "During onboarding",
              "First 2 weeks",
              "First 30 days",
              "1–3 months",
              "3–6 months",
              "Beyond 6 months"
            ],
            required: true,
          }
        ]
      },
      {
        id: "cdvo-reassessment",
        title: "REASSESSMENT & RE-PLACEMENT",
        questions: [
          {
            id: "placeable_after_cancellation",
            type: "radio",
            label: "After a VA is cancelled, how often are they still placeable?",
            options: [
              "Always placeable",
              "Sometimes placeable",
              "Rarely placeable",
              "Not placeable"
            ],
            required: true,
          },
          {
            id: "replacement_determination_factors",
            type: "checkbox",
            label: "What factors determine if a cancelled VA is suitable for re-endorsement to a new client? (Select UP TO 3).",
            options: [
              "Communication improvement",
              "Technical skill improvement",
              "Responsiveness to coaching and feedback",
              "Attitude and willingness to improve",
              "Previous performance level",
              "Fit with future client requirements / role alignment",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          }
        ]
      },
      {
        id: "cdvo-technical-gaps",
        title: "TECHNICAL SKILLS GAPS",
        questions: [
          {
            id: "lacking_technical_skills",
            type: "checkbox",
            label: "Which technical skills are most lacking in VAs? (Select up to 3)",
            options: [
              "Appointment scheduling",
              "Insurance verification",
              "Prior authorization",
              "Claims processing / billing",
              "Documentation / charting",
              "Patient communication handling",
              "Use of EMR systems",
              "Payer portal navigation",
              "Data entry accuracy",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "technical_struggle_reasons",
            type: "checkbox",
            label: "Why do you think VAs struggle with technical skills? (Select up to 3)",
            options: [
              "No prior VA or healthcare experience",
              "Lack of hands-on practice",
              "Limited exposure to real systems",
              "Inconsistent client workflows",
              "Lack of confidence",
              "Poor understanding of end-to-end processes",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          }
        ]
      },
      {
        id: "cdvo-training-readiness",
        title: "TRAINING & READINESS GAPS (ROLE-SPECIFIC – CORE SECTION)",
        questions: [
          {
            id: "role_specific_training_needs",
            type: "grid",
            label: "Across the roles you support, which specific skills or tasks require the most additional training?",
            description: "👉 Select up to 3 per role based on highest training need",
            rows: [
              "Medical Receptionist: Call handling & phone etiquette",
              "Medical Receptionist: Appointment scheduling",
              "Medical Receptionist: Insurance verification",
              "Medical Receptionist: Patient intake / registration",
              "Medical Receptionist: Follow-ups & reminders",
              "Medical Receptionist: Payment collection",
              "Medical Receptionist: Referral coordination",
              "Medical Receptionist: Medical records management",
              "Medical Administrative Assistant: Email & inbox management",
              "Medical Administrative Assistant: Calendar management",
              "Medical Administrative Assistant: Document handling / file organization",
              "Medical Administrative Assistant: Prior authorization coordination",
              "Medical Administrative Assistant: Insurance verification support",
              "Medical Administrative Assistant: Report preparation / data tracking",
              "Medical Administrative Assistant: Provider support tasks",
              "Medical Administrative Assistant: Task prioritization",
              "Medical Biller: Insurance verification",
              "Medical Biller: Claims submission",
              "Medical Biller: Payment posting",
              "Medical Biller: Denial management",
              "Medical Biller: AR follow-ups",
              "Medical Biller: Payer portal navigation",
              "Medical Biller: Coding basics (ICD-10/CPT)",
              "Medical Biller: Patient billing communication",
              "Medical Scribe: Real-time documentation",
              "Medical Scribe: SOAP note creation",
              "Medical Scribe: Medical terminology",
              "Medical Scribe: EMR navigation",
              "Medical Scribe: Provider workflow understanding",
              "Medical Scribe: Accuracy of notes",
              "Medical Scribe: Speed of documentation",
              "Medical Scribe: Listening comprehension",
              "Health Educator: Patient education delivery",
              "Health Educator: Coaching & motivational interviewing",
              "Health Educator: Patient engagement",
              "Health Educator: Chronic disease knowledge",
              "Health Educator: Documentation & tracking",
              "Health Educator: Care plan reinforcement",
              "Health Educator: Communication & empathy",
              "Health Educator: Follow-ups",
              "Dental Receptionist: Appointment scheduling",
              "Dental Receptionist: Insurance verification",
              "Dental Receptionist: Treatment coordination",
              "Dental Receptionist: Patient communication",
              "Dental Receptionist: Recall & follow-ups",
              "Dental Receptionist: Dental terminology",
              "Dental Receptionist: Chart review",
              "Dental Receptionist: Payment collection",
              "Dental Biller: Insurance breakdown",
              "Dental Biller: Claim submission",
              "Dental Biller: Payment posting",
              "Dental Biller: Denial management",
              "Dental Biller: AR follow-ups",
              "Dental Biller: CDT coding",
              "Dental Biller: Insurance follow-ups",
              "Dental Biller: Treatment estimates"
            ],
            columns: [
              "No training needed",
              "Minor improvement needed",
              "Moderate training needed",
              "High training priority"
            ],
            required: true,
          },
          {
            id: "priority_role_for_training",
            type: "radio",
            label: "Which ONE role should we prioritize for immediate training improvement?",
            options: [
              "Medical Receptionist",
              "Medical Admin",
              "Medical Biller",
              "Medical Scribe",
              "Health Educator",
              "Dental Receptionist",
              "Dental Biller"
            ],
            required: true,
          },
          {
            id: "priority_role_reason",
            type: "textarea",
            label: "Why does this role need immediate focus?",
            required: true,
          }
        ]
      },
      {
        id: "cdvo-communication",
        title: "COMMUNICATION & CLIENT MANAGEMENT",
        questions: [
          {
            id: "observed_comm_challenges",
            type: "checkbox",
            label: "What communication challenges do you observe most often? (Select up to 3)",
            options: [
              "Long pauses or hesitation",
              "Difficulty explaining processes",
              "Poor grammar or sentence structure",
              "Lack of confidence",
              "Misunderstanding client instructions",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "comm_criticality",
            type: "scale",
            label: "How critical is communication in determining VA success?",
            description: "(1 = Not important, 4 = Extremely important)",
            min: 1,
            max: 4,
            required: true,
          }
        ]
      },
      {
        id: "cdvo-recommendations",
        title: "RECOMMENDATIONS & IMPROVEMENTS",
        questions: [
          {
            id: "readiness_improvement_suggestions",
            type: "textarea",
            label: "What changes would improve VA readiness before client endorsement?",
            required: true,
          },
          {
            id: "additional_feedback",
            type: "textarea",
            label: "Any additional feedback or suggestions?",
            required: true,
          }
        ]
      },
    ],
    "Sales and Placement": [
      {
        id: "sales-client-needs",
        title: "CLIENT NEEDS & EXPECTATIONS",
        questions: [
          {
            id: "client_expectations_clarity",
            type: "scale",
            label: "Based on your interactions, how clearly do clients communicate their expectations for a VA?",
            description: "(1 = Not clear, 4 = Very clear)",
            min: 1,
            max: 4,
            required: true,
          },
          {
            id: "common_client_expectations",
            type: "checkbox",
            label: "What are the most common expectations clients have for VAs? (Select up to 3)",
            options: [
              "Strong communication skills",
              "Ability to work independently",
              "Relevant experience in the role",
              "Accuracy and attention to detail",
              "Fast turnaround time",
              "Familiarity with tools/systems",
              "Problem-solving ability",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "common_client_pain_points",
            type: "checkbox",
            label: "What are the most common pain points clients are trying to solve by hiring a VA? (Select up to 3)",
            options: [
              "High administrative workload",
              "Delays in task completion",
              "Staffing shortages",
              "Billing and revenue cycle issues",
              "Poor patient/customer communication",
              "Inefficient workflows",
              "Burnout of in-house staff",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          }
        ]
      },
      {
        id: "sales-skill-expectations",
        title: "CLIENT SKILL EXPECTATIONS BY ROLE",
        description: "What skills do clients most commonly expect for each role? (Select up to 3 per role)",
        questions: [
          {
            id: "medical_receptionist_skills",
            type: "checkbox",
            label: "Medical Receptionist",
            options: [
              "Call handling & phone etiquette",
              "Appointment scheduling",
              "Insurance verification",
              "Patient intake & registration",
              "Customer service",
              "EMR/EHR navigation",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "medical_admin_skills",
            type: "checkbox",
            label: "Medical Admin",
            options: [
              "Inbox/email management",
              "Scheduling & calendar coordination",
              "Document & records management",
              "Insurance support tasks",
              "Prior authorization support",
              "Reporting/admin coordination",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "medical_biller_skills",
            type: "checkbox",
            label: "Medical Biller",
            options: [
              "Claims submission (CMS-1500/UB-04)",
              "Payment posting (ERA/EOB)",
              "Denial management",
              "AR follow-up",
              "Insurance verification",
              "Coding knowledge",
              "Clearinghouse/payer portals",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "medical_scribe_skills",
            type: "checkbox",
            label: "Medical Scribe",
            options: [
              "Real-time documentation",
              "Medical terminology",
              "EHR charting",
              "Accuracy & speed",
              "Provider communication",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "health_educator_skills",
            type: "checkbox",
            label: "Health Educator",
            options: [
              "Patient education",
              "Communication & coaching",
              "Care plan explanation",
              "Follow-up coordination",
              "Documentation",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "dental_receptionist_skills",
            type: "checkbox",
            label: "Dental Receptionist",
            options: [
              "Scheduling",
              "Insurance verification",
              "Patient communication",
              "Dental software use",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          },
          {
            id: "dental_biller_skills",
            type: "checkbox",
            label: "Dental Biller",
            options: [
              "Claims submission",
              "Payment posting",
              "Insurance breakdown",
              "AR follow-up",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          }
        ]
      },
      {
        id: "sales-va-positioning",
        title: "VA POSITIONING",
        questions: [
          {
            id: "va_highlight_aspects",
            type: "checkbox",
            label: "What aspects of a VA do you typically highlight to clients? (Select up to 3)",
            options: [
              "Communication skills",
              "Technical skills",
              "Experience/background",
              "System/tool proficiency",
              "Reliability",
              "Adaptability",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          },
          {
            id: "va_presentation_performance_gaps",
            type: "checkbox",
            label: "Where do you see gaps between how VAs are presented and their actual performance? (Select up to 3)",
            options: [
              "Communication skills",
              "Technical skills",
              "Confidence level",
              "Real-world experience",
              "System proficiency",
              "Consistency",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          }
        ]
      },
      {
        id: "sales-matching-outcomes",
        title: "MATCHING & INTERVIEW OUTCOMES",
        questions: [
          {
            id: "matching_confidence",
            type: "scale",
            label: "How confident are you in matching the right VA to the right client?",
            description: "(1 = Not confident, 4 = Very confident)",
            min: 1,
            max: 4,
            required: true,
          },
          {
            id: "matching_challenges",
            type: "checkbox",
            label: "What are the biggest challenges in matching VAs to clients? (Select up to 3)",
            options: [
              "Limited visibility of VA actual skills",
              "Inconsistent assessment results (SEI/BCT)",
              "Unclear client expectations",
              "Limited qualified VA pool",
              "Time pressure to fill roles",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          },
          {
            id: "interview_decline_reasons",
            type: "checkbox",
            label: "What are the most common reasons clients decline or do not hire a VA after interview? (Select up to 3)",
            options: [
              "Poor communication skills",
              "Lack of confidence",
              "Inadequate technical knowledge",
              "Difficulty answering scenario-based questions",
              "Lack of real-world experience",
              "Misalignment with client expectations",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          },
          {
            id: "difficult_to_place_roles",
            type: "checkbox",
            label: "Which VA roles are most difficult to place successfully? (Select up to 3)",
            options: [
              "Medical Receptionist",
              "Medical Admin",
              "Medical Biller",
              "Medical Scribe",
              "Health Educator",
              "Dental Receptionist",
              "Dental Biller"
            ],
            maxSelections: 3,
            required: true,
          }
        ]
      },
      {
        id: "sales-interview-observations",
        title: "INTERVIEW OBSERVATIONS & RED FLAGS",
        questions: [
          {
            id: "interview_red_flags",
            type: "checkbox",
            label: "What red flags do you commonly observe during interviews? (Select up to 3)",
            options: [
              "Poor communication skills",
              "Long pauses or hesitation",
              "Lack of confidence",
              "Weak technical knowledge",
              "Difficulty understanding questions",
              "Inconsistent responses",
              "Over-reliance on scripts",
              "Unable to provide real examples",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          },
          {
            id: "red_flag_stage",
            type: "radio",
            label: "At what stage are these red flags usually observed? (Select one)",
            options: [
              "Initial screening",
              "During client interview",
              "After placement"
            ],
            required: true,
          },
          {
            id: "red_flag_endorsement_reasons",
            type: "checkbox",
            label: "Why do some candidates with red flags still get endorsed? (Select up to 3)",
            options: [
              "Strong technical skills",
              "Limited candidate pool",
              "Time pressure to endorse",
              "Potential to improve",
              "Misalignment in evaluation",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          },
          {
            id: "red_flags_failed_placements",
            type: "checkbox",
            label: "Which red flags most often lead to failed placements or cancellations? (Select up to 3)",
            options: [
              "Communication issues",
              "Confidence issues",
              "Technical gaps",
              "Poor adaptability",
              "Workflow misunderstanding",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          }
        ]
      },
      {
        id: "sales-placement-success",
        title: "PLACEMENT SUCCESS & ENABLEMENT",
        questions: [
          {
            id: "placement_improvement_suggestions",
            type: "textarea",
            label: "What do we need to improve to help VAs get placed faster and more successfully?",
            required: true,
          },
          {
            id: "support_tools_resources",
            type: "textarea",
            label: "What support, tools, or resources would help increase VA placement success and client acceptance?",
            required: true,
          },
          {
            id: "success_improvement_areas",
            type: "checkbox",
            label: "Which areas would most improve VA placement success? (Select up to 3)",
            options: [
              "Stronger communication skills",
              "Better technical/role-specific skills",
              "More real-world scenario training",
              "Improved confidence during interviews",
              "Better alignment of VA skills to client needs",
              "More accurate skills assessment (SEI)",
              "Better visibility of VA strengths and experience",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          }
        ]
      },
      {
        id: "sales-cancellation-insights",
        title: "VA CANCELLATION & REHIRE INSIGHTS",
        questions: [
          {
            id: "commonly_cancelled_roles",
            type: "checkbox",
            label: "Which VA roles are most commonly cancelled by clients? (Select up to 3)",
            options: [
              "Medical Receptionist",
              "Medical Admin",
              "Medical Biller",
              "Medical Scribe",
              "Health Educator",
              "Dental Receptionist",
              "Dental Biller"
            ],
            maxSelections: 3,
            required: true,
          },
          {
            id: "cancellation_reasons",
            type: "checkbox",
            label: "What are the most common reasons for VA cancellation? (Select up to 3)",
            options: [
              "Poor communication skills",
              "Lack of confidence",
              "Weak technical skills",
              "Inability to handle real tasks",
              "Poor time management",
              "Inconsistent performance",
              "Difficulty following workflows",
              "Lack of initiative",
              "Misalignment with client expectations",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          },
          {
            id: "cancellation_stage",
            type: "radio",
            label: "At what stage do cancellations most commonly happen?",
            options: [
              "Within first 2 weeks",
              "Within first 30 days",
              "After 1–3 months",
              "After 3+ months"
            ],
            required: true,
          },
          {
            id: "cancelled_va_skill_gaps",
            type: "checkbox",
            label: "What are the main skill gaps of cancelled VAs? (Select up to 3)",
            options: [
              "Communication",
              "Technical skills",
              "Workflow understanding",
              "System familiarity",
              "Critical thinking",
              "Time management",
              "Client handling",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          },
          {
            id: "placeable_after_cancellation",
            type: "radio",
            label: "After a VA is cancelled, how often are they still placeable?",
            options: [
              "Always placeable",
              "Sometimes placeable",
              "Rarely placeable",
              "Not placeable"
            ],
            required: true,
          },
          {
            id: "replacement_determination_factors",
            type: "checkbox",
            label: "What factors determine if a cancelled VA is suitable for re-endorsement to a new client? (Select UP TO 3).",
            options: [
              "Communication improvement",
              "Technical skill improvement",
              "Responsiveness to coaching and feedback",
              "Attitude and willingness to improve",
              "Previous performance level",
              "Fit with future client requirements / role alignment",
              "Other"
            ],
            optionsWithInputs: ["Other"],
            maxSelections: 3,
            required: true,
          },
          {
            id: "replacement_challenges",
            type: "checkbox",
            label: "What are the biggest challenges in re-placing cancelled VAs? (Select up to 3)",
            options: [
              "Same issues persist",
              "Loss of client confidence",
              "Limited opportunities",
              "Negative feedback history",
              "Poor interview performance",
              "Other"
            ],
            maxSelections: 3,
            required: true,
          }
        ]
      },
      {
        id: "sales-final-insights",
        title: "FINAL INSIGHTS",
        questions: [
          {
            id: "hiring_speed_differentiators",
            type: "textarea",
            label: "What differentiates VAs who get hired quickly vs those who don’t?",
            required: true,
          },
          {
            id: "additional_feedback",
            type: "textarea",
            label: "Any additional feedback or suggestions?",
            required: true,
          }
        ]
      },
    ]
  }
};

export const FULL_SURVEY_SCHEMA: FullSurveySchema = {
  client: CLIENT_SURVEY_SCHEMA,
  va: VA_SURVEY_SCHEMA,
  support: SUPPORT_SURVEY_SCHEMA,
};
