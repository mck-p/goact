import React from 'react'
import styled from '@emotion/styled'
import { useHover } from '@uidotdev/usehooks'
import EditIcon from '@mui/icons-material/Edit'

import { Avatar } from './styled'
import { IconButton } from '@mui/material'
import UpdateMemberAvatarModal from './UpdateMemberAvatarModal'
import {
  getProfileAvatarReadURL,
  getProfileAvatarUploadURL,
} from '../../../../services/communities'
import { useSession } from '@clerk/clerk-react'
import log from '../../../../log'

const Wrap = styled.div`
  width: 164px;
  height: 164px;
  position: relative;
`

const EditTrigger = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background-color: rgba(33, 33, 33, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

interface Props {
  canEdit: boolean
  url: string
  name: string
  memberId: string
  communityId: string
  updateAvatar: (url: string) => void
}

const MemberAvatar = ({
  canEdit,
  url,
  name,
  updateAvatar,
  communityId,
  memberId,
}: Props) => {
  const [ref, hovering] = useHover()
  const { session } = useSession()
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Wrap ref={ref}>
      <Avatar src={url} alt={name} />
      {canEdit && hovering ? (
        <EditTrigger onClick={handleOpen}>
          <IconButton>
            <EditIcon />
          </IconButton>
        </EditTrigger>
      ) : null}
      <UpdateMemberAvatarModal
        open={canEdit && open}
        handleClose={handleClose}
        handleSubmit={async (e) => {
          e.preventDefault()
          console.log('yes')
          const form = new FormData(e.target as any)

          let url = form.get('url') as string | undefined

          if (form.has('file')) {
            // handle avatar file upload
            const token = await session?.getToken()
            const id = window.crypto.randomUUID()

            if (token) {
              const file = form.get('file') as File
              const type = file.type
              const [_, ext] = type.split('/')
              const fileName = `${id}.${ext}`
              try {
                const req = {
                  communityId,
                  memberId,
                  token,
                  filename: fileName,
                }

                const fileUploadURL = await getProfileAvatarUploadURL(req)

                await fetch(fileUploadURL.url, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': type,
                  },
                  body: file,
                })

                await getProfileAvatarReadURL(req)

                url = fileName
              } catch (err) {
                log.warn({ err }, 'Error when trying to upload file')
              }
            }
          }

          // save url
          updateAvatar(url as string)

          handleClose()
        }}
      />
    </Wrap>
  )
}

export default MemberAvatar
