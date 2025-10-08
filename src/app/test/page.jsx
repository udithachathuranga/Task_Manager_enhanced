"use client";

import React, { useEffect, useState } from "react";

export default function Test() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 👇 change this URL to your API route
        const res = await fetch(`/api/users_in_project?project_id=90743944-9e6e-40c7-8a7a-01974e1614da`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">API Test Page</h1>

      {error && <p className="text-red-500">❌ Error: {error}</p>}
      {data ? (
        <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
}
