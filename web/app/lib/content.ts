/** Single source for navigation and service content. Pages compose from this;
 *  none of it is duplicated per page. */

export type Service = { slug: string; name: string; line: string };
export type Practice = {
  slug: string; name: string; short: string; lead: string; services: Service[];
};

export const PRACTICES: Practice[] = [
  {
    slug: 'corporate-finance', name: 'Corporate Finance', short: 'Corporate Finance',
    lead: 'Raising money, restructuring it, and getting it to the right place at the right time — for firms too large for a local adviser and too small for a bulge bracket.',
    services: [
      { slug: 'debt-and-working-capital', name: 'Debt & Working Capital', line: 'Term debt, invoice discounting, factoring, trade finance and government-backed facilities.' },
      { slug: 'equity-and-private-capital', name: 'Equity & Private Capital', line: 'Private equity, venture capital, family offices and fund placement.' },
      { slug: 'project-and-infrastructure-finance', name: 'Project & Infrastructure Finance', line: 'Non-recourse and limited-recourse structures, including renewable energy.' },
      { slug: 'ipo-and-public-markets', name: 'IPO & Public Markets', line: 'Readiness, structuring and execution for a public listing.' },
      { slug: 'restructuring-and-distressed', name: 'Restructuring & Distressed', line: 'Balance-sheet restructuring, turnaround and distressed asset management.' },
      { slug: 'growth-capital', name: 'Growth Capital', line: 'Funding for firms past first revenue and scaling.' },
      { slug: 'transfer-pricing', name: 'Transfer Pricing', line: 'Intra-group pricing policy, documentation and defence.' },
    ],
  },
  {
    slug: 'm-and-a', name: 'Mergers & Acquisitions', short: 'M&A',
    lead: 'Buying, selling and combining businesses across borders, from first approach to the year after completion.',
    services: [
      { slug: 'buy-side', name: 'Buy-side', line: 'Target identification, approach, diligence and negotiation.' },
      { slug: 'sell-side', name: 'Sell-side', line: 'Preparation, marketing, competitive process and exit planning.' },
      { slug: 'company-valuation', name: 'Company Valuation', line: 'Independent valuation for transactions, disputes and reporting.' },
      { slug: 'deal-strategy', name: 'Deal Strategy', line: 'Aligning a transaction with what the business is actually for.' },
      { slug: 'post-merger-integration', name: 'Post-Merger Integration', line: 'Integration planning and the synergies that were promised.' },
      { slug: 'joint-ventures-and-alliances', name: 'Joint Ventures & Alliances', line: 'Partnership structures, LBOs, MBOs and MBIs.' },
    ],
  },
  {
    slug: 'risk', name: 'Risk & Governance', short: 'Risk & Governance',
    lead: 'Knowing what could go wrong, what it would cost, and who is accountable for it.',
    services: [
      { slug: 'risk-strategy-and-framework', name: 'Risk Strategy & Framework', line: 'Appetite, framework design and the reporting line that makes it real.' },
      { slug: 'credit-market-and-treasury-risk', name: 'Credit, Market & Treasury Risk', line: 'Exposure measurement, limits and liquidity.' },
      { slug: 'operational-and-enterprise-risk', name: 'Operational & Enterprise Risk', line: 'Process risk, cloud risk and enterprise-wide aggregation.' },
      { slug: 'internal-audit', name: 'Internal Audit', line: 'Function design, co-source and independent review.' },
      { slug: 'governance-sox-and-it-controls', name: 'Governance, SOX & IT Controls', line: 'Control frameworks, SOX readiness and IT governance.' },
      { slug: 'risk-reporting-and-analytics', name: 'Risk Reporting & Analytics', line: 'Reporting that a board can act on rather than file.' },
      { slug: 'technology-risk-and-assurance', name: 'Technology Risk & Assurance', line: 'ISO 27001, SOC 1 and SOC 2, vendor risk, continuity and recovery.' },
      { slug: 'commercial-mediation', name: 'Commercial Mediation', line: 'Resolving commercial disputes without litigation.' },
      { slug: 'ai-and-automation-in-risk-and-diligence', name: 'AI & Automation in Risk and Diligence', line: 'How we use automated tooling in diligence, and where judgement stays human.' },
    ],
  },
  {
    slug: 'strategy', name: 'Strategy & Board', short: 'Strategy & Board',
    lead: 'Deciding what to do next, testing that decision properly, and putting the right people around the table.',
    services: [
      { slug: 'corporate-and-business-strategy', name: 'Corporate & Business Strategy', line: 'Direction, portfolio and the plan that follows from both.' },
      { slug: 'growth-and-international-expansion', name: 'Growth & International Expansion', line: 'New markets, route to market and what it costs to enter.' },
      { slug: 'decision-support', name: 'Decision Support', line: "Devil's advocate, red team and facilitated decision sessions, at three intensities." },
      { slug: 'non-executive-directors-and-board', name: 'Non-Executive Directors & Board', line: 'NED appointments and board advisory.' },
      { slug: 'interim-management', name: 'Interim Management', line: 'Interim CEO, CFO, COO, CRO, CTO, CMO and sales leadership.' },
    ],
  },
  {
    slug: 'coaching', name: 'Coaching & Programmes', short: 'Coaching',
    lead: 'The people side of the same problem: leaders who need to think more clearly, and teams that need to work better together.',
    services: [
      { slug: 'executive-coaching', name: 'Executive Coaching', line: 'One-to-one work with chief executives and their direct reports.' },
      { slug: 'team-coaching', name: 'Team Coaching', line: 'Board and leadership team effectiveness.' },
      { slug: 'career-transition', name: 'Career Transition', line: 'Outplacement, career identity and the move to something else.' },
      { slug: 'mentoring', name: 'Mentoring', line: 'Longer-run mentoring relationships for founders and operators.' },
      { slug: 'entrepreneur-programmes', name: 'Entrepreneur Programmes', line: 'Structured programmes for founders and entrepreneurial teams.' },
      { slug: 'leadership-development', name: 'Leadership Development', line: 'Leadership assessment, cultural intelligence and negotiation skills.' },
    ],
  },
];

