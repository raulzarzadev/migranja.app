import {
  AnimalType,
  ParentType
} from '@firebase/types.model.ts/AnimalType.model'
import AnimalsTable from 'components/AnimalsTable'
import InputContainer from 'components/inputs/InputContainer'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { ParentForm } from '../ParentForm'

export interface BatchType {
  animals: Partial<AnimalType>[]
  father: ParentType
  earrings: {
    fromNumber: number
    toNumber: number
    from?: string
    to?: string
    suffix?: string
  }
}

const BatchForm = ({
  animal: { type = 'ovine' }
}: {
  animal: Partial<AnimalType>
}) => {
  const [batch, setBatch] = useState<BatchType | null>(null)
  const handleCreateBatch = ({ earrings, father }: BatchType) => {
    const animals: BatchType['animals'] = []
    for (
      let earring = earrings.fromNumber;
      earring <= earrings.toNumber;
      earring++
    ) {
      animals.push({
        type,
        parents: {
          father,
          mother: null
        },
        earring: `${earring}${earrings.suffix ? '-' + earrings.suffix : ''}`
      })
    }
    setBatch({
      earrings,
      father,
      animals
    })
  }
  return (
    <div>
      <DefineBatchForm setBatch={handleCreateBatch} batch={batch} />
      <AnimalsTable animalsData={batch?.animals || []} />
    </div>
  )
}

const DefineBatchForm = ({
  batch,
  setBatch
}: {
  batch?: BatchType | null
  setBatch: (data: BatchType) => void
}) => {
  const methods = useForm({
    defaultValues: batch || {
      earrings: {
        fromNumber: 0,
        toNumber: 0,
        suffix: ''
      }
    }
  })
  const { watch, handleSubmit, setValue } = methods
  const formValues = watch()
  const {
    query: { farmId }
  } = useRouter()
  const { father, earrings } = formValues
  console.log(formValues)
  const [earringsTotal, setEarringsTotal] = useState(0)
  useEffect(() => {
    setEarringsTotal(earrings?.toNumber - earrings?.fromNumber)
    setValue(
      'earrings.from',
      `${earrings?.fromNumber}${earrings.suffix ? '-' + earrings.suffix : ''}`
    )
    setValue(
      'earrings.to',
      `${earrings?.toNumber}${earrings.suffix ? '-' + earrings.suffix : ''}`
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [earrings?.toNumber, earrings?.fromNumber, earrings?.suffix])

  const onSubmit = (data: BatchType) => {
    setBatch(data)
  }
  return (
    <div>
      <header>
        <div>Nuevo lote</div>
      </header>
      <main>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ParentForm
              farmId={farmId as string}
              gender="male"
              setValue={(value) => methods.setValue(`father`, value)}
              value={father}
            />
            {father?.earring}
            <InputContainer
              type="date"
              label="Incorporación"
              name="incorporation"
            />
            <InputContainer
              type="number"
              name="earrings.fromNumber"
              label="from"
            />
            <InputContainer type="number" name="earrings.toNumber" label="to" />
            <InputContainer type="text" name="earrings.suffix" label="sufijo" />
            <div>Total:{earringsTotal}</div>
            <button className="btn btn-accent mx-auto">Crear lote</button>
          </form>
        </FormProvider>
      </main>
    </div>
  )
}

export default BatchForm
