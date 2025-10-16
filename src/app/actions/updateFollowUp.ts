/**
 * Update Follow Up Server Action
 * 
 * This action marks a complaint's follow-up status as completed (No)
 */
"use server"

import supabase from "@/lib/supabaseClient"

const customer_complaint_table: string = "customer_complaint";

/**
 * Updates the followUpRequired field to "No" for a specific complaint
 * 
 * @param complaintId - The ID of the complaint to update
 * @returns Promise with status, data, and error
 */
export async function markFollowUpCompleted(complaintId: number) {
  const { status, data, error } = await supabase
    .from(customer_complaint_table)
    .update({ followUpRequired: "No" })
    .eq('id', complaintId)
    .select();

  return { status, data, error };
}
