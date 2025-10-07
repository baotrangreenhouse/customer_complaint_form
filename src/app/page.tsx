/**
 * Home Page Component - Complaints Dashboard
 * 
 * This is the main landing page that displays all customer complaints in a table format.
 * Uses the new 1:1 database structure where each product is a separate complaint record.
 * 
 * Features:
 * - Fetches complaints on component mount
 * - Loading and error states
 * - Responsive table layout
 * - Filter by location, product, complaint type, health concern, follow-up status
 * - Real-time filter results count
 * - Clear filters functionality
 */
"use client"

import { FormInputData_Type } from "@/types/type";
import { useEffect, useState } from "react";
import { getComplaint } from "./actions/getComplaint";
import Navbar from "@/components/Nav/navbar";

const Home = () => {
  // State to store fetched complaints data
  const [complaints, setComplaints] = useState<FormInputData_Type[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<FormInputData_Type[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Filter states
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [filterCustomerName, setFilterCustomerName] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterProduct, setFilterProduct] = useState<string>("");
  const [filterProductSize, setFilterProductSize] = useState<string>("");
  const [filterComplaintType, setFilterComplaintType] = useState<string>("");
  const [filterHealthConcern, setFilterHealthConcern] = useState<string>("");
  const [filterResponse, setFilterResponse] = useState<string>("");
  const [filterFollowUp, setFilterFollowUp] = useState<string>("");

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
          setFilteredComplaints(data || []);
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

  // Apply filters whenever filter states or complaints change
  useEffect(() => {
    let filtered = [...complaints];

    // Date range filter
    if (filterDateFrom) {
      const fromDate = new Date(filterDateFrom);
      filtered = filtered.filter(c => {
        if (!c.created_at) return false;
        const complaintDate = new Date(c.created_at);
        return complaintDate >= fromDate;
      });
    }
    if (filterDateTo) {
      const toDate = new Date(filterDateTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire end date
      filtered = filtered.filter(c => {
        if (!c.created_at) return false;
        const complaintDate = new Date(c.created_at);
        return complaintDate <= toDate;
      });
    }

    // Text search filters (case-insensitive partial match)
    if (filterCustomerName) {
      const searchTerm = filterCustomerName.toLowerCase();
      filtered = filtered.filter(c => 
        c.customerName.toLowerCase().includes(searchTerm)
      );
    }
    if (filterLocation) {
      const searchTerm = filterLocation.toLowerCase();
      filtered = filtered.filter(c => 
        c.location.toLowerCase().includes(searchTerm)
      );
    }

    // Dropdown filters (exact match)
    if (filterProduct) {
      filtered = filtered.filter(c => c.productFlavour === filterProduct);
    }
    if (filterProductSize) {
      filtered = filtered.filter(c => c.productSize === filterProductSize);
    }
    if (filterComplaintType) {
      filtered = filtered.filter(c => c.complaintType === filterComplaintType);
    }
    if (filterHealthConcern) {
      filtered = filtered.filter(c => c.healthConcern === filterHealthConcern);
    }
    if (filterResponse) {
      filtered = filtered.filter(c => c.response === filterResponse);
    }
    if (filterFollowUp) {
      filtered = filtered.filter(c => c.followUpRequired === filterFollowUp);
    }

    setFilteredComplaints(filtered);
  }, [complaints, filterDateFrom, filterDateTo, filterCustomerName, filterLocation, 
      filterProduct, filterProductSize, filterComplaintType, filterHealthConcern, 
      filterResponse, filterFollowUp]);

  // Get unique values for filter dropdowns
  const uniqueLocations = Array.from(new Set(complaints.map(c => c.location))).filter(Boolean).sort();
  const uniqueProducts = Array.from(new Set(complaints.map(c => c.productFlavour))).filter(Boolean).sort();
  const uniqueProductSizes = Array.from(new Set(complaints.map(c => c.productSize))).filter(Boolean).sort();
  const uniqueComplaintTypes = Array.from(new Set(complaints.map(c => c.complaintType))).filter(Boolean).sort();
  const uniqueResponses = Array.from(new Set(complaints.map(c => c.response))).filter(Boolean).sort();

  // Clear all filters
  const clearFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterCustomerName("");
    setFilterLocation("");
    setFilterProduct("");
    setFilterProductSize("");
    setFilterComplaintType("");
    setFilterHealthConcern("");
    setFilterResponse("");
    setFilterFollowUp("");
  };

  // Loading state
  if (loading) {
    return (
      <section className="min-h-screen bg-[var(--background-cream-color)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 text-center py-20">
          <div className="text--header mb-6 text-[var(--text-primary)]">Loading complaints...</div>
          <div className="loader-div"></div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="min-h-screen bg-[var(--background-cream-color)]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 text-center py-20">
          <div className="text--header mb-4 text-[var(--error-red)]">Error Loading Complaints</div>
          <p className="text--content text-[var(--text-secondary)]">{error}</p>
          <p className="text-sm text-[var(--text-light)] mt-4">
            Check your .env.local file and Supabase configuration
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[var(--background-cream-color)] pt-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text--header mb-6 text-[var(--text-primary)]">Customer Complaints</div>

        {/* Filter Bar - Compact Design */}
        <div className="bg-white shadow--greenhouse p-4 mb-6">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Filters</h2>
              <span className="text-sm text-[var(--text-secondary)] group-open:hidden">
                Click to expand filters
              </span>
              <span className="text-sm text-[var(--text-secondary)] hidden group-open:inline">
                Click to collapse
              </span>
            </summary>
            
            <div className="mt-4 pt-4 border-t border-[var(--text-light)]">
              {/* Date Range Filters */}
              <div className="mb-4 pb-4 border-b border-[var(--text-light)]">
                <p className="text-xs font-bold text-[var(--olive-green)] uppercase tracking-wide mb-2">Date Range</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className="w-full h-10 px-2 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className="w-full h-10 px-2 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Search Filters */}
              <div className="mb-4 pb-4 border-b border-[var(--text-light)]">
                <p className="text-xs font-bold text-[var(--olive-green)] uppercase tracking-wide mb-2">Search</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={filterCustomerName}
                      onChange={(e) => setFilterCustomerName(e.target.value)}
                      className="w-full h-10 px-2 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] placeholder:text-[var(--text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-full h-10 px-2 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] placeholder:text-[var(--text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Dropdown Filters */}
              <div className="mb-3">
                <p className="text-xs font-bold text-[var(--olive-green)] uppercase tracking-wide mb-2">Filters</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* Product Filter */}
                  <select
                    value={filterProduct}
                    onChange={(e) => setFilterProduct(e.target.value)}
                    className="w-full h-10 px-2 text-xs border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                  >
                    <option value="">All Products</option>
                    {uniqueProducts.map(prod => (
                      <option key={prod} value={prod}>{prod}</option>
                    ))}
                  </select>

                  {/* Product Size Filter */}
                  <select
                    value={filterProductSize}
                    onChange={(e) => setFilterProductSize(e.target.value)}
                    className="w-full h-10 px-2 text-xs border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                  >
                    <option value="">All Sizes</option>
                    {uniqueProductSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>

                  {/* Complaint Type Filter */}
                  <select
                    value={filterComplaintType}
                    onChange={(e) => setFilterComplaintType(e.target.value)}
                    className="w-full h-10 px-2 text-xs border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {uniqueComplaintTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  {/* Health Concern Filter */}
                  <select
                    value={filterHealthConcern}
                    onChange={(e) => setFilterHealthConcern(e.target.value)}
                    className="w-full h-10 px-2 text-xs border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                  >
                    <option value="">Health</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>

                  {/* Response Filter */}
                  <select
                    value={filterResponse}
                    onChange={(e) => setFilterResponse(e.target.value)}
                    className="w-full h-10 px-2 text-xs border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                  >
                    <option value="">Response</option>
                    {uniqueResponses.map(response => (
                      <option key={response} value={response}>{response}</option>
                    ))}
                  </select>

                  {/* Follow-up Filter */}
                  <select
                    value={filterFollowUp}
                    onChange={(e) => setFilterFollowUp(e.target.value)}
                    className="w-full h-10 px-2 text-xs border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                  >
                    <option value="">Follow-up</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {/* Results Count and Clear Button */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--text-light)]">
                <div className="text-xs text-[var(--text-secondary)]">
                  Showing <span className="font-bold text-[var(--text-primary)]">{filteredComplaints.length}</span> of <span className="font-bold text-[var(--text-primary)]">{complaints.length}</span>
                </div>
                <button
                  onClick={clearFilters}
                  className="px-4 h-8 text-xs bg-[var(--coral-orange)] text-white font-medium hover:opacity-90 transition-opacity"
                >
                  Clear All
                </button>
              </div>
            </div>
          </details>
        </div>

        {/* No complaints state */}
        {complaints.length === 0 ? (
          <div className="text-center py-20 bg-white shadow--greenhouse p-12">
            <p className="text--content text-[var(--text-secondary)] mb-4">
              No complaints found. 
            </p>
            <p className="text-sm text-[var(--text-light)]">
              Submit your first complaint using the form.
            </p>
          </div>
        ) : (
          /* Complaints table */
          <div className="bg-white shadow--greenhouse overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--olive-green)] text-white">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Date</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Customer</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Location</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Product</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Size</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Complaint Type</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Health Concern</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Response</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Follow-up</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-[var(--text-light)] hover:bg-[var(--pale-green)] hover:bg-opacity-10 transition-colors duration-150"
                    >
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base text-[var(--text-secondary)]">
                        {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base text-[var(--text-primary)] font-medium">
                        {complaint.customerName}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base text-[var(--text-secondary)]">
                        {complaint.location === "Customer Service (Grocery / Non-Greenhouse Retail Store)" 
                          ? complaint.locationCustomerService || complaint.location
                          : complaint.location}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base text-[var(--text-secondary)]">
                        {complaint.productFlavour}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base text-[var(--text-secondary)]">
                        {complaint.productSize}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base text-[var(--text-secondary)]">
                        {complaint.complaintType}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span className={`badge ${
                          complaint.healthConcern === 'Yes' 
                            ? 'badge--error' 
                            : 'badge--success'
                        }`}>
                          {complaint.healthConcern}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base text-[var(--text-secondary)]">
                        {complaint.response}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span className={`badge ${
                          complaint.followUpRequired === 'Yes' 
                            ? 'badge--error' 
                            : 'badge--success'
                        }`}>
                          {complaint.followUpRequired}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty filter state */}
              {filteredComplaints.length === 0 && complaints.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-lg text-[var(--text-secondary)]">
                    No complaints match the selected filters
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Home;