import React, { useEffect, useState } from "react";
import { authFetch } from "../lib/api";

function TopUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getData() {
      try {
        // Replace "/api/users" with your actual endpoint
        const data = await authFetch("/api/users", { method: "GET" });
        setUsers(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    getData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <h2>Top Users:</h2>
      <ul>
        {users.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default TopUsers;























