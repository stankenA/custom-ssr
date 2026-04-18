import { createPageHandler } from "@/server/routes";
import { StaticPage } from ".";

export default createPageHandler({
  route: "/static",
  strategy: "ssg",
  render: () => <StaticPage />,
});
