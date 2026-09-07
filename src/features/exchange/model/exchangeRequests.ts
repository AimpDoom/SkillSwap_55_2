import type { SwapRequest } from '@/entities/request'
import { getSwapRequests, saveSwapRequests } from '@/entities/request'
import { generateId } from '@/shared/lib/helpers'

type ExchangeRequestParams = {
  fromUserId: string
  toUserId: string
  skillId: string
}

export function hasExchangeRequest({
  fromUserId,
  toUserId,
  skillId,
}: ExchangeRequestParams): boolean {
  return getSwapRequests().some(
    (request) =>
      request.fromUserId === fromUserId &&
      request.toUserId === toUserId &&
      request.skillId === skillId,
  )
}

export function createExchangeRequest({
  fromUserId,
  toUserId,
  skillId,
}: ExchangeRequestParams): SwapRequest | null {
  if (
    hasExchangeRequest({
      fromUserId,
      toUserId,
      skillId,
    })
  ) {
    return null
  }

  const now = new Date().toISOString()

  const request: SwapRequest = {
    id: generateId(),
    skillId,
    fromUserId,
    toUserId,
    status: 'accepted',
    createdAt: now,
    updatedAt: now,
  }

  saveSwapRequests([...getSwapRequests(), request])

  return request
}
