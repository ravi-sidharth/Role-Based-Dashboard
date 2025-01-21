import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

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
function UserDashboard() {

  const navigate:any = useNavigate()
  // const token:string | undefined = Cookies.get("token") ?? undefined
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user,setUser] = useState<User |null >(null)

  useEffect(() => {
    const token:string | undefined = Cookies.get("token") ?? undefined
    fetchUserTasks(token);
    if(!token) {
      navigate('/')
      return
    }

    try {
      if (token) {
        setUser(jwtDecode(token));
      }
  
    } catch (e) {
      console.log(e);
      alert("Token not found!");
      navigate('/')
      return

    }
  }, [navigate]);

  

  const fetchUserTasks = async (token?:string) => {
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
      alert(result.data.message);
    } catch (e: any) {
      console.log(e);
      alert(e.result?.data?.message || e.response.data.message);
      navigate('/')
      return
    }
  };

  return (
    <div>
      <h1 className="text-center text-4xl">Welcome {user?.name}</h1>
      {tasks && tasks.length > 0 ? (
        tasks.map((task: Task, index: number) => {
          return (
            <div key={index}>
              <h1>{task.title}</h1>
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
