import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function UserDashboard() {
  type User = {
    name: string;
    email: string;
    password: string;
    role: string;
  };

  type Task = {
    title:string,
    description:string,
    createdBy:User,
  };

  const token = Cookies.get("token");
  const [tasks, setTasks] = useState<Task[]>([]);
  let user: User | null = null;

  try {
    if (token) {
      user = jwtDecode<User>(token);
    }
  } catch (e) {
    console.log(e);
    alert("Token not found!");
  }

  const fetchUserTasks = async () => {
    try {
      const result = await axios.get(
        "https://role-based-dashboard-0vpx.onrender.com/api/user/tasks",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(result.data.tasks);
    } catch (e: any) {
      console.log(e.result.data.message || e);
      alert(e.result.data.message);
    }

    useEffect(() => {
      fetchUserTasks();
    }, []);
  };
  
  return (
    <div>
      <h1 className="text-center text-4xl">Welcome {user?.name}</h1>
      {tasks && tasks.length >0  ? (
        tasks.map((task:Task, index: number) => {
          return (
            <div key={index}>
              <h1 >{task.title}</h1>
              <pre>{task.description}</pre>
              <p>{task.createdBy.name}</p>
            </div>
          );
        })
      ) : (
        <p className="text-2xl">Loading tasks...</p>
      )}
    </div>
  );
}

export default UserDashboard;
