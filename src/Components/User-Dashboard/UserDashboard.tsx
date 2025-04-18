import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import TaskCreate from "../Task-Create/TaskCreate";
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

function UserDashboard() {
  const navigate: any = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [createTaskPopup, setCreateTaskPopup] = useState(false);
  const [newTaskCreated, setNewTaskCreated] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    navigate("/");
  };

  const fetchUserTasks = async (token: string) => {
    try {
      const result = await axiosInstance.get("/get-task", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(result.data.tasks);
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

  useEffect(() => {
    try {
      const token: string | undefined = Cookies.get("token") ?? undefined;
      if (!token) {
        alert("Please login to continue!");
        navigate("/");
        return;
      }
      setUser(jwtDecode(token));
      fetchUserTasks(token);
    } catch (e: any) {
      alert(e.response.data.message);
      navigate(-1);
      return;
    }
  }, [navigate, newTaskCreated]);

  return (
    <div className="w-[80%] mx-auto pt-10">
      <div>
        {user?.role === "user" ? (
          <div className="">
            <h1 className="text-center text-4xl">
              Welcome to the User dashboard
            </h1>
            <div className="flex justify-between">
              <button
                onClick={() => setCreateTaskPopup((prev) => !prev)}
                className="bg-green-500 hover:bg-green-700 px-4 py-2 rouded-lg "
              >
                Add Task
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rouded-lg "
              >
                Logout
              </button>
            </div>
            <div className="flex flex-wrap gap-5 mt-5">
              {tasks && tasks.length > 0 ? (
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
                        Created By {task.createdBy.email}❤️
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-2xl">
                  {loading ? "loading..." : "Task Not Found!"}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="absolute ml-[30%]">
        {createTaskPopup && (
          <TaskCreate
            setCreateTaskPopup={setCreateTaskPopup}
            setNewTaskCreated={setNewTaskCreated}
          />
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
