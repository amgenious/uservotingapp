'use client'
import React from 'react'
import Player from 'lottie-react'
import animationData from '../../public/vote_anim.json'

const Voteanimation: React.FC = () =>{
  return (
    <Player
          autoplay
          loop
          src='../../public/vote_anim.json'
          style={{ height: '500px', width: '500px',}}
          animationData={animationData}  />
  )
}

export default Voteanimation