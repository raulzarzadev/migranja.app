import Icon from '@comps/Icon'

const HeaderTable = ({
  handleSortBy,
  label,
  fieldName,
  fieldSelected,
  reverse
}: {
  handleSortBy: (fieldName: string) => void
  label: string
  fieldName: string
  fieldSelected: string
  reverse: boolean
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        handleSortBy(fieldName)
      }}
      className={`btn btn-sm btn-ghost mx-auto ${
        fieldName === fieldSelected && 'underline'
      } `}
    >
      <span className="mr-1">{label}</span>
      {fieldName === fieldSelected &&
        (reverse === false ? (
          <Icon name="down" size="xs" />
        ) : (
          <Icon name="up" size="xs" />
        ))}
    </button>
  )
}
export default HeaderTable
