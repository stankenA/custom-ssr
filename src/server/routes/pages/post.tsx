import { Router } from "express";
import { Post } from "../../../shared/types";
import { PostPage } from "../../../pages/post";
import { renderPage } from "../../render/render-page";

const router = Router();
const pageRote = "/posts/:id";

router.get(pageRote, async (req, res) => {
  const { id } = req.params;

  const post = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  ).then((r) => r.json());

  const html = renderPage(<PostPage post={post as Post} />);
  res.send(html);
});

export default router;
