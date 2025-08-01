import { prisma } from "../../src/common/database/prisma";
import papaparse from "papaparse";
import fs from "fs/promises";
import path from "path";

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

/**
 * Seed countries with INSEE code
 *
 * File: v_pays_territoire_2024.csv
 * Source: https://www.insee.fr/fr/statistiques/fichier/7766585/v_pays_territoire_2024.csv
 *
 * File: geonames.json
 * Source: http://api.geonames.org/countryInfoJSON?username=ghostlexly&formatted=true&style=full&lang=FR
 */
export const main = async () => {
  console.log("🌱 Seeding countries...");

  await seedCountries();

  console.log("🌱 Seeding countries completed successfully!");
};

const seedCountries = async () => {
  const inseeData = await getInseeData();
  const geonames = await getGeonames();

  // Seed Countries
  for (const country of geonames) {
    // Find the insee data to get insee country code
    const inseeCountry = inseeData.find(
      (insee) => insee.CODEISO2 === country.countryCode
    );

    if (!inseeCountry) {
      // console.warn(`Country ${country.countryName} not found in INSEE data`);
      continue;
    }

    // Insert country into database
    await prisma.country.upsert({
      where: {
        iso2Code: country.countryCode,
      },
      update: {},
      create: {
        countryName: country.countryName,
        inseeCode: inseeCountry?.COG || null,
        iso2Code: country.countryCode,
        iso3Code: country.isoAlpha3,
        num3Code: country.isoNumeric,
        population: Number(country.population),
        continent: country.continent,
        continentName: country.continentName,
        currencyCode: country.currencyCode,
      },
    });
  }
};

const getInseeData = async () => {
  // Read INSEE file
  const inseeData = await fs.readFile(
    path.join(__dirname, "data", "v_pays_territoire_2024.csv"),
    "utf-8"
  );

  // Parse INSEE Data
  const { data: parsedInseeData } = papaparse.parse<InseeRow>(inseeData, {
    header: true,
    skipEmptyLines: true,
  });

  return parsedInseeData;
};

const getGeonames = async () => {
  // Read Geonames file
  const geonamesData = await fs.readFile(
    path.join(__dirname, "data", "geonames.json"),
    "utf-8"
  );

  // Parse Geonames Data
  const geonamesParsed = JSON.parse(geonamesData);

  return geonamesParsed.geonames;
};