// Sixth top-level item, above the partner's own max-five cap. It is a method
// section, not a practice: see AI_LIMITS and decision D06.
const AI_NAV = { href: '/en-uk/ai', label: 'AI' };

// AI sits directly after M&A, not at the end. Anchored to the M&A entry rather
// than to a literal index, so reordering PRACTICES moves AI with it instead of
// silently leaving it next to whatever ends up second.
const AI_AFTER = 'm-and-a';

export const NAV = PRACTICES.flatMap((p) => {
  const item = { href: `/en-uk/${p.slug}`, label: p.short };
  return p.slug === AI_AFTER ? [item, AI_NAV] : [item];
});

// An anchor that stops matching does not throw, it just drops AI from the
// navbar — a whole top-level section disappearing with nothing to notice it.
// Fail the build instead.
if (!NAV.some((n) => n.href === AI_NAV.href)) {
  throw new Error(
    `NAV: no practice with slug "${AI_AFTER}", so the AI item was dropped. `
    + `Update AI_AFTER to the slug AI should follow.`,
  );
}

export type Partner = {
  slug: string; initials: string; name: string; role: string;
  focus: string; city: string; email: string; linkedin?: string; photo?: string; bio?: string;
};
/** Source: the team section of adancorporate.com/en-uk/home/. Names, roles,
 *  focus, city, email and LinkedIn are as the firm publishes them. Each person
 *  still re-approves their own entry before launch — see CLAUDE.md. */
