import React from "react";
import SignupForm from "../../AUTH/SignupForm";
import { useSelector } from "react-redux";

export default function AddUser() {
    const { user } = useSelector((state) => state.auth)
    return (
        <>
            <div className="flex-col gap-4 space-y-4 items-center justify-center ">
                <h1 className="text-center text-4xl ">Add Category</h1>
                <div className="border border-black rounded-md p-10 w-full h-auto mx-auto">
                    <SignupForm adminPresent={user.accountType} />
                </div>
            </div>
        </>
    )
}