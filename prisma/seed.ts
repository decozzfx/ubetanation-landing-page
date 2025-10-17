import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@ubetanation.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("✅ Created admin user:", adminUser.username);
}

// Create sample blog posts

main()
  .catch(e => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
