import { Command } from "commander";
import { loggerService } from "../lib/logger";
import papaparse from "papaparse";
import { wolfios } from "../lib/wolfios";
import { prisma } from "../providers/database/prisma";

const logger = loggerService.create({ name: "seed-countries-command" });

const setupCommand = (program: Command): void => {
  program
    .command("seed:countries")
    .description("Seed countries list into the database.")
    .action(runCommand);
};

type InseeRow = {
  COG: string;
  ACTUAL: string;
  CRPAY: string;
  ANI: string;
  LIBCOG: string;
  LIBENR: string;
  CODEISO2: string;
  CODEISO3: string;
  CODENUM3: string;
};

const runCommand = async (): Promise<void> => {
  try {
    logger.info("Downloading insee data...");
    const inseeData = await getInseeData();

    logger.info("Downloading geonames.org data...");
    const countries = await wolfios
      .get("http://api.geonames.org/countryInfoJSON", {
        params: {
          username: "ghostlexly",
          formatted: "true",
          style: "full",
          lang: "FR", // 👈 set your country language code here for country name translation
        },
      })
      .then(async (res) => await res.json())
      .then((data) => data.geonames);

    for (const country of countries) {
      // -------------------------------------
      // find the insee data to get insee country code
      // -------------------------------------
      const insee = findInsee({ inseeData, iso2Code: country.countryCode });

      if (!insee) {
        logger.warn(`No insee data found for ${country.countryCode}`);
      }

      // -------------------------------------
      // insert country into database
      // -------------------------------------
      await prisma.country.create({
        data: {
          countryName: country.countryName,
          inseeCode: insee?.COG || null,
          iso2Code: country.countryCode,
          iso3Code: country.isoAlpha3,
          num3Code: country.isoNumeric,
          population: Number(country.population),
          continent: country.continent,
          continentName: country.continentName,
          currencyCode: country.currencyCode,
        },
      });

      logger.debug(`Seed [${country.countryName}] successfully.`);
    }

    logger.info(`Seeding finished successfully.`);
  } catch (error) {
    logger.error(error, "Error on seeding countries !");
  }
};

const getInseeData = async (): Promise<InseeRow[]> => {
  const inseeData = await wolfios
    .get(
      "https://www.insee.fr/fr/statistiques/fichier/7766585/v_pays_territoire_2024.csv"
    )
    .then(async (res) => await res.text());

  // -- parse csv data
  const { data } = papaparse.parse<InseeRow>(inseeData, {
    header: true,
    skipEmptyLines: true,
  });

  return data;
};

const findInsee = ({ inseeData, iso2Code }) => {
  return inseeData.find((item) => item.CODEISO2 === iso2Code);
};

export default setupCommand;
