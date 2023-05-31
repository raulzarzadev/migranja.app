import { ReactNode } from 'react'

const H2 = ({ children }: { children: ReactNode }) => {
  return <h2 className="text-lg font-bold my-2">{children}</h2>
}

export default H2
