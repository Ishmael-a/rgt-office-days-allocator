import { hash, compare } from "bcryptjs";

const SALTROUNDS = 10;

export const hashPassword = async (password: string) => {
  return await hash(password, SALTROUNDS);
};

export const comparePassword = async (
  password: string,
  passwordHash: string
) => {
  return await compare(password, passwordHash);
};
