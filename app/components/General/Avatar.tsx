import { RxAvatar } from "react-icons/rx";
interface AvatarProps {
    img?: string,

}
const Avatar: React.FC<AvatarProps> = ({ img }) => {
    if (img) return <img src={img} alt=""></img>
    return <div><RxAvatar size={50} /></div>

}

export default Avatar