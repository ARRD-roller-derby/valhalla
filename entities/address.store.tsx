import { IAddress } from '@/models'
import { TOption } from '@/types'
import { create } from 'zustand'

// TYPES --------------------------------------------------------------------

interface IStateAddresses {
  loading: boolean
  addresses: IAddress[]
  selectedAddress?: IAddress
  searchedAddresses: TOption[]
}

interface IGetAddresses {
  getAddresses: () => Promise<void>
  searchAddress: (search: string) => Promise<void>
}

interface ISetAddresses {}

export type IAddressStore = IStateAddresses & IGetAddresses & ISetAddresses

// STORE --------------------------------------------------------------------

export const useAddresses = create<IAddressStore>((set, get) => ({
  //STATE --------------------------------------------------------------------
  loading: false,
  addresses: [],
  searchedAddresses: [],

  // GETTERS----------------------------------------------------------------
  async getAddresses() {
    set({ loading: true })
    const res = await fetch(`/api/addresses/all`)
    const addresses = await res.json()
    set({ addresses, loading: false })
  },
  async searchAddress(search) {
    const params = new URLSearchParams({ search })
    set({ loading: true })
    const res = await fetch(`/api/addresses/search?${params.toString()}`)
    const resJson = await res.json()
    set({ searchedAddresses: resJson, loading: false })
  },

  // SETTERS----------------------------------------------------------------
}))
