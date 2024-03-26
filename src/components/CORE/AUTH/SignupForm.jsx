import React, { memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { signup } from '../../../SERVICES/operations/AuthOperations'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ACCOUNT_TYPE } from '../../../UTILS/constants'
import Tab from '../../COMMON/Tab'
import { enqueueSnackbar } from 'notistack'

const SignupForm = memo( function SignupForm({adminPresent}){

    const dispatch = useDispatch()
    const navigate = useNavigate()
    // const {token} = useSelector((state)=>state.auth)

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [accountType, setAccountType] = useState(null)

    const accType = adminPresent ? ACCOUNT_TYPE.INSTRUCTOR : ACCOUNT_TYPE.STUDENT
    console.log("admin",adminPresent)
    console.log("acctype",accType)
    
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm()

    
    const submitForm = ( data) => {
        
        console.log("in the function")
        if(data.password !== data.confirmPassword){
            setError('confirmPassword', {type:'custom', message:'Confirm Password should match your password'})
            return
        }

        if(adminPresent && accountType === 'Student'){
            enqueueSnackbar('Please select account type',{variant:'warning'})
            return
        }

        
        console.log("Signing user")
        setLoading(true)
        console.log(data)
        dispatch(signup({
            accountType: accountType? accountType : accType,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            contactNumber: data.contactNumber
        }))
        setLoading(false)
        if(!adminPresent){
            navigate('/login')
        }
            
        
    }

    const tabData = [
        
        {
          id: 1,
          tabName: "Instructor",
          type: ACCOUNT_TYPE.INSTRUCTOR,
        },
        {
            id: 2,
            tabName: "Admin",
            type: ACCOUNT_TYPE.ADMIN,
        },
      ]

    return (
        <>
            <div className='w-[calc(100vw-8rem)] sm:w-full flex flex-col space-y-2 gap-2 sm:gap-4 '>
            {
                adminPresent && <Tab tabData={tabData} field={accountType} setField={setAccountType} />
            }
                <form onSubmit={handleSubmit(submitForm)} className='w-full'>
                    <div className='w-full flex flex-col space-y-2 sm:gap-4 p-2 text-white'>
                        {/* Name Fields */}
                        <div className=' w-auto sm:flex justify-center space-y-2 sm:space-y-0 gap-2'>
                            <div className='sm:w-1/2 flex flex-col sm:space-y-2 '>
                                <label htmlFor="firstName"
                                    className='sm:text-lg '
                                >First name <span className='text-red-700 font-bold text-base'>*</span></label>
                                <input
                                    id="firstName"
                                    type='text'
                                    disabled={loading}
                                    placeholder='Enter Your First Name'
                                    {...register("firstName", { required:"First Name can't be empty", pattern:{value:/^[a-z ,.'-]+$/i, message:"Inavlid Name eg:-Shubham"} })}
                                    className='sm:text-lg font-medium text-sm sm:placeholder:text-lg sm:px-2 bg-transparent outline-none border-b placeholder:text-[#fff5f5]'
                                />
                                {
                                    errors.firstName && (
                                        <span className="ml-2 text-xs tracking-wide text-red-700">
                                        {errors.firstName.message}
                                        </span>
                                    )
                                }
                            </div>
                            <div className='sm:w-1/2 flex flex-col sm:space-y-2 '>
                                <label htmlFor="lastName"
                                    className='sm:text-lg '
                                >Last name </label>
                                <input
                                    id="lastName"
                                    type='text'
                                    disabled={loading}
                                    placeholder='Enter Your Last Name'
                                    {...register("lastName",{pattern:{value:/^[a-z ,.'-]+$/i, message:"Inavlid Name eg:-Shubham"}} )}
                                    className='sm:text-lg font-medium text-sm sm:placeholder:text-lg sm:px-2 bg-transparent border-b outline-none placeholder:text-[#fff5f5]'
                                />
                                {
                                    errors.lastName && (
                                        <span className="ml-2 text-xs tracking-wide text-red-700">
                                            {errors.lastName.message}
                                        </span>
                                    )
                                }
                            </div>
                        </div>
                        {/* Email & mob no Fields Fields */}
                        <div className='w-auto sm:flex justify-center space-y-2 sm:space-y-0 gap-2'>
                            <div className='sm:w-1/2 flex flex-col sm:space-y-2 '>
                                <label htmlFor="email"
                                    className='sm:text-lg '
                                >E-mail <span className='text-red-700 font-bold text-base'>*</span></label>
                                <input
                                    id="email"
                                    type='text'
                                    disabled={loading}
                                    placeholder='Enter Your E-mail'
                                    {...register("email", { required:{value:true, message:"E-mail can't be empty"}, pattern:{value:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, message: "Wrong E-mail eg:-shub@gmail.com"} })}
                                    className='sm:text-lg font-medium text-sm sm:placeholder:text-lg sm:px-2 bg-transparent border-b outline-none placeholder:text-[#fff5f5]'
                                />
                                {
                                    errors.email && (
                                        <span className="ml-2 text-xs tracking-wide text-red-700">
                                        {errors.email.message}
                                        </span>
                                    )
                                }
                            </div>
                            <div className='sm:w-1/2 flex flex-col sm:space-y-2 '>
                                <label htmlFor="contactNumber"
                                    className='sm:text-lg '
                                >Contact Number <span className='text-red-700 font-bold text-base'>*</span></label>
                                <input
                                    id="contactNumber"
                                    type='text'
                                    disabled={loading}
                                    placeholder='Enter Your Contact number'
                                    {...register("contactNumber", { required:{value:true, message:"Contact Number can't be empty"}, maxLength:{value:10, message:"Contact Number must be of 10 digits"} , minLength:{value:10, message:"Contact Number must be of 10 digits"} })}
                                    className='sm:text-lg font-medium placeholder:text-[12px] sm:placeholder:text-lg sm:px-2 bg-transparent border-b outline-none placeholder:text-[#fff5f5]'
                                />
                                {
                                    errors.contactNumber && (
                                        <span className="ml-2 text-xs tracking-wide text-red-700">
                                        {errors.contactNumber.message}
                                        </span>
                                    )
                                }
                            </div>
                        </div>
                        {/* Password Fields */}
                        <div className='w-auto sm:flex space-y-2 sm:space-y-0 gap-2 '>
                            <div className='w-full sm:w-1/2 flex flex-col sm:space-y-2 '>
                                <label htmlFor="firstName"
                                    className='sm:text-lg '
                                >Password <span className='text-red-700 font-bold text-base'>*</span></label>
                                <div className='flex justify-between border-b'>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        disabled={loading}
                                        placeholder='Enter Your Password'
                                        {...register("password", { required:{value:true, message:"Password can't be empty"}, maxLength:{value:12, message:"Password can't be greater than 12 characters"} , minLength:{value:6, message:"Password must be minimun of 6 characters"} })}
                                        className='sm:text-lg text-sm font-medium sm:placeholder:text-lg sm:px-2 bg-transparent outline-none placeholder:text-[#fff5f5]'
                                    />
                                    <span
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="bottom-1 p-0.5 cursor-pointer hover:bg-white text-black duration-[.35s]"
                                    >
                                        {showPassword ? (
                                            <AiOutlineEyeInvisible fontSize={32} fill="#ffffff" />
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
                            <div className='sm:w-1/2 flex flex-col sm:space-y-2 '>
                                <label htmlFor="confirmPassword"
                                    className='sm:text-lg '
                                >Confirm Password <span className='text-red-700 font-bold text-base'>*</span></label>
                                <div className=' flex justify-between border-b'>
                                    <input
                                        id="confirmPassword"
                                        disabled={loading}
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder='Confirm Your Password '
                                        {...register("confirmPassword", { required:{value:true, message:"Confirm Password can't be empty"}, maxLength:{value:12, message:"Confirm Password can't be greater than 12 characters"} , minLength:{value:6, message:"Confirm Password must be minimun of 6 characters"} })}
                                        className='w-auto sm:text-lg font-medium text-sm sm:placeholder:text-lg sm:px-2 bg-transparent outline-none placeholder:text-[#fff5f5]'
                                    />
                                    <span
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="  bottom-1 p-0.5 cursor-pointer hover:bg-white text-black duration-[.35s]"
                                    >
                                        {showConfirmPassword ? (
                                            <AiOutlineEyeInvisible fontSize={32} fill="#ffffff" />
                                        ) : (
                                            <AiOutlineEye fontSize={32} fill="#ffffff" />
                                        )}
                                    </span>
                                </div>
                                {
                                    errors.confirmPassword && (
                                        <span className="ml-2 text-xs tracking-wide text-red-700">
                                        {errors.confirmPassword.message}
                                        </span>
                                    )
                                }
                            </div>
                        </div>
                        {/* signup button */}
                        <div className='w-fit h-10 mx-auto mt-4'>
                            <button type="submit" className='w-fit p-4 font-medium text-xl text-white bg-[#e66a57] rounded-lg'>
                                Create Account
                            </button>
                        </div>
                    </div>
                </form>

                <div className='text-white sm:text-lg w-full h-fit p-2 flex justify-center gap-4'><span>Already a user?</span> <span className='hover:underline hover:text-[#4a4a4c] hover:cursor-pointer' onClick={()=>navigate('/login')}>Login</span></div>
            </div>
        </>
    )
})

export default SignupForm