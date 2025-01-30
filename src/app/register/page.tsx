import React from 'react';
import GoogleSignInButton from '@/components/competition/googleSignInButton'

function Register() {
  return (
    <div className="wrapper">
      <div className="container absolute z-20 h-[60vh] w-[70%] rounded-[10vh] bg-[#ffffff1a] backdrop-blur-[30px] top-[23%] left-[17%] p-[3%]">
        <div className='text-4xl font-bold font-sans text-white pt-4'>Log in to your Account</div>
        <div className='text-xl font-sans text-white mb-8 pt-4'>Welcome Back! Select a method to log in:

</div>
        <GoogleSignInButton/>
      </div>
    </div>
  );
}

export default Register;