import Head from "next/head";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import SuperJSON from "superjson";
import { prisma } from "~/server/db";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";

const ProfilePage: NextPage<{ email: string }> = ({ email }) => {
  const { data: user } = api.profile.getUserByEmail.useQuery({
    email,
  });

  if (!user) return <div>User not found</div>;

  return (
    <>
      <Head>
        <title>{user.email} @Profile</title>
      </Head>
      <PageLayout>
        <div className="flex flex-col gap-2">
          <div className="bg-slate-600 p-4">
            <Image
              src={user.imageUrl}
              alt="user image"
              width={164}
              height={164}
              className="translate-y-[82px] rounded-full border-4 border-slate-900"
            />
          </div>
          <div className="translate-y-[82px] p-4 text-2xl font-bold">
            {user.email}
          </div>
        </div>
      </PageLayout>
    </>
  );
};
export default ProfilePage;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: SuperJSON,
  });
  const slug = context.params?.slug;
  if (typeof slug !== "string") throw new Error("no slug");

  const email = slug.replace("@", "");
  await ssg.profile.getUserByEmail.prefetch({ email });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      email,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
