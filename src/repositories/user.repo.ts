import { Prisma, prisma } from "libs";

const userSelect = {
  id: true,
  email: true,
  name: true,
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    select: userSelect,
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
      deletedAt: null,
    },
    select: { ...userSelect, password: true },
  });
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({
    data,
    select: userSelect,
  });
};
