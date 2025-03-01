"use client";
import { useState } from 'react';

const LogoutConfirmation = ({ title, message, handleConfirm, handleCancel }) => {

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[#1b1b1b] bg-opacity-50 z-50 text-white">
            <div className="bg-black lg:p-10 p-5 rounded-lg shadow-md text-center md:w-fit w-[70vw]">
                <h1 className='text-3xl font-medium'>{title}</h1>
                <p className="text-sm font-light mt-2">{message}</p>
                <div className="mt-4 flex justify-center">
                    <button onClick={handleCancel} className="bg-[#3a3a3a] hover:bg-gray-900 px-4 py-2 rounded-md mr-2">Cancel</button>
                    <button onClick={handleConfirm} className="bg-white text-black hover:bg-slate-300 px-4 py-2 rounded-md">Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmation;
