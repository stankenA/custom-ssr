import { PORT } from "@/shared/config";
import { createApp } from "./app";

(async () => {
  const app = await createApp();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();
