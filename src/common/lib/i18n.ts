import fs from "fs/promises";
import i18next from "i18next";
// import { z } from "zod";
// import { zodI18nMap } from "zod-i18n-map";

export const setupI18n = async () => {
  try {
    // Translations for Zod
    const transZodFr = JSON.parse(
      await fs.readFile("./src/common/locales/zod/fr.json", "utf-8")
    );

    // Initialize i18n
    await i18next.init({
      lng: "fr",
      resources: {
        fr: { zod: transZodFr },
      },
    });

    // Set Zod error map (uncomment if you want to use Zod translations)
    // z.setErrorMap(zodI18nMap);
  } catch (error) {
    console.error("Error initializing i18n:", error);
  }
};
