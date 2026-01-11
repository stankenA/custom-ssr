import { MainPage } from "../../../client/pages/main";
import { ISR_REVALIDATE } from "../../../shared/config";
import { createPageHandler } from "../create-page-handler";

export default createPageHandler({
  route: "/",
  strategy: "isr",
  getData: () => ({ date: Date.now() }),
  render: ({ date }) => <MainPage date={date} />,
  revalidateMs: ISR_REVALIDATE,
});
