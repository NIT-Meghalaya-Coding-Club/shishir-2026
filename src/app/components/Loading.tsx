import React from 'react'

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 bg-background w-screen h-screen z-50 flex items-center justify-center">
        <span className="loader"></span>
    </div>
  )
}

export default Loading