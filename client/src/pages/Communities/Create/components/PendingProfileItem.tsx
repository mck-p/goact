import React, { useCallback, useState } from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { IconButton, TextField } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import * as Icons from '@mui/icons-material'
import CheckIcon from '@mui/icons-material/Check'
import {
  CommunityProfileSchemaItem,
  PROFILE_ITEM_TYPE,
} from '../../../../state/domains/communities'
import { ItemButtons, ItemInput, ItemWrap } from './styled'

interface Props extends CommunityProfileSchemaItem {
  removeItem: () => void
  upgradeItem: (item: any) => void
}

const PendingProfileItem = ({ removeItem, upgradeItem, ...item }: Props) => {
  const [currentItemState, setCurrentItemState] =
    useState<CommunityProfileSchemaItem>(item)

  const handleTypeChange = (event: SelectChangeEvent) => {
    setCurrentItemState((schema) => ({
      ...schema,
      type: event.target.value as PROFILE_ITEM_TYPE,
    }))
  }

  const handleIconChange = (event: SelectChangeEvent) => {
    setCurrentItemState((schema) => ({
      ...schema,
      icon: event.target.value,
    }))
  }

  const handleNameChange = (event: any) => {
    setCurrentItemState((schema) => ({
      ...schema,
      name: event.target.value,
    }))
  }

  const handleLabelChange = (event: any) => {
    setCurrentItemState((schema) => ({
      ...schema,
      label: event.target.value,
    }))
  }

  const allowedIcons: (keyof typeof Icons)[] = [
    'TextFields',
    'CalendarToday',
    'Home',
    'LocalPhone',
    'AlternateEmail',
  ]

  const updateState = useCallback(() => {
    upgradeItem(currentItemState)
  }, [currentItemState])

  return (
    <ItemWrap>
      <ItemInput>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1.25rem',
            flexGrow: '1',
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              value={currentItemState.type}
              onChange={handleTypeChange}
              displayEmpty
              id="type-select"
              labelId="type-select-label"
            >
              {Object.values(PROFILE_ITEM_TYPE).map((type) => (
                <MenuItem value={type} key={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="type-select-label">Icon</InputLabel>

            <Select
              value={currentItemState.icon}
              onChange={handleIconChange}
              displayEmpty
              id="icon-select"
              labelId="icon-select-label"
            >
              {allowedIcons.map((icon: keyof typeof Icons) => {
                const Icon = Icons[icon]

                return (
                  <MenuItem value={icon} key={icon}>
                    <Icon />
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </div>
        <div
          style={{
            display: 'flex',
            padding: '1.25rem',
            flexGrow: '1',
            flexDirection: 'column',
          }}
        >
          <TextField
            name="name"
            label="Name"
            helperText="Some unique to your profile value, usually lowercased and with hyphens"
            required
            value={currentItemState.name}
            onChange={handleNameChange}
          />
          <TextField
            name="label"
            label="Label"
            required
            helperText="The human readable label you want to display when asking for or showing this information"
            value={currentItemState.label}
            onChange={handleLabelChange}
          />
        </div>
      </ItemInput>
      <ItemButtons>
        <IconButton
          onClick={() => {
            updateState()
            removeItem()
          }}
        >
          <CheckIcon />
        </IconButton>
        <IconButton onClick={removeItem}>
          <DeleteForeverIcon />
        </IconButton>
      </ItemButtons>
    </ItemWrap>
  )
}

export default PendingProfileItem
