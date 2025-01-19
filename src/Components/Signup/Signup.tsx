import axios from "axios";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";

function Signup() {
    type Inputs ={
        name:string,
        email:string,
        password:string
    }

    const {register,handleSubmit} = useForm<Inputs>()
    const navigate = useNavigate()

    const handleSignupFormData = (data:Inputs) => {
        console.log(data,"User sign in data")
            axios.post('https://role-based-dashboard-0vpx.onrender.com/api/user/signup',data)
            .then(result=>console.log(result,"Sign Up data"))
            .catch(err=> console.log(err))
        navigate('/')
    }   

  return (
    <div className="flex flex-col items-center">
        <form onSubmit={handleSubmit((data)=>handleSignupFormData(data))} className="mt-28 p-8 flex flex-col shadow-2xl gap-4 font-bold bg-white rounded-lg " action="/api/user/signup" method="post">
            <div className="text-center text-4xl">Sign Up</div>
            <div className="flex flex-col">
                <label htmlFor="name">Full Name</label>
                <input {...register("name")} className="border-2 rounded-md" type="text" id="name" required />
            </div>
            <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input {...register("email")} className="border-2 rounded-md" type="email" id="email" required />
            </div>
            <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <input {...register("password")} className="border-2 rounded-md" type="password" id="password" required />
            </div>
            <div className="flex flex-col ">
                <button className="p-1 bg-green-400 text-white rounded-md" type="submit">Submit</button>
            </div>
        </form>
        <div className="text-white">Already have an account? <NavLink className="underline text-green-400" to="/" >Login Here</NavLink></div>
    </div>
  )
}

export default Signup;
