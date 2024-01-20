import openFetch from 'openapi-fetch'
import { definitions } from './api.schema'

export type CreateUserRequest = definitions['server.CreateUserRequest']
export type CreateUserResponse =
  | Promise<definitions['server.SuccessResponse-server_CreateUserResponse']>
  | Promise<definitions['server.ErrorResponse-server_GenericError']>

export type GetRecentMessageResponse = Promise<
  definitions['server.SuccessResponse-server_GetMessageResponse']
>

const URL = 'http://localhost:8080/api/v1'

export const TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN0cmluZyIsImV4cCI6MTcwNTk0ODM2OH0.pdnfUdokzTzUt4QD6FwrTmx58WsCFFPvLUpX3xGtNTE`

export const createUser = (req: CreateUserRequest): CreateUserResponse =>
  fetch(`${URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(req),
  }).then((x) => x.json())
