import { PaginationParams, Prisma, prisma } from "libs";

interface FindUserParams {
  search?: string;
}

interface FindUserParamsWithPagination
  extends FindUserParams,
    PaginationParams {}

const userSelect = {
  id: true,
  email: true,
  name: true,
};

export const findUsersCount = async ({ search }: FindUserParams) => {
  return prisma.user.count({
    where: {
      deletedAt: null,
      OR: search
        ? [
            { email: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    },
  });
};

export const findUsers = async ({
  search,
  page,
  take,
}: FindUserParamsWithPagination) => {
  return prisma.user.findMany({
    where: {
      deletedAt: null,
      OR: search
        ? [
            { email: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    },
    take,
    skip: (page - 1) * take,
    select: userSelect,
  });
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
