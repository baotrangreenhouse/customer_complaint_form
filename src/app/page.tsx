/**
 * Home Page Component
 * 
 * This is the main landing page of the application (route: "/").
 * Currently set up to fetch and display complaint data, but the UI is incomplete.
 * 
 * Features:
 * - Uses "use client" directive for client-side rendering
 * - Fetches complaint data using the getComplaint server action
 * - Manages complaints state with React useState
 * - Currently renders an empty section (incomplete implementation)
 * 
 * TODO: Implement the UI to display fetched complaints data
 */
"use client"

import { FormInputData_Type } from "@/types/type";
import { useEffect, useState } from "react";
import { getComplaint } from "./actions/getComplaint";

const Home = () => {
  // State to store fetched complaints data
  const [complaints, setComplaints] = useState<FormInputData_Type[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch complaints data when component mounts
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { status, data, error } = await getComplaint();
        
        if (error) {
          setError(error.message || "Failed to fetch complaints");
          console.error("Error fetching complaints:", error);
        } else {
          setComplaints(data || []);
          console.log("Successfully fetched complaints:", data);
        }
      } catch (err) {
        setError("Failed to fetch complaints");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    
    getData();
  }, [])

  // Loading state
  if (loading) {
    return (
      <section className="pt-20 px-5">
        <div className="text-center">
          <div className="text--header mb-4">Loading complaints...</div>
          <div className="loader-div"></div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="pt-20 px-5">
        <div className="text-center">
          <div className="text--header mb-4 text-[var(--red-color)]">Error</div>
          <p className="text--content">{error}</p>
          <p className="text-sm text-[var(--grey-color)] mt-2">
            Check your .env.local file and Supabase configuration
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-20 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="text--header mb-6">Customer Complaints</div>
        
        {/* No complaints state */}
        {complaints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text--content text-[var(--grey-color)]">
              No complaints found. 
            </p>
            <p className="text-sm text-[var(--grey-color)] mt-2">
              Submit your first complaint using the form.
            </p>
          </div>
        ) : (
          /* Complaints table */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--pale-green-color)] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left">Complaint Type</th>
                    <th className="px-4 py-3 text-left">Health Concern</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Products</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint, index) => (
                    <tr key={index} className="border-b border-[var(--grey-color)]">
                      <td className="px-4 py-3">{complaint.customerName}</td>
                      <td className="px-4 py-3">{complaint.location}</td>
                      <td className="px-4 py-3">{complaint.complaintType}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          complaint.healthConcern === 'Yes' 
                            ? 'bg-[var(--red-color)] text-white' 
                            : 'bg-[var(--green-color)] text-white'
                        }`}>
                          {complaint.healthConcern}
                        </span>
                      </td>
                      <td className="px-4 py-3">{complaint.response}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[var(--grey-color)]">
                          {complaint.product?.length || 0} product(s)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Home;