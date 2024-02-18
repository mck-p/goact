import { ROOT_URL } from './config'

const COMMUNITIES_BASE_URL = `${ROOT_URL}/communities`

export const getProfileAvatarUploadURL = ({
  communityId,
  memberId,
  filename,
  token,
}: {
  communityId: string
  memberId: string
  filename: string
  token: string
}) =>
  fetch(
    `${COMMUNITIES_BASE_URL}/${communityId}/members/${memberId}/profile/avatar/upload-url`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename,
      }),
    },
  ).then((X) => X.json())

export const getProfileAvatarReadURL = ({
  communityId,
  memberId,
  filename,
  token,
}: {
  communityId: string
  memberId: string
  filename: string
  token: string
}) =>
  fetch(
    `${COMMUNITIES_BASE_URL}/${communityId}/members/${memberId}/profile/avatar/read-url`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename,
      }),
    },
  ).then((X) => X.json())
