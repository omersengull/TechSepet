import React from 'react';
import { IconType } from 'react-icons';

type ButtonProps = {
  text?: string; // artık opsiyonel, children kullanılabilir
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  small?: boolean;
  outline?: boolean;
  icon?: IconType;
  width?: number;
  bold?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  text,
  disabled,
  onClick,
  outline,
  small,
  icon: Icon,
  width,
  bold,
  children,
}) => {
  return (
    <div>
      <button
        disabled={disabled}
        onClick={onClick}
        style={{ width: width ? `${width}px` : undefined }}
        className={`flex mt-1 ${bold ? 'font-bold' : ''} items-center justify-center flex-row rounded-lg p-3 ${small ? "w-[250px]" : "w-full"} ${outline ? "border text-black" : "bg-renk1 text-white"}`}
      >
        {Icon && <Icon />}
        {children ? children : <span className='ml-2'>{text}</span>}
      </button>
    </div>
  );
}

export default Button;
