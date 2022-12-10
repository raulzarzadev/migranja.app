import ICON_LIST, { IconName } from './icons-list'

const SIZE = 25

const sizing: Record<Sizes, string> = {
  '2xs': `${SIZE * 0.45}px`,
  xs: `${SIZE * 0.65}px`,
  sm: `${SIZE * 0.92}px`,
  md: `${SIZE * 1}px`,
  lg: `${SIZE * 1.2}px`,
  xl: `${SIZE * 1.6}px`,
  '2xl': `${SIZE * 2.9}px`
}

type Sizes = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface IconComponent {
  name: IconName
  size?: Sizes
}

export default function Icon({
  name = 'settings',
  size = 'md',
  ...rest
}: IconComponent) {
  const Icon = ICON_LIST[name]
  return <Icon size={sizing[size]} {...rest} />
}
