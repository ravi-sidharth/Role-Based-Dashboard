import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

type User = {
  name: string;
  email: string;
  password: string;
  role: string;
};

type Task = {
  title: string;
  description: string;
  createdBy: User;
};

function AdminDashboard() {
  const navigate: any = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token: string | undefined = Cookies.get("token") ?? undefined;
    if (!token) {
      navigate("/");
      return;
    }

    try {
      if (token) {
        setUser(jwtDecode(token));
      }
    } catch (e) {
      console.log(e);
      alert("Token not found!");
      navigate('/ ')
    }
    fetchAllUsersTasks(token);
  }, [navigate]);

  const fetchAllUsersTasks = async (token?: string) => {
    try {
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
    } catch (e: any) {
      console.log(e, "error");
      alert(e.response.data.message);
      navigate("/");
      return;
    }
  };

  return (
    <>
      {user?.role === "admin" ? (
        <div>
          <h1 className="text-center text-4xl">
            Welcome to the Admin dashboard
          </h1>
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
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default AdminDashboard;
