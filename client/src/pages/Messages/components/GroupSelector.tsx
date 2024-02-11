import React from 'react'
import styled from '@emotion/styled'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 5rem;
`

interface Props {
  selectedGroupId?: string
  groups: {
    _id: string
    name: string
  }[]
  setSelectedGroup: (group: { _id: string; name: string } | undefined) => void
}

const GroupSelector = ({
  selectedGroupId,
  groups,
  setSelectedGroup,
}: Props) => (
  <List>
    {groups.map((group) => (
      <ListItemButton
        key={group._id}
        selected={selectedGroupId === group._id}
        onClick={() => {
          setSelectedGroup(groups.find(({ _id }) => _id === group._id))
        }}
      >
        <ListItemText primary={group.name} />
      </ListItemButton>
    ))}
  </List>
)

export default GroupSelector
