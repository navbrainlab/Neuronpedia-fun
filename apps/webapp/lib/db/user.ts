// eslint-disable-next-line import/no-cycle
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/db';
// eslint-disable-next-line import/no-cycle
import { RequestOptionalUser } from '@/lib/with-user';
import { UserSecretType } from '@prisma/client';
import { getServerSession, Session } from 'next-auth';
import { API_KEY_HEADER_NAME, DEMO_MODE } from '../env';

export const getAuthenticatedUserFromApiKey = async (request: RequestOptionalUser, throwOnFail = true) => {
  const apiKey = request.headers.get(API_KEY_HEADER_NAME);
  if (!apiKey) {
    throw new Error('API Key missing');
  }
  const userSecret = await prisma.userSecret.findFirst({
    where: {
      value: apiKey,
      type: UserSecretType.NEURONPEDIA,
    },
  });
  if (!userSecret) {
    console.log('Invalid API Key');
    if (throwOnFail) {
      throw new Error('Invalid API Key');
    } else {
      return null;
    }
  }
  const user = await prisma.user.findUnique({
    where: {
      name: userSecret.username,
    },
    select: {
      id: true,
      name: true,
      admin: true,
    },
  });
  if (!user && throwOnFail) {
    throw new Error('Invalid API Key');
  } else {
    return user;
  }
};

// gets the session if not provided, then constructs an AuthenticatedUser
export const makeAuthedUserFromSessionOrReturnNull = async (session: Session | null = null) => {
  if (DEMO_MODE) {
    return null;
  }

  // eslint-disable-next-line no-param-reassign
  session = session || (await getServerSession(authOptions));
  if (session) {
    return { id: session.user.id, name: session.user.name };
  }
  return null;
};

export const createUser = async (email: string, name: string, image: string, emailVerified: Date | null) =>
  prisma.user.create({
    data: {
      email,
      name,
      image,
      emailVerified,
    },
  });

export const checkUserExistsByEmail = async (email: string) =>
  prisma.user.findUnique({
    where: {
      email,
    },
  });

export const checkUserExistsByName = async (name: string) =>
  prisma.user.findUnique({
    where: {
      name,
    },
  });

export const getUserById = async (userId: string) =>
  prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

export const getUserByName = async (username: string) =>
  prisma.user.findUniqueOrThrow({
    where: {
      name: username,
    },
  });

export const getUserNeuronpediaApiKey = async (username: string, type: UserSecretType) =>
  prisma.userSecret.findUniqueOrThrow({
    where: {
      username_type: {
        username,
        type,
      },
    },
  });

export const getUserByNameForPublicProfile = async (username: string) =>
  prisma.user.findUniqueOrThrow({
    where: {
      name: username,
    },
    select: {
      id: true,
      name: true,
      bio: true,
      createdAt: true,
      bot: true,
    },
  });

export const getUserByIdRefresh = async (userId: string) =>
  prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: {
      lists: true,
    },
  });

export const getAdminUser = async () => {
  const adminUser = await prisma.user.findFirst({
    where: {
      admin: true,
    },
  });
  if (!adminUser) {
    throw new Error('Admin user not found. Did you seed the database?');
  }
  return adminUser;
};

export const updateUserAccount = async (
  userId: string,
  name: string,
  newsletterNotifyEmail: boolean,
  unsubscribeAllEmail: boolean,
) =>
  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      emailNewsletterNotification: newsletterNotifyEmail,
      emailUnsubscribeAll: unsubscribeAllEmail,
    },
  });

// ========================== MARK: EMAIL

export const setUserEmailUnsubscribeNewsletter = async (unsubscribeCode: string) =>
  prisma.user.update({
    where: {
      emailUnsubscribeCode: unsubscribeCode,
    },
    data: {
      emailNewsletterNotification: false,
    },
  });

export const setUserEmailUnsubscribeAll = async (unsubscribeCode: string) =>
  prisma.user.update({
    where: {
      emailUnsubscribeCode: unsubscribeCode,
    },
    data: {
      emailUnsubscribeAll: true,
    },
  });

export const setUserEmailNewsletterNotification = async (userId: string, notify: boolean) =>
  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailNewsletterNotification: notify,
    },
  });

export const getEmailNewsletterEnabledUsers = async () =>
  prisma.user.findMany({
    where: {
      emailUnsubscribeAll: false,
      emailNewsletterNotification: true,
      bot: false,
    },
  });

export const getEmailSubscribedDetails = async () =>
  prisma.user.findMany({
    where: {
      emailUnsubscribeAll: false,
      bot: false,
    },
    select: {
      email: true,
      emailUnsubscribeCode: true,
      emailUnsubscribeAll: true,
    },
  });
