import { neon } from "@neondatabase/serverless";

let clientInstance: any = null;

function getClient() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not configured in .env.local");
  }
  if (!clientInstance) {
    clientInstance = neon(dbUrl);
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
  // Neon v1+ requires client.query(queryText, params) for parameterized queries with placeholders ($1, $2, etc.)
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
