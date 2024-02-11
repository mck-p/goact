import { mapDatabaseToWebsocket, sortMessages } from './utils'

describe('mapDatabaseToWebsocket', () => {
  describe('When given a Message from the database', () => {
    it('maps it to the correct shape for Websocket Message', () => {
      const message = {
        message: 'My Message',
        group_id: 'group-123',
        author_id: 'user-123',
        created_at: 'created-123',
        sent_at: 'sent-123',
        _id: 'id-123',
      }

      const result = mapDatabaseToWebsocket(message)
      const expected = {
        action: '@@MESSAGE/RECEIVE',
        payload: {
          message: 'My Message',
          receiverId: 'group-123',
        },
        metadata: {
          authorId: 'user-123',
          receivedAt: 'created-123',
        },
        id: 'id-123',
      }

      expect(result).toEqual(expected)
    })
  })
})

describe('sortMessages', () => {
  describe('When given the first value being received sooner than the second', () => {
    it('returns 1', () => {
      const first = {
        created_at: 1,
      }

      const second = {
        created_at: 2,
      }

      const result = sortMessages(first as any, second as any)
      const expected = -1

      expect(result).toBe(expected)
    })
  })

  describe('When given the first value being received later than the second', () => {
    it('returns -1', () => {
      const first = {
        created_at: 2,
      }

      const second = {
        created_at: 1,
      }

      const result = sortMessages(first as any, second as any)
      const expected = 1

      expect(result).toBe(expected)
    })
  })

  describe('When given the first value being received the same time as the second', () => {
    it('returns 0', () => {
      const first = {
        created_at: 1,
      }

      const second = {
        created_at: 1,
      }

      const result = sortMessages(first as any, second as any)
      const expected = 0

      expect(result).toBe(expected)
    })
  })
})
