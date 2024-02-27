import React, { useCallback, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { useParams } from 'wouter'
import { navigate } from 'wouter/use-location'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'

import {
  CommunityNameLens,
  useDeleteCommunityMutation,
  useLazyGetCommunityByIDQuery,
  useLazyGetCommunityMembersQuery,
} from '../../../state/domains/communities'

import { Page } from './components/styled'
import MemberListItem from './components/MemberListItem'
import { useSession } from '@clerk/clerk-react'

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
  const { session } = useSession()

  const params = useParams()

  const [getCommunityById, communityByIdResults] =
    useLazyGetCommunityByIDQuery()

  const [getCommunityMembers, communityMembers] =
    useLazyGetCommunityMembersQuery()

  const [deleteCommunity] = useDeleteCommunityMutation()

  const handleDelete = useCallback(async () => {
    if (session) {
      const token = await session.getToken()
      console.log(communityByIdResults)
      if (token) {
        await deleteCommunity({
          id: communityByIdResults.currentData?._id!,
          token,
        })
        navigate('/dashboard')
      }
    }
  }, [session, navigate, communityByIdResults])
  useEffect(() => {
    const doWork = async () => {
      const token = await session?.getToken()

      if (token) {
        getCommunityById({
          id: params.id!,
          token: token,
        })

        getCommunityMembers({
          token,
          id: params.id!,
        })
      }
    }

    if (session) {
      doWork()
    }
  }, [session, params])

  const loading =
    communityByIdResults.status !== 'fulfilled' &&
    communityMembers.status !== 'fulfilled'

  if (loading) {
    return 'Loading...'
  }

  const community = communityByIdResults.currentData!
  const members = communityMembers.currentData!

  if (!community && !members) {
    return 'No Community Found'
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
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete. Cannot be undone.
          </Button>
        </Box>
      </Modal>
    </Page>
  )
}

export default SingleCommunity
