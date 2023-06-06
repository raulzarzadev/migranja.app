import * as React from 'react'
import { emphasize, styled } from '@mui/material/styles'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Chip from '@mui/material/Chip'
import { IconName } from './Icon/icons-list'

interface Crumb {
  label: string
  icon?: IconName
}

export default function CustomizedBreadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  function handleClick(crumb) {
    console.log(crumb)
    console.info('You clicked a breadcrumb.')
  }
  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        {crumbs.map((crumb) => (
          <button key={crumb.label} onClick={() => handleClick(crumb)}>
            <p
            // component="a"
            // href="#"
            //icon={crumb.icon && <Icon size="md" name={crumb.icon} />}
            >
              {crumb.label}
            </p>
          </button>
        ))}
      </Breadcrumbs>
    </div>
  )
}
