interface SquareOption {
  title: string
}
const SquareOption = ({
  option,
  selected
}: {
  option: SquareOption
  selected: boolean
}) => {
  return (
    <div
      className={`${
        selected ? ' border-base-content ' : 'border-transparent'
      } border-4  hover:border-base-content rounded-xl`}
    >
      <div className=" flex w-32 h-32 rounded-lg bg-base-300 justify-center items-center shadow-md cursor-pointer">
        <span>{option.title}</span>
      </div>
    </div>
  )
}

export default SquareOption
