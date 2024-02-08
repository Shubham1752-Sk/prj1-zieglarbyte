import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch , useSelector } from "react-redux"
import { MdNavigateNext } from "react-icons/md"
import IconBtn from "../../../COMMON/IconBtn"
import { createCategory } from '../../../../SERVICES/operations/CategoryOperations'
import Spinner from '../../../COMMON/Spinner'

export default function AddCategory() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const {token} = useSelector((state)=>state.auth)

  const submit = async () => {

    const currentValues = getValues()

    dispatch(createCategory(setLoading, token, currentValues.categoryName, currentValues.categoryDesc ))

    setValue('categoryName','')
    setValue('categoryDesc','')
  }

  return (
    <>
      <div className="flex-col gap-4 space-y-4 items-center justify-center ">
        <h1 className="text-center text-4xl ">Add Category</h1>
        <form
          onSubmit={handleSubmit(submit)}
          className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
        >
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="categroyName">
              Category Name <sup className="text-pink-200">*</sup>
            </label>
            <input
              id='categoryName'
              placeholder='Enter Category Name'
              {...register("categoryName", { required: true })}
              className="form-style w-full p-2 py-4 text-black"
            />
            {errors.categoryName && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Category Name is required
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="categroyDesc">
              Category Description <sup className="text-pink-200">*</sup>
            </label>
            <textarea
              id="courseShortDesc"
              placeholder="Enter Description"
              {...register("categoryDesc")}
              className="form-style resize-x-none min-h-[130px] w-full border p-2 rounded-md text-black"
            />
            <div className="w-full p-2 flex justify-end">
              <IconBtn
                disabled= {loading}
                text="Create Category"
                // type={'submit'}
              >
                { loading ? <Spinner /> : <MdNavigateNext />}
              </IconBtn>
            </div>
          </div>
        </form>
      </div>

    </>
  )
}

