import { createApp } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase();
    const app = createApp();
    app.listen(env.port, () => {
      console.log(`PropSpace API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

bootstrap();
