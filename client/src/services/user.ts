import { ROOT_URL } from './config'

const USER_BASE_URL = `${ROOT_URL}/users`

export const getUserByExternalId = async (id: string, token: string) => {
  const result = await fetch(`${USER_BASE_URL}/external-id/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return result.json()
}
