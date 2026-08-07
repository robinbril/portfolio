/**
 * Portfolio i18n — NL (default) ↔ EN
 * Toggle: #lang-toggle. Persists in localStorage (portfolio-lang).
 */
(function () {
  const STORAGE_KEY = "portfolio-lang";

  const dict = {
    nl: {
      "nav.about": "Over Mij",
      "nav.projects": "Projecten",
      "nav.experience": "Ervaring",
      "nav.skills": "Skills",
      "nav.contact": "Contact",
      "hero.available": "Beschikbaar · Amsterdam",
      "hero.role": "AI Tech Lead · Staffing platforms",
      "hero.subtitle":
        "AI Tech Lead bij PolpoHire, The Staffing Society en Reforge Recruitment. Volledige automatisering van administratieve processen in HR, operations en finance, plus AI-, software- en recruiterplatforms voor alle bedrijven.",
      "hero.ctaProjects": "Bekijk Projecten",
      "hero.ctaContact": "Contact",
      "stats.mcp": "MCP-servers",
      "stats.agents": "Agents in productie",
      "stats.scientists": "Data scientists getraind",
      "stats.saas": "Betalende SaaS-gebruikers",
      "sec.about": "Over Mij",
      "sec.projects": "Mijn Projecten",
      "sec.experience": "Werkervaring",
      "sec.skills": "Technische Expertise",
      "sec.education": "Opleiding",
      "sec.certs": "Certificeringen",
      "sec.contact": "Neem contact op",
      "sec.leaveNumber": "Laat je nummer achter",
      "about.profile": "Profiel",
      "about.hours": "40 uur per week beschikbaar",
      "about.langs": "Nederlands (moedertaal), Engels (vloeiend)",
      "about.degree": "BSc Bedrijfskunde (Cum Laude)",
      "about.p4":
        "Zijn kracht ligt op het snijvlak van AI, data, procesautomatisering en het opschalen van softwareplatforms.",
      "about.p1":
        "Robin is AI Tech Lead bij <strong>PolpoHire</strong>, <strong>The Staffing Society</strong> en <strong>Reforge Recruitment</strong>. Hij voorziet deze bedrijven van volledige automatisering van administratieve processen binnen HR, operations, finance en aanverwante domeinen.",
      "about.p2":
        "Daarnaast bouwt hij het gedeelde <strong>AI-platform</strong>, een volledig softwareplatform en een recruiterplatform waarmee de drie organisaties hun operatie, matching en administratie draaien.",
      "about.p3":
        "Eerder werkte hij via Reforge bij Fellowmind met <strong>Hive AI</strong>, droeg hij bij aan <strong>DefGPT Pro</strong> binnen Defensie en bouwde hij via Virelio AI-tools voor scale-ups en grotere organisaties.",
      "projects.subtitle":
        "Een selectie van agents, automatiseringen en tools, gebouwd voor klanten en eigen gebruik.",
      "projects.showAll": "Toon alle projecten",
      "projects.showLess": "Toon minder",
      "skills.intro":
        "Gebundeld rond veelvoorkomend werk: agents, enterprise-integraties en productieklare AI.",
      "edu.bsc.title": "BSc Bedrijfskunde (cum laude)",
      "edu.bsc.note": "GPA 8.0 · Propedeuse behaald in eerste jaar",
      "edu.minor.note": "Head of R&D Analytics department",
      "contact.cv": "Download CV (PDF)",
      "contact.tryAi": "Of probeer mijn AI interface ↓",
      "contact.formIntro":
        "Robin neemt binnen 24 uur contact op via WhatsApp of telefoon",
      "contact.privacy":
        "Jouw gegevens worden veilig verwerkt en niet gedeeld",
      "contact.thanks": "Bedankt voor je aanvraag!",
      "contact.thanksSub": "Robin neemt zo snel mogelijk contact met je op.",
      "contact.submit": "Verstuur Aanvraag",
      "contact.copied": "Gekopieerd!",
      "period.2026present": "2026 – heden",
      "period.2024present": "2024 – heden",
      "exp.polpo.role": "AI Tech Lead",
      "exp.polpo.company": "PolpoHire · The Staffing Society · Reforge Recruitment",
      "exp.polpo.b1":
        "Tech lead voor drie staffing-bedrijven: PolpoHire, The Staffing Society en Reforge Recruitment — één technische koers, gedeelde platformen.",
      "exp.polpo.b2":
        "Voorziet alle bedrijven van volledige automatisering van administratieve processen binnen HR, operations, finance en aanverwante domeinen.",
      "exp.polpo.b3":
        "Bouwt en beheert het gedeelde AI-platform waarmee agents en automatiseringen processen end-to-end uitvoeren.",
      "exp.polpo.b4":
        "Levert een volledig softwareplatform voor de operatie van de drie organisaties — van data en workflows tot interne tools.",
      "exp.polpo.b5":
        "Ontwikkelt het recruiterplatform voor matching, pipeline, communicatie en administratie van de recruitment-operatie.",
      "exp.reforge.role": "AI Tech Lead",
      "exp.reforge.company": "Reforge Consultancy · opdracht bij Fellowmind",
      "exp.reforge.b1":
        "Werkte bij Fellowmind als AI Tech Lead aan maatwerk-agents voor klanten, gebouwd en uitgerold met Hive AI, het interne platform voor ontwikkeling en deployment.",
      "exp.reforge.b2":
        "Haalde requirements op via klantworkshops en vertaalde klantprocessen naar agent-workflows, functionele eisen en concrete bouwtaken.",
      "exp.reforge.b3":
        "Bouwde vier custom agents voor onder andere verkooporder-automatisering, verwerking van logistieke documenten, een juridische kennisbank en een meertalige voice-agent voor het doorzoeken van bedrijfskennis.",
      "exp.reforge.b4":
        "Ontwikkelde MCP-integraties waarmee agents veilig kunnen werken met bedrijfssystemen, documenten, PDF's en planningsprocessen.",
      "exp.reforge.b5":
        "Bouwde evaluatie- en monitoringframeworks om agents in productie controleerbaar te houden.",
      "filter.agents": "Agents",
      "filter.mcp": "MCP",
      "filter.vision": "Vision",
      "filter.automation": "Automatisering",
      "filter.websites": "Websites",
      "kicker.production": "IN PRODUCTIE",
      "kicker.industrial": "Industrieel",
      "kicker.logistics": "Logistiek",
      "kicker.insurer": "Zorgverzekeraar",
      "kicker.multilingual": "Meertalig",
      "kicker.opensource": "Open Source",
      "langToggleAria": "Switch to English",
      "themeToggleAria": "Wissel tussen licht en donker thema",
      "menuAria": "Open navigatiemenu",
      "documentTitle": "Robin Bril | AI Tech Lead",
    },
    en: {
      "nav.about": "About",
      "nav.projects": "Projects",
      "nav.experience": "Experience",
      "nav.skills": "Skills",
      "nav.contact": "Contact",
      "hero.available": "Available · Amsterdam",
      "hero.role": "AI Tech Lead · Staffing platforms",
      "hero.subtitle":
        "AI Tech Lead at PolpoHire, The Staffing Society and Reforge Recruitment. Full automation of administrative processes across HR, operations and finance, plus AI, software and recruiter platforms for all three companies.",
      "hero.ctaProjects": "View Projects",
      "hero.ctaContact": "Contact",
      "stats.mcp": "MCP servers",
      "stats.agents": "Agents in production",
      "stats.scientists": "Data scientists trained",
      "stats.saas": "Paying SaaS users",
      "sec.about": "About",
      "sec.projects": "My Projects",
      "sec.experience": "Experience",
      "sec.skills": "Technical Expertise",
      "sec.education": "Education",
      "sec.certs": "Certifications",
      "sec.contact": "Get in touch",
      "sec.leaveNumber": "Leave your number",
      "about.profile": "Profile",
      "about.hours": "Available 40 hours per week",
      "about.langs": "Dutch (native), English (fluent)",
      "about.degree": "BSc Business Administration (Cum Laude)",
      "about.p4":
        "His strength sits at the intersection of AI, data, process automation and scaling software platforms.",
      "about.p1":
        "Robin is AI Tech Lead at <strong>PolpoHire</strong>, <strong>The Staffing Society</strong> and <strong>Reforge Recruitment</strong>. He equips these companies with full automation of administrative processes across HR, operations, finance and related domains.",
      "about.p2":
        "He also builds the shared <strong>AI platform</strong>, a full software platform and a recruiter platform that power operations, matching and administration across all three organisations.",
      "about.p3":
        "Earlier, through Reforge at Fellowmind he worked with <strong>Hive AI</strong>, contributed to <strong>DefGPT Pro</strong> within Defence, and via Virelio built AI tools for scale-ups and larger organisations.",
      "projects.subtitle":
        "A selection of agents, automations and tools — built for clients and personal use.",
      "projects.showAll": "Show all projects",
      "projects.showLess": "Show less",
      "skills.intro":
        "Clustered around common work: agents, enterprise integrations and production-ready AI.",
      "edu.bsc.title": "BSc Business Administration (cum laude)",
      "edu.bsc.note": "GPA 8.0 · Propedeuse completed in first year",
      "edu.minor.note": "Head of R&D Analytics department",
      "contact.cv": "Download CV (PDF)",
      "contact.tryAi": "Or try my AI interface ↓",
      "contact.formIntro":
        "Robin will contact you within 24 hours via WhatsApp or phone",
      "contact.privacy":
        "Your details are processed securely and never shared",
      "contact.thanks": "Thanks for your request!",
      "contact.thanksSub": "Robin will get back to you as soon as possible.",
      "contact.submit": "Send request",
      "contact.copied": "Copied!",
      "period.2026present": "2026 – present",
      "period.2024present": "2024 – present",
      "exp.polpo.role": "AI Tech Lead",
      "exp.polpo.company": "PolpoHire · The Staffing Society · Reforge Recruitment",
      "exp.polpo.b1":
        "Tech lead for three staffing companies: PolpoHire, The Staffing Society and Reforge Recruitment — one technical direction, shared platforms.",
      "exp.polpo.b2":
        "Delivers full automation of administrative processes across HR, operations, finance and related domains for all companies.",
      "exp.polpo.b3":
        "Builds and runs the shared AI platform so agents and automations execute processes end-to-end.",
      "exp.polpo.b4":
        "Ships a full software platform for the three organisations — from data and workflows to internal tools.",
      "exp.polpo.b5":
        "Develops the recruiter platform for matching, pipeline, communication and recruitment administration.",
      "exp.reforge.role": "AI Tech Lead",
      "exp.reforge.company": "Reforge Consultancy · assignment at Fellowmind",
      "exp.reforge.b1":
        "Worked at Fellowmind as AI Tech Lead on custom agents for clients, built and shipped with Hive AI — the internal platform for development and deployment.",
      "exp.reforge.b2":
        "Gathered requirements in client workshops and translated client processes into agent workflows, functional requirements and concrete build tasks.",
      "exp.reforge.b3":
        "Built four custom agents covering sales-order automation, logistics document processing, a legal knowledge base and a multilingual voice agent for enterprise knowledge search.",
      "exp.reforge.b4":
        "Developed MCP integrations so agents can safely work with business systems, documents, PDFs and planning processes.",
      "exp.reforge.b5":
        "Built evaluation and monitoring frameworks to keep agents controllable in production.",
      "filter.agents": "Agents",
      "filter.mcp": "MCP",
      "filter.vision": "Vision",
      "filter.automation": "Automation",
      "filter.websites": "Websites",
      "kicker.production": "IN PRODUCTION",
      "kicker.industrial": "Industrial",
      "kicker.logistics": "Logistics",
      "kicker.insurer": "Health insurer",
      "kicker.multilingual": "Multilingual",
      "kicker.opensource": "Open Source",
      "langToggleAria": "Wissel naar Nederlands",
      "themeToggleAria": "Toggle light and dark theme",
      "menuAria": "Open navigation menu",
      "documentTitle": "Robin Bril | AI Tech Lead",
    },
  };

  /** Exact NL → EN phrase map for unmarked body copy (experience, projects, labels). */
  const phrases = [
    // Experience roles & companies
    ["Ministerie van Defensie (via Capgemini)", "Ministry of Defence (via Capgemini)"],
    ["Ministerie van Defensie", "Ministry of Defence"],
    ["Data Consultant & AI Engineer", "Data Consultant & AI Engineer"],
    ["Traineeship Procesmanagement", "Process Management Traineeship"],
    ["Founder & Software Developer", "Founder & Software Developer"],
    // Experience bullets (full NL → EN)
    [
      "Bouwde AI-tools en automatiseringen voor klantprocessen, leadgeneratie, documentverwerking en interne workflows.",
      "Built AI tools and automations for client processes, lead generation, document processing and internal workflows.",
    ],
    [
      "Ontwikkelde AI-assistenten die grote documentomgevingen veilig doorzoekbaar maken via Slack, Teams en spraak.",
      "Developed AI assistants that make large document environments safely searchable via Slack, Teams and voice.",
    ],
    [
      "Implementeerde multi-agent workflows voor documentverwerking, onderzoek en operationele automatisering.",
      "Implemented multi-agent workflows for document processing, research and operational automation.",
    ],
    [
      "Bracht automatiseringen van ontwerp naar livegang voor klantcommunicatie, opvolging en operationele taken.",
      "Took automations from design to go-live for client communication, follow-up and operational tasks.",
    ],
    [
      'Organiseerde "Advanced AI in Practice"-workshops voor 450 data scientists over AI in softwareontwikkeling, RAG, agentic AI en data governance.',
      'Organised "Advanced AI in Practice" workshops for 450 data scientists on AI in software development, RAG, agentic AI and data governance.',
    ],
    [
      "Werkte in opdracht bij het Ministerie van Defensie in twee parallelle rollen: AI Engineer en Data Consultant.",
      "Worked on assignment at the Ministry of Defence in two parallel roles: AI Engineer and Data Consultant.",
    ],
    [
      "Bouwde in een team van drie mee aan DefGPT Pro: een private on-premise AI-assistent voor intern gebruik binnen Defensie.",
      "In a team of three, contributed to DefGPT Pro: a private on-premise AI assistant for internal Defence use.",
    ],
    [
      "Ontwierp mee aan de multi-agent architectuur met MCP-servers, RAG en koppeling met de interne kennisbank.",
      "Co-designed the multi-agent architecture with MCP servers, RAG and integration with the internal knowledge base.",
    ],
    [
      "Gaf AI-workshops aan de analytics-afdeling ter voorbereiding op de eerste pilotgroep.",
      "Delivered AI workshops to the analytics department in preparation for the first pilot group.",
    ],
    [
      "Faciliteerde wekelijkse requirements-workshops met senior stakeholders en militaire staf voor de strategische BI-roadmap.",
      "Facilitated weekly requirements workshops with senior stakeholders and military staff for the strategic BI roadmap.",
    ],
    [
      "Bouwde data-integraties tussen SAP, interne databases en rapportagelagen voor geconsolideerde managementrapportages.",
      "Built data integrations between SAP, internal databases and reporting layers for consolidated management reports.",
    ],
    [
      "Ontwikkelde operationele dashboards in Power BI en SAP voor inzichten op militair niveau, inclusief gegevensopschoning en kwaliteitscontrole.",
      "Developed operational dashboards in Power BI and SAP for military-level insights, including data cleansing and quality control.",
    ],
    [
      "Ontwikkelde en onderhield geautomatiseerde datapipelines in BigQuery met geplande queries, incrementele loads en foutafhandeling.",
      "Built and maintained automated data pipelines in BigQuery with scheduled queries, incremental loads and error handling.",
    ],
    [
      "Ontwierp datamodellen en bouwde een schaalbare dashboardarchitectuur in Looker voor acht afdelingen.",
      "Designed data models and built a scalable Looker dashboard architecture for eight departments.",
    ],
    [
      "Analyseerde markttrends, KPI's en concurrentieprestaties en presenteerde inzichten op bestuursniveau.",
      "Analysed market trends, KPIs and competitive performance and presented insights at board level.",
    ],
    [
      "Bouwde Quotum.cloud: een investeringsplatform dat on-chain data, derivaten en macro-indicatoren combineerde tot realtime marktanalyses via meerdere dashboards.",
      "Built Quotum.cloud: an investment platform combining on-chain data, derivatives and macro indicators into real-time market analysis across multiple dashboards.",
    ],
    [
      "Ontwikkelde een risico-algoritme met 12+ wiskundige metrics voor live evaluatie van marktrisico op crypto en aandelen.",
      "Developed a risk algorithm with 12+ mathematical metrics for live market-risk evaluation on crypto and equities.",
    ],
    [
      "Groeide naar 185 betalende abonnees internationaal. Deed de volledige operatie zelf: dagelijkse marktanalyses, livestreams en verdiepende content voor de community.",
      "Grew to 185 paying subscribers internationally. Ran the full operation solo: daily market analysis, livestreams and in-depth community content.",
    ],
    [
      "Optimaliseerde workflows voor bouwprojecten en verlaagde projectkosten door standaardisatie van documentatie.",
      "Optimised construction project workflows and reduced project costs through documentation standardisation.",
    ],
    [
      "Interviewde stakeholders en implementeerde een gestandaardiseerd documentatiesysteem voor betere samenwerking tussen teams.",
      "Interviewed stakeholders and implemented a standardised documentation system for better cross-team collaboration.",
    ],
    // Skill categories
    ["Ontwikkeling", "Engineering"],
    ["Cloud & data", "Cloud & data"],
    ["Proces & delivery", "Process & delivery"],
    ["Multi-agent concepten", "Multi-agent concepts"],
    ["MCP-integraties", "MCP integrations"],
    ["LLM-integratie", "LLM integration"],
    ["Human-in-the-loop", "Human-in-the-loop"],
    ["Requirements engineering", "Requirements engineering"],
    ["Klantworkshops", "Client workshops"],
    ["Stakeholdermanagement", "Stakeholder management"],
    ["AI-workshops", "AI workshops"],
    // Project descriptions
    [
      "Productie-agents en MCP-integraties binnen Fellowmind's Hive AI-platform. Vier agents live: verkooporder-automatisering, logistieke documentverwerking, een juridische kennisbank en meertalig voice-zoeken. Backend op AKS met 14+ MCP-servers voor D365, Microsoft Graph, SharePoint en PDF-extractie.",
      "Production agents and MCP integrations on Fellowmind's Hive AI platform. Four agents live: sales-order automation, logistics document processing, a legal knowledge base and multilingual voice search. Backend on AKS with 14+ MCP servers for D365, Microsoft Graph, SharePoint and PDF extraction.",
    ],
    [
      "Private Gen-AI platform met multi-agent workflows binnen een streng beveiligde enterprise-omgeving. Gecontroleerde LLM-orchestratie, audit-logging, rolgebaseerde filtering en afstemming met Analytics, IT en de business. Volledig on-premise.",
      "Private Gen-AI platform with multi-agent workflows inside a tightly secured enterprise environment. Controlled LLM orchestration, audit logging, role-based filtering and alignment with Analytics, IT and the business. Fully on-premise.",
    ],
    [
      "Mijn persoonlijke AI engineer-werkomgeving. Maakt van Claude Code een complete ontwikkeltool die taken onthoudt over sessies heen, gespecialiseerde rollen aanstuurt en mijn werkpatronen automatiseert.",
      "My personal AI engineer workbench. Turns Claude Code into a full development tool that remembers tasks across sessions, steers specialised roles and automates my work patterns.",
    ],
    [
      "MCP-server voor Dynamics 365 Customer Engagement (Sales, Service). Geeft AI-agents CRUD-toegang tot accounts, contacts, opportunities en cases via de Dataverse Web API met OAuth.",
      "MCP server for Dynamics 365 Customer Engagement (Sales, Service). Gives AI agents CRUD access to accounts, contacts, opportunities and cases via the Dataverse Web API with OAuth.",
    ],
    [
      "Microsoft Teams MCP-server via Graph API. AI-agents kunnen channels lezen, berichten sturen en chat-context ophalen voor HITL-workflows en notificaties.",
      "Microsoft Teams MCP server via Graph API. AI agents can read channels, send messages and fetch chat context for HITL workflows and notifications.",
    ],
    [
      "MCP-server die Apify-actors aanstuurt voor geautomatiseerde lead generation. Scrapt bedrijfsdata, contactpersonen en openbare profielen en levert gestructureerde leads aan AI-agents.",
      "MCP server that drives Apify actors for automated lead generation. Scrapes company data, contacts and public profiles and delivers structured leads to AI agents.",
    ],
    [
      "Een eerder platform dat AI-agents draait, gespecialiseerd in het automatisch lezen en verwerken van PDF-documenten zoals facturen en pakbonnen. Voorganger van het huidige Python-platform.",
      "An earlier platform running AI agents specialised in automatically reading and processing PDF documents such as invoices and packing slips. Predecessor of the current Python platform.",
    ],
    [
      "Leest binnenkomende order-e-mails en bijgevoegde PDF's, vraagt om bevestiging bij twijfelgevallen en maakt daarna automatisch een verkooporder aan in het ERP-systeem. In productie bij een Nederlands industrieel bedrijf.",
      "Reads incoming order emails and attached PDFs, asks for confirmation on edge cases, then automatically creates a sales order in the ERP system. In production at a Dutch industrial company.",
    ],
    [
      "Verwerkt automatisch pakbonnen en logistieke documenten en koppelt ze aan de bijbehorende inkooporders in het ERP-systeem. Naast de agent ook de ondersteunende koppelingen voor PDF-analyse en planning gebouwd.",
      "Automatically processes packing slips and logistics documents and links them to matching purchase orders in the ERP. Besides the agent, also built the supporting PDF analysis and planning integrations.",
    ],
    [
      "Doorzoekt contracten voor een Nederlandse zorgverzekeraar. Elke gebruiker (juridisch, sales, finance) ziet alleen contracten waar zij toegang toe hebben, met meerdere beveiligingslagen tegen misbruik en volledig auditbaar.",
      "Searches contracts for a Dutch health insurer. Every user (legal, sales, finance) only sees contracts they can access, with multiple security layers against abuse and full auditability.",
    ],
    [
      "Meertalige voice-agent voor kennis-zoeken over D365 F&O en bedrijfsdocumenten. Audio/PCM streaming met realtime transcriptie en contextuele antwoorden via een agent runtime.",
      "Multilingual voice agent for knowledge search across D365 F&O and company documents. Audio/PCM streaming with real-time transcription and contextual answers via an agent runtime.",
    ],
    [
      "Full-stack webapp met Stable Diffusion + ControlNet. Drag & drop editor met prompt-suggesties en one-click upscaling.",
      "Full-stack web app with Stable Diffusion + ControlNet. Drag & drop editor with prompt suggestions and one-click upscaling.",
    ],
    [
      "MCP-server voor D365 Finance & Operations via OData. Geeft AI-agents toegang tot vendors, purchase orders en inbound loads met gecontroleerde schrijfacties.",
      "MCP server for D365 Finance & Operations via OData. Gives AI agents access to vendors, purchase orders and inbound loads with controlled write actions.",
    ],
    [
      "Microsoft Graph Outlook server: mail, agenda, contacten. 20+ tools voor inbox-triage, calendar-management en HITL-flows. Auth via Entra ID.",
      "Microsoft Graph Outlook server: mail, calendar, contacts. 20+ tools for inbox triage, calendar management and HITL flows. Auth via Entra ID.",
    ],
    [
      "SharePoint Copilot Retrieval API met OBO authenticatie en ACL-enforcement. Iedere user ziet alleen documenten waar zij toegang toe hebben.",
      "SharePoint Copilot Retrieval API with OBO authentication and ACL enforcement. Every user only sees documents they have access to.",
    ],
    [
      "Autonoom multi-agent systeem met gespecialiseerde agents (research, code, review) voor end-to-end taken binnen afgebakende workflows.",
      "Autonomous multi-agent system with specialised agents (research, code, review) for end-to-end tasks inside scoped workflows.",
    ],
    [
      "Automatische planning met conflict-detectie via Microsoft Graph. Analyseert inbox-context en genereert afspraken met follow-up reminders.",
      "Automatic scheduling with conflict detection via Microsoft Graph. Analyses inbox context and generates meetings with follow-up reminders.",
    ],
    [
      "Geautomatiseerde outreach met rate-limiting en platform-safe integraties. Profielen vinden, gepersonaliseerde berichten genereren en versturen.",
      "Automated outreach with rate limiting and platform-safe integrations. Finds profiles, generates personalised messages and sends them.",
    ],
    [
      "Realtime audio-verwerking via WebRTC met transcriptie, samenvatting en actiepunten. Ontworpen met fallback-scenario's voor verschillende omgevingen.",
      "Real-time audio processing via WebRTC with transcription, summary and action items. Designed with fallback scenarios for different environments.",
    ],
    [
      "Van idee tot live deployment via geautomatiseerde AI-pipeline. Genereert Next.js sites met copy, afbeeldingen en one-click deploy.",
      "From idea to live deployment via an automated AI pipeline. Generates Next.js sites with copy, images and one-click deploy.",
    ],
    [
      "Autonome persoonlijke agent voor e-mail, agenda en research binnen afgebakende taken. Werkt met memory en tools voor dagelijkse operaties.",
      "Autonomous personal agent for email, calendar and research within scoped tasks. Uses memory and tools for day-to-day operations.",
    ],
    [
      "Visueel model om RAG- en multi-agent architecturen inzichtelijk te maken voor niet-technische stakeholders. Gebruikt in workshops en architectuursessies.",
      "Visual model to make RAG and multi-agent architectures understandable for non-technical stakeholders. Used in workshops and architecture sessions.",
    ],
    [
      "Claude Sonnet 4.6 prompt-technieken geïmplementeerd voor enterprise automatisering. Van artifacts tot MCP. Geïntegreerd in meerdere workflows.",
      "Claude Sonnet 4.6 prompt techniques implemented for enterprise automation. From artifacts to MCP. Integrated into multiple workflows.",
    ],
    [
      "Rust MCP-server die markdown converteert naar PDF via headless Chrome. Built op RMCP voor low-latency document-generatie binnen agent workflows.",
      "Rust MCP server that converts markdown to PDF via headless Chrome. Built on RMCP for low-latency document generation inside agent workflows.",
    ],
    [
      "PowerPoint-generatie vanuit structured specs. Fellowmind-branded templates en master slides. Agents leveren de spec, MCP rendert de presentatie.",
      "PowerPoint generation from structured specs. Fellowmind-branded templates and master slides. Agents supply the spec; MCP renders the deck.",
    ],
    [
      "Vraagt input → web-search, paper-lezing, rapport met bronnen en PDF-export. Samenvattingen met bronvermelding.",
      "Takes input → web search, paper reading, report with sources and PDF export. Summaries with citations.",
    ],
    [
      "Realtime speech-to-action: transcriptie → samenvatting → calendar. Offline fallback mogelijk. Robuust in verschillende omgevingen.",
      "Real-time speech-to-action: transcription → summary → calendar. Offline fallback available. Robust across environments.",
    ],
    [
      "Full-stack platform die productpagina's analyseert en automatisch copy, pricing en layout optimaliseert. Meetbare conversie-verbetering.",
      "Full-stack platform that analyses product pages and automatically optimises copy, pricing and layout. Measurable conversion lift.",
    ],
    [
      "AI-agent die content plant, genereert en publiceert op Instagram, LinkedIn en TikTok. Minder tijd, meer bereik.",
      "AI agent that plans, generates and publishes content on Instagram, LinkedIn and TikTok. Less time, more reach.",
    ],
    [
      "E-commerce webshop voor haarserum met AI-gegenereerde teksten en conversie-optimalisatie. Live: reviven.nl",
      "E-commerce store for hair serum with AI-generated copy and conversion optimisation. reviven.nl",
    ],
    [
      "Premium reissite met boekings-integraties, villa-overzichten en dynamische prijzen. Live: wlbali.com",
      "Premium travel site with booking integrations, villa listings and dynamic pricing. wlbali.com",
    ],
    [
      "Interactieve developer-portfolio met preloader-animatie, donker thema en premium UI. Live: robinbril.com",
      "Interactive developer portfolio with preloader animation, dark theme and premium UI. robinbril.com",
    ],
    [
      "Investment platform met real-time portfolio tracking, market data en secure authentication. Live: quotum.org",
      "Investment platform with real-time portfolio tracking, market data and secure authentication. quotum.org",
    ],
    // Common UI leftovers
    ["heden", "present"],
    ["Propedeuse behaald in eerste jaar", "Foundation year completed in year one"],
    ["Gegevensvalidatie", "Data validation"],
    ["Data Storytelling", "Data storytelling"],
    ["Procesmanagement", "Process management"],
    ["Workflowoptimalisatie", "Workflow optimisation"],
    ["Lokale LLM-deployments", "Local LLM deployments"],
    ["Workflow-automatisering", "Workflow automation"],
    ["API-integratie", "API integration"],
    ["Leiderschap", "Leadership"],
    ["Privacy-conform", "Privacy-compliant"],
    ["On-premise LLM", "On-premise LLM"],
    ["Naam", "Name"],
    ["Telefoonnummer", "Phone number"],
    ["Bericht (optioneel)", "Message (optional)"],
    ["Hive AI Agents voor productie", "Hive AI Agents in production"],
    ["Staffing AI & software platform", "Staffing AI & software platform"],
    ["PolpoHire · Staffing Society · Reforge Recruitment", "PolpoHire · Staffing Society · Reforge Recruitment"],
    [
      "Gedeeld AI-platform, softwareplatform en recruiterplatform voor drie staffing-bedrijven. Volledige automatisering van administratieve processen in HR, operations en finance — één technische stack, drie merken.",
      "Shared AI platform, software platform and recruiter platform for three staffing companies. Full automation of administrative processes across HR, operations and finance — one technical stack, three brands.",
    ],
    ["BEDRIJVEN", "COMPANIES"],
    ["DOMEINEN", "DOMAINS"],
    ["PLATFORMS", "PLATFORMS"],
    ["HR · Ops · Finance", "HR · Ops · Finance"],
    ["AI · Soft · Recruit", "AI · Soft · Recruit"],
    ["Gen-AI Tool met Agents", "Gen-AI tool with agents"],
    ["ROL", "ROLE"],
    ["DEPLOY", "DEPLOY"],
    ["LIVE", "LIVE"],
    ["AGENTS", "AGENTS"],
    ["MCP-SERVERS", "MCP SERVERS"],
  ];

  // Longer phrases first so short ones don't eat them
  phrases.sort((a, b) => b[0].length - a[0].length);

  let currentLang = "nl";
  /** Snapshot of original NL HTML for phrase-mapped nodes */
  const originalHtml = new WeakMap();

  function getStoredLang() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "en" || v === "nl") return v;
    } catch (_) {}
    return "nl";
  }

  function setStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
  }

  function applyDict(lang) {
    const pack = dict[lang] || dict.nl;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key || pack[key] == null) return;
      el.textContent = pack[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key || pack[key] == null) return;
      el.innerHTML = pack[key];
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (!key || pack[key] == null) return;
      el.setAttribute("aria-label", pack[key]);
    });

    document.querySelectorAll("[data-i18n-typing]").forEach((el) => {
      const key = el.getAttribute("data-i18n-typing");
      if (!key || pack[key] == null) return;
      const textEl = el.querySelector(".typing-text");
      if (textEl) textEl.textContent = pack[key];
      el.setAttribute("aria-label", pack[key]);
    });

    if (pack.documentTitle) document.title = pack.documentTitle;
    document.documentElement.lang = lang;
  }

  function normalizeWs(s) {
    return String(s).replace(/\s+/g, " ").trim();
  }

  function applyPhrasesToString(value, toEn) {
    if (!value) return value;
    if (!toEn) return value;
    // Collapse whitespace so multi-line HTML text matches single-line phrases
    let out = value.replace(/([ \t]*\n[ \t]*)+/g, " ").replace(/[ \t]{2,}/g, " ");
    for (const [nl, en] of phrases) {
      if (out.includes(nl)) {
        out = out.split(nl).join(en);
        continue;
      }
      // Fallback: normalized equality chunks for long prose
      const nNl = normalizeWs(nl);
      if (nNl.length > 40 && normalizeWs(out).includes(nNl)) {
        // replace via regex with flexible whitespace
        const parts = nl.trim().split(/\s+/).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        const re = new RegExp(parts.join("\\s+"), "g");
        out = out.replace(re, en);
      }
    }
    return out;
  }

  function translateElementHtml(el, toEn) {
    if (!el || el.closest("[data-i18n], [data-i18n-html], [data-i18n-typing]")) return;
    if (toEn) {
      if (!originalHtml.has(el)) originalHtml.set(el, el.innerHTML);
      const base = originalHtml.get(el);
      // Full plain-text match (handles <strong>/links inside paragraphs)
      const tmp = document.createElement("div");
      tmp.innerHTML = base;
      const plain = normalizeWs(tmp.textContent || "");
      for (const [nl, en] of phrases) {
        if (normalizeWs(nl) === plain) {
          // Keep anchor tags when the NL phrase ends with a Live: url pattern
          const anchors = tmp.querySelectorAll("a[href]");
          if (anchors.length === 1) {
            const a = anchors[0];
            const label = a.textContent.trim();
            const href = a.getAttribute("href");
            let prefix = en.replace(new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*$"), "").trim();
            prefix = prefix.replace(/\s*Live:\s*$/i, "").trim();
            el.innerHTML =
              prefix +
              ' <strong>Live: <a href="' +
              href +
              '" target="_blank" rel="noopener noreferrer">' +
              label +
              "</a></strong>";
          } else {
            el.textContent = en;
          }
          return;
        }
      }
      el.innerHTML = applyPhrasesToString(base, true);
    } else if (originalHtml.has(el)) {
      el.innerHTML = originalHtml.get(el);
    }
  }

  function walkPhrases(root, toEn) {
    const selectors = [
      ".role-description li",
      ".timeline-content h3",
      ".timeline-content .company",
      ".timeline-date",
      ".ai-project-card > p",
      ".ai-project-card h3",
      ".featured-content p",
      ".featured-content h3",
      ".project-kicker",
      ".skill-category h3",
      ".skill-tags span",
      ".tags span",
      ".edu-card h3",
      ".edu-card p",
      ".cert-card h3",
      ".cert-card p",
      ".card-metric-label",
      ".info-list li span",
      "label",
      "input[placeholder]",
      "textarea[placeholder]",
    ];
    const seen = new Set();
    selectors.forEach((sel) => {
      root.querySelectorAll(sel).forEach((el) => {
        if (seen.has(el)) return;
        if (el.closest("[data-i18n], [data-i18n-html], [data-i18n-typing]")) return;
        seen.add(el);
        if (el.matches("input[placeholder], textarea[placeholder]")) {
          if (toEn) {
            if (!originalHtml.has(el)) originalHtml.set(el, el.getAttribute("placeholder") || "");
            el.setAttribute(
              "placeholder",
              applyPhrasesToString(originalHtml.get(el), true)
            );
          } else if (originalHtml.has(el)) {
            el.setAttribute("placeholder", originalHtml.get(el));
          }
          return;
        }
        translateElementHtml(el, toEn);
      });
    });

    // Fallback: remaining plain text nodes (nav already handled via data-i18n)
    const skip = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE"]);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (skip.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.closest("[data-i18n], [data-i18n-html], [data-i18n-typing]")) {
          return NodeFilter.FILTER_REJECT;
        }
        if (seen.has(p) || [...seen].some((el) => el.contains(p))) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      let value = node.nodeValue;
      if (!value || !value.trim()) return;
      if (toEn) {
        if (!originalHtml.has(node)) originalHtml.set(node, value);
        node.nodeValue = applyPhrasesToString(originalHtml.get(node), true);
      } else if (originalHtml.has(node)) {
        node.nodeValue = originalHtml.get(node);
      }
    });
  }

  function updateToggleUI(lang) {
    const btn = document.getElementById("lang-toggle");
    const label = document.getElementById("lang-code-label");
    if (label) label.textContent = lang === "nl" ? "EN" : "NL";
    if (btn) {
      btn.setAttribute(
        "aria-label",
        lang === "nl" ? "Switch to English" : "Wissel naar Nederlands"
      );
      btn.dataset.lang = lang;
    }
  }

  function setLanguage(lang) {
    const next = lang === "en" ? "en" : "nl";
    currentLang = next;
    applyDict(next);
    // Phrase pass: EN applies NL→EN; NL restores snapshots
    walkPhrases(document.body, next === "en");
    updateToggleUI(next);
    setStoredLang(next);
    document.dispatchEvent(
      new CustomEvent("portfolio:langchange", { detail: { lang: next } })
    );
  }

  function init() {
    const btn = document.getElementById("lang-toggle");
    if (btn) {
      btn.addEventListener("click", () => {
        setLanguage(currentLang === "nl" ? "en" : "nl");
      });
    }
    const initial = getStoredLang();
    setLanguage(initial);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.portfolioI18n = { setLanguage, getLang: () => currentLang, dict };
})();
