import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';

// CSV data
const csvData = `Site Name,What3Words Location ,Postal Code,Region,Sub-region
Angelinos (Woodstock) WBS,https://what3words.com/instance.headlines.magical,OX20 1ET,Thames Valley,Thames Valley West
Arborfield Cross WBS,https://what3words.com/firewall.impulsive.habit,RG2 9PL,Thames Valley,Thames Valley East
Upper Arncott WBS,https://what3words.com/strongman.club.sharpens,OX25 1AD,Thames Valley,Thames Valley West
Forge Close (Ashendon) WBS,https://what3words.com/maple.searcher.boarding,HP18 0HJ,Thames Valley,Thames Valley East
Ashford Common WTW,https://what3words.com/fonts.turns.weep,TW15 1RU,London,North West London
Axford WTW,https://what3words.com/attitudes.learn.squirted,SN8 2HA,Thames Valley,Thames Valley West
Barrow Hill TWRM Pump Out Shaft,https://what3words.com/words.chart.frosted,NW8,London,Abstraction and Ring Main
Battersea WTW,https://what3words.com/ankle.giant.print,SW8 5BX,London,South East London
Baunton WTW,https://what3words.com/variously.deciding.purchaser,GL7 7BQ,Thames Valley,Thames Valley West
Bayswater (Barton) WBS,https://what3words.com/rapid.smooth.judges,OX3 9RZ,Thames Valley,Thames Valley West
Bean C (School Lane) WBS,https://what3words.com/lined.margin.stuck,DA2 8BX,London,South East London
Bearwood (Wokingham) RES & WBS,https://what3words.com/sheets.robots.reef,RG41 4SP,Thames Valley,Thames Valley East
Bedwyn WTW,https://what3words.com/limitless.pelt.wire,SN8 3JF,Thames Valley,Thames Valley West
Beenham WBS,https://what3words.com/divorcing.products.abruptly,RG7 5LS,Thames Valley,Thames Valley East
Beggarsbush RES & WBS,https://what3words.com/tributes.doghouse.fixed,OX10 6PX,Thames Valley,Thames Valley East
Bourne End WTW,https://what3words.com/prom.square.create,SL8 5NT,Thames Valley,Thames Valley East
Bibury Farm RES & WBS,https://what3words.com/ruffling.crumple.ethic,GL7 5PB,Thames Valley,Thames Valley West
Bishopsford Road (Morden) WBS,https://w3w.co/alien.curve.skip,SM4 6AX,London,Abstraction and Ring Main
Bishopstone WBS,https://what3words.com/return.coach.plausible,HP17 8SL,Thames Valley,Thames Valley East
Bishops Green WTW,https://what3words.com/prominent.blank.kebabs,RG20 4HS,Thames Valley,Thames Valley East
Bledlow Ridge WBS,https://what3words.com/interview.loom.shallower,HP14 4BN,Thames Valley,Thames Valley East
Bletchingdon WBS,https://what3words.com/crabmeat.volcano.dwarves,OX5 3HS,Thames Valley,Thames Valley West
Bourton-on-the-Water WBS,https://what3words.com/broached.sandpaper.kingpin,GL54 2HN,Thames Valley,Thames Valley West
Bowerdean (High Wycombe) RES & WBS,https://what3words.com/late.apron.lower,HP13 6XS,Thames Valley,Thames Valley East
Bowsey Hill (Wargrave) RES & WBS,https://what3words.com/safe.slipped.hurricane,RG10 9XR,Thames Valley,Thames Valley East
Bradfield Windmill WTW,https://what3words.com/seagulls.crystal.concerned,RG7 6DE,Thames Valley,Thames Valley East
Brands Hatch (Farningham) WBS,https://what3words.com/shock.weeks.blows,DA4 0JT,London,South East London
Brightwalton Tower & WBS,https://what3words.com/given.scars.stung,RG20 7DH,Thames Valley,Thames Valley East
Brill WBS,https://what3words.com/develops.generals.waged,HP18 9UB,Thames Valley,Thames Valley East
Brixton WTW; RES; TWRM Pump Out SFT,https://what3words.com/develops.generals.waged,SW2 1SB,London,South East London
Brockhampton WBS,https://what3words.com/cloak.drips.system,GL54 5XL,Thames Valley,Thames Valley West
Brookfield Lane (Cheshunt) WBS,https://what3words.com/aura.tame.sparks,EN8 0PS,London,North East London
Burghfield RES & Tower & WBS,https://what3words.com/stamp.unable.dish,RG7 3QF,Thames Valley,Thames Valley East
Burnt Hill (Yattendon) RES & WBS,https://what3words.com/column.drill.swinging,RG18 0NF,Thames Valley,Thames Valley East
Buttermere WBS,https://what3words.com/thinker.expiring.unique,SN8 3RG,Thames Valley,Thames Valley West
Chelsfield RES & WBS,https://what3words.com/funded.homes.sing,BR6 7QJ,London,South East London
Chigwell WBS,https://what3words.com/action.bound.also,IG7 6NA,London,North East London
Chilton WBS,https://what3words.com/mount.ferried.pulses,OX11 0SW,Thames Valley,Thames Valley West
Childrey Warren WTW,https://what3words.com/crash.narrating.overtime,OX12 9LU,Thames Valley,Thames Valley West
Chingford WTW,https://what3words.com/books.supply.likes,E4 7PX,London,North East London
Chivery RES & WBS,https://what3words.com/knitted.backpacks.winded,HP23 6LD,Thames Valley,Thames Valley East
Cleeve WTW,https://what3words.com/handy.magnitude.pockets,RG8 0BY,Thames Valley,Thames Valley West
Cliveden 2 WBS,https://what3words.com/occupy.bottom.public,SL1 8NE,Thames Valley,Thames Valley East
Cliveden Tower & WBS,https://what3words.com/advice.lungs.mole,SL6 0HW,Thames Valley,Thames Valley East
Clyffe Pypard WBS,https://what3words.com/installs.range.polished,SN4 7PY,Thames Valley,Thames Valley West
Cold Ash RES & WBS,https://what3words.com/receiving.radiates.jetting,RG18 9QQ,Thames Valley,Thames Valley East
Apple Pie Hill (Compton) WBS,https://what3words.com/classmate.comedy.scar,RG20 6RD,Thames Valley,Thames Valley East
Coppermills WTW,https://what3words.com/rainy.meant.stack,E17 7HE,London,North East London
Crayford WTW,https://what3words.com/lands.view.fancy,DA1 3QA,London,South East London
Cricklewood RES & WBS,https://what3words.com/yoga.shady.bags,NW2 6XD,London,North East London
Crookham RES & WBS,https://what3words.com/huts.bottled.edgy,RG19 8DQ,Thames Valley,Thames Valley East
Crystal Palace WBS,https://what3words.com/cakes.fend.lines,SE26 6SW,London,South East London
Haileybury RES & WBS,https://what3words.com/snacks.care.twig,SG13 7PT,London,North East London
Hambleden WTW,https://what3words.com/talent.gives.texts,RG9 6LU,Thames Valley,Thames Valley East
Hampden WTW,https://what3words.com/sadly.business.ombudsman,HP16 9PR,Thames Valley,Thames Valley East
Hampton WTW,https://what3words.com/bend.poster.complains,TW12 2ES,London,South West London
Hardwick Hill (Banbury) WBS,https://what3words.com/harmonica.organs.estimated,OX16 1SU,Thames Valley,Thames Valley West
Harpsden WTW,https://what3words.com/enjoyable.aunts.roving,RG9 3NZ,Thames Valley,Thames Valley East
Hayes WBS,https://what3words.com/votes.hoot.valley,BR2 8HN,London,South East London
Hedsor RES & WBS,https://what3words.com/improving.little.tulip,HP10 0JP,Thames Valley,Thames Valley East
Hempton WBS,https://what3words.com/staining.perused.good,OX15 0UL,Thames Valley,Thames Valley West
High Beech (Waltham Abbey) RES & WB,https://what3words.com/teach.solve.earth,IG10 4AE,London,North East London
Hill Barn Road (Hazleton) WBS,https://what3words.com/stars.glides.coil,GL54 4DY,Thames Valley,Thames Valley West
Holmbury WBS,https://what3words.com/quit.long.spin,RH5 6NS,Thames Valley,Guildford & SWS
Hornsey WTW,https://what3words.com/steer.pads.moss,N8 7SL,London,North East London
Horton Kirby WTW,https://what3words.com/leaned.teams.vines,DA4 9DA,London,South East London
Hungerford WTW & RES,https://what3words.com/notice.subway.variation,RG17 0JX,Thames Valley,Thames Valley East
Kangley Bridge WTW,https://what3words.com/decay.other.foal,SE26 5AQ,London,South East London
Kempton Park WTW,https://what3words.com/could.melt.bucket,TW13 6XH,London,North West London
Kew TWRM Pump Out Shaft,https://what3words.com/suffice.worker.melon,TW8 0EW,London,Abstraction and Ring Main
Kilkenny WBS,https://what3words.com/food.quitter.massing,GL54 4LN,Thames Valley,Thames Valley West
Kingshill (High Wycombe) WBS,https://what3words.com/rock.wiping.expand,HP13 5AU,Thames Valley,Thames Valley East
Kingston Blount WBS,https://what3words.com/ourselves.paces.cowboy,OX39 4RS,Thames Valley,Thames Valley East
Knockholt RES & WBS,https://what3words.com/voices.animal.late,TN14 7PJ,London,South East London
Lane End (Dartford) WTW,https://what3words.com/driven.boring.mull,DA2 8DH,London,South East London
Latton WTW,https://what3words.com/adventure.nozzle.hang,GL7 5QF,Thames Valley,Thames Valley West
Long Crendon (Old) WBS,https://what3words.com/companies.giggles.homes,HP18 9AW,Thames Valley,Thames Valley West
Leckhampstead WTW,https://what3words.com/habits.terminal.grapevine,RG16 8QT,Thames Valley,Thames Valley East
Lewknor WBS,https://what3words.com/baguette.anchors.polite,OX9 5TT,Thames Valley,Thames Valley East
Lockwood Shaft Raw Water PS,https://what3words.com/jazz.using.ladder,N17 9NF,London,Abstraction and Ring Main
Longlands Farm (Mickleton) WBS,https://what3words.com/agree.asking.swerving,GL55 6LU,Thames Valley,Thames Valley West
Lyneham Vastern WBS,https://what3words.com/synthetic.exonerate.keepers,SN4 7PD,Thames Valley,Thames Valley West
Merton Abbey WTW; TWRM Pump Out SFT,https://what3words.com/liability.tones.socket,SW19 2EB,London,South East London
Mill End Road (High Wycombe) WBS,https://what3words.com/mole.judges.active,HP12 4AZ,Thames Valley,Thames Valley East
Milton WBS,https://what3words.com/strikers.typically.wake,OX15 4HG,Thames Valley,Thames Valley West
Netley Mill (Shere) WTW,https://what3words.com/sadly.snake.soft,GU5 9HA,Thames Valley,Guildford & SWS
Nettlebed B RES & WBS,https://what3words.com/areas.tilting.venturing,RG9 5AU,Thames Valley,Thames Valley West
Nineveh (Mickleton) WBS,https://what3words.com/evening.debut.watchdogs,GL55 6PY,Thames Valley,Thames Valley West
North Orpington WTW,https://what3words.com/olive.drums.neon,BR5 2BY,London,South East London
New River Head WBS,https://what3words.com/juices.tried.credit,EC1R 1XU,London,Abstraction and Ring Main
Pangbourne WTW,https://what3words.com/encroach.kick.warrior,RG8 7AY,Thames Valley,Thames Valley East
Pann Mill (High Wycombe) WTW,https://what3words.com/party.popped.firm,HP11 1N,Thames Valley,Thames Valley East
Pewley (Guildford) RES & WBS,https://what3words.com/crowned.notice.falls,GU1 3PU,Thames Valley,Guildford & SWS
Portobello (Lewknor) WBS,https://what3words.com/hoped.unfit.slate,OX49 5RT,Thames Valley,Thames Valley East
Preston WBS,https://what3words.com/blank.acrobat.huddling,GL7 5PR,Thames Valley,Thames Valley West
Ringsbury Close (Purton) WBS,reading.reverted.sketching,SN5 4DF,Thames Valley,Thames Valley West
Radnage WTW,https://what3words.com/landlady.pillow.justifies,HP14 4EQ,Thames Valley,Thames Valley East
Rapsgate RES & WBS,https://what3words.com/merely.princes.spruced,GL7 7EN,Thames Valley,Thames Valley West
Raynes Park TWRM Shaft & WBS,https://what3words.com/pulse.brush.trunk,SW20 0AX,London,Abstraction and Ring Main
Rollright WBS,https://what3words.com/blackouts.sitting.ribs,OX7 5RE,Thames Valley,Thames Valley West
Sezincote RES & WBS,https://what3words.com/cages.highlighted.pampering,GL56 9TB,Thames Valley,Thames Valley West
Southgate WBS,https://what3words.com/silly.lively.adopt,N14 4AX,London,North East London
Sheafhouse (Blockley) WTW,https://what3words.com/campus.plunge.downward,GL56 9DY,Thames Valley,Thames Valley West
Sheeplands (Wargrave) WTW,https://what3words.com/rinses.headliner.become,RG10 8DJ,Thames Valley,Thames Valley East
Shenington RES,https://what3words.com/modifies.forest.exporters,OX15 6NW,Thames Valley,Thames Valley West
Shooters Hill (Plumstead) Tower,https://what3words.com/copper.item.codes,SE18 3DH,London,South East London
Sindlesham WBS,https://what3words.com/extra.leave.senior,RG6 3UN,Thames Valley,Thames Valley East
Speen WTW,https://what3words.com/corner.films.snacks,RG14 1RT,Thames Valley,Thames Valley East
St Leonards (Windsor) RES & WBS,https://what3words.com/calms.fans.snows,SL4 4AP,Thames Valley,Thames Valley East
Stockcross WBS,https://what3words.com/taker.keys.brush,RG20 8JU,Thames Valley,Thames Valley East
Stokewood (Hedgerley) RES & WBS,https://what3words.com/pure.only.grabs,SL2 4AS,Thames Valley,Thames Valley East
Stoke Newington TWRM Pump Out Shaft,https://what3words.com/coach.after.goad,N4,London,Abstraction and Ring Main
Stokenchurch RES & WBS,https://what3words.com/upholding.speaker.slipping,HP14 3YN,Thames Valley,Thames Valley East
Stowell Park (Northleach) RES & WBS,https://what3words.com/resurgent.crate.primary,GL54 3QG,Thames Valley,Thames Valley West
St Peters Hill (Caversham) WBS,https://what3words.com/author.swan.sorters,RG4 7AJ,Thames Valley,Thames Valley East
Sunnydown (Guildford) WBS,https://what3words.com/starts.feared.loaf,GU2 7RL,Thames Valley,Guildford & SWS
Swanborough (Highworth) WBS,https://what3words.com/outsiders.defected.fingernails,SN6 7RN,Thames Valley,Thames Valley West
Swinford WTW,https://what3words.com/paddlers.herbs.remover,OX29 4BZ,Thames Valley,Thames Valley West
Syreford (Andoversford) WTW,https://what3words.com/rear.boarding.cosmic,GL54 5SJ,Thames Valley,Thames Valley West
Tadley Tower & WBS,https://what3words.com/outdoors.region.doubt,RG7 8LA,Thames Valley,Thames Valley East
Tilehurst RES & WBS & Tower,https://what3words.com/sample.third.visual,RG3 5DR,Thames Valley,Thames Valley East
Idovers Drive (Toothill) WBS,https://what3words.com/formal.couches.darker,SN5 8DU,Thames Valley,Thames Valley West
Toys Hill (Brasted) WBS,https://what3words.com/scarf.cones.stays,TN16 1LR,London,South East London
Ufton Nervet WTW,https://what3words.com/tend.squabbles.magnetic,RG7 4HQ,Thames Valley,Thames Valley East
Upshire (Waltham Abbey) WBS,https://what3words.com/played.foal.guilty,EN9 1NP,London,North East London
Upper Slaughter RES & WBS,https://what3words.com/storybook.data.mailboxes,GL54 2JJ,Thames Valley,Thames Valley West
Upper Swell WTW,https://what3words.com/submit.ombudsman.vows,GL54 1EW,Thames Valley,Thames Valley West
Wainhill (Chinnor) WBS,https://what3words.com/ownership.overture.twitching,OX39 4AB,Thames Valley,Thames Valley East
Waltham Abbey WTW,https://what3words.com/pill.decks.curvy,EN9 1ES,London,North East London
Walton-on-Thames WTW,https://what3words.com/crisp.power.punch,KT12 2EG,London,South West London
White Barn (Boars Hill) WBS,https://what3words.com/digit.loser.sadly,OX1 5HN,Thames Valley,Thames Valley West
Well Hall (Eltham) WBS,https://what3words.com/coins.dust.earth,SE9 6UB,London,South East London
Westerham Hill WTW & RES,https://what3words.com/vibe.rare.badge,TN16 2EL,London,South East London
Whitefield A RES & WBS,https://what3words.com/sparkles.leaned.dips,SN4 0JF,Thames Valley,Thames Valley West
Whiteshoots RES & WBS,https://what3words.com/homelands.replying.unpainted,GL54 2LA,Thames Valley,Thames Valley West
Wickham RES & WBS,https://what3words.com/coconuts.tummy.airless,RG20 8PS,Thames Valley,Thames Valley East
Wigginton RES & WBS,https://what3words.com/conveying.line.composts,OX15 4LQ,Thames Valley,Thames Valley West
Willesden RES & WBS,https://what3words.com/pretty.spell.traps,NW10,London,North East London
Witheridge Hill WTW,https://what3words.com/enjoys.enforced.broached,RG9 5PJ,Thames Valley,Thames Valley West
Woodcote RES & WBS,https://what3words.com/ramming.mermaids.observers,RG8 0RH,Thames Valley,Thames Valley West
West Wickham RES & WBS,https://what3words.com/royal.priced.tree,BR2 6AR,London,South East London
Addington Res & WBS,https://what3words.com/test.advice.actors,CRO 5RE,London,South East London
Aldbury WBS,https://what3words.com/afflicted.levels.unroll,HP23 5RU,Thames Valley,Thames Valley East`;

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

