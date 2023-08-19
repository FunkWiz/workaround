import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { PostView } from "~/components/postview";
import { generateServerSideHelper } from "~/server/helpers/ssgHelper";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data: post } = api.posts.getById.useQuery({
    id,
  });

  if (!post) return <div>Post not found</div>;

  return (
    <>
      <Head>
        <title>{`${post.post.content} - ${post.author.email}`}</title>
      </Head>
      <PageLayout>
        <div className="flex flex-col gap-2">
          <div className="mb-[82px] bg-slate-600 p-4">
            <Image
              src={post.author.imageUrl}
              alt="user image"
              width={164}
              height={164}
              className="translate-y-[82px] rounded-full border-4 border-slate-900"
            />
          </div>
          <div className="p-4 text-2xl font-bold">{post.author.email}</div>
          <div>
            <PostView {...post} />
          </div>
        </div>
      </PageLayout>
    </>
  );
};
export default SinglePostPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateServerSideHelper();
  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("no id provided");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
