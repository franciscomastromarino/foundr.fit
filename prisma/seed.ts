import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

const SEED_USERS = [
  {
    name: 'Martina López',
    email: 'martina@seed.local',
    profile: {
      fullName: 'Martina López',
      whatsappE164: '+5491123456701',
      role: 'Founder',
      startup: 'PayFlow',
      startupUrl: 'https://payflow.com.ar',
      industries: ['Fintech', 'SaaS'],
      lookingFor: ['Inversión', 'Partners'],
      interests: ['Fundraising', 'Growth'],
      bio: 'Ex Mercado Pago, ahora construyendo pagos B2B para PyMEs',
      city: 'Buenos Aires',
    },
  },
  {
    name: 'Santiago Ruiz',
    email: 'santiago@seed.local',
    profile: {
      fullName: 'Santiago Ruiz',
      whatsappE164: '+5491123456702',
      role: 'CTO',
      startup: 'EduNova',
      startupUrl: 'https://edunova.io',
      industries: ['Edtech', 'AI'],
      lookingFor: ['Cofounder', 'Hiring'],
      interests: ['Tecnología', 'Producto', 'Data'],
      bio: 'Full-stack dev, 10 años en startups, busco co-founder comercial',
      city: 'Córdoba',
    },
  },
  {
    name: 'Valentina Torres',
    email: 'valentina@seed.local',
    profile: {
      fullName: 'Valentina Torres',
      whatsappE164: '+5491123456703',
      role: 'CEO',
      startup: 'GreenBox',
      startupUrl: 'https://greenbox.lat',
      industries: ['Climate', 'Marketplace'],
      lookingFor: ['Clientes', 'Networking'],
      interests: ['Ventas', 'Liderazgo'],
      bio: 'Marketplace de productos sustentables, operando en 3 países',
      city: 'Rosario',
    },
  },
  {
    name: 'Tomás Fernández',
    email: 'tomas@seed.local',
    profile: {
      fullName: 'Tomás Fernández',
      whatsappE164: '+5491123456704',
      role: 'Product',
      startup: 'HealthPing',
      startupUrl: 'https://healthping.app',
      industries: ['Healthtech', 'SaaS'],
      lookingFor: ['Inversión', 'Mentoría'],
      interests: ['Producto', 'Diseño'],
      bio: 'PM en salud digital, construyendo telemedicina async',
      city: 'Buenos Aires',
    },
  },
  {
    name: 'Camila Herrera',
    email: 'camila@seed.local',
    profile: {
      fullName: 'Camila Herrera',
      whatsappE164: '+5491123456705',
      role: 'Marketing',
      startup: 'ShopLocal',
      industries: ['E-commerce', 'Marketplace'],
      lookingFor: ['Partners', 'Networking'],
      interests: ['Growth', 'Ventas'],
      bio: 'Growth marketer, ex Tiendanube, especialista en D2C',
      city: 'Buenos Aires',
    },
  },
  {
    name: 'Lucas Méndez',
    email: 'lucas@seed.local',
    profile: {
      fullName: 'Lucas Méndez',
      whatsappE164: '+5491123456706',
      role: 'Founder',
      startup: 'CryptoGuard',
      startupUrl: 'https://cryptoguard.io',
      industries: ['Web3', 'Fintech'],
      lookingFor: ['Cofounder', 'Inversión'],
      interests: ['Tecnología', 'Fundraising'],
      bio: 'Seguridad para wallets cripto, pre-seed cerrado',
      city: 'Mendoza',
    },
  },
  {
    name: 'Sofía Aguirre',
    email: 'sofia@seed.local',
    profile: {
      fullName: 'Sofía Aguirre',
      whatsappE164: '+5491123456707',
      role: 'Investor',
      startup: 'Patagonia Ventures',
      industries: ['SaaS', 'AI'],
      lookingFor: ['Networking', 'Mentoría'],
      interests: ['Fundraising', 'Liderazgo', 'Operaciones'],
      bio: 'Angel investor, 12 startups en portfolio, foco en LatAm SaaS',
      city: 'Buenos Aires',
    },
  },
  {
    name: 'Mateo Giménez',
    email: 'mateo@seed.local',
    profile: {
      fullName: 'Mateo Giménez',
      whatsappE164: '+5491123456708',
      role: 'Co-founder',
      startup: 'DataPulse',
      startupUrl: 'https://datapulse.ai',
      industries: ['AI', 'SaaS'],
      lookingFor: ['Clientes', 'Hiring'],
      interests: ['Data', 'Tecnología', 'Producto'],
      bio: 'Analytics en tiempo real para e-commerce, YC reject x2 😅',
      city: 'Buenos Aires',
    },
  },
  {
    name: 'Isabella Paz',
    email: 'isabella@seed.local',
    profile: {
      fullName: 'Isabella Paz',
      whatsappE164: '+5491123456709',
      role: 'Sales',
      startup: 'LegalBot',
      startupUrl: 'https://legalbot.com.ar',
      industries: ['AI', 'SaaS'],
      lookingFor: ['Partners', 'Clientes'],
      interests: ['Ventas', 'Legal'],
      bio: 'Automatización legal con AI para estudios jurídicos',
      city: 'La Plata',
    },
  },
  {
    name: 'Nicolás Vega',
    email: 'nicolas@seed.local',
    profile: {
      fullName: 'Nicolás Vega',
      whatsappE164: '+5491123456710',
      role: 'Advisor',
      startup: 'Ex-Globant',
      industries: ['SaaS', 'AI', 'Fintech'],
      lookingFor: ['Networking', 'Mentoría'],
      interests: ['Liderazgo', 'Operaciones', 'Tecnología'],
      bio: 'Ex VP Globant, ahora advisor de startups early stage',
      city: 'Buenos Aires',
    },
  },
  {
    name: 'Julieta Romero',
    email: 'julieta@seed.local',
    profile: {
      fullName: 'Julieta Romero',
      whatsappE164: '+5491123456711',
      role: 'Founder',
      startup: 'PetConnect',
      startupUrl: 'https://petconnect.ar',
      industries: ['Marketplace', 'E-commerce'],
      lookingFor: ['Inversión', 'Cofounder'],
      interests: ['Producto', 'Growth', 'Diseño'],
      bio: 'Marketplace de servicios para mascotas, bootstrapped y rentable',
      city: 'Tucumán',
    },
  },
  {
    name: 'Federico Campos',
    email: 'federico@seed.local',
    profile: {
      fullName: 'Federico Campos',
      whatsappE164: '+5491123456712',
      role: 'CTO',
      startup: 'AgriTech AR',
      startupUrl: 'https://agritech.ar',
      industries: ['Climate', 'AI'],
      lookingFor: ['Hiring', 'Partners'],
      interests: ['Tecnología', 'Data'],
      bio: 'Sensores IoT + AI para agricultura de precisión',
      city: 'Pergamino',
    },
  },
  {
    name: 'Antonella Díaz',
    email: 'antonella@seed.local',
    profile: {
      fullName: 'Antonella Díaz',
      whatsappE164: '+5491123456713',
      role: 'CEO',
      startup: 'FitMind',
      startupUrl: 'https://fitmind.app',
      industries: ['Healthtech', 'AI'],
      lookingFor: ['Inversión', 'Networking'],
      interests: ['Fundraising', 'Liderazgo'],
      bio: 'App de bienestar mental para empresas, +50 clientes B2B',
      city: 'Buenos Aires',
    },
  },
  {
    name: 'Emiliano Costa',
    email: 'emiliano@seed.local',
    profile: {
      fullName: 'Emiliano Costa',
      whatsappE164: '+5491123456714',
      role: 'Founder',
      startup: 'DevHire',
      industries: ['SaaS', 'Marketplace'],
      lookingFor: ['Clientes', 'Partners'],
      interests: ['Ventas', 'Growth', 'Operaciones'],
      bio: 'Plataforma de hiring para devs LatAm, 200+ placements',
      city: 'Mar del Plata',
    },
  },
  {
    name: 'Renata Sánchez',
    email: 'renata@seed.local',
    profile: {
      fullName: 'Renata Sánchez',
      whatsappE164: '+5491123456715',
      role: 'Co-founder',
      startup: 'StyleBox',
      startupUrl: 'https://stylebox.la',
      industries: ['E-commerce', 'AI'],
      lookingFor: ['Inversión', 'Mentoría'],
      interests: ['Diseño', 'Producto'],
      bio: 'Personal shopping con AI, creciendo 30% MoM',
      city: 'Buenos Aires',
    },
  },
]

