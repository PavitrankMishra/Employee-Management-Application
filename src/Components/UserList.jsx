import React, { useEffect, useState } from "react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://reqres.in/api/users?page=1");
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
  }, []);
  return (
    <section>
      {users.map((user) => (
        <ul key={user.id}>
          <li>{user.email}</li>
          <li>{user.first_name}</li>
          <li>{user.last_name}</li>
          <li>{user.avatar}</li>
        </ul>
      ))}
    </section>
  );
};

export default UserList;
