import { Context } from '../utils/context';
import { generateToken, requireAuth } from '../utils/auth';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    events: async (_: any, __: any, { prisma }: Context) => {
      return await prisma.event.findMany({
        include: {
          attendees: true
        },
        orderBy: {
          startTime: 'asc'
        }
      });
    },

    me: async (_: any, __: any, { user }: Context) => {
      if (!user) return null;
      return user;
    },

    event: async (_: any, { id }: { id: string }, { prisma }: Context) => {
      return await prisma.event.findUnique({
        where: { id },
        include: {
          attendees: true
        }
      });
    }
  },

  Mutation: {
    login: async (_: any, { email, password }: { email: string; password: string }, { prisma }: Context) => {
      // Mock authentication - in real app, verify password
      let user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Create user if doesn't exist (for demo purposes)
        user = await prisma.user.create({
          data: {
            email,
            name: email.split('@')[0] // Use email prefix as name
          }
        });
      }

      const token = generateToken(user.id);

      return {
        token,
        user
      };
    },

    joinEvent: async (_: any, { eventId }: { eventId: string }, { prisma, user }: Context) => {
      const authUser = requireAuth(user);

      const event = await prisma.event.update({
        where: { id: eventId },
        data: {
          attendees: {
            connect: { id: authUser.id }
          }
        },
        include: {
          attendees: true
        }
      });

      // Publish real-time update
      pubsub.publish(`EVENT_UPDATED_${eventId}`, { eventUpdated: event });

      return event;
    },

    leaveEvent: async (_: any, { eventId }: { eventId: string }, { prisma, user }: Context) => {
      const authUser = requireAuth(user);

      const event = await prisma.event.update({
        where: { id: eventId },
        data: {
          attendees: {
            disconnect: { id: authUser.id }
          }
        },
        include: {
          attendees: true
        }
      });

      // Publish real-time update
      pubsub.publish(`EVENT_UPDATED_${eventId}`, { eventUpdated: event });

      return event;
    }
  },

  Subscription: {
    eventUpdated: {
      subscribe: (_: any, { eventId }: { eventId: string }) => {
        return (pubsub as any).asyncIterator(`EVENT_UPDATED_${eventId}`);
      }
    }
  }
};

export { pubsub };

