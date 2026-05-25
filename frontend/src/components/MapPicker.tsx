'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'

const MapInner = dynamic(() => import('./map-inner'), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] rounded-lg bg-tertiary animate-pulse flex items-center justify-center text-sm text-text-secondary">
      Carregando mapa...
    </div>
  ),
})

export type MapPickerProps = ComponentProps<typeof MapInner>

export default function MapPicker(props: MapPickerProps) {
  return <MapInner {...props} />
}
