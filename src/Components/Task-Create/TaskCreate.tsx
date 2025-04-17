import axios from "axios";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import axiosInstance from "../../Utils/axiosInstance";

type Task = {
  title: string;
  description: string;
};

type Props = {
  setCreateTaskPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setNewTaskCreated: React.Dispatch<React.SetStateAction<boolean>>;
};

const TaskCreate = ({setCreateTaskPopup,setNewTaskCreated }:Props) => {
  const { register, handleSubmit } = useForm<Task>();
  const token = Cookies.get("token");

  const handleTaskAddingData = async (data: Task) => {
    try {
      const { title, description } = data;
      const result = await axiosInstance.post(
        "/create-task",
        { title, description },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(result?.data?.message);
      setNewTaskCreated(prev=>!prev)
      setCreateTaskPopup(prev=>!prev)
    } catch (e: any) {
      console.log("Error occured while creating new task");
      alert(e.response?.data?.message);
    }
  };
  return (
    <form
      className="w-[350px] bg-white flex flex-col gap-5 p-5 rounded-lg font-bold"
      onSubmit={handleSubmit((data) => handleTaskAddingData(data))}
    >
      <button onClick={()=>setCreateTaskPopup(false)} className="text-4xl font-bold text-red-600 hover:text-red-800 shadow bg-gray-300">
        Close &times;
      </button>
      <div className="flex justify-between  ">
        <label htmlFor="title">Title</label>
        <input
          className="border-2 border-black"
          {...register("title")}
          id="title"
          name="title"
          type="text"
          required
        />
      </div>
      
      <div className="flex justify-between  items-center">
        <label htmlFor="description">Description</label>
        <textarea
          className="border-2 border-black"
          {...register("description")}
          id="description"
          name="description"
          required
        />
      </div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        type="submit"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskCreate;