const NOMINATIM_DELAY_MS = 1100;

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
      markerClusterGroupRef.current = L.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
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

      const googleMapsUrl = `https://www.google.com/maps?q=${site.lat},${site.lng}`;
      const w3wUrl = site.w3wUrl || '#';

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
          <div style="font-size: 12px; margin-bottom: 12px; color: #495057;">
            <strong>Sub-region:</strong> ${site.subRegion}
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <a href="${w3wUrl}" target="_blank" style="display: inline-block; padding: 8px 12px; background: #e11f26; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 500; text-align: center;">
              📍 Precise Location (What3Words)
            </a>
            <a href="${googleMapsUrl}" target="_blank" style="display: inline-block; padding: 8px 12px; background: #34a853; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 500; text-align: center;">
              🗺️ Navigate (Google Maps)
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
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [errors, setErrors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [subregionFilter, setSubregionFilter] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mapRef = useRef(null);

  // Parse CSV
  const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    const sites = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length >= 5) {
        sites.push({
          name: values[0].trim(),
          w3wUrl: cleanW3WUrl(values[1].trim()),
          postalCode: values[2].trim(),
          region: values[3].trim(),
          subRegion: values[4].trim()
        });
      }
    }
    return sites;
  };

  const parseCSVLine = (line) => {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    return values;
  };

  const cleanW3WUrl = (url) => {
    if (!url) return null;
    let cleaned = url.trim().replace(/\/+$/, '');

    if (cleaned.startsWith('https://what3words.com/') || cleaned.startsWith('https://w3w.co/')) {
      return cleaned;
    }

    if (cleaned.startsWith('http')) {
      return cleaned;
    }

    const wordsPattern = /^[a-z]+\.[a-z]+\.[a-z]+$/i;
    if (wordsPattern.test(cleaned)) {
      return `https://what3words.com/${cleaned}`;
    }

    const extractPattern = /([a-z]+\.[a-z]+\.[a-z]+)/i;
    const match = cleaned.match(extractPattern);
    if (match) {
      return `https://what3words.com/${match[1]}`;
    }

    return cleaned;
  };

  const geocodePostalCode = async (postalCode) => {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postalCode)}&country=United+Kingdom&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ThamesWaterSiteMapper/1.0'
      }
    });

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }

    throw new Error(`Postal code not found: ${postalCode}`);
  };

  const processAllSites = async (sites) => {
    const total = sites.length;
    const results = [];
    const localErrors = [];

    for (let i = 0; i < sites.length; i++) {
      const site = sites[i];

      try {
        const coords = await geocodePostalCode(site.postalCode);
        results.push({ ...site, ...coords });
      } catch (error) {
        localErrors.push(`${site.name}: ${error.message}`);
      }

      setProgress({ current: i + 1, total });

      if (i < sites.length - 1) {
        await new Promise(resolve => setTimeout(resolve, NOMINATIM_DELAY_MS));
      }
    }

    setErrors(localErrors);
    return results;
  };

  useEffect(() => {
    const loadData = async () => {
      const sites = parseCSV(csvData);
      const processedSites = await processAllSites(sites);
      setAllSites(processedSites);
      setFilteredSites(processedSites);
      setLoading(false);
    };

    loadData();
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
    if (mapRef.current) {
      mapRef.current.setView([site.lat, site.lng], 14);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'rgba(255, 255, 255, 0.95)',
      }}>
        <div style={{ fontSize: '18px', fontWeight: 500, marginBottom: '20px', color: '#495057' }}>
          Loading site locations...
        </div>
        <div style={{
          width: '300px',
          height: '24px',
          background: '#e9ecef',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '10px'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #0066a4, #00a4e4)',
            width: `${progress.total > 0 ? (progress.current / progress.total * 100) : 0}%`,
            transition: 'width 0.3s',
            borderRadius: '12px'
          }}></div>
        </div>
        <div style={{ fontSize: '14px', color: '#6c757d' }}>
          Processing {progress.current} of {progress.total} sites...
        </div>
        {errors.length > 0 && (
          <div style={{
            marginTop: '15px',
            maxWidth: '400px',
            fontSize: '12px',
            color: '#dc3545',
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            <strong>⚠️ {errors.length} site(s) could not be loaded:</strong><br />
            {errors.slice(0, 5).join(', ')}
            {errors.length > 5 && `...and ${errors.length - 5} more`}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>
      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'absolute',
          top: '10px',
          left: sidebarOpen ? '360px' : '10px',
          zIndex: 1001,
          background: '#0066a4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '10px 15px',
          cursor: 'pointer',
          fontSize: '18px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'left 0.3s'
        }}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div style={{
        width: '350px',
        height: '100vh',
        background: '#f8f9fa',
        borderRight: '1px solid #dee2e6',
        display: sidebarOpen ? 'flex' : 'none',
        flexDirection: 'column',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1000,
        overflowY: 'auto'
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
              fontSize: '14px'
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
        transition: 'margin-left 0.3s'
      }}>
        <MapContainer
          center={[51.5074, -0.5]}
          zoom={9}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(map) => { mapRef.current = map; }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <SiteMarkers sites={filteredSites} map={mapRef.current} />
        </MapContainer>
      </div>
    </div>
  );
}
