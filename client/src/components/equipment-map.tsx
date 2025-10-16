import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { type Equipment } from "@shared/schema";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { EquipmentStatusBadge } from "./equipment-status-badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom marker icons based on status
const createCustomIcon = (status: string) => {
  const color =
    status.toLowerCase() === "operational"
      ? "#22c55e"
      : status.toLowerCase() === "maintenance"
        ? "#f59e0b"
        : "#ef4444";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

interface EquipmentMapProps {
  equipment: Equipment[];
  selectedEquipment?: Equipment | null;
  onViewDetails: (equipment: Equipment) => void;
  className?: string;
}

function MapController({ selectedEquipment }: { selectedEquipment?: Equipment | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedEquipment) {
      map.flyTo([Number(selectedEquipment.latitude), Number(selectedEquipment.longitude)], 15, {
        duration: 1,
      });
    }
  }, [selectedEquipment, map]);

  return null;
}

export function EquipmentMap({
  equipment,
  selectedEquipment,
  onViewDetails,
  className = "",
}: EquipmentMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.006]);
  const [mapZoom, setMapZoom] = useState(10);

  useEffect(() => {
    if (equipment.length > 0 && !selectedEquipment) {
      const avgLat =
        equipment.reduce((sum, e) => sum + Number(e.latitude), 0) / equipment.length;
      const avgLng =
        equipment.reduce((sum, e) => sum + Number(e.longitude), 0) / equipment.length;
      setMapCenter([avgLat, avgLng]);
    }
  }, [equipment, selectedEquipment]);

  return (
    <div className={`relative ${className}`} data-testid="map-container">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="h-full w-full rounded-md"
        style={{ minHeight: "400px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController selectedEquipment={selectedEquipment} />
        {equipment.map((item) => (
          <Marker
            key={item.id}
            position={[Number(item.latitude), Number(item.longitude)]}
            icon={createCustomIcon(item.status)}
          >
            <Popup>
              <div className="min-w-[200px] space-y-2 p-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {item.equipmentId}
                    </p>
                    <p className="font-semibold">{item.name}</p>
                  </div>
                  <EquipmentStatusBadge status={item.status} />
                </div>
                <div className="space-y-1 text-xs">
                  <p>
                    <span className="font-medium">Type:</span> {item.type}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {item.address}
                  </p>
                  <p className="font-mono text-muted-foreground">
                    {Number(item.latitude).toFixed(4)}, {Number(item.longitude).toFixed(4)}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => onViewDetails(item)}
                  data-testid={`button-popup-view-${item.equipmentId}`}
                >
                  <Eye className="mr-2 h-3 w-3" />
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
