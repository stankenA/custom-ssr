import { PORT } from "../shared/config";
import { createApp } from "./app";

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
