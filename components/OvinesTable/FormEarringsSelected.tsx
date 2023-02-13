import InputContainer, { SelectOption } from '@comps/inputs/InputContainer'
import { FormProvider, useForm } from 'react-hook-form'
import { AnimalStatusLabels } from 'types/base/AnimalStatus.model'
export interface AnimalStatuses {}
const FormEarringsSelected = ({ earringsIds }: { earringsIds: string[] }) => {
  const methods = useForm()

  const statuses: SelectOption[] = []
  return (
    <div>
      <FormProvider {...methods}>
        <form>
          <InputContainer
            name="status"
            type="select"
            selectOptions={statuses}
          />
        </form>
      </FormProvider>
    </div>
  )
}

export default FormEarringsSelected