export const PARTNERS: Partner[] = [
  { slug: "ajay-mavinkurve", initials: "AM", name: "Ajay Mavinkurve", role: "Managing Partner", focus: "Corporate Finance, M&A, IPO, IB", city: "London", email: "ajay.mavinkurve@adancorporate.com", linkedin: "https://www.linkedin.com/in/ajay-mavinkurve" , photo: "/team/ajay-mavinkurve-v2.webp" , bio: "Ajay is a seasoned senior-level corporate finance executive with 30+ years of diversified experience in Global Corporate Finance, IPOs, Corporate and Tax structuring, Deal structuring, Commercial Negotiation, Valuations, Venture and Private Equity syndication, M&A, Growth Strategy, Distressed Asset Management, Working Capital and Buy-outs for Small & Mid-sized Enterprises (SMEs)." },
  { slug: "chennakeshav-adya", initials: "CA", name: "Chennakeshav (Keshav) Adya", role: "Managing Partner", focus: "Corporate Finance, M&A, Growth", city: "Dubai & London", email: "ck.adya@adancorporate.com", linkedin: "https://www.linkedin.com/in/cadya/", photo: "/team/chennakeshav-adya-v2.webp" , bio: "Chennakeshav (Keshav) is a seasoned business, marketing and technology executive with 20+ years of global corporate and entrepreneurial experience in building global companies from a concept and in leadership roles spanning M&A execution, deal origination, marketing, brand-building, market research and technology delivery." },
  { slug: "sabapaty-suryanarayanan", initials: "SS", name: "Sabapaty (Saba) Suryanarayanan", role: "Managing Partner", focus: "Commercial and Finance", city: "Mumbai, India", email: "sabapatys@adancorporate.com", linkedin: "https://www.linkedin.com/in/sabapaty-suryanarayanan-96a31b4" , photo: "/team/sabapaty-suryanarayanan-v2.webp" , bio: "Saba is a seasoned commercial and finance professional with 30+ years of experience in C-suite roles spanning varied geographies and multiple industry segments, including Manufacturing, Trading, Media and Financial Services in areas such as Deal structuring, Commercial Negotiation, Growth Strategy, Distressed Asset Management, Working Capital Funding, and Buyouts." },
  { slug: "vinayak-hattangadi", initials: "VH", name: "Vinayak Hattangadi", role: "Partner", focus: "Executive Director & Interim CTO", city: "Mumbai, India", email: "vinayak.hattangadi@adancorporate.com", linkedin: "https://www.linkedin.com/in/vinayak-hattangadi/"  , bio: "A seasoned technology and transformation professional with 25+ years of experience in global leadership roles spanning varied geographies and multiple industry segments, including Enterprise Technology, Cloud, and IT Services in areas such as Enterprise Architecture, Cloud Modernization, Cybersecurity, GCC Transformation, Digital Platforms, and Global Delivery Leadership." },
  { slug: "thomas-peutz", initials: "TP", name: "Thomas Peutz", role: "Partner", focus: "Sustainable Energy", city: "Amsterdam", email: "thomas.peutz@adancorporate.com", linkedin: "https://www.linkedin.com/in/thomas-peutz-a7a44116/" , photo: "/team/thomas-peutz-v2.webp" , bio: "Thomas is an innovative entrepreneurial leader with 25+ years of experience in C-suite roles spanning international management and organisational strategy, gained within the cultural sector and the creative industries. As a social entrepreneur, he has in-depth knowledge and passion for new venture development serving on executive and non-executive boards." },
  { slug: "roland-giebitz", initials: "RG", name: "Roland Giebitz", role: "Partner", focus: "Corporate Finance", city: "Hamburg, Germany", email: "roland.giebitz@adancorporate.com", linkedin: "https://www.linkedin.com/in/roland-giebitz-10292158" , photo: "/team/roland-giebitz-v2.webp" , bio: "Roland is a seasoned executive with 30+ years of experience in managing companies and in leading operational and business development projects." },
  { slug: "arun-shroff", initials: "AS", name: "Arun Shroff", role: "Partner", focus: "Operations, Logistics", city: "Pune, India", email: "arun.shroff@adancorporate.com", linkedin: "https://in.linkedin.com/in/arun-shroff" , photo: "/team/arun-shroff-v2.webp" , bio: "Arun Shroff is a seasoned Commercial and Operations leader with 4 decades of experience, working across different industries like Electrical precision parts Manufacturing, Agriculture Business (Pioneering Floriculture in India),and Paper & Paperboards.He managed relationships across countries, cultures, functions, and hierarchies. He has practical expertise in managing manufacturing and trading operations and fostering synergies to provide higher efficiency, products, and customer excellence." },
  { slug: "neeraj-arora", initials: "NA", name: "Neeraj Arora", role: "Partner", focus: "Media Tech Advisor and Investor", city: "London", email: "neeraj.arora@adancorporate.com", linkedin: "https://www.linkedin.com/in/neeraj-arora-16537313/"  , bio: "Neeraj is a specialist and expert in media monetisation and storytelling, his expertise lies in leading transformational strategies that transition traditional business into cutting-edge digital platforms, and in building and coaching high-performing business teams and is renowned for his passion for mentoring emerging leaders, leading complex commercial negotiations and fostering innovation." },
  { slug: "raju-venkataraman", initials: "RV", name: "Raju Venkataraman", role: "Partner", focus: "Executive Coaching & Strategy", city: "Singapore", email: "raju.v@adancorporate.com", linkedin: "https://www.linkedin.com/in/rajuvenka1/" , photo: "/team/raju-venkataraman-v2.webp" , bio: "Raju brings 30+ years of rich C-suite experience from the Corporate world; most recently as CFO & Head of Strategy of Walt Disney Company for South East Asia. He has rich cross-cultural experience across the APAC region and has a special interest in Asian economies. Presently, Raju is powering on senior leaders to fulfil their potential and aspirations amidst change and disruption" },
  { slug: "george-christelis", initials: "GC", name: "George Christelis", role: "Partner", focus: "Southern African region", city: "Johannesburg", email: "george.christelis@adancorporate.com", linkedin: "https://www.linkedin.com/in/george-christelis-05753545/" , photo: "/team/george-christelis-v2.webp" , bio: "George is an experienced finance professional with 20+ years of experience in C-suite roles for listed medium/large sized businesses in sectors such as real estate, construction, engineering and logistics." },
  { slug: "marco-salvini", initials: "MS", name: "Marco Salvini", role: "Partner", focus: "Real Estate", city: "Milan & London", email: "marco.salvini@adancorporate.com", linkedin: "https://www.linkedin.com/in/marcosalvini/" , photo: "/team/marco-salvini-v2.webp" , bio: "Marco is a senior executive with 25+ years of experience in C-suite roles spanning Real Estate leadership, delivering strategy, transformational change and turnaround of underperforming portfolios, assets and companies. Previously, he was the CEO for AIG/Lincoln - AIG Global Real Estate (Italy), where he successfully navigated the 2008 financial crisis and following global recession" },
  { slug: "sandeep-bhat", initials: "SB", name: "Sandeep Bhat", role: "Partner", focus: "PE, Banking, CF", city: "India", email: "sandeep.bhat@adancorporate.com", linkedin: "https://www.linkedin.com/in/sandeep-bhat-59225378/" , photo: "/team/sandeep-bhat-v2.webp" , bio: "Sandeep is a multiskilled professional in the Financial Services industry with 30+ years of experience in C-Suite roles with global banks & PE companies overseeing accounting, financial control, treasury management, tax management, operational risk control, legal and compliance, optimization of IT, HR, and administrative resources helping set up businesses and leading them as a key member of the senior management team across banking, merchant banking, stockbroking, and private equity; was on the international committee for CSR and Offshoring. He keeps abreast of the global financial, commodity, and currency markets amongst which is a keen interest in Technical Analyst for the stocks markets." },
  { slug: "freddie-tshiaba", initials: "FT", name: "Freddie Tshiaba", role: "Partner", focus: "Corporate Finance", city: "London", email: "freddie.tshiaba@adancorporate.com", linkedin: "https://www.linkedin.com/in/tshiaba/" , photo: "/team/freddie-tshiaba-v2.webp" , bio: "Freddie Tshiaba is a senior business leader with 20+ years of significant experience helping investment banks, financial institutions, enterprise software companies and multi-national corporates with strategic initiatives, business development, digital transformation, product management, liquidity risk and treasury management." },
  { slug: "mike-kemball", initials: "MK", name: "Mike Kemball", role: "Partner", focus: "Turnaround & Growth", city: "London", email: "mike.kemball@adancorporate.com", linkedin: "https://www.linkedin.com/in/mikekemball/" , photo: "/team/mike-kemball-v2.webp" , bio: "Mike is a sales transformation expert with 30+ years as an accomplished interim Sales Director and Managing Director in 15+ organisations across Telecom, Technology and Industrial sectors in Europe, India, Africa and the Middle East. Client companies and subsidiaries managed were typically $10m - $300m in revenue with sales teams from 10 up to 250 people." },
  { slug: "thu-nga-haskovcova", initials: "TH", name: "Thu Nga Haskovcova", role: "Partner", focus: "Central Eastern Europe, Law", city: "Prague, Czech Rep.", email: "thu.nga@adancorporate.com", linkedin: "https://www.linkedin.com/in/thu-nga-haskovcova-32431110/" , photo: "/team/thu-nga-haskovcova-v2.webp" , bio: "Thu Nga is a Czech qualified lawyer with 20 years of international experience in M&A, Market Entry (Start-ups), Real Estate, Financing, Private Equity and Corporate law matters. Thu has in-depth local knowledge of the Central Eastern European (CEE) region and working experience in and in-depth knowledge of South East Asia." },
  { slug: "nav-kaplish", initials: "NK", name: "Nav Kaplish", role: "Partner", focus: "Digital, Blockchain & Risk", city: "London", email: "nav.kaplish@adancorporate.com", linkedin: "https://www.linkedin.com/in/navkaplish" , photo: "/team/nav-kaplish-v2.webp" , bio: "Nav is a seasoned business and technology executive with 18+ years of global corporate and entrepreneurial experience in building and managing digital teams and in leadership roles spanning Governance, Risk & Compliance, Audits and conceptualisation and delivery of Blockchain products." },
  { slug: "edgar-garay", initials: "EG", name: "Edgar Garay", role: "Partner", focus: "Corporate Finance", city: "Bogota, Colombia", email: "edgar.garay@adancorporate.com", linkedin: "https://www.linkedin.com/in/garayedgar" , photo: "/team/edgar-garay-v2.webp" , bio: "Edgar is an eclectic digital nomad with 30+ years of experience in diverse asset classes across a broad spectrum of industries and geographies." },
  { slug: "jean-bernard-tanqueray", initials: "JT", name: "Jean-Bernard (JB) Tanqueray", role: "Partner", focus: "Family Offices", city: "Paris & London", email: "jean-bernard@adancorporate.com", linkedin: "https://www.linkedin.com/in/jbtanqueray/" , photo: "/team/jean-bernard-tanqueray-v2.webp" , bio: "Jean-Bernard is a seasoned Wealth and Asset Management executive with 20+ years of experience in investing in both businesses and public capital markets for Single Family Offices and Institutional Investors and has over the years, has developed a deep expertise in all main assets, strategies and styles (volatility & niche arbitrage strategies, event driven, systematic, global macro, deep value)" },
  { slug: "vernon-d-cruz", initials: "VD", name: "Vernon D'Cruz", role: "Partner", focus: "Commercial, Tourism & CSR", city: "Mumbai", email: "vernon.dcruz@adancorporate.com", linkedin: "https://www.linkedin.com/in/vernondcruz/", photo: "/team/vernon-d-cruz-v2.webp" , bio: "Vernon is a distinguished finance professional with 30+ years of experience in mid-sizes service organisations with demonstrated success in providing team leadership and development to foster growth. He has hands on experience in managing and running business with keen interest in Finance, Taxation, Legal, Commercial Negotiations, Commercial, Tourism & CSR." },
  { slug: "craig-tingle", initials: "CT", name: "Craig Tingle", role: "Partner", focus: "Real Estate", city: "Florida & Dubai", email: "craig.tingle@adancorporate.com", linkedin: "https://www.linkedin.com/in/craig-tingle-tingleandassociatespa-a5b93135//" , photo: "/team/craig-tingle-v2.webp" , bio: "Craig is a board-certified real estate attorney with 25+ years of legal experience and has closed several billions of dollars in transactions. His expertise includes: shopping centers, shopping malls, apartment buildings, assisted living facilities, subdivisions, medical campuses and portfolios acquisitions of each of these." },
  { slug: "preethi-hari", initials: "PH", name: "Preethi Hari", role: "Partner", focus: "Risk Management", city: "London", email: "preethi.hari@adancorporate.com" , photo: "/team/preethi-hari-v2.webp" , bio: "Preethi is a versatile senior-level corporate professional with 18+ years of experience in Risk Management, IT Governance, IT Security, Business Continuity, Audits, Compliance and Regulatory. She specialises in COBIT/ COSO framework, ITSM (ITIL), 6-Sigma, SOX etc in Banking, Insurance, Oil & Gas, Shipping, Mining, Logistics, Telecom and Commercial Real Estate." },
  { slug: "suresh-nambiar", initials: "SN", name: "Suresh Nambiar", role: "Partner", focus: "Procurement & Logistics", city: "Manama City, Bahrain", email: "suresh.nambiar@adancorporate.com", linkedin: "https://www.linkedin.com/in/suresh-nambiar-047a0918/" , photo: "/team/suresh-nambiar-v2.webp" , bio: "Suresh is a senior business executive with 30+ years of extensive and diverse experience in C-suite roles spanning General Management, Financial Management, Human Resource Management, Procurement, and Logistics across varied industries such as Packaging, Pharma, Manufacturing and Engineering in areas such as cost optimization, fraud investigation, new product development and acquisitions." },
  { slug: "rauf-akhundov", initials: "RA", name: "Rauf Akhundov", role: "Partner", focus: "Central Asia", city: "Baku, Azerbaijan", email: "r.akhundov@adancorporate.com", linkedin: "https://www.linkedin.com/in/rauf-akhundov-89495022/" , photo: "/team/rauf-akhundov-v2.webp" , bio: "Rauf is a seasoned banker with 20+ years of international experience in C-suite roles spanning fundraising, strategic planning and budgeting, consumer, micro and corporate lending, network management, lobbying and relationship management with government officials in emerging markets." },
  { slug: "sreeraman-p-s", initials: "SP", name: "Sreeraman P.S.", role: "Director", focus: "Investments", city: "Mumbai", email: "sreeraman.ps@adancorporate.com", linkedin: "https://www.linkedin.com/in/sreeraman-p-s-6a4985127/", photo: "/team/sreeraman-p-s-v2.webp" , bio: "Sreeraman has 15+ years of experience in capital markets and investment banking dealing with small and medium enterprises. He has worked in Sales, Private Wealth Management, Investment Banking and Equity advisory roles in companies such as Indiabulls, Motilal Oswal and Kotak Securities." },
  { slug: "ajay-sethi", initials: "AS", name: "Ajay Sethi", role: "Director", focus: "Market Development", city: "London", email: "sethi@adancorporate.com", linkedin: "https://www.linkedin.com/in/ajay-sethi-91968b177/" , photo: "/team/ajay-sethi-v2.webp" , bio: "Ajay Sethi is an innovative professional with a strong entrepreneurial spirit, backing 35+ years of experience across management of growing businesses, sales and accountancy. Ajay has in-depth knowledge of business management, brand development, sales & marketing, product sourcing, fund-raising, accounting procedures, and risk mitigation." },
  { slug: "varun-nadkarni", initials: "VN", name: "Varun Nadkarni", role: "Financial Analyst", focus: "Accounting & Finance", city: "India", email: "varun.nadkarni@adancorporate.com", linkedin: "https://www.linkedin.com/in/varun-nadkarni-43843a104/"  , bio: "Varun having more than 2.5 years of experience in the field of accounts and finance, holds MBA degree in Finance and International Business from Amity University, India and has interest and passion for Equities and mutual funds and analysing of financial statements." },
  { slug: "heena-tilwani", initials: "HT", name: "Heena Tilwani", role: "Financial Analyst", focus: "Accounting & Finance", city: "India", email: "heena.tilwani@adancorporate.com", linkedin: "https://www.linkedin.com/in/heena-tilwani-b73a71168/"  , bio: "Heena is a financial analyst and Intermediate Accountant with over 5+ years of expertise in financial accounting, analysis, and reporting. She is experienced in providing monthly/quarterly reports and performance KPIs. She is interested in financial modelling, process improvement, and data analytics." },
  { slug: "shreyash-gandhi", initials: "SG", name: "Shreyash Gandhi", role: "Financial Analyst", focus: "M&A, Accounting & Finance", city: "India", email: "shreyash.gandhi@adancorporate.com", linkedin: "https://www.linkedin.com/in/cashreyash/"  , bio: "Shreyash is a Chartered Accountant specializing in business valuation, due diligence, and strategic advisory. Formerly with Deloitte, he led international engagements across Europe, Canada, and the Middle East. He focuses on transaction structuring and startup valuations to drive value in global investment decisions." },
  { slug: "mahimaa-a-b", initials: "MA", name: "Mahimaa A.B", role: "Financial Analyst", focus: "Marketing, Accounting & Finance", city: "London", email: "mahima.baindur@adancorporate.com", linkedin: "https://www.linkedin.com/in/mahimaabaindur/"  , bio: "A marketing and strategy professional with experience spanning brand campaigns, partnerships, business strategy, and market research across the education and corporate sectors, with a strong focus on consumer marketing, FMCG insights, brand building, and strategy-driven business growth." },
  { slug: "harsh-katiyar", initials: "HK", name: "Harsh Katiyar", role: "Corporate Intern (Technology)", focus: "Full-Stack Engineering, Blockchain & AI", city: "India", email: "katiyarh76@gmail.com", linkedin: "https://www.linkedin.com/in/harsh-katiyar-46682625b/"  , bio: "A Computer Science and Business Systems undergraduate with experience spanning Full-Stack Engineering, Distributed Systems, Blockchain Technologies, Cloud Computing, Database Architecture, Scalable Application Development, System Design, and AI-driven Solutions, with strong proficiency in Java, C/C++, JavaScript, Node.js, SQL, RESTful Architectures, and modern software engineering practices focused on building secure, high-performance, and scalable digital platforms." },
  { slug: "kieran-bourke", initials: "KB", name: "Kieran Bourke", role: "Advisor", focus: "Risk Management", city: "Singapore", email: "kieran.bourke@adancorporate.com", linkedin: "https://www.linkedin.com/in/kieran-bourke-006a511a/" , photo: "/team/kieran-bourke-v2.webp" , bio: "Kieran is a Financial Risk Management expert with 25+ years of broad global Financial Services experience across Market, Traded Credit, Operational, Regulatory, and Enterprise Risk Management protocols across 4 continents. He was a Managing Director at Standard Chartered Bank at London & Singapore, where he established the commodities market risk function from scratch." },
  { slug: "dipak-khot", initials: "DK", name: "Dipak Khot", role: "Advisor", focus: "Risk Management", city: "London", email: "dipak.khot@adancorporate.com", linkedin: "https://www.linkedin.com/in/dipak-khot-212623/" , photo: "/team/dipak-khot-v2.webp" , bio: "Dipak is an accomplished client-focused banker with nearly 3 decades of experience in Treasury/ Market risk management. He has an exceptional understanding of global financial markets, banking, FX/ IR hedging/ structuring, liquidity management and an ability to leverage the knowledge of current economic, financial, accounting, regulatory and industry climate to develop effective hedging strategies." },
];
/** Managing Partners and Partners, in published order. */
export const SENIOR = PARTNERS.filter((p) => p.role.includes('Partner'));

