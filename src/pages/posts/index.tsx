import { useState } from "react";
import { Post } from "../../shared/types";

type PostPageProps = {
  post?: Post;
};

export const PostPage = ({ post }: PostPageProps) => {
  const [number, setNumber] = useState(0);

  return (
    <main className='min-h-screen bg-emerald-200'>
      <h1 className='text-3xl text-shadow-blue-300'>{post?.title}</h1>
      <p>{post?.body}</p>
      <button type='button' onClick={() => setNumber(number + 1)}>
        {number}
      </button>
    </main>
  );
};
