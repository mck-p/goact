import React from 'react'
import FoodBankIcon from '@mui/icons-material/FoodBank'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { COMFORT_ITEM_TYPE } from '../../../../state/domains/communities'

interface Props {
  type: COMFORT_ITEM_TYPE
}

const ComfortItemIcon = ({ type }: Props) => {
  console.log(type, 'type')
  if (type === COMFORT_ITEM_TYPE.FOOD) {
    return <FoodBankIcon />
  }

  if (type == COMFORT_ITEM_TYPE.GENERAL) {
    return <HelpOutlineIcon />
  }

  return <HelpOutlineIcon />
}

export default ComfortItemIcon
