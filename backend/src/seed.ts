import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  // Create sample events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        name: 'Tech Meetup 2025',
        location: 'Silicon Valley Conference Center',
        startTime: new Date('2025-06-25T18:00:00Z')
      }
    }),
    prisma.event.create({
      data: {
        name: 'College Fest - Spring Edition',
        location: 'University Campus',
        startTime: new Date('2025-06-30T10:00:00Z')
      }
    }),
    prisma.event.create({
      data: {
        name: 'Open Mic Night',
        location: 'Downtown Coffee House',
        startTime: new Date('2025-07-05T19:00:00Z')
      }
    }),
    prisma.event.create({
      data: {
        name: 'Startup Pitch Competition',
        location: 'Innovation Hub',
        startTime: new Date('2025-07-10T14:00:00Z')
      }
    })
  ]);

  console.log('Created events:', events);

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Bob Johnson',
        email: 'bob@example.com'
      }
    })
  ]);

  console.log('Created users:', users);

  console.log('Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

