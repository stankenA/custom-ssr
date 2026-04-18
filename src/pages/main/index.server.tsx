import { ISR_REVALIDATE } from "@/server/env";
import { createPageHandler } from "@/server/routes";
import { MainPage } from ".";

export default createPageHandler({
  route: "/",
  strategy: "isr",
  revalidateMs: ISR_REVALIDATE,
  getData: () => ({ date: Date.now() }),
  render: ({ date }) => <MainPage date={date} />,
});
