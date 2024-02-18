import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import EditIcon from '@mui/icons-material/Edit'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveIcon from '@mui/icons-material/Save'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { format } from 'date-fns'
import dayjs from 'dayjs'

import { IconButton, TextField, Typography } from '@mui/material'
import { RootState } from '../../../state/store'

import { useParams } from 'wouter'

import {
  CommunityMemberAddressLens,
  CommunityMemberAnniversaryLens,
  CommunityMemberAvatarLens,
  CommunityMemberBirthdayLens,
  CommunityMemberComfortItemsLens,
  CommunityMemberEmailLens,
  CommunityMemberIdLens,
  CommunityMemberNameLens,
  CommunityMemberPhoneNumberLens,
  CommunityMemberProfile,
  useGetCommunityMemberQuery,
  useUpdateCommunityMemberProfileMutation,
} from '../../../state/domains/communities'

import { Page, Profile, Lists } from './components/styled'
import ComfortList from './components/ComfortList'
import { useUser } from '../../../hooks/useuser'
import MemberAvatar from './components/MemberAvatar'
import { useTranslation } from 'react-i18next'

const CommunityMember = () => {
  const { user } = useUser()
  const { t: translations } = useTranslation()
  const params = useParams()

  const { data } = useGetCommunityMemberQuery({
    community: params.community_id!,
    member: params.member_id!,
  })

  const [updateProfile] = useUpdateCommunityMemberProfileMutation()

  const [editUserName, setEditUserName] = useState<boolean>(false)
  const [editBirthday, setEditBirthday] = useState<boolean>(false)
  const [editAnniversary, setEditAnniversary] = useState<boolean>(false)
  const [editAddress, setEditaddress] = useState<boolean>(false)
  const [editPhoneNumber, setEditPhoneNumber] = useState<boolean>(false)
  const [editEmailAddress, setEditEmailAddress] = useState<boolean>(false)

  const updateMeberProfile = useCallback(
    (newValues: Partial<CommunityMemberProfile>) => {
      if (data) {
        updateProfile({
          communityId: data.community,
          memberId: data.member,
          ...data.profile,
          ...newValues,
        })
      }
    },
    [data],
  )

  if (!data) {
    return null
  }

  const member = {
    avatar: CommunityMemberAvatarLens.get(data),
    name: CommunityMemberNameLens.get(data),
    comfortItems: CommunityMemberComfortItemsLens.get(data) || [],
    id: CommunityMemberIdLens.get(data),
    birthday: CommunityMemberBirthdayLens.get(data),
    anniversary: CommunityMemberAnniversaryLens.get(data),
    address: CommunityMemberAddressLens.get(data),
    phoneNumber: CommunityMemberPhoneNumberLens.get(data),
    email: CommunityMemberEmailLens.get(data),
  }

  const canEdit = user?.id === member.id

  return (
    <Page>
      <Profile elevation={2}>
        <MemberAvatar
          communityId={data.community}
          memberId={data.member}
          url={member.avatar}
          name={member.name}
          canEdit={canEdit}
          updateAvatar={(url) =>
            updateMeberProfile({
              avatar: url,
            })
          }
        />
        {editUserName ? (
          <form
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem',
            }}
            onSubmit={(e) => {
              e.preventDefault()

              const data = new FormData(e.target as any)

              updateMeberProfile({
                name: data.get('name') as string,
              })

              setEditUserName(false)
            }}
          >
            <TextField
              defaultValue={member.name}
              name="name"
              label="Name in Community"
            />
            <IconButton
              onClick={() => setEditUserName(false)}
              sx={{ marginLeft: '1rem' }}
              title="Cancel"
            >
              <CancelIcon />
            </IconButton>
          </form>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.25rem',
            }}
          >
            <div>
              <Typography variant="caption" gutterBottom>
                {translations('page.communities.members.name.label')}
              </Typography>

              <Typography variant="h3">{member.name}</Typography>
            </div>
            {canEdit ? (
              <IconButton
                onClick={() => setEditUserName(true)}
                title="Change name in community"
                sx={{ marginLeft: '1rem' }}
              >
                <EditIcon />
              </IconButton>
            ) : null}
          </div>
        )}
        {editBirthday ? (
          <form
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem',
            }}
            onSubmit={(e) => {
              e.preventDefault()

              const data = new FormData(e.target as any)

              updateMeberProfile({
                birthday: data.get('birthday') as string,
              })

              setEditBirthday(false)
            }}
            id="birthday-form"
          >
            <DatePicker
              name="birthday"
              defaultValue={
                member.birthday ? dayjs(member.birthday) : undefined
              }
            />
            <IconButton
              onClick={() => setEditBirthday(false)}
              sx={{ marginLeft: '1rem' }}
              title="Cancel"
            >
              <CancelIcon />
            </IconButton>
          </form>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.25rem',
            }}
          >
            <div>
              <Typography variant="caption" gutterBottom>
                {translations('page.communities.members.birthday.label')}
              </Typography>
              <Typography variant="h5" component="h3">
                {member.birthday
                  ? format(new Date(member.birthday), 'PP')
                  : 'Unknown Birthday'}
              </Typography>
            </div>
            {canEdit ? (
              <IconButton
                onClick={() => setEditBirthday(true)}
                title="Change Birthday"
                sx={{ marginLeft: '1rem' }}
              >
                <EditIcon />
              </IconButton>
            ) : null}
          </div>
        )}
        {editAnniversary ? (
          <form
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem',
            }}
            onSubmit={(e) => {
              e.preventDefault()

              const data = new FormData(e.target as any)

              updateMeberProfile({
                anniversary: data.get('annivesary') as string,
              })

              setEditAnniversary(false)
            }}
            id="anniversary-form"
          >
            <DatePicker
              name="annivesary"
              defaultValue={
                member.anniversary ? dayjs(member.anniversary) : undefined
              }
            />
            <IconButton
              onClick={() => setEditAnniversary(false)}
              sx={{ marginLeft: '1rem' }}
              title="Cancel"
            >
              <CancelIcon />
            </IconButton>
          </form>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.25rem',
            }}
          >
            <div>
              <Typography variant="caption" gutterBottom>
                {translations('page.communities.members.anniversary.label')}
              </Typography>
              <Typography variant="h5" component="h3">
                {member.anniversary
                  ? format(new Date(member.anniversary), 'PP')
                  : 'Unknown Anniversary'}
              </Typography>
            </div>
            {canEdit ? (
              <IconButton
                onClick={() => setEditAnniversary(true)}
                title="Change Anniversary"
                sx={{ marginLeft: '1rem' }}
              >
                <EditIcon />
              </IconButton>
            ) : null}
          </div>
        )}
        {editAddress ? (
          <form
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem',
            }}
            onSubmit={(e) => {
              e.preventDefault()

              const data = new FormData(e.target as any)

              updateMeberProfile({
                address: data.get('address') as string,
              })

              setEditaddress(false)
            }}
            id="address-form"
          >
            <TextField
              name="address"
              label="Edit Address"
              defaultValue={member.address}
              minRows={4}
              multiline
            />
            <IconButton
              type="submit"
              sx={{ marginLeft: '1rem' }}
              title="Submit"
            >
              <SaveIcon />
            </IconButton>
            <IconButton
              onClick={() => setEditaddress(false)}
              sx={{ marginLeft: '1rem' }}
              title="Cancel"
            >
              <CancelIcon />
            </IconButton>
          </form>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.25rem',
            }}
          >
            <div>
              <Typography variant="caption" gutterBottom>
                {translations('page.communities.members.address.label')}
              </Typography>
              <Typography variant="h5" component="h3">
                {member.address ?? 'Unknown Address'}
              </Typography>
            </div>
            {canEdit ? (
              <IconButton
                onClick={() => setEditaddress(true)}
                title="Change Address"
                sx={{ marginLeft: '1rem' }}
              >
                <EditIcon />
              </IconButton>
            ) : null}
          </div>
        )}
        {editPhoneNumber ? (
          <form
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem',
            }}
            onSubmit={(e) => {
              e.preventDefault()

              const data = new FormData(e.target as any)

              updateMeberProfile({
                phoneNumber: data.get('phoneNumber') as string,
              })

              setEditPhoneNumber(false)
            }}
            id="address-form"
          >
            <TextField
              name="phoneNumber"
              label="Edit Phone Number"
              defaultValue={member.phoneNumber}
            />
            <IconButton
              onClick={() => setEditPhoneNumber(false)}
              sx={{ marginLeft: '1rem' }}
              title="Cancel"
            >
              <CancelIcon />
            </IconButton>
          </form>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.25rem',
            }}
          >
            <div>
              <Typography variant="caption" gutterBottom>
                {translations('page.communities.members.phone-number.label')}
              </Typography>
              <Typography variant="h5" component="h3">
                {member.phoneNumber ?? 'Unknown Phone Number'}
              </Typography>
            </div>
            {canEdit ? (
              <IconButton
                onClick={() => setEditPhoneNumber(true)}
                title="Change Phone Number"
                sx={{ marginLeft: '1rem' }}
              >
                <EditIcon />
              </IconButton>
            ) : null}
          </div>
        )}
        {editEmailAddress ? (
          <form
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem',
            }}
            onSubmit={(e) => {
              e.preventDefault()

              const data = new FormData(e.target as any)

              updateMeberProfile({
                email: data.get('email') as string,
              })

              setEditEmailAddress(false)
            }}
            id="address-form"
          >
            <TextField
              name="email"
              label="Edit Email"
              type="email"
              defaultValue={member.email}
            />
            <IconButton
              onClick={() => setEditEmailAddress(false)}
              sx={{ marginLeft: '1rem' }}
              title="Cancel"
            >
              <CancelIcon />
            </IconButton>
          </form>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1.25rem',
            }}
          >
            <div>
              <Typography variant="caption" gutterBottom>
                {translations('page.communities.members.email.label')}
              </Typography>
              <Typography variant="h5" component="h3">
                {member.email ?? 'Unknown Email'}
              </Typography>
            </div>
            {canEdit ? (
              <IconButton
                onClick={() => setEditEmailAddress(true)}
                title="Change Email"
                sx={{ marginLeft: '1rem' }}
              >
                <EditIcon />
              </IconButton>
            ) : null}
          </div>
        )}
        <Lists>
          <ComfortList
            items={member.comfortItems}
            memberId={member.id}
            setNewItems={(cb) => {
              const newComfortListItems = cb(member.comfortItems)

              updateMeberProfile({
                comfortItems: newComfortListItems,
              })
            }}
          />
        </Lists>
      </Profile>
    </Page>
  )
}

const OnlyAuthenticatedCommunityMember = () => {
  const token = useSelector((state: RootState) => state.auth.token)

  if (!token) {
    return null
  }

  return <CommunityMember />
}

export default OnlyAuthenticatedCommunityMember
