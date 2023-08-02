// Bibliothèques externes
import { useEffect, useMemo } from 'react'

// Bibliothèques internes
import { useAddresses } from '@/entities'
import { TOption } from '@/types'
import { AutoCompSelector } from '@/ui'

interface AddressSelectorProps {
  address: TOption
  onSelect: (address: TOption) => void
}

export function AddressSelector({ address, onSelect }: AddressSelectorProps) {
  // stores
  const { addresses, searchedAddresses, loading, getAddresses, searchAddress } = useAddresses()

  // const
  const addr: TOption[] = useMemo(() => {
    const savedAddress = addresses.map((address) => ({ label: address.label, value: address }))
    return [...searchedAddresses, ...savedAddress]
  }, [addresses, searchedAddresses])

  // effects
  useEffect(() => {
    getAddresses()
  }, [])

  return (
    <AutoCompSelector
      options={addr}
      onSelect={onSelect}
      defaultValue={address}
      onSearch={searchAddress}
      loading={loading}
    />
  )
}