export function practiceBySlug(slug: string) {
  return PRACTICES.find((p) => p.slug === slug);
}
export function serviceBySlug(practice: string, service: string) {
  const p = practiceBySlug(practice);
  return p ? { practice: p, service: p.services.find((s) => s.slug === service) } : null;
}

/* ---------------------------------------------------------------------------
   Copy below is taken from adancorporate.com, not written fresh. Source page is
   named on each block. Grammar slips in the original are corrected in place and
   listed in audit/copy-provenance.md; wording and meaning are unchanged.
   --------------------------------------------------------------------------- */

/** Source: /en-uk/home/ and /en-uk/about-us/company-overview.html — "Who we are". */
export const WHO_WE_ARE = [
  'Adan Corporate is an international corporate advisory firm with global reach through an expansive network of multi-disciplinary corporate professionals, mostly former C-suite executives of listed companies.',
  'Success often means being able to navigate through a complex set of challenges, issues, opportunities and risks with the right partners at the right time.',
  'Our team has provided a wide range of bespoke advisory services to small and medium-sized firms at every step of the value creation journey — from seed funding to IPOs.',
];

/** Source: /en-uk/home/ and company-overview — "What we do". */
export const WHAT_WE_DO = [
  'We specialise in providing junior and mid-tier growth firms with the widest reach to cross-border financing and transactions.',
  'The spectrum of our relationships with key decision makers helps us assist clients with innovative forms of financing.',
  'We work on a long-term relationship basis with banks, PE/VC funds, promoters and investors, built on trust, transparency and results.',
];

