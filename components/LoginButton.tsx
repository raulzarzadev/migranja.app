import { googleLogin } from '@firebase/Users/main'

const LoginButton = ({ label = 'Ingresa' }: { label?: string }) => {
  return (
    <button
      className="btn btn-sm text-white"
      onClick={(e) => {
        e.preventDefault()
        googleLogin()
      }}
    >
      {label}
    </button>
  )
}

export default LoginButton
