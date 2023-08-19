import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { LoadingSpinner } from "~/components/loading";
import { PostView } from "~/components/postview";
import { generateServerSideHelper } from "~/server/helpers/ssgHelper";

const ProfileFeed = (props: { userId: string }) => {
  const { data: posts, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading)
    return (
      <div className="p-4">
        <LoadingSpinner size={50} />
      </div>
    );

  if (!posts || posts.length === 0) return <div>User has not posted</div>;

  return (
    <ul className="flex flex-col gap-2">
      {posts.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </ul>
  );
};

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
          <div className="mb-[82px] bg-slate-600 p-4">
            <Image
              src={user.imageUrl}
              alt="user image"
              width={164}
              height={164}
              className="translate-y-[82px] rounded-full border-4 border-slate-900"
            />
          </div>
          <div className="p-4 text-2xl font-bold">{user.email}</div>
          <div>
            <ProfileFeed userId={user.id} />
          </div>
        </div>
      </PageLayout>
    </>
  );
};
export default ProfilePage;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateServerSideHelper();
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
