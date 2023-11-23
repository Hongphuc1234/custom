import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useTokenStore = create()(

persist(
    (set) => ({
        token: null,
        setToken: (token) => set(() => ({ token: token }))
    }),
    {
        name: 'token-storage',
    }
)

)

export { useTokenStore }