/** Source: /en-uk/about-us/the-adan-advantage.html — the firm's own positioning line. */
export const ADVANTAGE_LINE = 'Small enough to care. Big enough to get you there.';

/** Source: "Our Breadth and Depth of Services", home + company-overview + the-adan-advantage.
 *  The "19 countries" figure in the original Location line is one of three
 *  different counts published across the site; it is replaced by the office list
 *  in OFFICES, which is countable. See findings register F02. */
export const BREADTH: { name: string; line: string }[] = [
  { name: 'Sector agnostic', line: 'We work in a range of areas — from conventional industries such as mining to high-tech such as AR/VR.' },
  { name: 'Location agnostic', line: 'Our partners are based in the offices listed below, across three continents, and our networks span the globe.' },
  { name: 'Deal-value agnostic', line: 'Our deal value ranges between $1m and $500m and our focus is the mid-market segment.' },
  { name: 'Deal-type agnostic', line: 'We provide a wide range of bespoke services to SMEs and funds at every step of the value creation journey.' },
];

/** Source: "How do we do it? We use our Extensive Global Network." home + company-overview. */
export const NETWORK: { group: string; items: string[] }[] = [
  { group: 'Funds', items: ['Private equity funds', 'Venture capital funds', 'Sovereign wealth funds', 'Hedge funds', 'Pension funds'] },
  { group: 'Financial firms', items: ['Global banks', 'NBFCs', 'Trade finance firms', 'Regional banks'] },
  { group: 'Specialised funds', items: ['Impact funds', 'Long-only investors', 'Infrastructure funds', 'Green funds', 'Renewable energy funds'] },
  { group: 'Government funds', items: ['Regional development banks', 'Development agencies', 'Export credit agencies'] },
  { group: 'Sophisticated investors', items: ['Single family offices', 'Multi family offices', 'High net worth networks'] },
  { group: 'Power networks', items: ['Strategic investors', 'Top-tier business schools', 'Personal networks', 'Strategic partners'] },
];