const SEED_EVENTS = [
  {
    title: 'Startup Pitch Night BA',
    description: 'Noche de pitches para founders early-stage. 5 minutos por startup, feedback de inversores y networking post-evento.',
    date: new Date('2026-06-15T19:00:00'),
    endDate: new Date('2026-06-15T22:00:00'),
    location: 'ÁreaT res, Palermo, Buenos Aires',
    url: 'https://meetup.com/startup-pitch-night-ba',
    industries: ['SaaS', 'Fintech', 'AI'],
  },
  {
    title: 'AI Builders Meetup',
    description: 'Meetup mensual para builders de productos con AI. Demos en vivo, lightning talks y birras.',
    date: new Date('2026-06-22T18:30:00'),
    endDate: new Date('2026-06-22T21:00:00'),
    location: 'WeWork Libertador, Buenos Aires',
    url: 'https://lu.ma/ai-builders-ba',
    industries: ['AI', 'SaaS'],
  },
  {
    title: 'Fintech Forum Argentina',
    description: 'Conferencia anual de fintech con speakers de Mercado Pago, Ualá, Brubank y más. Paneles, workshops y networking.',
    date: new Date('2026-07-10T09:00:00'),
    endDate: new Date('2026-07-10T18:00:00'),
    location: 'Centro de Convenciones Buenos Aires',
    url: 'https://fintechforum.ar',
    industries: ['Fintech', 'SaaS'],
  },
  {
    title: 'Hackathon ClimateTech',
    description: '48hs para construir soluciones tech contra el cambio climático. Premios en cash y mentoría de VCs.',
    date: new Date('2026-07-25T09:00:00'),
    endDate: new Date('2026-07-27T18:00:00'),
    location: 'Campus Tecnológico, Córdoba',
    industries: ['Climate', 'AI'],
  },
  {
    title: 'Demo Day - Emprending Batch 3',
    description: 'Las 10 startups del batch 3 de Emprending presentan sus avances. Abierto a inversores y comunidad.',
    date: new Date('2026-08-05T18:00:00'),
    endDate: new Date('2026-08-05T21:00:00'),
    location: 'Auditorio ITBA, Buenos Aires',
    url: 'https://emprending.com/demo-day',
    industries: ['SaaS', 'AI', 'Fintech', 'Healthtech'],
  },
  {
    title: 'Workshop: De 0 a PMF',
    description: 'Workshop práctico de 3 horas sobre product-market fit. Frameworks, casos reales y ejercicios hands-on.',
    date: new Date('2026-06-28T10:00:00'),
    endDate: new Date('2026-06-28T13:00:00'),
    location: 'Nerdear.la HQ, Buenos Aires',
    industries: ['SaaS', 'Marketplace', 'E-commerce'],
  },
  {
    title: 'Networking Founders Rosario',
    description: 'Encuentro informal para founders de Rosario y alrededores. Sin agenda, solo buenas conversaciones.',
    date: new Date('2026-06-20T19:00:00'),
    endDate: new Date('2026-06-20T22:00:00'),
    location: 'Cervecería Antares, Rosario',
    industries: ['Marketplace', 'SaaS', 'E-commerce'],
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // --- Admin user (Google login) ---
  const adminUser = await prisma.user.upsert({
    where: { email: 'franmastromarino@gmail.com' },
    update: {},
    create: {
      name: 'Fran Mastromarino',
      email: 'franmastromarino@gmail.com',
    },
  })

  await prisma.profile.upsert({
    where: { id: adminUser.id },
    update: {},
    create: {
      id: adminUser.id,
      fullName: 'Fran Mastromarino',
      whatsappE164: '+5491112345678',
      role: 'Founder',
      startup: 'Foundr.fit',
      startupUrl: 'https://foundr.fit',
      industries: ['SaaS', 'AI'],
      lookingFor: ['Networking', 'Partners', 'Inversión'],
      interests: ['Tecnología', 'Producto', 'Growth'],
      bio: 'Construyendo Foundr.fit - la red para founders de LatAm',
      city: 'Buenos Aires',
      community: 'emprending',
      onboardingComplete: true,
      onboardingStep: 3,
      visible: true,
    },
  })
  console.log(`  ✓ Fran Mastromarino (admin)`)

  const userIds: string[] = [adminUser.id]

  for (const userData of SEED_USERS) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
      },
    })

    await prisma.profile.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        ...userData.profile,
        community: 'emprending',
        onboardingComplete: true,
        onboardingStep: 3,
        visible: true,
      },
    })

    userIds.push(user.id)
    console.log(`  ✓ ${userData.name}`)
  }

  // userIds[0] = Fran (admin), userIds[1..] = seed users

  // Create some cross-likes for matches
  // Fran <-> Martina (match)
  // Fran <-> Santiago (match)
  // Martina <-> Santiago (match)
  // Valentina <-> Tomás (match)
  // Lucas <-> Sofía (match)
  // Camila -> Mateo (one-way, no match)
  // Isabella -> Nicolás (one-way, no match)
  const likePairs = [
    [0, 1], [1, 0], // Fran <-> Martina
    [0, 2], [2, 0], // Fran <-> Santiago
    [1, 2], [2, 1], // Martina <-> Santiago
    [3, 4], [4, 3], // Valentina <-> Tomás
    [6, 7], [7, 6], // Lucas <-> Sofía
    [5, 8],         // Camila -> Mateo (one-way)
    [9, 10],        // Isabella -> Nicolás (one-way)
    [11, 12], [12, 11], // Julieta <-> Federico
  ]

  for (const [fromIdx, toIdx] of likePairs) {
    await prisma.like.upsert({
      where: {
        fromUser_toUser: {
          fromUser: userIds[fromIdx],
          toUser: userIds[toIdx],
        },
      },
      update: {},
      create: {
        fromUser: userIds[fromIdx],
        toUser: userIds[toIdx],
      },
    })
  }

  console.log(`\n📅 Seeding events...`)

  for (const eventData of SEED_EVENTS) {
    await prisma.event.create({
      data: {
        ...eventData,
        community: 'emprending',
        createdBy: adminUser.id,
      },
    })
    console.log(`  ✓ ${eventData.title}`)
  }

  // Add some attendees to events
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } })
  const attendeeMap = [
    { eventIdx: 0, userIdxs: [0, 1, 2, 4, 7] },   // Pitch Night: Fran, Martina, Santiago, Tomás, Sofía
    { eventIdx: 1, userIdxs: [0, 2, 8, 13] },       // AI Builders: Fran, Santiago, Mateo, Federico
    { eventIdx: 2, userIdxs: [0, 1, 6] },            // Fintech Forum: Fran, Martina, Lucas
    { eventIdx: 3, userIdxs: [3, 13] },              // Hackathon: Valentina, Federico
    { eventIdx: 4, userIdxs: [0, 1, 2, 3, 4, 7] },  // Demo Day: Fran + varios
    { eventIdx: 5, userIdxs: [0, 5, 14, 15] },       // Workshop PMF: Fran, Camila, Emiliano, Renata
    { eventIdx: 6, userIdxs: [3] },                   // Networking Rosario: Valentina
  ]

  for (const { eventIdx, userIdxs } of attendeeMap) {
    if (!events[eventIdx]) continue
    for (const userIdx of userIdxs) {
      if (!userIds[userIdx]) continue
      await prisma.eventAttendee.create({
        data: {
          eventId: events[eventIdx].id,
          userId: userIds[userIdx],
        },
      })
    }
  }

  console.log(`\n✅ Seeded ${SEED_USERS.length + 1} users, ${SEED_EVENTS.length} events with attendees`)
  console.log('   Admin: franmastromarino@gmail.com')
  console.log('   Matches: Fran↔Martina, Fran↔Santiago, Martina↔Santiago, Valentina↔Tomás, Lucas↔Sofía, Julieta↔Federico')
  console.log('   One-way likes: Camila→Mateo, Isabella→Nicolás')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
