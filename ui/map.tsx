import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import L from 'leaflet'

interface MapProps {
  readonly lat: number
  readonly lon: number
}

export function Map({ lat, lon }: MapProps) {
  return (
    <div className="relative h-full min-h-[100px] w-full cursor-default overflow-hidden rounded">
      <MapContainer
        center={[lon, lat]}
        zoom={12}
        scrollWheelZoom={true}
        className="absolute bottom-0 left-0 right-0 top-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          position={[lon, lat]}
          icon={L.divIcon({
            iconSize: [20, 20],
            iconAnchor: [20 / 2, 20],
            className: 'map-marker',
            html: "<img src='/icons/marker-black.svg' alt='marker'/>",
          })}
        />
      </MapContainer>
    </div>
  )
}
