import React, { useState } from 'react'
import * as MaterialIcons from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { IconButton, TextField, Typography } from '@mui/material'

import {
  CommunityMemberProfile,
  PROFILE_ITEM_TYPE,
} from '../../../../state/domains/communities'

import {
  EditableProfileItemForm,
  EditableProfileItemDisplay,
  EditableProfileItemButtons,
  EditableProfileItemHeader,
  EditableProfileLabel,
  EditableProfileItemData,
} from './styled'

interface Props<T = any> {
  type: PROFILE_ITEM_TYPE
  name: string
  label: string
  required?: boolean
  defaultValue: T
  updateMemberProfile: (newData: Partial<CommunityMemberProfile>) => void
  memberCanEdit: boolean
  icon: keyof typeof MaterialIcons
}

const ActionItems = ({ setCanEdit }: { setCanEdit: (b: boolean) => void }) => (
  <EditableProfileItemButtons>
    <IconButton type="submit" sx={{ marginLeft: '1rem' }} title="Submit">
      <MaterialIcons.Save />
    </IconButton>
    <IconButton
      onClick={() => setCanEdit(false)}
      sx={{ marginLeft: '1rem' }}
      title="Cancel"
    >
      <MaterialIcons.Cancel />
    </IconButton>
  </EditableProfileItemButtons>
)

const EditableTextItem = ({
  name,
  label,
  required,
  defaultValue,
  icon,
  updateMemberProfile,
  memberCanEdit,
}: Props<string>) => {
  const [canEdit, setCanEdit] = useState<boolean>(false)

  if (canEdit) {
    return (
      <EditableProfileItemForm
        onSubmit={(e) => {
          e.preventDefault()

          const data = new FormData(e.target as any)

          updateMemberProfile({
            [name]: data.get(name) as string,
          })

          setCanEdit(false)
        }}
      >
        <TextField
          name={name}
          label={label}
          required={required}
          defaultValue={defaultValue}
          sx={{ flexGrow: 1 }}
        />
        <ActionItems setCanEdit={setCanEdit} />
      </EditableProfileItemForm>
    )
  }
  const Icon = MaterialIcons[icon]

  return (
    <EditableProfileItemDisplay>
      <EditableProfileItemData>
        <EditableProfileItemHeader>
          <EditableProfileLabel variant="caption">{label}</EditableProfileLabel>
          <Icon />
        </EditableProfileItemHeader>

        <Typography variant="h5">{defaultValue}</Typography>
      </EditableProfileItemData>
      {memberCanEdit ? (
        <IconButton
          onClick={() => setCanEdit(true)}
          sx={{ marginLeft: '1rem' }}
        >
          <MaterialIcons.Edit />
        </IconButton>
      ) : null}
    </EditableProfileItemDisplay>
  )
}

const EditableDateItem = ({
  name,
  label,
  icon,
  defaultValue,
  updateMemberProfile,
  memberCanEdit,
}: Props<string>) => {
  const [canEdit, setCanEdit] = useState<boolean>(false)

  if (canEdit) {
    return (
      <EditableProfileItemForm
        onSubmit={(e) => {
          e.preventDefault()

          const data = new FormData(e.target as any)

          updateMemberProfile({
            [name]: data.get(name) as string,
          })

          setCanEdit(false)
        }}
      >
        <DatePicker
          name={name}
          defaultValue={defaultValue ? dayjs(defaultValue) : undefined}
          sx={{ flexGrow: 1 }}
        />
        <ActionItems setCanEdit={setCanEdit} />
      </EditableProfileItemForm>
    )
  }

  const Icon = MaterialIcons[icon]

  return (
    <EditableProfileItemDisplay>
      <EditableProfileItemData>
        <EditableProfileItemHeader>
          <EditableProfileLabel variant="caption">{label}</EditableProfileLabel>
          <Icon />
        </EditableProfileItemHeader>

        <Typography variant="h5" component="h3">
          {defaultValue
            ? format(new Date(defaultValue), 'PP')
            : 'Unknown Birthday'}
        </Typography>
      </EditableProfileItemData>
      {memberCanEdit ? (
        <IconButton
          onClick={() => setCanEdit(true)}
          sx={{ marginLeft: '1rem' }}
        >
          <MaterialIcons.Edit />
        </IconButton>
      ) : null}
    </EditableProfileItemDisplay>
  )
}

const EditableMultiLineItem = ({
  name,
  label,
  required,
  defaultValue,
  icon,
  updateMemberProfile,
  memberCanEdit,
}: Props<string>) => {
  const [canEdit, setCanEdit] = useState<boolean>(false)

  if (canEdit) {
    return (
      <EditableProfileItemForm
        onSubmit={(e) => {
          e.preventDefault()

          const data = new FormData(e.target as any)

          updateMemberProfile({
            [name]: data.get(name) as string,
          })

          setCanEdit(false)
        }}
      >
        <TextField
          name={name}
          label={label}
          defaultValue={defaultValue}
          minRows={3}
          multiline
          required={required}
          sx={{ flexGrow: 1 }}
        />
        <ActionItems setCanEdit={setCanEdit} />
      </EditableProfileItemForm>
    )
  }
  const Icon = MaterialIcons[icon]

  return (
    <EditableProfileItemDisplay>
      <EditableProfileItemData>
        <EditableProfileItemHeader>
          <EditableProfileLabel variant="caption">{label}</EditableProfileLabel>
          <Icon />
        </EditableProfileItemHeader>

        {defaultValue?.split('\n').map((line, i) => (
          <Typography variant="h6" key={i}>
            {line}
          </Typography>
        ))}
      </EditableProfileItemData>
      {memberCanEdit ? (
        <IconButton
          onClick={() => setCanEdit(true)}
          sx={{ marginLeft: '1rem' }}
        >
          <MaterialIcons.Edit />
        </IconButton>
      ) : null}
    </EditableProfileItemDisplay>
  )
}

const EditableProfifleItem = ({ type, ...rest }: Props) => {
  switch (type) {
    case PROFILE_ITEM_TYPE.TEXT:
      return <EditableTextItem type={type} {...rest} />
    case PROFILE_ITEM_TYPE.DATE:
      return <EditableDateItem type={type} {...rest} />
    case PROFILE_ITEM_TYPE.MULTI_LINE_TEXT:
      return <EditableMultiLineItem type={type} {...rest} />
    default:
      return null
  }
}

export default EditableProfifleItem
