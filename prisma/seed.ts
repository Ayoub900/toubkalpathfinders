/**
 * Standalone DB seeder — mirrors the /api/seed route but runs from the CLI
 * (no admin cookie required). Reuses the shared SEED_TREKS data and createTrek
 * helper so the seeded content stays in sync with the app.
 *
 * Run with:  npx prisma db seed
 * Reseed:    npx prisma db seed -- --force   (wipes existing treks + bookings)
 */
import { prisma } from "../lib/prisma";
import { createTrek, trekCount } from "../lib/treks";
import { SEED_TREKS } from "../lib/seed-data";

async function main() {
  const force = process.argv.includes("--force");

  const existing = await trekCount();
  if (existing > 0 && !force) {
    console.log(
      `${existing} treks already exist — skipping. Re-run with \`-- --force\` to wipe and reseed.`
    );
    return;
  }

  if (force) {
    await prisma.booking.deleteMany({});
    await prisma.trek.deleteMany({});
    console.log("Cleared existing treks and bookings.");
  }

  let created = 0;
  for (const trek of SEED_TREKS) {
    await createTrek(trek);
    created++;
  }
  console.log(`Seeded ${created} treks.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
