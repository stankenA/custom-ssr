import { PORT } from "./env";
import { createApp } from "./app";

(async () => {
  const app = await createApp();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})();
