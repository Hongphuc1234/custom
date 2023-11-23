import { create } from 'zustand'

const useEmailStore = create((set) => ({
    email: '',
    setEmail: (email) => set(() => ({ email }))
}))

export { useEmailStore }