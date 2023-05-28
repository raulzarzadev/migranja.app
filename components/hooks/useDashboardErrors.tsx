import { listenErrors } from '@firebase/Errors/main'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setErrors } from 'store/slices/errorsSlice'

const useDashboardErrors = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    listenErrors((errors) => {
      dispatch(setErrors(errors))
    })
  }, [dispatch])
}

export default useDashboardErrors
