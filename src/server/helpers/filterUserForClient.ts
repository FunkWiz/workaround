import { type User } from "@clerk/nextjs/server";

export const filterUserForClient = (user: User) => {
  return {
    imageUrl: user.imageUrl,
    email: user.emailAddresses[0]?.emailAddress ?? "@no_email",
    id: user.id,
  };
};
