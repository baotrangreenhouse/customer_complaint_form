"use client"

import { useState } from "react";
import { getStoreLocations } from "@/app/actions/getStoreLocations";

/**
 * Test page for SQL Server connection
 * Navigate to /test-sql to use this page
 */
export default function TestSQLPage() {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    console.log('Testing SQL Server connection...');
    
    try {
      const { data, error } = await getStoreLocations();
      
      if (error) {
        setError(error);
        console.error('Error:', error);
      } else {
        setLocations(data);
        console.log('Success! Fetched locations:', data);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('Caught error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-cream-color)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">
          SQL Server Connection Test
        </h1>

        <div className="bg-white p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Details</h2>
          <div className="space-y-2 text-sm font-mono">
            <div>Host: {process.env.NEXT_PUBLIC_SQL_HOST || '(check server logs)'}</div>
            <div>Database: {process.env.NEXT_PUBLIC_SQL_DATABASE || '(check server logs)'}</div>
            <div>User: {process.env.NEXT_PUBLIC_SQL_USER || '(check server logs)'}</div>
          </div>
        </div>

        <button
          onClick={testConnection}
          disabled={loading}
          className="px-6 py-3 bg-[var(--olive-green)] text-white font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Testing Connection...' : 'Test SQL Connection'}
        </button>

        {error && (
          <div className="mt-6 bg-red-50 border-2 border-red-500 p-4">
            <h3 className="font-bold text-red-800 mb-2">Error:</h3>
            <p className="text-red-700 font-mono text-sm">{error}</p>
            <p className="text-red-600 text-xs mt-2">Check the browser console and server terminal for detailed logs</p>
          </div>
        )}

        {locations.length > 0 && (
          <div className="mt-6 bg-green-50 border-2 border-green-500 p-4">
            <h3 className="font-bold text-green-800 mb-2">
              Success! Fetched {locations.length} locations:
            </h3>
            <div className="max-h-96 overflow-y-auto">
              <ul className="list-disc list-inside text-sm space-y-1">
                {locations.map((loc, index) => (
                  <li key={index} className="text-green-700">{loc}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gray-50 p-4 text-sm">
          <h3 className="font-semibold mb-2">Troubleshooting:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Check browser console (F12) for client-side errors</li>
            <li>Check terminal where you ran <code className="bg-gray-200 px-1">npm run dev</code> for server-side errors</li>
            <li>Verify credentials in <code className="bg-gray-200 px-1">.env.local</code></li>
            <li>Ensure SQL Server allows connections from your IP</li>
            <li>For Azure SQL: Verify firewall rules in Azure Portal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
