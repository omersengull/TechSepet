import React from 'react'
interface HeadingProps {
    center?: boolean;
    text: string;
}
const Heading: React.FC<HeadingProps> = ({ center, text }) => {
    return (
        <div className={`${center ? 'text-center' : 'text-start'} text-3xl font-bold my-3 mx-10 md:my-5 `}>{text}</div>
    )
}

export default Heading