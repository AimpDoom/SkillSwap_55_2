import type { RequestStatus, SwapRequest } from './types'

import { LOCAL_STORAGE_KEYS } from '@/shared/lib/constants'
import { getStorageItem, setStorageItem } from '@/shared/lib/storage'

const REQUEST_STATUSES: RequestStatus[] = ['pending', 'accepted', 'rejected', 'inProgress', 'done']

function isSwapRequest(value: unknown): value is SwapRequest {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const request = value as Record<string, unknown>

  return (
    typeof request.id === 'string' &&
    typeof request.skillId === 'string' &&
    typeof request.fromUserId === 'string' &&
    typeof request.toUserId === 'string' &&
    typeof request.status === 'string' &&
    REQUEST_STATUSES.includes(request.status as RequestStatus) &&
    typeof request.createdAt === 'string' &&
    typeof request.updatedAt === 'string'
  )
}

export function getSwapRequests(): SwapRequest[] {
  const requests = getStorageItem<unknown>(LOCAL_STORAGE_KEYS.REQUESTS, [])

  return Array.isArray(requests) ? requests.filter(isSwapRequest) : []
}

export function saveSwapRequests(requests: SwapRequest[]): void {
  setStorageItem(LOCAL_STORAGE_KEYS.REQUESTS, requests)
}
