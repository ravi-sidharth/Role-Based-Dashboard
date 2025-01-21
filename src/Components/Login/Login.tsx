import axios from "axios";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie'


function Login() {
    type Inputs = {
        email:string,
        password:string
    }
    const navigate = useNavigate()
    const {register,handleSubmit}=useForm<Inputs>()

    const handleLoginFormData = async (data:Inputs) => {
        try {
            const {email ,password } = data
            const result = await axios.post('https://role-based-dashboard-0vpx.onrender.com/api/user/login',{email,password})
            Cookies.set("token",result.data.token)
    
            if (result.data.success) {
                const decodedToken:any = jwtDecode(result?.data?.token)
                if (decodedToken.role ==="admin") {
                    alert(result?.data?.message)
                    navigate('/admin/dashboard')
                } else {
                    alert(result?.data?.message)
                    navigate('/user/dashboard')
                }
            } else {
                alert(result.data.message)
            }
            
        } catch(e:any) {
            console.log("Error while login",e)
            alert(e.response?.data?.message)
        }
    }
  return (
    <div className="flex flex-col items-center">
        <form onSubmit={handleSubmit(data=>handleLoginFormData(data))} className="bg-white mt-28 p-8 flex flex-col shadow-2xl gap-4 font-bold rounded-lg" action="/api/user/login" method="post">
            <div className="text-center text-4xl">Login</div>
            <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <input {...register("email")} className="border-2 rounded-md" type="email" id="email" required/>
            </div>
            <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <input {...register("password")} className="border-2 rounded-md" type="password" id="password" required/>
            </div>
            <div className="flex flex-col ">
                <button className="px-1 py-1 bg-green-400 text-white rounded-md" type="submit">Submit</button>
            </div>
        </form>
        <div className="text-white">Not have an account? <NavLink className="underline text-green-400" to="/signup" >Sign Up Here</NavLink></div>
    </div>
  );
}

export default Login;
