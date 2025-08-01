import path from "path";
import { glob } from "glob";
import { getAppDir } from "../src/common/utils/app-dir";

const SEEDS_PATH = path.join(getAppDir(), "..", "prisma", "seeds");

const getSeedFiles = async () => {
  return await glob("**/*.js", { cwd: SEEDS_PATH, ignore: ["seed.js"] });
};

const main = async () => {
  console.log("🌱 Starting database seeding...");

  try {
    const seedFiles = await getSeedFiles();

    for (const seedFile of seedFiles) {
      // import seed module
      const { main: seedModule } = await import(
        path.join(SEEDS_PATH, seedFile)
      );

      // execute seed
      await seedModule();
    }

    console.log("🌱 All seeds completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