/** Source: "A selection of completed transactions", company-overview.
 *  Deal values are as published by the firm. Held for partner sign-off before
 *  launch under the confirmed-source rule — see findings register F53. */
export type Deal = { title: string; region: string; size: string; sectors: string[]; expertise: string[] };
export const DEALS: Deal[] = [
  { title: "IPO of India's largest film production and distribution firm", region: 'Europe, Asia, US', size: '$1bn', sectors: ['Media & Entertainment'], expertise: ['IPO', 'Business Strategy', 'Credit Ratings Assistance'] },
  { title: 'Selection of project funding partners for a multinational technical consultancy firm based in Asia', region: 'Asia', size: '$200m', sectors: ['Technology'], expertise: ['Project Finance', 'Deal Strategy'] },
  { title: 'Real-estate private equity fund and fund placement', region: 'Europe', size: '$200m', sectors: ['Private Equity'], expertise: ['Fund Placement', 'Private Equity', 'Corporate Strategy'] },
  { title: "Corporate debt and sales tax benefits for Asia's largest private mining company with the largest investment in renewable energy", region: 'Asia', size: '$150m', sectors: ['Metals & Mining', 'Green Energy'], expertise: ['Debt Financing', 'Project Finance', 'Deal Strategy'] },
  { title: "End-to-end IPO advisory for Asia's leading adhesive brand", region: 'Asia', size: '$150m', sectors: ['Chemicals & Polymers', 'Industrial Manufacturing'], expertise: ['IPO', 'Credit Ratings Assistance', 'Deal Strategy'] },
  { title: "Business strategy and project finance for Asia's leading theme park", region: 'Asia', size: 'Confidential', sectors: ['Hospitality & Leisure', 'Media & Entertainment'], expertise: ['Project Finance', 'Equity Financing', 'Business Strategy'] },
];

/** Source: /en-uk/about-us/global-locations.html. Fourteen offices in thirteen
 *  countries across three continents — counted from the firm's own list. */
/* `zone` is the office's IANA time zone. Nothing renders it since the hero row
 * was removed; it stays because it is part of the office record rather than a
 * view concern, and it is the expensive half to reconstruct. */
