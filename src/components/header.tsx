import React from 'react'

import confetti from "../../public/confetti.png"
import Image from "next/image";
import Avtar from "../../public/avtar2.png";

const header = () => {
  return (
    <div className="w-full">
        <div className="flex gap-5 items-center">
        <Image 
          src={Avtar} 
          alt="avtar" 
          width={60}
          className="rounded-4"
        />
        <div>
          
          <p className="text-muted-foreground text-[14px]">
            Welcome Back
          </p>
          <h2 className="text-3xl text-gray-600 tracking-normal font-bold">Mihir Gupta</h2>
        </div>
        <Image src={confetti} alt="confetti" width={60}/>
      </div>
    </div>
    
  )
}

export default header