import { ReactNode } from 'react'

const Box = ({ children, ...rest }: { children: ReactNode }) => {
  return (
    <div
      className="bg-base-200 rounded-md shadow-md p-2 w-full h-full"
      {...rest}
    >
      {children}
    </div>
  )
}

export default Box
