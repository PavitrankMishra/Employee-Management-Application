import React, { useEffect, useState } from "react";
import Header from "./Header";
import styles from "./UserList.module.css";

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

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
  
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
  
      const updatedUser = await response.json(); // Get the updated user data from API
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...updatedUser } : user
        )
      );
  
      setEditingUser(null);
      setMessage("User updated successfully");
  
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error updating user");
      setTimeout(() => setMessage(""), 3000);
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

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      <Header />
      <section className={styles.userListSection}>
        <h1 className={styles.userHeading}>User List</h1>
        {message && <p className={styles.message}>{message}</p>}
        {editingUser && (
          <div className={styles.overlay}>
            <form onSubmit={handleUpdate} className={styles.editingForm}>
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
              <button type="submit">Update User</button>
              <button onClick={() => setEditingUser(null)}>
                Cancel Updating User
              </button>
            </form>
          </div>
        )}
        <ul className={styles.userList}>
          {users.map((user) => (
            <li key={user.id} className={styles.userItem}>
              <img
                src={user.avatar}
                alt={user.first_name}
                className={styles.userImage}
              />
              <span className={styles.userName}>
                {user.first_name} {user.last_name}
              </span>
              <div className={styles.buttonContainer}>
                <button
                  onClick={() => handleEditUser(user)}
                  className={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.navigation}>
          <button
            onClick={handlePreviousPage}
            className={styles.previousButton}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <button
            onClick={handleNextPage}
            className={styles.nextButton}
            disabled={currentPage === 2}
          >
            Next Page
          </button>
        </div>
      </section>
    </>
  );
};

export default UserList;
