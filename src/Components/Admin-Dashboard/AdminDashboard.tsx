import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../Utils/axiosInstance";

type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
};

type Task = {
  _id: string;
  title: string;
  description: string;
  createdBy: User;
};

function AdminDashboard() {
  const navigate: any = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading,setLoading] = useState(true)

  const fetchAllUsersTasks = async (token: string) => {
    try {
      const result = await axiosInstance.get(
        "/admin/tasks",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(result.data.tasks);
      console.log(result.data.tasks)
      if (result.data.tasks.length > 0) {
        alert(result.data.message);
      } else {
        alert('Task Not Found!!')
      }
  
    } catch (e: any) {
      alert(e.response.data.message);
      navigate(-1);
      return;
    } finally {
      setLoading(false)
    }
  };

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    navigate("/");
  };

  useEffect(() => {
    try {
      const token: string | undefined = Cookies.get("token") ?? undefined;
      if (!token) {
        alert("Please login to continue!");
        navigate("/");
        return;
      }
      setUser(jwtDecode(token));
      fetchAllUsersTasks(token);
    } catch (e) {
      console.log(e);
      alert("Token is invalid!");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="w-[80%] mx-auto pt-10">
      {user?.role === "admin" ? (
        <div>
          <h1 className="text-center text-4xl">
            Welcome to the Admin dashboard
          </h1>
          <div className="text-end"><button onClick={handleLogout} className="bg-red-600 px-4 py-2 rouded-lg">Logout</button></div>
          <div className="flex flex-wrap gap-5 mt-5">
            {tasks  && tasks.length >0 ? (
              tasks.map((task: Task) => {
                return (
                  <div
                    className="p-4 w-[290px] flex flex-col bg-gray-400 text-wrap gap-3"
                    key={task._id}
                  >
                    <h1 className="text-2xl font-bold leading-6 text-wrap">
                      {task.title}
                    </h1>
                    <pre className="text-wrap leading-4">
                      {task.description}
                    </pre>
                    <p className="text-wrap text-sm text-gray-800 text-right">
                      Created By {task.createdBy?.email}❤️
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-2xl">{loading ? "Loading..." :"Task Not Found!"}</p>
            )}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default AdminDashboard;
