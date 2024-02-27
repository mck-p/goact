import {
  Modal,
  Box,
  Paper,
  Typography,
  TextField,
  Tabs,
  Tab,
  Button,
} from '@mui/material'
import React, { useState } from 'react'

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

const UpdateMemberAvatarModal = ({
  open,
  handleClose,
  handleSubmit,
}: Props) => {
  const { t: translations } = useTranslation()
  const [currentTab, setCurrentTab] = useState<number>(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="avatar-update-modal-title"
      aria-describedby="avatar-update-modal--description"
    >
      <Box style={modalStyle}>
        <form onSubmit={handleSubmit}>
          <Paper sx={{ padding: '2.5rem' }}>
            <Typography gutterBottom variant="h4">
              {translations('page.communities.members.avatar.update.label')}
            </Typography>
            <Tabs
              value={currentTab}
              onChange={handleChange}
              aria-label={translations(
                'page.communities.members.avatar.update.tabs.label',
              )}
            >
              <Tab label="URL" id="url-tab" aria-controls="url-tabpanel" />
              <Tab
                label="File Upload"
                id="file-upload-tab"
                aria-controls="file-upload-tabpanel"
              />
            </Tabs>
            <div
              role="tabpanel"
              hidden={currentTab !== 0}
              id="url-tabpanel"
              aria-labelledby="url-tab"
              style={{
                padding: '1.25rem',
              }}
            >
              {currentTab === 0 && (
                <TextField
                  name="url"
                  type="url"
                  fullWidth
                  label="URL"
                  required
                />
              )}
            </div>
            <div
              role="tabpanel"
              hidden={currentTab !== 1}
              id="file-upload-tabpanel"
              aria-labelledby="file-upload-tab"
              style={{
                padding: '1.25rem',
              }}
            >
              {currentTab === 1 && (
                <TextField
                  name="file"
                  type="file"
                  fullWidth
                  label="file"
                  required
                />
              )}
            </div>
            <Button fullWidth type="submit" variant="contained">
              {translations(
                'page.communities.members.avatar.update.button.label',
              )}
            </Button>
          </Paper>
        </form>
      </Box>
    </Modal>
  )
}

export default UpdateMemberAvatarModal
