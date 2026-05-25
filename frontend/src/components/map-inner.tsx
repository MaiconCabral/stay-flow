'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = defaultIcon

const BRAZIL_CENTER: [number, number] = [-14.235, -51.925]

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function CenterUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  const done = useRef(false)

  useEffect(() => {
    if (!done.current) {
      map.setView([lat, lng], map.getZoom())
      done.current = true
    }
  }, [lat, lng, map])

  return null
}

export default function MapInner({ latitude, longitude, onChange }: {
  latitude: number | null
  longitude: number | null
  onChange: (lat: number, lng: number) => void
}) {
  const hasPosition = latitude !== null && longitude !== null
  const position: [number, number] = hasPosition ? [latitude, longitude] : BRAZIL_CENTER
  const [key, setKey] = useState(0)

  useEffect(() => {
    setKey((k) => k + 1)
  }, [latitude, longitude])

  const handleClick = useCallback((lat: number, lng: number) => {
    onChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)))
  }, [onChange])

  const handleDrag = useCallback((e: L.LeafletEvent) => {
    const marker = e.target as L.Marker
    const pos = marker.getLatLng()
    onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)))
  }, [onChange])

  return (
    <div className="space-y-2">
      <div className="h-[250px] rounded-lg overflow-hidden border border-border">
        <MapContainer
          key={key}
          center={position}
          zoom={hasPosition ? 15 : 4}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onClick={handleClick} />
          {hasPosition && (
            <>
              <CenterUpdater lat={latitude} lng={longitude} />
              <Marker
                position={position}
                draggable={true}
                icon={defaultIcon}
                eventHandlers={{ dragend: handleDrag }}
              />
            </>
          )}
        </MapContainer>
      </div>
      <div className="flex items-center gap-4 text-xs text-text-secondary">
        {hasPosition ? (
          <>
            <span>Lat: <strong className="text-text-primary">{latitude}</strong></span>
            <span>Lng: <strong className="text-text-primary">{longitude}</strong></span>
          </>
        ) : (
          <span>Clique no mapa para definir a localização</span>
        )}
      </div>
    </div>
  )
}
