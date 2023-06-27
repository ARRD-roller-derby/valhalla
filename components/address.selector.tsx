import { useAddresses } from '@/entities'
import { TOption } from '@/types'
import { AutoCompSelector } from '@/ui'
import { useEffect, useMemo } from 'react'

interface AddressSelectorProps {
  address: TOption
  onSelect: (address: TOption) => void
}

export function AddressSelector({ address, onSelect }: AddressSelectorProps) {
  const { addresses, searchedAddresses, loading, getAddresses, searchAddress } = useAddresses()

  const addr: TOption[] = useMemo(() => {
    const savedAddress = addresses.map((address) => ({ label: address.label, value: address }))
    return [...searchedAddresses, ...savedAddress]
  }, [addresses, searchedAddresses])

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
