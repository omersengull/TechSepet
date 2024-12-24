import React from 'react'
import Avatar from './Avatar'
import Heading from './Heading'
import { Rating } from '@mui/material'
const Comment = ({ prd }: { prd: any }) => {
  return (
    <div className='border md:w-1/2 p-2 rounded-lg'>

      <div className='flex items-center gap-1'>
        <Avatar img={prd?.user?.image} />
        <div className='ml-1'>
          {prd?.user?.name}
        </div>
        <div className='flex'>
          <Rating name='read-only' value={prd?.rating} readOnly />
        </div>
      </div>

      <div >
        {prd?.comment}
      </div>
    </div>
  )
}

export default Comment