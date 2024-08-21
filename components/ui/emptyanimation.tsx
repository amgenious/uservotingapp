'use client'
import React from 'react'
import Player from 'lottie-react'
import animationData from '../../public/empty_anim.json'

const Emptyanimation = () => {
  return (
    <Player
          autoplay
          loop
          src='../../public/vote_anim.json'
          style={{ height: '300px', width: '300px',}}
          animationData={animationData}  />
  )
}

export default Emptyanimation