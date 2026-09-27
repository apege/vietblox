import { neon } from "@neondatabase/serverless";

// Fallback to configured project database string if process.env isn't bound on Cloudflare yet
const FALLBACK_DATABASE_URL =
  "postgresql://neondb_owner:npg_kNgGz7hl1MUS@ep-lingering-hall-b3i8pm10-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

let clientInstance: any = null;

function getCleanDbUrl(): string {
  let url = process.env.DATABASE_URL || FALLBACK_DATABASE_URL;
  if (!url || typeof url !== "string") {
    url = FALLBACK_DATABASE_URL;
  }
  // Clean quotes and remove channel_binding for HTTP fetch compatibility
  url = url.trim().replace(/^["']|["']$/g, "");
  url = url.replace(/&?channel_binding=[^&]+/g, "");
  return url;
}

function getClient() {
  if (!clientInstance) {
    const url = getCleanDbUrl();
    clientInstance = neon(url);
  }
  return clientInstance;
}

/**
 * Executes a parameterized SQL query on Neon Serverless Postgres
 */
export const sql = async <T = any>(
  queryText: string,
  params: any[] = []
): Promise<T[]> => {
  const client = getClient();
  if (typeof client.query === "function") {
    const result = await client.query(queryText, params);
    return result as T[];
  }
  const result = await client(queryText, params);
  return result as T[];
};

/**
 * Cache Tags for on-demand revalidation in Next.js
 */
export const CACHE_TAGS = {
  PRODUCTS: "products-data",
  STORE_SETTINGS: "store-settings-data",
  TESTIMONIALS: "testimonials-data",
  ORDERS: "orders-data",
};

/**
 * Type-safe Database query helper with error catching
 */
export async function queryDb<T = any>(
  queryText: string,
  params: any[] = []
): Promise<{ data: T[] | null; error: string | null }> {
  try {
    const data = await sql<T>(queryText, params);
    return { data, error: null };
  } catch (err: any) {
    console.error("Database query error:", err);
    return { data: null, error: err.message || "Unknown database error" };
  }
}
