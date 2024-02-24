import React, { useState } from 'react'
import * as MaterialIcons from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format } from 'date-fns'
import dayjs from 'dayjs'
import { IconButton, TextField, Typography } from '@mui/material'
import { CommunityMemberProfile } from '../../../../state/domains/communities'
import { useTranslation } from 'react-i18next'

export enum PROFILE_ITEM_TYPE {
  TEXT = 'text',
  DATE = 'date',
}

interface Props<T = any> {
  type: PROFILE_ITEM_TYPE
  name: string
  label: string
  required?: boolean
  defaultValue: T
  updateMemberProfile: (newData: Partial<CommunityMemberProfile>) => void
  memberCanEdit: boolean
}

const EditableTextItem = ({
  name,
  label,
  required,
  defaultValue,
  updateMemberProfile,
  memberCanEdit,
}: Props<string>) => {
  const { t: translations } = useTranslation()
  const [canEdit, setCanEdit] = useState<boolean>(false)

  if (canEdit) {
    return (
      <form
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem',
        }}
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
        />
        <IconButton
          onClick={() => setCanEdit(false)}
          sx={{ marginLeft: '1rem' }}
          title="Cancel"
        >
          <MaterialIcons.Cancel />
        </IconButton>
      </form>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1.25rem',
      }}
    >
      <div>
        <Typography variant="caption" gutterBottom>
          {translations('page.communities.members.name.label')}
        </Typography>

        <Typography variant="h3">{defaultValue}</Typography>
      </div>
      {memberCanEdit ? (
        <IconButton
          onClick={() => setCanEdit(true)}
          sx={{ marginLeft: '1rem' }}
        >
          <MaterialIcons.Edit />
        </IconButton>
      ) : null}
    </div>
  )
}

const EditableDateItem = ({
  name,
  label,
  required,
  defaultValue,
  updateMemberProfile,
  memberCanEdit,
}: Props<string>) => {
  const [canEdit, setCanEdit] = useState<boolean>(false)

  if (canEdit) {
    return (
      <form
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem',
        }}
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
          required={required}
        />
        <IconButton
          onClick={() => setCanEdit(false)}
          sx={{ marginLeft: '1rem' }}
          title="Cancel"
        >
          <MaterialIcons.Cancel />
        </IconButton>
      </form>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1.25rem',
      }}
    >
      <div>
        <Typography variant="caption" gutterBottom>
          {label}
        </Typography>
        <Typography variant="h5" component="h3">
          {defaultValue
            ? format(new Date(defaultValue), 'PP')
            : 'Unknown Birthday'}
        </Typography>
      </div>
      {memberCanEdit ? (
        <IconButton
          onClick={() => setCanEdit(true)}
          sx={{ marginLeft: '1rem' }}
        >
          <MaterialIcons.Edit />
        </IconButton>
      ) : null}
    </div>
  )
}
const EditableProfifleItem = ({ type, ...rest }: Props) => {
  if (type === PROFILE_ITEM_TYPE.TEXT) {
    return <EditableTextItem type={type} {...rest} />
  }

  if (type === PROFILE_ITEM_TYPE.DATE) {
    return <EditableDateItem type={type} {...rest} />
  }

  return null
}

export default EditableProfifleItem
