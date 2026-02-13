import { Post } from "../../shared/types";

type PostPageProps = {
  post: Post;
};

export const PostPage = ({ post }: PostPageProps) => {
  return (
    <main className='min-h-screen bg-emerald-200'>
      <h1 className='text-3xl text-shadow-blue-300'>{post.title}</h1>
      <p>{post.body}</p>
    </main>
  );
};
