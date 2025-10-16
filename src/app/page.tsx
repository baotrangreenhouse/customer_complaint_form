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
import { markFollowUpCompleted } from "./actions/updateFollowUp";
import Navbar from "@/components/Nav/navbar";

const Home = () => {
  // State to store fetched complaints data
  const [complaints, setComplaints] = useState<FormInputData_Type[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<FormInputData_Type[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  // Accordion state - tracks which rows are expanded
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  
  // Loading state for marking complete
  const [completingIds, setCompletingIds] = useState<Set<number>>(new Set());

  // Filter states
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [filterCustomerName, setFilterCustomerName] = useState<string>("");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterProduct, setFilterProduct] = useState<string>("");
  const [filterProductSize, setFilterProductSize] = useState<string>("");
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [filterFollowUp, setFilterFollowUp] = useState<string>("");
  const [filterResponse, setFilterResponse] = useState<string>("");

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
    if (filterResponse) {
      filtered = filtered.filter(c => c.response === filterResponse);
    }
    if (filterDepartment) {
      filtered = filtered.filter(c => c.followUpDepartment === filterDepartment);
    }
    if (filterFollowUp) {
      filtered = filtered.filter(c => c.followUpRequired === filterFollowUp);
    }

    setFilteredComplaints(filtered);
  }, [complaints, filterDateFrom, filterDateTo, filterCustomerName, filterLocation, 
      filterProduct, filterProductSize, filterResponse, filterDepartment, filterFollowUp]);

  // Get unique values for filter dropdowns
  const uniqueLocations = Array.from(new Set(complaints.map(c => c.location))).filter(Boolean).sort();
  const uniqueProducts = Array.from(new Set(complaints.map(c => c.productFlavour))).filter(Boolean).sort();
  const uniqueProductSizes = Array.from(new Set(complaints.map(c => c.productSize))).filter(Boolean).sort();
  const uniqueDepartments = Array.from(new Set(complaints.map(c => c.followUpDepartment))).filter(Boolean).sort();
  const uniqueFollowUps = Array.from(new Set(complaints.map(c => c.followUpRequired))).filter(Boolean).sort();
  const uniqueResponses = Array.from(new Set(complaints.map(c => c.response))).filter(Boolean).sort();

  // Clear all filters
  const clearFilters = () => {
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterCustomerName("");
    setFilterLocation("");
    setFilterProduct("");
    setFilterProductSize("");
    setFilterResponse("");
    setFilterDepartment("");
    setFilterFollowUp("");
  };

  // Mark follow-up as completed
  const handleMarkComplete = async (complaintId: number) => {
    try {
      // Add to loading state
      setCompletingIds(prev => new Set(prev).add(complaintId));
      
      const { status, error } = await markFollowUpCompleted(complaintId);
      
      if (error) {
        console.error("Error marking follow-up as completed:", error);
        alert("Failed to mark follow-up as completed");
      } else {
        console.log("Successfully marked follow-up as completed");
        // Refresh complaints list
        const { data } = await getComplaint();
        if (data) {
          setComplaints(data);
          setFilteredComplaints(data);
        }
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to mark follow-up as completed");
    } finally {
      // Remove from loading state
      setCompletingIds(prev => {
        const next = new Set(prev);
        next.delete(complaintId);
        return next;
      });
    }
  };
  
  // Toggle row expansion
  const toggleRow = (index: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
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
              {/* Bento-style Filter Grid with 8pt spacing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Date Range Section */}
                <div className="border border-[var(--text-light)] p-4 bg-[var(--background-cream-color)]">
                  <p className="text-xs font-bold text-[var(--olive-green)] uppercase tracking-wide mb-3">Date Range</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="w-full h-10 px-3 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="w-full h-10 px-3 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Search Section */}
                <div className="border border-[var(--text-light)] p-4 bg-[var(--background-cream-color)]">
                  <p className="text-xs font-bold text-[var(--olive-green)] uppercase tracking-wide mb-3">Search</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={filterCustomerName}
                        onChange={(e) => setFilterCustomerName(e.target.value)}
                        className="w-full h-10 px-3 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] placeholder:text-[var(--text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="w-full h-10 px-3 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] placeholder:text-[var(--text-light)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropdown Filters Section - Full Width */}
              <div className="border border-[var(--text-light)] p-4 bg-[var(--background-cream-color)] mt-4">
                <p className="text-xs font-bold text-[var(--olive-green)] uppercase tracking-wide mb-3">Filters</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {/* Product Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">
                      Product
                    </label>
                    <select
                      value={filterProduct}
                      onChange={(e) => setFilterProduct(e.target.value)}
                      className="w-full h-10 px-3 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent cursor-pointer"
                    >
                      <option value="">All Products</option>
                      {uniqueProducts.map(prod => (
                        <option key={prod} value={prod}>{prod}</option>
                      ))}
                    </select>
                  </div>

                  {/* Product Size Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">
                      Size
                    </label>
                    <select
                      value={filterProductSize}
                      onChange={(e) => setFilterProductSize(e.target.value)}
                      className="w-full h-10 px-3 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent cursor-pointer"
                    >
                      <option value="">All Sizes</option>
                      {uniqueProductSizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  {/* Department Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">
                      Department
                    </label>
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="w-full h-10 px-3 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent cursor-pointer"
                    >
                      <option value="">All Departments</option>
                      {uniqueDepartments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  {/* Follow-up Required Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">
                      Follow-up
                    </label>
                    <select
                      value={filterFollowUp}
                      onChange={(e) => setFilterFollowUp(e.target.value)}
                      className="w-full h-10 px-3 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent cursor-pointer"
                    >
                      <option value="">All Follow-ups</option>
                      {uniqueFollowUps.map(followUp => (
                        <option key={followUp} value={followUp}>{followUp}</option>
                      ))}
                    </select>
                  </div>

                  {/* Response Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-primary)] mb-2">
                      Response
                    </label>
                    <select
                      value={filterResponse}
                      onChange={(e) => setFilterResponse(e.target.value)}
                      className="w-full h-10 px-3 text-sm border border-[var(--text-light)] bg-white text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--olive-green)] focus:border-transparent cursor-pointer"
                    >
                      <option value="">All Responses</option>
                      {uniqueResponses.map(response => (
                        <option key={response} value={response}>{response}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Results Count and Clear Button */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm font-medium text-[var(--text-secondary)]">
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
          /* Complaints table with accordion */
          <div className="bg-white shadow--greenhouse overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--olive-green)] text-white">
                  <tr>
                    <th className="w-10 px-4 py-3 lg:py-4"></th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Date</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Customer</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Product</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Department</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold uppercase tracking-wide">Follow-up</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint, index) => (
                    <>
                      {/* Main collapsed row */}
                      <tr 
                        key={`row-${index}`} 
                        className="border-b border-[var(--text-light)] cursor-pointer"
                        onClick={() => toggleRow(index)}
                      >
                        {/* Expand/Collapse Icon */}
                        <td className="px-4 py-3 lg:py-4 text-center">
                          <svg 
                            className={`w-5 h-5 text-[var(--olive-green)] transition-transform duration-200 ${
                              expandedRows.has(index) ? 'rotate-90' : ''
                            }`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </td>
                        
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base text-[var(--text-secondary)]">
                          {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base text-[var(--text-primary)] font-medium">
                          {complaint.customerName}
                        </td>
                        
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base text-[var(--text-secondary)]">
                          {complaint.productFlavour}
                        </td>
                        
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base text-[var(--text-secondary)]">
                          {complaint.followUpDepartment || 'N/A'}
                        </td>
                        
                        <td className="px-4 lg:px-6 py-3 lg:py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                              complaint.followUpRequired === 'Yes' 
                                ? 'bg-[var(--coral-orange)] text-white' 
                                : 'bg-[var(--pale-green)] text-[var(--olive-green)]'
                            }`}>
                              {complaint.followUpRequired || 'N/A'}
                            </span>
                            {complaint.followUpRequired === 'Yes' && (
                              <button
                                onClick={() => handleMarkComplete(complaint.id!)}
                                disabled={completingIds.has(complaint.id!)}
                                className={`
                                  px-3 py-1 text-xs font-medium rounded
                                  transition-all duration-200 ease-in-out
                                  ${completingIds.has(complaint.id!) 
                                    ? 'bg-gray-400 text-white cursor-wait' 
                                    : 'bg-[var(--olive-green)] text-white hover:bg-opacity-90 hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                                  }
                                `}
                                title="Mark as completed"
                              >
                                {completingIds.has(complaint.id!) ? (
                                  <span className="flex items-center gap-1">
                                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Completing...
                                  </span>
                                ) : (
                                  '✓ Complete'
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded details row */}
                      {expandedRows.has(index) && (
                        <tr key={`expanded-${index}`} className="bg-[var(--background-grey-color)]">
                          <td colSpan={6} className="p-4">
                            {/* Asymmetrical Bento-style layout - fills full width */}
                            <div className="grid grid-cols-12 gap-4">
                              
                              {/* Row 1: Contact (col-span-4), Location (col-span-3), Issue (col-span-5) */}
                              {/* Contact Information Box - Medium */}
                              <div className="col-span-12 md:col-span-6 lg:col-span-4 border border-[var(--text-light)] bg-white p-4">
                                <h4 className="font-bold text-[var(--olive-green)] uppercase text-xs tracking-wide mb-3">Contact Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-[var(--text-light)] text-xs font-medium">Email:</span>
                                    <p className="text-[var(--text-primary)] font-medium">{complaint.customerEmail || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <span className="text-[var(--text-light)] text-xs font-medium">Phone:</span>
                                    <p className="text-[var(--text-primary)] font-medium">{complaint.customerPhone || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <span className="text-[var(--text-light)] text-xs font-medium">Source:</span>
                                    <p className="text-[var(--text-primary)] font-medium">{complaint.complaintSource || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Location Details Box - Smaller */}
                              <div className="col-span-12 md:col-span-6 lg:col-span-3 border border-[var(--text-light)] bg-white p-4">
                                <h4 className="font-bold text-[var(--olive-green)] uppercase text-xs tracking-wide mb-3">Location</h4>
                                <div className="text-sm">
                                  <span className="text-[var(--text-light)] text-xs font-medium">Store:</span>
                                  <p className="text-[var(--text-primary)] font-medium">
                                    {complaint.location === "Customer Service (Grocery / Non-Greenhouse Retail Store)" 
                                      ? complaint.locationCustomerService || complaint.location
                                      : complaint.location}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Issue Details Box - Larger */}
                              <div className="col-span-12 md:col-span-12 lg:col-span-5 border border-[var(--text-light)] bg-white p-4">
                                <h4 className="font-bold text-[var(--olive-green)] uppercase text-xs tracking-wide mb-3">Issue Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-[var(--text-light)] text-xs font-medium">Department:</span>
                                    <p className="text-[var(--text-primary)] font-medium">{complaint.followUpDepartment || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <span className="text-[var(--text-light)] text-xs font-medium">Issues:</span>
                                    <p className="text-[var(--text-primary)] font-medium">
                                      {Array.isArray(complaint.issue) 
                                        ? complaint.issue.join(', ') 
                                        : complaint.issue || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Row 2: Product (col-span-5), Response (col-span-4), Additional Notes (col-span-3) */}
                              {/* Product Details Box - Larger */}
                              <div className="col-span-12 md:col-span-6 lg:col-span-5 border border-[var(--text-light)] bg-white p-4">
                                <h4 className="font-bold text-[var(--olive-green)] uppercase text-xs tracking-wide mb-3">Product Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-[var(--text-light)] text-xs font-medium">Product:</span>
                                    <p className="text-[var(--text-primary)] font-medium">{complaint.productFlavour}</p>
                                  </div>
                                  <div>
                                    <span className="text-[var(--text-light)] text-xs font-medium">Size:</span>
                                    <p className="text-[var(--text-primary)] font-medium">{complaint.productSize}</p>
                                  </div>
                                  <div>
                                    <span className="text-[var(--text-light)] text-xs font-medium">Best Before Date:</span>
                                    <p className="text-[var(--text-primary)] font-medium">
                                      {complaint.bestBeforeDate ? new Date(complaint.bestBeforeDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-[var(--text-light)] text-xs font-medium">Affected Units:</span>
                                    <p className="text-[var(--text-primary)] font-medium">{complaint.affectedUnit || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <span className="text-[var(--text-light)] text-xs font-medium">Product in Possession:</span>
                                    <p className="text-[var(--text-primary)] font-medium">{complaint.productInPossession || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Response Details Box - Medium */}
                              <div className="col-span-12 md:col-span-6 lg:col-span-4 border border-[var(--text-light)] bg-white p-4">
                                <h4 className="font-bold text-[var(--olive-green)] uppercase text-xs tracking-wide mb-3">Response Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-[var(--text-light)] text-xs font-medium">Response:</span>
                                    <p className="text-[var(--text-primary)] font-medium">{complaint.response || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <span className="text-[var(--text-light)] text-xs font-medium">Follow-up Required:</span>
                                    <p className="text-[var(--text-primary)] font-medium">{complaint.followUpRequired || 'N/A'}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Additional Notes Box - Small but always visible */}
                              <div className="col-span-12 md:col-span-12 lg:col-span-3 border border-[var(--text-light)] bg-white p-4">
                                <h4 className="font-bold text-[var(--olive-green)] uppercase text-xs tracking-wide mb-3">Additional Notes</h4>
                                <p className="text-[var(--text-primary)] text-sm whitespace-pre-wrap leading-relaxed min-h-[60px]">
                                  {complaint.additionalNotes || 'No additional notes provided.'}
                                </p>
                              </div>
                              
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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