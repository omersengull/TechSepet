import React from 'react'
import { IconType } from 'react-icons'

interface ChoiceInputProps {

  onClick: (value: string) => void,
  text: string,
  icon: IconType,
  selected?: boolean
}
const ChoiceInput: React.FC<ChoiceInputProps> = ({ onClick, text, icon: Icon, selected }) => {

  return (
    <div onClick={() => onClick(text)} className={`cursor-pointer px-4 py-2 flex rounded-md items-center gap-2 justify-center h-16 border ${selected ? "border-black" : "border-gray-200"}`}>
      <Icon />
      <span className='text-slate-600 text-lg'>{text}</span>
    </div>
  )
}

export default ChoiceInput