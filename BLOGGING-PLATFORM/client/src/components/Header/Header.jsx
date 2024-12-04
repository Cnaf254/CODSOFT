import React from 'react'
import re from '../../assets/react.svg'

export default function Header() {
  return (
    <div class="text-white flex flex-col w-1/5 bg-blue-950 min-h-screen justify-between items-center">
      <div class="pt-3">
        <img src={re} alt="" class="pb-10"/>
        <ul class="pb-6">
          <li class="pb-5">
            <a href="">Home</a>
          </li>
          <li class="pb-5">
            <a href="">Blog</a>
          </li>
          <li class="pb-5">
            <a href=""> About</a>
          </li>
          <li class="pb-5">
            <a href="">Services</a>
          </li>
        </ul>
      </div>
      <div class="pb-4">Logout</div>
    </div>
  )
}
