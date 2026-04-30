export const ROLES = [
  'Founder',
  'Co-founder',
  'CEO',
  'CTO',
  'Product',
  'Marketing',
  'Sales',
  'Investor',
  'Advisor',
  'Otro',
] as const

export const INDUSTRIES = [
  'SaaS',
  'Fintech',
  'E-commerce',
  'Healthtech',
  'Edtech',
  'AI',
  'Web3',
  'Climate',
  'Marketplace',
  'Otro',
] as const

export const INTENTS = [
  'Cofounder',
  'Clientes',
  'Inversión',
  'Partners',
  'Hiring',
  'Networking',
  'Mentoría',
] as const

export const INTERESTS = [
  'Tecnología',
  'Producto',
  'Growth',
  'Ventas',
  'Fundraising',
  'Liderazgo',
  'Operaciones',
  'Diseño',
  'Data',
  'Legal',
] as const

export type Role = (typeof ROLES)[number]
export type Industry = (typeof INDUSTRIES)[number]
export type Intent = (typeof INTENTS)[number]
export type Interest = (typeof INTERESTS)[number]
