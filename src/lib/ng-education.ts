export const NIGERIAN_UNIVERSITIES = [
  // Federal Universities
  'University of Lagos',
  'University of Ibadan', 
  'Ahmadu Bello University',
  'University of Nigeria Nsukka',
  'Obafemi Awolowo University',
  'University of Benin',
  'University of Ilorin',
  'Bayero University Kano',
  'University of Jos',
  'University of Calabar',
  'University of Port Harcourt',
  'University of Maiduguri',
  'Federal University of Technology Akure',
  'Federal University of Technology Owerri',
  'Federal University of Technology Minna',
  
  // State Universities
  'Lagos State University',
  'Ambrose Alli University',
  'Delta State University',
  'Enugu State University',
  'Imo State University',
  'Kaduna State University',
  'Kano State University',
  'Rivers State University',
  
  // Private Universities
  'Covenant University',
  'Babcock University',
  'American University of Nigeria',
  'Bowen University',
  'Crawford University',
  'Redeemer\'s University',
  'Pan-Atlantic University',
  'Afe Babalola University',
  'Bells University of Technology',
  'Caleb University',
  
  // Polytechnics
  'Yaba College of Technology',
  'Federal Polytechnic Nekede',
  'Kaduna Polytechnic',
  'Federal Polytechnic Bida',
  'Lagos State Polytechnic',
  'Moshood Abiola Polytechnic',
  
  // Colleges of Education
  'Federal College of Education Zaria',
  'Adeniran Ogunsanya College of Education',
  'Emmanuel Alayande College of Education',
];

export const NIGERIAN_COMPANIES = [
  // Fintech
  'Flutterwave',
  'Paystack',
  'Interswitch',
  'Kuda Bank',
  'PiggyVest',
  'Cowrywise',
  'Carbon',
  'FairMoney',
  
  // E-commerce
  'Jumia',
  'Konga',
  'Jiji',
  'PayPorte',
  
  // Tech/Startups
  'Andela',
  'SystemSpecs',
  'CcHub',
  'Techstars Lagos',
  'Ventures Platform',
  'TalentQL',
  
  // Traditional Companies
  'Dangote Group',
  'MTN Nigeria',
  'Airtel Nigeria',
  'Globacom',
  'Access Bank',
  'Guaranty Trust Bank',
  'Zenith Bank',
  'First Bank',
  'UBA',
  'Stanbic IBTC',
  
  // Oil & Gas
  'Shell Nigeria',
  'Chevron Nigeria',
  'Total Nigeria',
  'NNPC',
  'Oando',
  'Seplat',
];

export function isNigerianUniversity(institution: string): boolean {
  return NIGERIAN_UNIVERSITIES.some(uni => 
    institution.toLowerCase().includes(uni.toLowerCase()) ||
    uni.toLowerCase().includes(institution.toLowerCase())
  );
}

export function isNigerianCompany(company: string): boolean {
  return NIGERIAN_COMPANIES.some(comp => 
    company.toLowerCase().includes(comp.toLowerCase()) ||
    comp.toLowerCase().includes(company.toLowerCase())
  );
}

export function getUniversityRanking(institution: string): number {
  const topTier = ['University of Lagos', 'University of Ibadan', 'Covenant University', 'Obafemi Awolowo University'];
  const secondTier = ['Ahmadu Bello University', 'University of Nigeria Nsukka', 'Babcock University'];
  
  if (topTier.some(uni => institution.toLowerCase().includes(uni.toLowerCase()))) return 95;
  if (secondTier.some(uni => institution.toLowerCase().includes(uni.toLowerCase()))) return 85;
  if (isNigerianUniversity(institution)) return 75;
  return 60; // International or unknown
}