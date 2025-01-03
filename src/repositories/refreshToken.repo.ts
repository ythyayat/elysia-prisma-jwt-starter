import { prisma } from "libs";

export const createRefreshToken = async (data: {
  hashedToken: string;
  id: string;
  userId: string;
  userAgent: string;
}) => {
  return prisma.refreshToken.create({
    data,
  });
};

export const findRefreshTokenById = async (id: string) => {
  return prisma.refreshToken.findUnique({
    where: {
      id,
    },
  });
};

export const deleteRefreshTokenById = async (id: string) => {
  return prisma.refreshToken.delete({
    where: {
      id,
    },
  });
};

export const findRefreshTokenByToken = async (hashedToken: string) => {
  return prisma.refreshToken.findFirst({
    where: {
      hashedToken,
    },
  });
};
