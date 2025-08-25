"use server"
import { API_Response_Type, FormInputData_Type, FormInputProduct_Type } from "@/types/type";
import supabase from "@/lib/supabaseClient";

const customer_complaint_table: string = "customer_complaint";
const customer_complaint_product_table: string = "customer_complaint_product";

export const submitForm = async (inputData: FormInputData_Type) : Promise<API_Response_Type> => {
  const {status, data, error} = await supabase
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
  if (!error) {
    const {status, error} = await supabase
      .from(customer_complaint_product_table)
      .insert(
        inputData.product.map((product: FormInputProduct_Type) => {
          return {
            complaint_id: data[0].id,
            product_flavour: product.productFlavour,
            product_size: product.productSize,
            affected_unit: product.affectedUnit,
            best_before_date: product.bestBeforeDate
          }
        })
      );
    return {status, data: [], error};
  }
  return {status, data: [], error};
}

