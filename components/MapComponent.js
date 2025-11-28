import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';

// Import pre-geocoded site coordinates
import siteCoordinates from '../data/site-coordinates.json';

const SUBREGION_COLORS = {
  'Thames Valley West': '#e74c3c',
  'Thames Valley East': '#3498db',
  'South East London': '#2ecc71',
  'North East London': '#9b59b6',
  'North West London': '#f39c12',
  'South West London': '#1abc9c',
  'Abstraction and Ring Main': '#e91e63',
  'Guildford & SWS': '#00bcd4'
};

// Helper component to get map instance
function MapController({ onMapReady }) {
  const map = useMap();

  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
}

// MarkerCluster component
function MarkerClusterGroup({ children, map }) {
  const markerClusterGroupRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    markerClusterGroupRef.current = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true
    });

    map.addLayer(markerClusterGroupRef.current);

    return () => {
      if (markerClusterGroupRef.current) {
        map.removeLayer(markerClusterGroupRef.current);
      }
    };
  }, [map]);

  return null;
}

// Site markers component
function SiteMarkers({ sites, map, onMarkerClick }) {
  const markerClusterGroupRef = useRef(null);

  useEffect(() => {
    if (!map || !sites || sites.length === 0) return;

    if (!markerClusterGroupRef.current) {
      // Optimize clustering for mobile performance
      const isMobile = window.innerWidth < 768;
      markerClusterGroupRef.current = L.markerClusterGroup({
        maxClusterRadius: isMobile ? 80 : 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        disableClusteringAtZoom: isMobile ? 15 : null,
        animate: !isMobile // Disable animations on mobile for better performance
      });
      map.addLayer(markerClusterGroupRef.current);
    }

    markerClusterGroupRef.current.clearLayers();

    sites.forEach(site => {
      const color = SUBREGION_COLORS[site.subRegion] || '#666666';

      const pinSvg = `
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.5 0 0 5.5 0 12.5C0 21.5 12.5 41 12.5 41S25 21.5 25 12.5C25 5.5 19.5 0 12.5 0Z" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="12.5" cy="12.5" r="5" fill="white"/>
        </svg>
      `;

      const icon = L.divIcon({
        className: 'custom-pin-marker',
        html: pinSvg,
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -35]
      });

      const marker = L.marker([site.lat, site.lng], { icon });

      const w3wUrl = site.w3wUrl || '#';
      const assetCount = site.assetCount || 0;

      const popupContent = `
        <div style="min-width: 220px;">
          <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #212529; border-bottom: 2px solid #0066a4; padding-bottom: 5px;">
            ${site.name}
          </div>
          <div style="font-size: 12px; margin-bottom: 4px; color: #495057;">
            <strong>Postal Code:</strong> ${site.postalCode}
          </div>
          <div style="font-size: 12px; margin-bottom: 4px; color: #495057;">
            <strong>Region:</strong> ${site.region}
          </div>
          <div style="font-size: 12px; margin-bottom: 4px; color: #495057;">
            <strong>Sub-region:</strong> ${site.subRegion}
          </div>
          ${assetCount > 0 ? `<div style="font-size: 12px; margin-bottom: 12px; color: #495057;">
            <strong>Assets:</strong> ${assetCount}
          </div>` : '<div style="margin-bottom: 12px;"></div>'}
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <a href="${w3wUrl}" target="_blank" style="display: inline-block; padding: 8px 12px; background: #e11f26; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 500; text-align: center;">
              📍 Precise Location (What3Words)
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onMarkerClick) onMarkerClick(site);
      });

      markerClusterGroupRef.current.addLayer(marker);
    });

    // Fit bounds
    if (markerClusterGroupRef.current.getLayers().length > 0) {
      const bounds = markerClusterGroupRef.current.getBounds();
      map.fitBounds(bounds.pad(0.1));
    }

    return () => {
      if (markerClusterGroupRef.current) {
        markerClusterGroupRef.current.clearLayers();
      }
    };
  }, [sites, map, onMarkerClick]);

  return null;
}

export default function MapComponent() {
  const [allSites, setAllSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [subregionFilter, setSubregionFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Hidden by default on mobile
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Load pre-geocoded coordinates instantly
    setAllSites(siteCoordinates);
    setFilteredSites(siteCoordinates);
    setLoading(false);

    // Show sidebar by default on desktop
    const checkDesktop = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    const filtered = allSites.filter(site => {
      const matchesSearch = !searchTerm || site.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = !regionFilter || site.region === regionFilter;
      const matchesSubregion = !subregionFilter || site.subRegion === subregionFilter;
      return matchesSearch && matchesRegion && matchesSubregion;
    });
    setFilteredSites(filtered);
  }, [searchTerm, regionFilter, subregionFilter, allSites]);

  const regions = [...new Set(allSites.map(s => s.region))];
  const subregions = [...new Set(allSites.map(s => s.subRegion))];

  const handleSiteClick = (site) => {
    if (map) {
      map.setView([site.lat, site.lng], 14);
      // Close sidebar on mobile after clicking a site
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8f9fa',
        fontSize: '18px',
        color: '#495057'
      }}>
        Loading map...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
      {/* Sidebar toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1001,
          background: '#0066a4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '10px 15px',
          cursor: 'pointer',
          fontSize: '18px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div style={{
        width: '350px',
        maxWidth: '85vw',
        height: '100vh',
        background: '#f8f9fa',
        borderRight: '1px solid #dee2e6',
        display: sidebarOpen ? 'flex' : 'none',
        flexDirection: 'column',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1000,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <div style={{
          padding: '15px',
          background: '#0066a4',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '18px', marginBottom: '10px' }}>🗺️ Thames Water Site Locations</h1>
          <input
            type="text"
            placeholder="Search sites by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '14px',
              color: '#495057',
              background: 'white'
            }}
          />
        </div>

        <div style={{
          padding: '10px 15px',
          background: '#e9ecef',
          borderBottom: '1px solid #dee2e6'
        }}>
          <label style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#495057',
            display: 'block',
            marginBottom: '3px'
          }}>Filter by Region:</label>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '13px',
              marginBottom: '8px',
              background: 'white'
            }}
          >
            <option value="">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>

          <label style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#495057',
            display: 'block',
            marginBottom: '3px'
          }}>Filter by Sub-region:</label>
          <select
            value={subregionFilter}
            onChange={(e) => setSubregionFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '13px',
              background: 'white'
            }}
          >
            <option value="">All Sub-regions</option>
            {subregions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{
          padding: '8px 15px',
          background: '#d4edda',
          borderBottom: '1px solid #28a745',
          fontSize: '13px',
          color: '#155724'
        }}>
          Showing {filteredSites.length} of {allSites.length} sites
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 0'
        }}>
          {filteredSites.map((site, idx) => (
            <div
              key={idx}
              onClick={() => handleSiteClick(site)}
              style={{
                padding: '8px 15px',
                fontSize: '12px',
                cursor: 'pointer',
                borderBottom: '1px solid #f1f3f4',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e3f2fd'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ fontWeight: 500, color: '#212529' }}>{site.name}</div>
              <div style={{ fontSize: '11px', color: '#6c757d' }}>{site.postalCode}</div>
            </div>
          ))}
        </div>

        <div style={{
          padding: '10px 15px',
          background: 'white',
          borderTop: '1px solid #dee2e6'
        }}>
          <h3 style={{ fontSize: '12px', marginBottom: '8px', color: '#495057' }}>🎨 Sub-region Colours</h3>
          {Object.entries(SUBREGION_COLORS).map(([name, color]) => (
            <div key={name} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              marginBottom: '4px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: color,
                flexShrink: 0
              }}></div>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '350px' : '0',
        transition: 'margin-left 0.3s',
        touchAction: 'pan-x pan-y'
      }}>
        <MapContainer
          center={[51.5074, -0.5]}
          zoom={9}
          style={{ height: '100%', width: '100%' }}
          preferCanvas={true}
        >
          <MapController onMapReady={(mapInstance) => {
            mapRef.current = mapInstance;
            setMap(mapInstance);
          }} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <SiteMarkers sites={filteredSites} map={map} />
        </MapContainer>
      </div>
    </div>
  );
}
