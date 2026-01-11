import { StaticPage } from "../../../client/pages/static";
import { createPageHandler } from "../create-page-handler";

export default createPageHandler({
  route: "/static",
  strategy: "ssg",
  render: () => <StaticPage />,
});
