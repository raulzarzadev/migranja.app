import BatchTable from 'components/BatchTable'
import BatchForm, { BatchType } from 'components/forms/BatchForm'
import { useState } from 'react'

const AddBatch = () => {
  const [batch, setBatch] = useState<BatchType | null>(null)
  return (
    <div className="flex w-full flex-col lg:flex-row justify-center">
      <div className=" bg-base-300 shadow-md rounded-md m-2 lg:w-1/2 h-min">
        <BatchForm
          animal={{
            type: 'ovine'
          }}
          setBatch={setBatch}
        />
      </div>
      {batch?.animals && (
        <div className=" bg-base-300 shadow-md rounded-md m-2 lg:w-1/2">
          <BatchTable
            animals={batch?.animals}
            setAnimals={(animals) => setBatch({ ...batch, animals })}
          />
        </div>
      )}
    </div>
  )
}

export default AddBatch
