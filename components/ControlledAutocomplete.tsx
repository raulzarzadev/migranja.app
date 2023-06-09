import { Autocomplete, AutocompleteProps } from '@mui/material'
import { Controller } from 'react-hook-form'

const ControlledAutocomplete = ({
  options = [],
  renderInput,
  getOptionLabel,
  control,
  defaultValue,
  name,
  renderOption
}) => {
  return (
    <Controller
      render={({ field: { onChange }, ...props }) => (
        <Autocomplete
          options={options}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          renderInput={renderInput}
          onChange={(e, data) => onChange(data)}
          {...props}
        />
      )}
      defaultValue={defaultValue}
      name={name}
      control={control}
    />
  )
}
