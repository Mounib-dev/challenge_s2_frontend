// auth.spec.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { useAuthStore } from '../src/stores/auth'

const mockAxios = new MockAdapter(axios)

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    mockAxios.reset()
    useAuthStore().clearToken()
  })

  it('should login successfully', async () => {
    const authStore = useAuthStore()

    const credentials = {
      username: 'testuser',
      password: 'testpassword'
    }

    const responseData = {
      token: 'mocked_token'
    }

    mockAxios
      .onPost('https://localhost:3000/api/v1/auth/login', credentials)
      .reply(200, responseData)

    const result = await authStore.login(credentials)

    expect(result).toEqual('Authentication successful, please wait as you will be redirected')
    expect(authStore.token).toEqual('mocked_token')
  })

  it('should handle login error', async () => {
    const authStore = useAuthStore()

    const credentials = {
      username: 'testuser',
      password: 'wrongpassword'
    }

    mockAxios
      .onPost('https://localhost:3000/api/v1/auth/login', credentials)
      .reply(401, { message: 'Unauthorized' })

    const result = await authStore.login(credentials)

    expect(result).toEqual('Unauthorized')
    expect(authStore.token).toEqual('')
  })
})
