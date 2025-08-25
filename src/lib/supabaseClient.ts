import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL: string = process.env.SUPABASE_URL ?? "";
const SERVICE_KEY: string = process.env.SUPABASE_PRIVATE_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

export default supabase;

