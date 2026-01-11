import { PostPage } from "../../../client/pages/post";
import { postApi } from "../../../shared/api";
import { createPageHandler } from "../create-page-handler";

export default createPageHandler({
  route: "/posts/:id",
  strategy: "ssr",
  getData: async (req) => {
    const post = await postApi.getPost({ id: req.params.id as string });

    return post;
  },
  render: (post) => <PostPage post={post} />,
});
