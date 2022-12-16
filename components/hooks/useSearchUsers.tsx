import { findUserByEmail } from '@firebase/Users/main'
import { UserType } from '@firebase/Users/user.model'

const useSearchUsers = () => {
  const searchUser = ({ email }: { email: UserType['email'] }) => {
    return findUserByEmail({ email })
  }
  return { searchUser }
}

export default useSearchUsers
