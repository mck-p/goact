import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  List,
  ListSubheader,
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  ListItem,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

import useUser from '../../../../hooks/useuser'
import {
  COMFORT_ITEM_TYPE,
  ComfortItem,
} from '../../../../state/domains/communities'
import ComfortItemIcon from './ComfortItemIcon'
import NewComfortItemModal from './NewComfortItemModal'

interface Props {
  items: ComfortItem[]
  memberId: string
  setNewItems: (cb: (oldItems: ComfortItem[]) => ComfortItem[]) => void
}

const parseGeneralData = (formData: FormData) => {
  const type = formData.get('type') as string as COMFORT_ITEM_TYPE
  const notes = formData.get('notes') as string
  const title = formData.get('title') as string

  return {
    type,
    notes,
    title,
  }
}

const parseFoodData = (formData: FormData) => {
  const generalData = parseGeneralData(formData)
  const canBeDelivered = formData.get('canBeDelivered') === 'true'
  const deliveryOptions = (formData.get('deliveryOptions') as string)
    ?.split(',')
    .map((val) => val.trim())
    .filter(Boolean)

  const fromSpecificPlace = formData.get('fromSpecificPlace') === 'true'
  const specificPlace = (formData.get('specificPlace') as string)
    ?.split(',')
    .map((val) => val.trim())
    .filter(Boolean)

  return {
    ...generalData,
    canBeDelivered,
    deliveryOptions,
    fromSpecificPlace,
    specificPlace,
  }
}

const ComfortList = ({ items, memberId, setNewItems }: Props) => {
  const { user } = useUser()
  const { t: translations } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target as any)

    const type = formData.get('type') as COMFORT_ITEM_TYPE

    if (type === COMFORT_ITEM_TYPE.GENERAL) {
      const form: ComfortItem = parseGeneralData(formData)

      setNewItems((oldItems) => [...oldItems, form])
    }

    if (type === COMFORT_ITEM_TYPE.FOOD) {
      const form: ComfortItem = parseFoodData(formData)

      setNewItems((oldItems) => [...oldItems, form])
    }

    handleClose()
  }

  return (
    <List
      subheader={
        <ListSubheader
          id="comfort-list-header"
          component={Typography}
          variant="h5"
        >
          {translations('page.communities.members.comfort-likes.title')}
        </ListSubheader>
      }
    >
      {items.map((comfort, i) => (
        <ListItem
          secondaryAction={
            user?.id === memberId ? (
              <IconButton
                onClick={() =>
                  setNewItems((oldItems) =>
                    oldItems.filter((item) => {
                      if (item === comfort) {
                        return false
                      }

                      return true
                    }),
                  )
                }
                edge="end"
                aria-label="delete"
                color="warning"
                title={translations(
                  'page.communities.members.comfort-likes.delete.label',
                )}
              >
                <DeleteIcon />
              </IconButton>
            ) : undefined
          }
        >
          <ListItemIcon>
            <ComfortItemIcon type={comfort.type} />
          </ListItemIcon>
          <ListItemText primary={comfort.title} secondary={comfort.notes} />
        </ListItem>
      ))}
      {user?.id === memberId ? (
        <>
          <Button
            color="primary"
            fullWidth
            variant="contained"
            onClick={handleOpen}
          >
            {translations('page.communities.members.comfort-likes.add')}
          </Button>
          <NewComfortItemModal
            open={open}
            handleClose={handleClose}
            handleSubmit={handleSubmit}
          />
        </>
      ) : null}
    </List>
  )
}

export default ComfortList
