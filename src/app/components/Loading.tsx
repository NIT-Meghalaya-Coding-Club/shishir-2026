import React from 'react'

const Loading = () => {
  return (
    <div className="bg-black/55 backdrop-blur-sm fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center">
        <span className="loader"></span>
    </div>
  )
}

export default Loading