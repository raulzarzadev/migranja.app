import { useMediaQuery, useTheme } from '@mui/material'

const useMaterialMediaQuery = ({ size }: { size: 'sm' | 'md' }) => {
  const theme = useTheme()
  const match = useMediaQuery(theme.breakpoints.up(size))
  return { match }
}

export default useMaterialMediaQuery
