import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { login } from '../../../SERVICES/operations/AuthOperations'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { enqueueSnackbar } from 'notistack'

const LoginForm = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {token} = useSelector((state)=>state.auth)

  useEffect(()=>{
    document.title = "Login"
    if(token){
      enqueueSnackbar("You are Already Logged In!!",{variant:'error'})
      navigate('/dashboard/my-profile')
    }
  },[])
  const {
    register,
    handleSubmit,
    formState: errors
  } = useForm()

  const submitForm = (data) =>{
    setLoading(true)
    dispatch(login(
      data.email,
      data.password,
      navigate
    ))
    setLoading(false)
  }
  return (
    <>
      <div className='w-[calc(100vw-8rem)] sm:w-fit h-fit flex-col  text-white'>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className=' flex flex-col space-y-6 justify-center items-center sm:gap-2'>
            <div className='w-full flex flex-col space-y-2 '>
              <label htmlFor="email"
                className=' sm:text-lg '
              >E-mail <span className='text-red-700 font-bold text-base'>*</span></label>
              <input
                id="email"
                type='text'
                disabled={loading}
                placeholder='Enter Your E-mail'
                {...register("email", { required: { value: true, message: "E-mail can't be empty" }, pattern: { value: /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, message: "Wrong E-mail eg:-shub@gmail.com" } })}
                className='text-sm sm:text-lg font-medium sm:placeholder:text-lg  bg-transparent border-b outline-none placeholder:text-[#fff5f5]'
              />
              {
                errors.email && (
                  
                  <span className="ml-2 text-xs tracking-wide text-red-700">
                    {errors.email.message}
                    {
                      alert(errors.email.message)
                    }
                  </span>
                )
              }
            </div>
            <div className='w-full flex flex-col space-y-2 '>
              <label htmlFor="firstName"
                className='sm:text-lg '
              >Password <span className='text-red-700 font-bold text-base'>*</span></label>
              <div className='relative flex justify-between border-b'>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={loading}
                  placeholder='Enter Your Password'
                  {...register("password", { required: { value: true, message: "Password can't be empty" }, maxLength: { value: 12, message: "Password can't be greater than 12 characters" }, minLength: { value: 6, message: "Password must be minimun of 6 characters" } })}
                  className='text-sm sm:text-lg font-medium sm:placeholder:text-lg bg-transparent outline-none placeholder:text-[#fff5f5]'
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className=" right-3 bottom-1 cursor-pointer hover:bg-white text-black duration-[.35s]"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible fontSize={32} fill="#ffffff"  />
                  ) : (
                    <AiOutlineEye fontSize={32} fill="#ffffff" />
                  )}
                </span>
              </div>
              {
                errors.password && (
                  <span className="ml-2 text-xs tracking-wide text-red-700">
                    {errors.password.message}
                  </span>
                )
              }
            </div>
          </div>
          <div className='w-fit mx-auto mt-6'>
            <button type="submit" className='w-fit p-4 px-6 font-semibold text-xl text-white bg-[#e66a57] rounded-lg'>
              Login
            </button>
          </div>
        </form>
        <div className='w-full h-fit p-2 text-base sm:text-lg flex gap-2 justify-center'>
          <span>New User?</span><span className="hover:underline hover:cursor-pointer hover:text-[#4a4a4c]" onClick={()=>navigate('/signup')}>Signup now</span> 
        </div>
      </div>
    </>
  )
}

export default LoginForm