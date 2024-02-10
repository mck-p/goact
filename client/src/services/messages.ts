import { ROOT_URL } from './config'
import { Message, MessageGroup } from './messages.schema'

const MESSAGES_BASE_URL = `${ROOT_URL}/messages`

export const getMessageForGroup = async (
  groupId: string,
  token: string,
): Promise<Message[]> => {
  const result = await fetch(`${MESSAGES_BASE_URL}/groups/${groupId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return result.json()
}

export const getMessageGroupsForUser = async (
  token: string,
): Promise<MessageGroup[]> => {
  const result = await fetch(`${MESSAGES_BASE_URL}/groups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return result.json()
}
