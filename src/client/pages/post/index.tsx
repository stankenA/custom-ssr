import { Post } from "../../../shared/types";

type PostPageProps = {
  post: Post;
};

export const PostPage = ({ post }: PostPageProps) => {
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </main>
  );
};
