import { PORT } from "./env";
import { createApp } from "./app";

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