export type Office = { continent: string; country: string; city: string; tel?: string; address?: string; zone?: string };
export const OFFICES: Office[] = [
  { continent: 'Europe', country: 'United Kingdom', city: 'London', zone: 'Europe/London', address: '27 Old Gloucester Street, London WC1N 3AX', tel: '+44 7917 120849' },
  { continent: 'Europe', country: 'Switzerland', city: 'Zurich', zone: 'Europe/Zurich', address: 'Glattbrugg, Zurich 8152', tel: '+41 77 976 7674' },
  { continent: 'Europe', country: 'The Netherlands', city: 'Amsterdam', zone: 'Europe/Amsterdam', address: 'Herengracht 268, 1016 BW Amsterdam', tel: '+31 615 35 3660' },
  { continent: 'Europe', country: 'Czech Republic', city: 'Prague', zone: 'Europe/Prague', address: '838/9 Vaclavske nam., Prague 110 00', tel: '+420 226 807 069' },
  { continent: 'Europe', country: 'Italy', city: 'Milan', zone: 'Europe/Rome', tel: '+44 7469 955740' },
  { continent: 'Europe', country: 'France', city: 'Paris', zone: 'Europe/Paris', tel: '+420 226 807 069' },
  { continent: 'Asia', country: 'India', city: 'Mumbai', zone: 'Asia/Kolkata', address: '2nd Floor, Lakshdeep, Gulmohar Lane No. 5, Juhu JVPD Scheme, Mumbai 400049', tel: '+91 22 2628 6599' },
  { continent: 'Asia', country: 'United Arab Emirates', city: 'Dubai', zone: 'Asia/Dubai', address: 'Sheikh Zayed Road, Dubai', tel: '+971 55 455 8146' },
  { continent: 'Asia', country: 'United Arab Emirates', city: 'Abu Dhabi', zone: 'Asia/Dubai', address: 'Garden View, Khalifa Street, Abu Dhabi', tel: '+971 56 264 4124' },
  { continent: 'Asia', country: 'Singapore', city: 'Singapore', zone: 'Asia/Singapore', address: 'Simei Rise #02-48, Singapore 528808' },
  { continent: 'Asia', country: 'Kazakhstan', city: 'Almaty', zone: 'Asia/Almaty', address: '46 Valikhanov Str., Yasamal Office 4, Almaty 050046', tel: '+994 50 278 7870' },
  { continent: 'Asia', country: 'Azerbaijan', city: 'Baku', zone: 'Asia/Baku', address: '574-2 Hagverdiyev St, Yasamal district, Baku', tel: '+994 50 278 7870' },
  { continent: 'Africa', country: 'South Africa', city: 'Johannesburg', zone: 'Africa/Johannesburg', address: "60 Arum, St John's Avenue, Senderwood, Johannesburg", tel: '+27 72 969 9865' },
  { continent: 'Africa', country: "Côte d'Ivoire", city: 'Abidjan', zone: 'Africa/Abidjan', address: "26 BP 1028, Abidjan 26" },
];
/* Tenure, parsed out of the published bios rather than asserted. Twenty-four of
 * the thirty-two bios state a figure ("30+ years", "20 years"); the rest state
 * none and are simply not counted. SENIORITY_YEARS is the largest round tenure
 * that a majority of those still clear, so the claim on the homepage is the
 * weakest one the bios actually support - if a bio is edited down, the figure
 * falls on its own instead of quietly becoming false.
 *
 * Non-negotiable: no claim about track record ships without a source. The
 * source here is the bio text itself, which is why this is computed. */
const STATED_YEARS = PARTNERS
  .map((p) => p.bio?.match(/(\d{2})\+?\s+years/i)?.[1])
  .filter(Boolean)
  .map(Number);

/* Largest transaction the firm itself discloses on its deals list. Not a
 * cumulative total: one of the six is marked Confidential, so any sum would be
 * a floor presented as a figure. The live site publishes "$5bn value of
 * transactions"; nothing in the published record supports it, so it is not
 * carried across until a partner confirms it against a source. */
export const LARGEST_DEAL = DEALS
  .map((d) => d.size)
  .filter((v) => /^\$/.test(v))
  .sort((x, y) => {
    const n = (v: string) => Number(v.replace(/[^0-9.]/g, '')) * (/bn/i.test(v) ? 1000 : 1);
    return n(y) - n(x);
  })[0];

export const YEARS_STATED_COUNT = STATED_YEARS.length;
export const SENIORITY_YEARS = [35, 30, 25, 20, 15].find(
  (y) => STATED_YEARS.filter((v) => v >= y).length * 2 > STATED_YEARS.length,
) ?? 15;
export const SENIORITY_SHARE = STATED_YEARS.filter((v) => v >= SENIORITY_YEARS).length;

/** Offices grouped by continent, in the order the list already uses. */
export const OFFICES_BY_CONTINENT = OFFICES.reduce<{ continent: string; cities: Office[] }[]>(
  (acc, o) => {
    const found = acc.find((g) => g.continent === o.continent);
    if (found) found.cities.push(o);
    else acc.push({ continent: o.continent, cities: [o] });
    return acc;
  }, []);

/* The capital-flow diagram the firm publishes under "What we do".
 * Source: /en-uk/home/index.html, the raster at assets/images (9 source boxes,
 * two SME boxes, lenders, PE/VC, and an Adan node on every arrow).
 *
 * Redrawn rather than reused: the original is a Word-era raster with bevels and
 * drop shadows, it carries text far below the 14px floor once scaled, and it
 * cannot reflow at 375px. One deliberate change to the content — the original
 * draws "Small & Medium Sized Enterprises" twice, once before growth and once
 * before exit, which is the single thing that makes it hard to read. It is one
 * entity at two stages, so it is drawn once and the stages sit on the arrows. */
export const CAPITAL_SOURCES = [
  'Endowment funds', 'Sovereign wealth funds', 'Pension funds',
  'Family offices', 'Institutional investors', 'Funds of funds',
  'HNIs \u2014 high-net-worth individuals', 'Insurance companies', 'Government funds',
];

/** What Adan does on the arrow between a mid-market firm and its exit. */
export const VALUE_CREATION = ['M&A', 'Go to market', 'Growth', 'Alliances & JVs'];

/** What Adan arranges on the arrow from a lender. */
export const LENDER_INSTRUMENTS = ['Debt', 'Working capital'];

export const SOURCE_COUNT = CAPITAL_SOURCES.length;

export const OFFICE_COUNT = OFFICES.length;
export const COUNTRY_COUNT = new Set(OFFICES.map((o) => o.country)).size;
export const CONTINENT_COUNT = new Set(OFFICES.map((o) => o.continent)).size;

/** Source: /en-uk/about-us/insights-blog.html. Every item was published to an
 *  author's LinkedIn, not to this domain, so each is labelled and linked as such
 *  rather than presented as an owned article. See findings register F54. */
