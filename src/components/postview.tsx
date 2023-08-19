import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { type RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <li className="flex gap-2 border-b border-slate-400 p-4">
      <div className="shrink-0">
        <Image
          src={author.imageUrl}
          alt="Author image"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div>
        <div className="flex gap-1 font-bold">
          <Link href={`@${author.email}`}>
            <span> {`@${author.email}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">·</span>
            <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
          </Link>
        </div>
        <p className="text-2xl">{post.content}</p>
      </div>
    </li>
  );
};
