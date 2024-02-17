import React from 'react'
import { Box, Typography } from '@mui/material'
import { Link, useParams } from 'wouter'
import { useSelector } from 'react-redux'
import { navigate } from 'wouter/use-location'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'

import Log from '../../../log'
import { RootState } from '../../../state/store'

import {
  CommunityIdLens,
  CommunityMemberIdLens,
  CommunityNameLens,
  useDetleteCommunityMutation,
  useGetCommunityByIDQuery,
  useGetCommunityMembersQuery,
} from '../../../state/domains/communities'

import { Page } from './components/styled'
import MemberListItem from './components/MemberListItem'

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  padding: '1.5rem',
}

const SingleCommunity = () => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const params = useParams()

  const {
    data: community,
    error: communityError,
    isLoading: communityIsLoading,
  } = useGetCommunityByIDQuery(params.id!)

  const {
    data: members,
    error: membersError,
    isLoading: membersAreLoading,
  } = useGetCommunityMembersQuery(params.id!)

  const [deleteCommunity] = useDetleteCommunityMutation()

  const isLoading = communityIsLoading || membersAreLoading
  const error = communityError || membersError

  if (isLoading) {
    return 'Loading...'
  }

  if (error) {
    Log.warn(
      { err: error, params: { id: params.id } },
      'There was an error when we tried to get the community',
    )
  }

  if (!community) {
    return 'No data'
  }

  return (
    <Page>
      <Typography variant="h2" gutterBottom align="center">
        {CommunityNameLens.get(community)}
      </Typography>
      <List>
        {members?.map((member, i) => (
          <MemberListItem key={i} member={member} />
        ))}
      </List>
      <Button color="secondary" onClick={handleOpen}>
        Delete
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal--description"
      >
        <Box style={modalStyle}>
          <Typography>
            Are you sure you want to delete the Community {community.name}?
          </Typography>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              await deleteCommunity(community._id)
              navigate('/dashboard')
            }}
          >
            Delete. Cannot be undone.
          </Button>
        </Box>
      </Modal>
    </Page>
  )
}

const OnlyAuthenticatedSingle = () => {
  const token = useSelector((state: RootState) => state.auth.token)

  if (!token) {
    return null
  }

  return <SingleCommunity />
}

export default OnlyAuthenticatedSingle
