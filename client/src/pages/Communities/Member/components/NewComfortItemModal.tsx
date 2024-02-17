import {
  Modal,
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material'
import React, { useState } from 'react'
import { COMFORT_ITEM_TYPE } from '../../../../state/domains/communities'
import ComfortItemIcon from './ComfortItemIcon'
import { useTranslation } from 'react-i18next'

interface Props {
  open: boolean
  handleClose: () => void
  handleSubmit: React.FormEventHandler
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  border: '2px solid #000',
}

const FoodForm = () => {
  const { t: translations } = useTranslation()
  const [canBeDelivered, setCanBeDelivered] = useState<boolean>(false)
  const [fromASpecificPlace, setFromASpecificPlace] = useState<boolean>(false)

  return (
    <>
      <FormGroup sx={{ marginBottom: '1.5rem', padding: '0.25rem' }}>
        <FormControlLabel
          control={
            <Checkbox
              value={canBeDelivered}
              onChange={(event) => {
                setCanBeDelivered(event.target.checked)
              }}
              name="canBeDelivered"
            />
          }
          label={translations(
            'page.communities.members.comfort-likes.add.food.can-be-delivered.label',
          )}
        />
        {canBeDelivered ? (
          <TextField
            name="deliveryOptions"
            label={translations(
              'page.communities.members.comfort-likes.add.food.can-be-delivered.deliverOptions.label',
            )}
          />
        ) : null}
      </FormGroup>

      <FormGroup sx={{ marginBottom: '1.5rem', padding: '0.25rem' }}>
        <FormControlLabel
          control={
            <Checkbox
              value={fromASpecificPlace}
              onChange={(event) => {
                setFromASpecificPlace(event.target.checked)
              }}
              name="fromSpecificPlace"
            />
          }
          label={translations(
            'page.communities.members.comfort-likes.add.food.from-specific-place.label',
          )}
        />
        {fromASpecificPlace ? (
          <TextField
            name="specificPlace"
            label={translations(
              'page.communities.members.comfort-likes.add.food.from-specific-place.options.label',
            )}
          />
        ) : null}
      </FormGroup>
    </>
  )
}

const NewComfortItemModal = ({ open, handleClose, handleSubmit }: Props) => {
  const { t: translations } = useTranslation()

  const [itemType, setItemType] = useState<COMFORT_ITEM_TYPE>(
    COMFORT_ITEM_TYPE.GENERAL,
  )

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal--description"
    >
      <Box style={modalStyle}>
        <form onSubmit={handleSubmit}>
          <Paper sx={{ padding: '2.5rem' }}>
            <Typography gutterBottom variant="h4">
              {translations('page.communities.members.comfort-likes.add')}
            </Typography>
            <TextField
              fullWidth
              name="title"
              sx={{ marginBottom: '1rem' }}
              label={translations(
                'page.communities.members.comfort-likes.add.label',
              )}
            />
            <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
              <InputLabel id="comfort-item-select-label">
                {translations(
                  'page.communities.members.comfort-likes.add.type.label',
                )}
              </InputLabel>
              <Select
                labelId="comfort-item-select-label"
                id="comfort-item-select"
                name="type"
                value={itemType}
                onChange={(event) => {
                  if (event?.target) {
                    setItemType(event?.target.value as COMFORT_ITEM_TYPE)
                  }
                }}
                label={translations(
                  'page.communities.members.comfort-likes.add.type.label',
                )}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {Object.values(COMFORT_ITEM_TYPE).map((key) => (
                  <MenuItem value={key} key={key}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <ComfortItemIcon type={key} />
                      <ListItemText
                        sx={{ marginLeft: '1rem' }}
                        primary={translations(
                          `page.communities.members.comfort-likes.add.${key}.label`,
                        )}
                      />
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {itemType === COMFORT_ITEM_TYPE.FOOD ? <FoodForm /> : null}
            <TextField
              multiline
              minRows={5}
              sx={{ marginBottom: '1.5rem' }}
              label={translations(
                'page.communities.members.comfort-likes.add.general.notes.label',
              )}
              name="notes"
              fullWidth
            />
            <Button fullWidth type="submit" variant="contained">
              Save Comfort Item
            </Button>
          </Paper>
        </form>
      </Box>
    </Modal>
  )
}

export default NewComfortItemModal
