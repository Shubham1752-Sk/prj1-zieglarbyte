import React from 'react'
import { FORM_TYPE } from '../../../UTILS/constants'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

const Template = ({ form_type, title }) => {
  
  return (
    <div className='w-screen h-screen'>
      <div className='w-full h-full bg-auth-bg bg-cover bg-fixed bg-center bg-no-repeat flex justify-center items-center '>
        <div className='w-fit h-fit flex flex-col gap-4 bg-white bg-opacity-5 p-8 rounded-xl backdrop-blur-sm shadow-lg drop-shadow-xl shadow-black'>
          <div>
            <h1 className="text-center text-xl sm:text-4xl text-[#f4f4f7] font-bold font-serif">{title}
            </h1>
          </div>
          <div className='w-full h-full flex justify-center '>
            {
              form_type === FORM_TYPE.LOGIN ? <LoginForm /> : <SignupForm />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Template