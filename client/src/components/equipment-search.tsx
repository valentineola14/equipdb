import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

type SearchType = "all" | "id" | "address" | "coordinates";

interface SearchParams {
  query?: string;
  searchType: SearchType;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

interface EquipmentSearchProps {
  onSearch: (params: SearchParams) => void;
  placeholder?: string;
}

export function EquipmentSearch({
  onSearch,
  placeholder = "Search equipment...",
}: EquipmentSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("all");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("10");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (searchType === "coordinates") {
      triggerCoordinateSearch();
    } else {
      onSearch({
        query: value,
        searchType,
      });
    }
  };

  const triggerCoordinateSearch = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius);

    if (!isNaN(lat) && !isNaN(lng)) {
      onSearch({
        searchType: "coordinates",
        latitude: lat,
        longitude: lng,
        radius: isNaN(rad) ? 10 : rad,
      });
    } else {
      onSearch({
        query: "",
        searchType: "coordinates",
      });
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setLatitude("");
    setLongitude("");
    setRadius("10");
    onSearch({
      query: "",
      searchType,
    });
  };

  const handleSearchTypeChange = (type: string) => {
    const newType = type as SearchType;
    setSearchType(newType);
    
    if (newType === "coordinates") {
      triggerCoordinateSearch();
    } else {
      onSearch({
        query: searchQuery,
        searchType: newType,
      });
    }
  };

  return (
    <div className="space-y-3">
      <Tabs value={searchType} onValueChange={handleSearchTypeChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" data-testid="tab-search-all">
            All
          </TabsTrigger>
          <TabsTrigger value="id" data-testid="tab-search-id">
            ID
          </TabsTrigger>
          <TabsTrigger value="address" data-testid="tab-search-address">
            Address
          </TabsTrigger>
          <TabsTrigger value="coordinates" data-testid="tab-search-coordinates">
            Coordinates
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {searchType === "coordinates" ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="latitude" className="text-xs text-muted-foreground">
                Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="40.7128"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                onBlur={triggerCoordinateSearch}
                data-testid="input-latitude"
              />
            </div>
            <div>
              <Label htmlFor="longitude" className="text-xs text-muted-foreground">
                Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="-74.0060"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                onBlur={triggerCoordinateSearch}
                data-testid="input-longitude"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="radius" className="text-xs text-muted-foreground">
              Radius (km)
            </Label>
            <Input
              id="radius"
              type="number"
              step="1"
              min="1"
              placeholder="10"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              onBlur={triggerCoordinateSearch}
              data-testid="input-radius"
            />
          </div>
          {(latitude || longitude) && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleClear}
              data-testid="button-clear-coordinates"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Coordinates
            </Button>
          )}
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-9"
            data-testid="input-equipment-search"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={handleClear}
              data-testid="button-clear-search"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
