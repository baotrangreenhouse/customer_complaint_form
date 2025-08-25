"use server"
import { FormInputData_Type } from "@/types/type";
import supabase from "@/lib/supabaseClient";

const customer_complaint_table: string = "customer_complaint";

export const submitForm = async (inputData: FormInputData_Type) => {
  console.log("supabase", supabase);

  const {data, error} = await supabase
    .from(customer_complaint_table)
    .insert([
      {
        customer_name: inputData.customerName,
        location: inputData.location,
        complaint_type: inputData.complaintType,
        complaint_type_details: inputData.complaintTypeDetails,
        health_concern: inputData.healthConcern,
        health_concern_details: inputData.healthConcernDetails,
        issue: inputData.issue.join(";"),
        issue_details: inputData.issueDetails,
        sample_held: inputData.sampleHeld,
        response: inputData.response,
        follow_up_required: inputData.followUpRequired,
        additional_notes: inputData.additionalNotes
      }
    ]).select();
  console.log(data);
  console.log(error);
}

