"use server"
import supabase from "@/lib/supabaseClient"


const customer_complaint_table: string = "customer_complaint";

export const getComplaint = async () => {
  const {status, data, error} = await supabase
    .from(customer_complaint_table)
    .select("*")

  console.log(status);
  console.log(data);
  console.log(error);
  return {status, data, error};
}
