import { db } from "../index";
import { origins, products } from "../schema/catalog";
import { users } from "../schema/identity";
import { pages, faqs, testimonials } from "../schema/content";
import { employees, channels, channelMessages, meetings } from "../schema/scheduling";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed origins
  const existingOrigins = await db.select().from(origins);
  if (existingOrigins.length === 0) {
    console.log("  Seeding origins...");
    await db.insert(origins).values([
      { name: "Brazilian", country: "Brazil" },
      { name: "Peruvian", country: "Peru" },
      { name: "Malaysian", country: "Malaysia" },
      { name: "Indian", country: "India" },
      { name: "Cambodian", country: "Cambodia" },
    ]);
  }

  // Seed products
  const existingProducts = await db.select().from(products);
  if (existingProducts.length === 0) {
    console.log("  Seeding products...");
    const seededOrigins = await db.select().from(origins);
    const brazilian = seededOrigins.find((o) => o.name === "Brazilian")!;
    const peruvian = seededOrigins.find((o) => o.name === "Peruvian")!;
    const malaysian = seededOrigins.find((o) => o.name === "Malaysian")!;

    await db.insert(products).values([
      { name: "Brazilian Body Wave Bundle", description: "Premium body wave hair bundle with natural luster", price: "89.99", texture: "Body Wave", type: "Bundle", length: "18\"", originId: brazilian.id, imageUrl: "/images/products/brazilian-body-wave.jpg" },
      { name: "Brazilian Straight Bundle", description: "Silky straight Brazilian hair bundle", price: "79.99", texture: "Straight", type: "Bundle", length: "20\"", originId: brazilian.id, imageUrl: "/images/products/brazilian-straight.jpg" },
      { name: "Peruvian Deep Wave Bundle", description: "Luxurious deep wave Peruvian hair", price: "94.99", texture: "Deep Wave", type: "Bundle", length: "22\"", originId: peruvian.id, imageUrl: "/images/products/peruvian-deep-wave.jpg" },
      { name: "Malaysian Curly Bundle", description: "Natural curly Malaysian hair bundle", price: "99.99", texture: "Curly", type: "Bundle", length: "16\"", originId: malaysian.id, imageUrl: "/images/products/malaysian-curly.jpg" },
      { name: "Brazilian Lace Closure", description: "4x4 lace closure with baby hair", price: "59.99", texture: "Body Wave", type: "Closure", length: "14\"", originId: brazilian.id, imageUrl: "/images/products/brazilian-closure.jpg" },
      { name: "Peruvian Frontal", description: "13x4 lace frontal ear to ear", price: "119.99", texture: "Straight", type: "Frontal", length: "16\"", originId: peruvian.id, imageUrl: "/images/products/peruvian-frontal.jpg" },
      { name: "Brazilian Loose Wave Bundle", description: "Elegant loose wave pattern", price: "84.99", texture: "Loose Wave", type: "Bundle", length: "24\"", originId: brazilian.id, imageUrl: "/images/products/brazilian-loose-wave.jpg" },
      { name: "Malaysian Straight Bundle", description: "Premium straight Malaysian hair", price: "74.99", texture: "Straight", type: "Bundle", length: "18\"", originId: malaysian.id, imageUrl: "/images/products/malaysian-straight.jpg" },
      { name: "Peruvian Body Wave Closure", description: "5x5 HD lace closure", price: "69.99", texture: "Body Wave", type: "Closure", length: "16\"", originId: peruvian.id, imageUrl: "/images/products/peruvian-closure.jpg" },
      { name: "Custom Wig - Body Wave", description: "Full lace wig with pre-plucked hairline", price: "299.99", texture: "Body Wave", type: "Wig", length: "20\"", originId: brazilian.id, imageUrl: "/images/products/custom-wig-body-wave.jpg" },
      { name: "Custom Wig - Straight", description: "Glueless HD lace wig", price: "279.99", texture: "Straight", type: "Wig", length: "22\"", originId: peruvian.id, imageUrl: "/images/products/custom-wig-straight.jpg" },
      { name: "Brazilian Deep Wave Bundle", description: "Deep wave pattern with lasting curl definition", price: "92.99", texture: "Deep Wave", type: "Bundle", length: "20\"", originId: brazilian.id, imageUrl: "/images/products/brazilian-deep-wave.jpg" },
    ]);
  }

  // Seed users
  const existingUsers = await db.select().from(users);
  if (existingUsers.length === 0) {
    console.log("  Seeding users...");
    // Password hash for "password123" (bcrypt)
    const hash = "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lLFpIGaW4y";
    await db.insert(users).values([
      { name: "Admin User", email: "admin@crowncommerce.com", passwordHash: hash, role: "admin" },
      { name: "Manager User", email: "manager@crowncommerce.com", passwordHash: hash, role: "admin" },
      { name: "Jane Customer", email: "jane@example.com", passwordHash: hash, role: "customer" },
      { name: "John Customer", email: "john@example.com", passwordHash: hash, role: "customer" },
      { name: "Sarah Customer", email: "sarah@example.com", passwordHash: hash, role: "customer" },
    ]);
  }

  // Seed content
  const existingPages = await db.select().from(pages);
  if (existingPages.length === 0) {
    console.log("  Seeding content pages...");
    await db.insert(pages).values([
      { title: "About Us", slug: "about", body: "CrownCommerce is a premium hair product platform offering the finest quality hair from around the world." },
      { title: "Shipping Policy", slug: "shipping", body: "We offer free shipping on orders over $150. Standard delivery takes 3-5 business days." },
      { title: "Return Policy", slug: "returns", body: "We accept returns within 14 days of delivery for unused products in original packaging." },
      { title: "Privacy Policy", slug: "privacy", body: "Your privacy is important to us. We collect and use your data only to process orders and improve your experience." },
      { title: "Terms of Service", slug: "terms", body: "By using CrownCommerce, you agree to our terms of service." },
    ]);
  }

  const existingFaqs = await db.select().from(faqs);
  if (existingFaqs.length === 0) {
    console.log("  Seeding FAQs...");
    await db.insert(faqs).values([
      { question: "How long does hair last?", answer: "With proper care, our premium hair bundles can last 12-24 months.", category: "Product" },
      { question: "Can I color the hair?", answer: "Yes! Our virgin hair can be colored, bleached, and styled just like your natural hair.", category: "Product" },
      { question: "What is your return policy?", answer: "We accept returns within 14 days of delivery for unused products in original packaging.", category: "Orders" },
      { question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.", category: "Shipping" },
      { question: "Do you offer wholesale pricing?", answer: "Yes! Contact us through our wholesale inquiry form for bulk pricing.", category: "Wholesale" },
      { question: "How do I care for my hair extensions?", answer: "Use sulfate-free shampoo, deep condition weekly, and avoid excessive heat styling.", category: "Care" },
    ]);
  }

  const existingTestimonials = await db.select().from(testimonials);
  if (existingTestimonials.length === 0) {
    console.log("  Seeding testimonials...");
    await db.insert(testimonials).values([
      { quote: "The best hair I've ever purchased! The quality is absolutely amazing.", author: "Michelle R.", rating: 5, location: "Atlanta, GA" },
      { quote: "I've been ordering from here for 2 years and the consistency is unmatched.", author: "Keisha T.", rating: 5, location: "Houston, TX" },
      { quote: "My clients love when I use these bundles. The hair is always perfect.", author: "Dominique L.", rating: 5, location: "Los Angeles, CA" },
    ]);
  }

  // Seed scheduling data
  const existingEmployees = await db.select().from(employees);
  if (existingEmployees.length === 0) {
    console.log("  Seeding scheduling data...");
    await db.insert(employees).values([
      { name: "Alex Johnson", role: "Engineering Lead", department: "Engineering", presence: "online" },
      { name: "Maria Garcia", role: "Product Designer", department: "Design", presence: "online" },
      { name: "James Wilson", role: "Backend Developer", department: "Engineering", presence: "away" },
      { name: "Sarah Chen", role: "Frontend Developer", department: "Engineering", presence: "offline" },
      { name: "David Kim", role: "QA Engineer", department: "Engineering", presence: "online" },
    ]);

    const seededEmployees = await db.select().from(employees);

    await db.insert(channels).values([
      { name: "general", type: "public", createdBy: seededEmployees[0].id },
      { name: "engineering", type: "public", createdBy: seededEmployees[0].id },
      { name: "design", type: "public", createdBy: seededEmployees[1].id },
      { name: "random", type: "public", createdBy: seededEmployees[0].id },
      { name: "announcements", type: "public", createdBy: seededEmployees[0].id },
      { name: "alex-maria", type: "direct", createdBy: seededEmployees[0].id },
      { name: "engineering-standup", type: "public", createdBy: seededEmployees[0].id },
    ]);

    const seededChannels = await db.select().from(channels);
    const general = seededChannels.find((c) => c.name === "general")!;
    const engineering = seededChannels.find((c) => c.name === "engineering")!;

    await db.insert(channelMessages).values([
      { channelId: general.id, senderId: seededEmployees[0].id, content: "Welcome to the team! 🎉" },
      { channelId: general.id, senderId: seededEmployees[1].id, content: "Thanks! Excited to be here!" },
      { channelId: general.id, senderId: seededEmployees[2].id, content: "Welcome aboard! Let us know if you need anything." },
      { channelId: engineering.id, senderId: seededEmployees[0].id, content: "Sprint planning at 10am tomorrow" },
      { channelId: engineering.id, senderId: seededEmployees[2].id, content: "Sounds good, I'll prepare my updates" },
      { channelId: engineering.id, senderId: seededEmployees[3].id, content: "I'll have the PR ready by then" },
      { channelId: general.id, senderId: seededEmployees[4].id, content: "Has anyone tested the new checkout flow?" },
      { channelId: engineering.id, senderId: seededEmployees[4].id, content: "Found a bug in the cart calculation, creating a ticket" },
      { channelId: general.id, senderId: seededEmployees[0].id, content: "Team lunch on Friday? 🍕" },
      { channelId: general.id, senderId: seededEmployees[1].id, content: "Count me in!" },
      { channelId: engineering.id, senderId: seededEmployees[0].id, content: "Code review backlog is clear. Great work everyone!" },
      { channelId: general.id, senderId: seededEmployees[2].id, content: "Reminder: office hours with leadership at 3pm" },
    ]);

    await db.insert(meetings).values([
      { title: "Sprint Planning", description: "Plan upcoming sprint tasks", date: "2026-04-08", startTime: "10:00", endTime: "11:00", location: "Conference Room A", organizerId: seededEmployees[0].id },
      { title: "Design Review", description: "Review new storefront designs", date: "2026-04-09", startTime: "14:00", endTime: "15:00", location: "Virtual", organizerId: seededEmployees[1].id },
      { title: "Team Standup", description: "Daily standup meeting", date: "2026-04-08", startTime: "09:00", endTime: "09:15", location: "Virtual", organizerId: seededEmployees[0].id },
      { title: "Quarterly Review", description: "Q1 progress review", date: "2026-04-10", startTime: "13:00", endTime: "14:30", location: "Main Conference Room", organizerId: seededEmployees[0].id },
    ]);
  }

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
