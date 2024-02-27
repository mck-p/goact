import { IconButton, Typography } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import * as Icons from '@mui/icons-material'
import React, { useCallback } from 'react'
import type { CommunityProfileSchemaItem } from '../../../../state/domains/communities'
import { ItemData, ItemWrap } from './styled'

interface Props extends CommunityProfileSchemaItem {
  removeItem: () => void
  downgradeItem: (item: any) => void
}

const SavedProfileItem = ({ removeItem, downgradeItem, ...item }: Props) => {
  const icon = item.icon as keyof typeof Icons
  const Icon = Icons[icon]

  const setEditItem = useCallback(() => {
    downgradeItem(item)
  }, [item])

  return (
    <ItemWrap>
      <ItemData>
        <Typography sx={{ marginRight: '1.5rem' }}>{item.label}</Typography>
        <Icon />
      </ItemData>
      <IconButton onClick={removeItem}>
        <DeleteForeverIcon />
      </IconButton>
      <IconButton
        onClick={() => {
          setEditItem()
          removeItem()
        }}
      >
        <EditIcon />
      </IconButton>
    </ItemWrap>
  )
}

export default SavedProfileItem
