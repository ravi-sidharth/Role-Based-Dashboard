import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

function AdminDashboard() {
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

  let user :User|null = null
  try {
    if(token) {
      user=jwtDecode(token);
    }
  } catch (e) {
    alert("Token not found!");
  }

  const fetchAllUsersTasks = async () => {
    try { 
      if (user?.role==="admin") {
          const result = await axios.get(
            "https://role-based-dashboard-0vpx.onrender.com/api/admin/tasks",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setTasks(result.data.tasks);
          console.log("result", result);
          alert(result.data.message);
        }
      else {
        throw new Error("You are not authorized Person")
      }
    } catch (e: any) {
      console.log(e);
      alert("Access denied, You are not authorized Person");
    }
  };

  useEffect(() => {
    fetchAllUsersTasks();
  }, []);

  return (
    <div>
      {user?.role === "admin" ? (
        <>
          <h1 className="text-center text-4xl">Welcome to the Admin dashboard</h1>
          {tasks ? (
            tasks.map((task: Task, index: number) => (
              <div key={index}>
                <h1>{task.title}</h1>
                <pre>{task.description}</pre>
                <p>{task.createdBy.name}</p>
              </div>
            ))
          ) : (
            <p>Loading tasks...</p>
          )}
        </>
      ) : (
        <div className="text-3xl">You are not Authorized Person...</div>
      )}
    </div>
  );
  
}

export default AdminDashboard;
