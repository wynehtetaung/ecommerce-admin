/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import "./dashboard.css";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const getUsers = await fetch(
        "https://ecommerce-project-api-s1c9.onrender.com/api/v1/user"
      );
      const { users } = await getUsers.json();
      setUsers(users);
    })();
  }, []);
  return (
    <div className="admin-dashboard">
      <div className="user-list">
        <div className="user-list-title">
          <p>Name</p>
          <p>Email</p>
          <p>Verified</p>
          <p>Action</p>
        </div>
        {users.map((user) => {
          return (
            <div key={user._id} className="user-list-content">
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{user.emailVerified === true ? "Verify" : "Not Verify"}</p>
              <button
                onClick={async () => {
                  const id = user._id;
                  await fetch(
                    `https://ecommerce-project-api-s1c9.onrender.com/api/v1/user/${id}`,
                    {
                      method: "DELETE",
                    }
                  );
                  const filterUsers = users.filter((user) => user._id !== id);
                  setUsers(filterUsers);
                }}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
