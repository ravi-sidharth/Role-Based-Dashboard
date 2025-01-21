import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

type User = {
    _id:string
    name: string;
    email: string;
    password: string;
    role: string;
  };

  type Task = {
    _id:string
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
    <div className="w-[80%] mx-auto overflow-x-hidden">
      <h1 className="text-center text-4xl pt-2">Welcome {user?.name}</h1>
      <div className="flex flex-wrap gap-5 mt-5">
      {tasks ? (
        tasks.map((task: Task) => {
          return (
            <div className="p-4 w-[290px] flex flex-col bg-gray-400 text-wrap gap-3" key={task._id}>
              <h1 className="text-2xl font-bold leading-6 text-wrap">{task.title}</h1>
              <pre className="text-wrap leading-4">{task.description}</pre>
              <p className="text-wrap text-sm text-gray-800 text-right">Created By {task.createdBy.name}❤️</p>
            </div>
          );
        })
      ) : (
        <p className="text-2xl">Loading tasks...</p>
      )}
    </div>
      </div>
  );
}

export default UserDashboard;