export type Insight = { title: string; date: string; iso: string; author: string; role: string; line: string; href: string };
export const INSIGHTS: Insight[] = [
  { title: 'Negotiating business deals in Asia', date: '12 August 2019', iso: '2019-08-12', author: 'Raju Venkataraman', role: 'Partner, Executive Coaching', line: 'The business etiquette dominant in different countries across Asia, and the implications for how one should conduct business negotiations.', href: 'https://www.linkedin.com/pulse/negotiating-business-deals-asia-raju-venkataraman/' },
  { title: 'ABCN (Anybody can negotiate)', date: '5 July 2019', iso: '2019-07-05', author: 'Raju Venkataraman', role: 'Partner, Executive Coaching', line: "The theme of a talk to MasterCard's 70-plus member APAC Legal, Franchise and Integrity team in Singapore.", href: 'https://www.linkedin.com/pulse/abcn-anybody-can-negotiate-raju-venkataraman' },
  { title: 'Purpose in life, or… Ikigai', date: '23 July 2019', iso: '2019-07-23', author: 'Chennakeshav (Keshav) Adya', role: 'Managing Partner', line: 'Finding your Ikigai is considered the key to longevity — and to happiness.', href: 'https://www.linkedin.com/posts/cadya_thezymurgistdiaries-growthmindset-leadership-activity-6557304811748900864-6i5g' },
  { title: 'Change is the heartbeat of growth', date: '23 June 2019', iso: '2019-06-23', author: 'Chennakeshav (Keshav) Adya', role: 'Managing Partner', line: 'Change is a normal part of our lives, but it is uncomfortable for most people because it makes them feel they have lost control.', href: 'https://www.linkedin.com/posts/cadya_thezymurgistdiaries-growthmindset-leadership-activity-6550847762307534848-eyBZ' },
  { title: 'Commodities market risk management', date: '10 January 2019', iso: '2019-01-10', author: 'Kieran Bourke', role: 'Advisor, Risk Management', line: 'High-profile losses in commodities trading, their root cause, and the building blocks of a second-line market risk framework capable of containing them.', href: 'https://www.linkedin.com/pulse/few-cases-commodities-market-risk-management-kieran-bourke/' },
  { title: 'So, what do you do?', date: '18 March 2018', iso: '2018-03-18', author: 'Raju Venkataraman', role: 'Partner, Executive Coaching', line: 'Most of us wait until a major crisis shakes us to our foundation before we take the time to examine our lives.', href: 'https://www.linkedin.com/pulse/so-what-do-you-raju-venkataraman' },
];

/** Not scraped. The live Digital pages are generic explainers of what AI is
 *  ("Artificial Intelligence is the new electricity", machine learning
 *  definitions, autonomous driving) with no Adan method, no engagement and no
 *  named work — the aspirational content behind decision D01. This is the
 *  approved replacement: a description of method, and an explicit statement of
 *  where judgement stays human. See findings register F60. */
export const AI_METHOD = {
  title: 'AI and automation in risk and diligence',
  standfirst: 'This is a description of method, not a claim about past work.',
  body: [
    'Diligence has always involved reading a great deal quickly: contracts, ledgers, policies, board minutes. We use automated tooling to widen what gets read and to flag anomalies for a person to examine — inconsistent terms across a contract set, gaps in a control narrative, figures that do not reconcile between documents.',
    'What it does not do is form the judgement. Every flag is reviewed by a partner, every conclusion is one a named individual will defend, and nothing reaches a client that has not been checked by someone accountable for it.',
    'Where we use these tools on an engagement, we say so in the engagement letter, and we explain what was automated and what was not.',
  ],
  href: '/en-uk/ai',
};

/** Where the tooling in AI_METHOD is actually applied. Every entry maps to a
 *  service the firm already sells, so this claims a method inside existing work
 *  rather than a new practice. Nothing here asserts a delivered engagement —
 *  see F60 and decision D01 on the live site's aspirational Digital pages. */
export const AI_APPLICATIONS: { name: string; line: string; href: string; practice: string }[] = [
  { name: 'Contract set review',
    line: 'Reading a full contract set for inconsistent terms, non-standard clauses and obligations that do not match the disclosure schedule.',
    href: '/en-uk/m-and-a/buy-side', practice: 'Buy-side' },
  { name: 'Document reconciliation',
    line: 'Figures that do not reconcile between the model, the management accounts and the statutory filings, flagged for a person to examine.',
    href: '/en-uk/m-and-a/company-valuation', practice: 'Company Valuation' },
  { name: 'Control narrative gaps',
    line: 'Comparing a stated control framework against the evidence supplied for it, and listing what is asserted but not evidenced.',
    href: '/en-uk/risk/internal-audit', practice: 'Internal Audit' },
  { name: 'Governance and SOX readiness',
    line: 'Mapping control documentation to the framework it claims to satisfy, before the external auditor does it for you.',
    href: '/en-uk/risk/governance-sox-and-it-controls', practice: 'Governance, SOX & IT Controls' },
  { name: 'Risk reporting',
    line: 'Turning a large exposure set into a report a board can act on, with the working shown rather than a score.',
    href: '/en-uk/risk/risk-reporting-and-analytics', practice: 'Risk Reporting & Analytics' },
  { name: 'Post-merger integration tracking',
    line: 'Tracking promised synergies against the documents that record whether they were delivered.',
    href: '/en-uk/m-and-a/post-merger-integration', practice: 'Post-Merger Integration' },
];

/** Stated plainly, because the live Digital pages claimed the opposite by
 *  implication and had nothing behind them. */
export const AI_LIMITS: string[] = [
  'We do not claim an AI product. There is nothing to license and nothing to buy.',
  'We do not let tooling form a judgement. Every flag is reviewed by a partner before it reaches you.',
  'We do not put client material into a service that trains on it.',
  'We do not use it silently. Where it is used on an engagement, the engagement letter says so and says what was automated.',
];
