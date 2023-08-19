import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

const CreatePostWizard = () => {
  const { user } = useUser();
  const { imageUrl } = user!;
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
      toast.success("Post successfully created!");
    },
    onError: (error) => {
      const zodError = error?.data?.zodError?.fieldErrors?.content?.[0];

      if (zodError) {
        toast.error(zodError);
        return;
      }

      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (!input || isPosting) return;

    mutate({ content: input });
  };

  return (
    <div className="border-b border-slate-400 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();

          return false;
        }}
      >
        <div className="flex items-center gap-2">
          <Image
            src={imageUrl}
            alt="Profile image"
            width={60}
            height={60}
            className="rounded-full"
          />
          <input
            placeholder="Type some emojis!"
            className="grow rounded-md bg-transparent p-2 outline-none transition-opacity disabled:opacity-40"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isPosting}
          />
          {isPosting ? <LoadingSpinner /> : <button type="submit">Post</button>}
        </div>
      </form>
    </div>
  );
};

const Feed = () => {
  const { data: posts, isLoading } = api.posts.getAll.useQuery();

  if (isLoading)
    return (
      <div className="p-4">
        <LoadingSpinner />
      </div>
    );

  if (!posts) return <div className="p-4">No data</div>;

  return (
    <ul className="flex flex-col gap-2">
      {posts.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </ul>
  );
};

export default function Home() {
  const { isSignedIn, isLoaded: isUserLoaded } = useUser();

  if (!isSignedIn || !isUserLoaded) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        {isUserLoaded ? <SignInButton /> : <LoadingSpinner size={100} />}
      </div>
    );
  }

  return (
    <PageLayout>
      <CreatePostWizard />
      <Feed />
    </PageLayout>
  );
}
