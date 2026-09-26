import {
  PrismaClient,
  ProductStatus,
  UserRole,
  UserStatus,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@sneakerhead.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
    create: {
      email: adminEmail,
      name: "Super Admin",
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  const customerPasswordHash = await bcrypt.hash("Customer123!", 12);

  const sampleCustomers = [
    {
      email: "jane@example.com",
      name: "Jane Customer",
      status: UserStatus.ACTIVE,
    },
    {
      email: "pending@example.com",
      name: "Pending User",
      status: UserStatus.PENDING_VERIFICATION,
    },
    {
      email: "disabled@example.com",
      name: "Disabled User",
      status: UserStatus.DISABLED,
    },
  ];

  for (const customer of sampleCustomers) {
    await prisma.user.upsert({
      where: { email: customer.email },
      update: {
        name: customer.name,
        status: customer.status,
        role: UserRole.CUSTOMER,
        passwordHash: customerPasswordHash,
      },
      create: {
        email: customer.email,
        name: customer.name,
        status: customer.status,
        role: UserRole.CUSTOMER,
        passwordHash: customerPasswordHash,
        emailVerified: customer.status === UserStatus.ACTIVE,
      },
    });
  }

  const categories = [
    {
      name: "Lifestyle",
      slug: "lifestyle",
      description: "Everyday sneakers and casual kicks",
      sortOrder: 1,
    },
    {
      name: "Running",
      slug: "running",
      description: "Performance running shoes",
      sortOrder: 2,
    },
    {
      name: "Basketball",
      slug: "basketball",
      description: "Court-ready basketball sneakers",
      sortOrder: 3,
    },
  ];

  const categoryIds: Record<string, string> = {};
  for (const category of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        ...category,
        isActive: true,
      },
    });
    categoryIds[category.slug] = saved.id;
  }

  const products = [
    {
      name: "Air Force Classic",
      slug: "air-force-classic",
      description:
        "A timeless court-inspired silhouette with premium leather overlays and everyday comfort.",
      categorySlug: "lifestyle",
      status: ProductStatus.ACTIVE,
      featured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
          alt: "Red sneaker",
          isPrimary: true,
        },
      ],
      variants: [
        {
          sku: "AFC-WHT-09",
          size: "9",
          color: "White",
          priceCents: 11999,
          compareAtCents: 13999,
          stock: 20,
        },
        {
          sku: "AFC-WHT-10",
          size: "10",
          color: "White",
          priceCents: 11999,
          compareAtCents: 13999,
          stock: 15,
        },
        {
          sku: "AFC-BLK-10",
          size: "10",
          color: "Black",
          priceCents: 12499,
          stock: 8,
        },
      ],
    },
    {
      name: "Velocity Runner Pro",
      slug: "velocity-runner-pro",
      description:
        "Lightweight cushioning and breathable mesh for long training runs and race-day pace.",
      categorySlug: "running",
      status: ProductStatus.ACTIVE,
      featured: true,
      images: [
        {
          url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
          alt: "Running sneaker",
          isPrimary: true,
        },
      ],
      variants: [
        {
          sku: "VRP-BLU-09",
          size: "9",
          color: "Blue",
          priceCents: 14999,
          stock: 12,
        },
        {
          sku: "VRP-BLU-10",
          size: "10",
          color: "Blue",
          priceCents: 14999,
          stock: 18,
        },
        {
          sku: "VRP-GRN-11",
          size: "11",
          color: "Green",
          priceCents: 15499,
          stock: 6,
        },
      ],
    },
    {
      name: "Court Dominator X",
      slug: "court-dominator-x",
      description:
        "High-traction outsole and ankle support built for explosive cuts on the hardwood.",
      categorySlug: "basketball",
      status: ProductStatus.ACTIVE,
      featured: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
          alt: "Basketball sneaker",
          isPrimary: true,
        },
      ],
      variants: [
        {
          sku: "CDX-RED-10",
          size: "10",
          color: "Red",
          priceCents: 16999,
          compareAtCents: 18999,
          stock: 10,
        },
        {
          sku: "CDX-RED-11",
          size: "11",
          color: "Red",
          priceCents: 16999,
          stock: 7,
        },
      ],
    },
    {
      name: "Draft Studio Low",
      slug: "draft-studio-low",
      description:
        "Upcoming seasonal colorway currently in draft. Not visible in the storefront.",
      categorySlug: "lifestyle",
      status: ProductStatus.DRAFT,
      featured: false,
      images: [
        {
          url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
          alt: "Draft sneaker",
          isPrimary: true,
        },
      ],
      variants: [
        {
          sku: "DSL-GRY-09",
          size: "9",
          color: "Grey",
          priceCents: 9999,
          stock: 0,
        },
      ],
    },
  ];

  for (const product of products) {
    const categoryId = categoryIds[product.categorySlug];
    if (!categoryId) continue;

    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (existing) {
      await prisma.productVariant.deleteMany({ where: { productId: existing.id } });
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: product.name,
          description: product.description,
          categoryId,
          status: product.status,
          featured: product.featured,
          variants: { create: product.variants },
          images: {
            create: product.images.map((image, index) => ({
              url: image.url,
              alt: image.alt,
              isPrimary: image.isPrimary,
              sortOrder: index,
            })),
          },
        },
      });
    } else {
      await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          categoryId,
          status: product.status,
          featured: product.featured,
          variants: { create: product.variants },
          images: {
            create: product.images.map((image, index) => ({
              url: image.url,
              alt: image.alt,
              isPrimary: image.isPrimary,
              sortOrder: index,
            })),
          },
        },
      });
    }
  }

  console.log(`Seeded admin user: ${adminEmail}`);
  console.log("Seeded sample customers: jane@example.com / Customer123!");
  console.log("Seeded catalog: 3 categories, 4 products (3 active, 1 draft)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
