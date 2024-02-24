import React, { useCallback, useState } from 'react'
import styled from '@emotion/styled'
import { navigate } from 'wouter/use-location'
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material'
import {
  PROFILE_ITEM_TYPE,
  useAddCommunityMutation,
} from '../../../state/domains/communities'
import PendingProfileItem from './components/PendingProfileItem'
import Log from '../../../log'
import SavedProfileItem from './components/SavedProfileItem'
import { useSession } from '@clerk/clerk-react'

const Page = styled.main`
  width: 100%;
  padding: 0.5rem;
  margin-top: 5rem;
`

const Form = styled.form`
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: rgba(33, 33, 33, 0.5);
  padding: 2rem;
`

const CreateCommunity = () => {
  const [createCommunity] = useAddCommunityMutation()
  const { session } = useSession()

  const [communityProfileItems, setCommunityProfileItems] = useState<any[]>([
    {
      type: PROFILE_ITEM_TYPE.TEXT,
      icon: 'TextFields',
      label: 'Display Name',
      name: 'name',
      id: window.crypto.randomUUID(),
    },
  ])

  const [pendingProfileItems, setPendingProfileItems] = useState<any[]>([])

  const handleFormSubmit: React.FormEventHandler = useCallback(
    async (e) => {
      e.preventDefault()
      const formData = new FormData(e.target as any)

      const name = formData.get('name') as string
      const is_public = formData.get('public') === 'on'

      Log.info(
        { name, is_public, communityProfileItems },
        'Creating new community',
      )

      if (session) {
        const token = await session.getToken()
        if (token) {
          const result = await createCommunity({
            community: {
              name,
              is_public,
              profile_schema: communityProfileItems.reduce(
                (a, c, i) => ({
                  ...a,
                  [c.name]: {
                    ...c,
                    index: i,
                  },
                }),
                {},
              ),
            },
            token,
          }).unwrap()

          navigate(`/communities/${result._id}`)
        }
      }
    },
    [communityProfileItems, session],
  )

  const addNewPendingItem = () =>
    setPendingProfileItems((old) => [
      ...old,
      {
        type: PROFILE_ITEM_TYPE.TEXT,
        icon: 'TextFields',
        id: window.crypto.randomUUID(),
      },
    ])

  const prependNewPendingItem = (newItem: any) =>
    setPendingProfileItems((old) => [newItem, ...old])

  const removePendingItem = (index: number) =>
    setPendingProfileItems((old) => {
      return [...old.slice(0, index), ...old.slice(index + 1)]
    })

  const removeSavedItem = (index: number) =>
    setCommunityProfileItems((old) => {
      return [...old.slice(0, index), ...old.slice(index + 1)]
    })

  const promotePendingToSaved = (item: any) =>
    setCommunityProfileItems((old) => [...old, item])

  return (
    <Page>
      <Form onSubmit={handleFormSubmit}>
        <Typography variant="h2" align="center" gutterBottom>
          New Community
        </Typography>
        <TextField
          name="name"
          label="Community Name"
          helperText="What do you want to call your community?"
          required
          fullWidth
        />
        <div style={{ padding: '1.5rem' }}>
          <Typography gutterBottom variant="subtitle2">
            What information do you want your community members to be able to
            display on their profile?
          </Typography>
          {communityProfileItems.map((item, i) => (
            <SavedProfileItem
              key={item.id}
              removeItem={() => removeSavedItem(i)}
              downgradeItem={prependNewPendingItem}
              {...item}
            />
          ))}
        </div>
        <Divider />
        <div style={{ padding: '1.5rem' }}>
          <Typography gutterBottom variant="subtitle2">
            Pending items to add to profile
          </Typography>
          {pendingProfileItems.map((item, i) => (
            <>
              <PendingProfileItem
                key={item.id}
                removeItem={() => removePendingItem(i)}
                upgradeItem={promotePendingToSaved}
                {...item}
              />
              {i !== pendingProfileItems.length - 1 ? (
                <Divider variant="middle" key={`${i}-pending-divider`} />
              ) : null}
            </>
          ))}
        </div>
        <Button fullWidth onClick={addNewPendingItem}>
          Add New Profile Item
        </Button>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked name="public" />}
            label="Make Public"
          />
        </FormGroup>
        <Button type="submit" variant="contained" color="primary">
          Create Community
        </Button>
      </Form>
    </Page>
  )
}

export default CreateCommunity
