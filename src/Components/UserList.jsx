import React, { useEffect, useState } from "react";
import Header from "./Header";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  const handleNextPage = () => {
    setCurrentPage(2);
  };

  const handlePreviousPage = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `https://reqres.in/api/users?page=${currentPage}`
        );
        if (!response.ok) {
          throw new console.error("Network response was not ok");
        }
        const data = await response.json();
        setUsers(data.data);
        console.log(data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `https://reqres.in/api/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );
      setEditingUser(null);
      setMessage("User updated successfully");
    } catch (error) {
      setMessage("Error updating user");
    }
  };
  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`https://reqres.in/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((user) => user.id !== id));
      setMessage("User deleted successfully");
    } catch (error) {
      setMessage("Error deleting data");
    }
  };
  return (
    <section>
    <Header />
      <h1>User List</h1>
      {message && <p>{message}</p>}
      {editingUser && (
        <div>
          <h2>Edit User</h2>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <button onClick={handleUpdate}>Update User</button>
          <button onClick={() => setEditingUser(null)}>
            Cancel Updating User
          </button>
        </div>
      )}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <img src={user.avatar} alt={user.first_name} width="50" />
            {user.first_name} {user.last_name} - {user.email}
            <button onClick={() => handleEditUser(user)}>Edit User</button>
            <button onClick={() => handleDeleteUser(user.id)}>
              Delete User
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handlePreviousPage}>Previous Page</button>
      <button onClick={handleNextPage}>Next Page</button>
    </section>
  );
};

export default UserList;
