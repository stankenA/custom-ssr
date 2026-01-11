import { Post } from "../../types";
import { api } from "../axios-instance";

const getPost = ({ id }: { id: string }) =>
  api<Post>({
    method: "get",
    url: `https://jsonplaceholder.typicode.com/posts/${id}`,
  }).then((res) => res.data);

export const postApi = {
  getPost,
};
