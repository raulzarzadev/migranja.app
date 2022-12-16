import useFarm from 'components/hooks/useFarm'

const FarmTeamList = () => {
  const { farm } = useFarm()
  return (
    <div>
      {farm?.team.map(({ name, email }, i) => (
        <div className="flex my-2 w-full " key={i}>
          <div className="w-1/3">{name}</div>
          <div>{email}</div>
        </div>
      ))}
    </div>
  )
}

export default FarmTeamList
