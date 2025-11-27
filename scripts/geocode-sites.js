const fs = require('fs');
const https = require('https');

// CSV data with asset counts
const csvData = `Site Name,What3Words Location,Postal Code,Region,Sub-region,Asset Count
Angelinos (Woodstock) WBS,https://what3words.com/instance.headlines.magical,OX20 1ET,Thames Valley,Thames Valley West,3
Arborfield Cross WBS,https://what3words.com/firewall.impulsive.habit,RG2 9PL,Thames Valley,Thames Valley East,2
Upper Arncott WBS,https://what3words.com/strongman.club.sharpens,OX25 1AD,Thames Valley,Thames Valley West,3
Forge Close (Ashendon) WBS,https://what3words.com/maple.searcher.boarding,HP18 0HJ,Thames Valley,Thames Valley East,2
Ashford Common WTW,https://what3words.com/fonts.turns.weep,TW15 1RU,London,North West London,6
Axford WTW,https://what3words.com/attitudes.learn.squirted,SN8 2HA,Thames Valley,Thames Valley West,3
Barrow Hill TWRM Pump Out Shaft,https://what3words.com/words.chart.frosted,NW8,London,Abstraction and Ring Main,1
Battersea WTW,https://what3words.com/ankle.giant.print,SW8 5BX,London,South East London,2
Baunton WTW,https://what3words.com/variously.deciding.purchaser,GL7 7BQ,Thames Valley,Thames Valley West,4
Bayswater (Barton) WBS,https://what3words.com/rapid.smooth.judges,OX3 9RZ,Thames Valley,Thames Valley West,2
Bean C (School Lane) WBS,https://what3words.com/lined.margin.stuck,DA2 8BX,London,South East London,2
Bearwood (Wokingham) RES & WBS,https://what3words.com/sheets.robots.reef,RG41 4SP,Thames Valley,Thames Valley East,3
Bedwyn WTW,https://what3words.com/limitless.pelt.wire,SN8 3JF,Thames Valley,Thames Valley West,3
Beenham WBS,https://what3words.com/divorcing.products.abruptly,RG7 5LS,Thames Valley,Thames Valley East,2
Beggarsbush RES & WBS,https://what3words.com/tributes.doghouse.fixed,OX10 6PX,Thames Valley,Thames Valley East,2
Bourne End WTW,https://what3words.com/prom.square.create,SL8 5NT,Thames Valley,Thames Valley East,9
Bibury Farm RES & WBS,https://what3words.com/ruffling.crumple.ethic,GL7 5PB,Thames Valley,Thames Valley West,3
Bishopsford Road (Morden) WBS,https://w3w.co/alien.curve.skip,SM4 6AX,London,Abstraction and Ring Main,2
Bishopstone WBS,https://what3words.com/return.coach.plausible,HP17 8SL,Thames Valley,Thames Valley East,3
Bishops Green WTW,https://what3words.com/prominent.blank.kebabs,RG20 4HS,Thames Valley,Thames Valley East,4
Bledlow Ridge WBS,https://what3words.com/interview.loom.shallower,HP14 4BN,Thames Valley,Thames Valley East,2
Bletchingdon WBS,https://what3words.com/crabmeat.volcano.dwarves,OX5 3HS,Thames Valley,Thames Valley West,1
Bourton-on-the-Water WBS,https://what3words.com/broached.sandpaper.kingpin,GL54 2HN,Thames Valley,Thames Valley West,2
Bowerdean (High Wycombe) RES & WBS,https://what3words.com/late.apron.lower,HP13 6XS,Thames Valley,Thames Valley East,3
Bowsey Hill (Wargrave) RES & WBS,https://what3words.com/safe.slipped.hurricane,RG10 9XR,Thames Valley,Thames Valley East,2
Bradfield Windmill WTW,https://what3words.com/seagulls.crystal.concerned,RG7 6DE,Thames Valley,Thames Valley East,2
Brands Hatch (Farningham) WBS,https://what3words.com/shock.weeks.blows,DA4 0JT,London,South East London,2
Brightwalton Tower & WBS,https://what3words.com/given.scars.stung,RG20 7DH,Thames Valley,Thames Valley East,2
Brill WBS,https://what3words.com/develops.generals.waged,HP18 9UB,Thames Valley,Thames Valley East,2
Brixton WTW; RES; TWRM Pump Out SFT,https://what3words.com/develops.generals.waged,SW2 1SB,London,South East London,14
Brockhampton WBS,https://what3words.com/cloak.drips.system,GL54 5XL,Thames Valley,Thames Valley West,2
Brookfield Lane (Cheshunt) WBS,https://what3words.com/aura.tame.sparks,EN8 0PS,London,North East London,4
Burghfield RES & Tower & WBS,https://what3words.com/stamp.unable.dish,RG7 3QF,Thames Valley,Thames Valley East,5
Burnt Hill (Yattendon) RES & WBS,https://what3words.com/column.drill.swinging,RG18 0NF,Thames Valley,Thames Valley East,2
Buttermere WBS,https://what3words.com/thinker.expiring.unique,SN8 3RG,Thames Valley,Thames Valley West,3
Chelsfield RES & WBS,https://what3words.com/funded.homes.sing,BR6 7QJ,London,South East London,2
Chigwell WBS,https://what3words.com/action.bound.also,IG7 6NA,London,North East London,3
Chilton WBS,https://what3words.com/mount.ferried.pulses,OX11 0SW,Thames Valley,Thames Valley West,2
Childrey Warren WTW,https://what3words.com/crash.narrating.overtime,OX12 9LU,Thames Valley,Thames Valley West,5
Chingford WTW,https://what3words.com/books.supply.likes,E4 7PX,London,North East London,7
Chivery RES & WBS,https://what3words.com/knitted.backpacks.winded,HP23 6LD,Thames Valley,Thames Valley East,3
Cleeve WTW,https://what3words.com/handy.magnitude.pockets,RG8 0BY,Thames Valley,Thames Valley West,8
Cliveden 2 WBS,https://what3words.com/occupy.bottom.public,SL1 8NE,Thames Valley,Thames Valley East,2
Cliveden Tower & WBS,https://what3words.com/advice.lungs.mole,SL6 0HW,Thames Valley,Thames Valley East,2
Clyffe Pypard WBS,https://what3words.com/installs.range.polished,SN4 7PY,Thames Valley,Thames Valley West,2
Cold Ash RES & WBS,https://what3words.com/receiving.radiates.jetting,RG18 9QQ,Thames Valley,Thames Valley East,2
Apple Pie Hill (Compton) WBS,https://what3words.com/classmate.comedy.scar,RG20 6RD,Thames Valley,Thames Valley East,2
Coppermills WTW,https://what3words.com/rainy.meant.stack,E17 7HE,London,North East London,12
Crayford WTW,https://what3words.com/lands.view.fancy,DA1 3QA,London,South East London,2
Cricklewood RES & WBS,https://what3words.com/yoga.shady.bags,NW2 6XD,London,North East London,4
Crookham RES & WBS,https://what3words.com/huts.bottled.edgy,RG19 8DQ,Thames Valley,Thames Valley East,3
Crystal Palace WBS,https://what3words.com/cakes.fend.lines,SE26 6SW,London,South East London,3
Haileybury RES & WBS,https://what3words.com/snacks.care.twig,SG13 7PT,London,North East London,3
Hambleden WTW,https://what3words.com/talent.gives.texts,RG9 6LU,Thames Valley,Thames Valley East,6
Hampden WTW,https://what3words.com/sadly.business.ombudsman,HP16 9PR,Thames Valley,Thames Valley East,2
Hampton WTW,https://what3words.com/bend.poster.complains,TW12 2ES,London,South West London,2
Hardwick Hill (Banbury) WBS,https://what3words.com/harmonica.organs.estimated,OX16 1SU,Thames Valley,Thames Valley West,2
Harpsden WTW,https://what3words.com/enjoyable.aunts.roving,RG9 3NZ,Thames Valley,Thames Valley East,3
Hayes WBS,https://what3words.com/votes.hoot.valley,BR2 8HN,London,South East London,2
Hedsor RES & WBS,https://what3words.com/improving.little.tulip,HP10 0JP,Thames Valley,Thames Valley East,2
Hempton WBS,https://what3words.com/staining.perused.good,OX15 0UL,Thames Valley,Thames Valley West,1
High Beech (Waltham Abbey) RES & WB,https://what3words.com/teach.solve.earth,IG10 4AE,London,North East London,3
Hill Barn Road (Hazleton) WBS,https://what3words.com/stars.glides.coil,GL54 4DY,Thames Valley,Thames Valley West,2
Holmbury WBS,https://what3words.com/quit.long.spin,RH5 6NS,Thames Valley,Guildford & SWS,2
Hornsey WTW,https://what3words.com/steer.pads.moss,N8 7SL,London,North East London,3
Horton Kirby WTW,https://what3words.com/leaned.teams.vines,DA4 9DA,London,South East London,2
Hungerford WTW & RES,https://what3words.com/notice.subway.variation,RG17 0JX,Thames Valley,Thames Valley East,2
Kangley Bridge WTW,https://what3words.com/decay.other.foal,SE26 5AQ,London,South East London,2
Kempton Park WTW,https://what3words.com/could.melt.bucket,TW13 6XH,London,North West London,5
Kew TWRM Pump Out Shaft,https://what3words.com/suffice.worker.melon,TW8 0EW,London,Abstraction and Ring Main,2
Kilkenny WBS,https://what3words.com/food.quitter.massing,GL54 4LN,Thames Valley,Thames Valley West,2
Kingshill (High Wycombe) WBS,https://what3words.com/rock.wiping.expand,HP13 5AU,Thames Valley,Thames Valley East,2
Kingston Blount WBS,https://what3words.com/ourselves.paces.cowboy,OX39 4RS,Thames Valley,Thames Valley East,2
Knockholt RES & WBS,https://what3words.com/voices.animal.late,TN14 7PJ,London,South East London,2
Lane End (Dartford) WTW,https://what3words.com/driven.boring.mull,DA2 8DH,London,South East London,3
Latton WTW,https://what3words.com/adventure.nozzle.hang,GL7 5QF,Thames Valley,Thames Valley West,6
Long Crendon (Old) WBS,https://what3words.com/companies.giggles.homes,HP18 9AW,Thames Valley,Thames Valley West,3
Leckhampstead WTW,https://what3words.com/habits.terminal.grapevine,RG16 8QT,Thames Valley,Thames Valley East,4
Lewknor WBS,https://what3words.com/baguette.anchors.polite,OX9 5TT,Thames Valley,Thames Valley East,2
Lockwood Shaft Raw Water PS,https://what3words.com/jazz.using.ladder,N17 9NF,London,Abstraction and Ring Main,3
Longlands Farm (Mickleton) WBS,https://what3words.com/agree.asking.swerving,GL55 6LU,Thames Valley,Thames Valley West,2
Lyneham Vastern WBS,https://what3words.com/synthetic.exonerate.keepers,SN4 7PD,Thames Valley,Thames Valley West,2
Merton Abbey WTW; TWRM Pump Out SFT,https://what3words.com/liability.tones.socket,SW19 2EB,London,South East London,6
Mill End Road (High Wycombe) WBS,https://what3words.com/mole.judges.active,HP12 4AZ,Thames Valley,Thames Valley East,2
Milton WBS,https://what3words.com/strikers.typically.wake,OX15 4HG,Thames Valley,Thames Valley West,2
Netley Mill (Shere) WTW,https://what3words.com/sadly.snake.soft,GU5 9HA,Thames Valley,Guildford & SWS,2
Nettlebed B RES & WBS,https://what3words.com/areas.tilting.venturing,RG9 5AU,Thames Valley,Thames Valley West,2
Nineveh (Mickleton) WBS,https://what3words.com/evening.debut.watchdogs,GL55 6PY,Thames Valley,Thames Valley West,2
North Orpington WTW,https://what3words.com/olive.drums.neon,BR5 2BY,London,South East London,7
New River Head WBS,https://what3words.com/juices.tried.credit,EC1R 1XU,London,Abstraction and Ring Main,2
Pangbourne WTW,https://what3words.com/encroach.kick.warrior,RG8 7AY,Thames Valley,Thames Valley East,5
Pann Mill (High Wycombe) WTW,https://what3words.com/party.popped.firm,HP11 1N,Thames Valley,Thames Valley East,2
Pewley (Guildford) RES & WBS,https://what3words.com/crowned.notice.falls,GU1 3PU,Thames Valley,Guildford & SWS,2
Portobello (Lewknor) WBS,https://what3words.com/hoped.unfit.slate,OX49 5RT,Thames Valley,Thames Valley East,2
Preston WBS,https://what3words.com/blank.acrobat.huddling,GL7 5PR,Thames Valley,Thames Valley West,3
Ringsbury Close (Purton) WBS,reading.reverted.sketching,SN5 4DF,Thames Valley,Thames Valley West,3
Radnage WTW,https://what3words.com/landlady.pillow.justifies,HP14 4EQ,Thames Valley,Thames Valley East,3
Rapsgate RES & WBS,https://what3words.com/merely.princes.spruced,GL7 7EN,Thames Valley,Thames Valley West,2
Raynes Park TWRM Shaft & WBS,https://what3words.com/pulse.brush.trunk,SW20 0AX,London,Abstraction and Ring Main,3
Rollright WBS,https://what3words.com/blackouts.sitting.ribs,OX7 5RE,Thames Valley,Thames Valley West,3
Sezincote RES & WBS,https://what3words.com/cages.highlighted.pampering,GL56 9TB,Thames Valley,Thames Valley West,4
Southgate WBS,https://what3words.com/silly.lively.adopt,N14 4AX,London,North East London,4
Sheafhouse (Blockley) WTW,https://what3words.com/campus.plunge.downward,GL56 9DY,Thames Valley,Thames Valley West,4
Sheeplands (Wargrave) WTW,https://what3words.com/rinses.headliner.become,RG10 8DJ,Thames Valley,Thames Valley East,8
Shenington RES,https://what3words.com/modifies.forest.exporters,OX15 6NW,Thames Valley,Thames Valley West,2
Shooters Hill (Plumstead) Tower,https://what3words.com/copper.item.codes,SE18 3DH,London,South East London,3
Sindlesham WBS,https://what3words.com/extra.leave.senior,RG6 3UN,Thames Valley,Thames Valley East,2
Speen WTW,https://what3words.com/corner.films.snacks,RG14 1RT,Thames Valley,Thames Valley East,4
St Leonards (Windsor) RES & WBS,https://what3words.com/calms.fans.snows,SL4 4AP,Thames Valley,Thames Valley East,4
Stockcross WBS,https://what3words.com/taker.keys.brush,RG20 8JU,Thames Valley,Thames Valley East,2
Stokewood (Hedgerley) RES & WBS,https://what3words.com/pure.only.grabs,SL2 4AS,Thames Valley,Thames Valley East,3
Stoke Newington TWRM Pump Out Shaft,https://what3words.com/coach.after.goad,N4,London,Abstraction and Ring Main,6
Stokenchurch RES & WBS,https://what3words.com/upholding.speaker.slipping,HP14 3YN,Thames Valley,Thames Valley East,2
Stowell Park (Northleach) RES & WBS,https://what3words.com/resurgent.crate.primary,GL54 3QG,Thames Valley,Thames Valley West,7
St Peters Hill (Caversham) WBS,https://what3words.com/author.swan.sorters,RG4 7AJ,Thames Valley,Thames Valley East,1
Sunnydown (Guildford) WBS,https://what3words.com/starts.feared.loaf,GU2 7RL,Thames Valley,Guildford & SWS,2
Swanborough (Highworth) WBS,https://what3words.com/outsiders.defected.fingernails,SN6 7RN,Thames Valley,Thames Valley West,3
Swinford WTW,https://what3words.com/paddlers.herbs.remover,OX29 4BZ,Thames Valley,Thames Valley West,5
Syreford (Andoversford) WTW,https://what3words.com/rear.boarding.cosmic,GL54 5SJ,Thames Valley,Thames Valley West,3
Tadley Tower & WBS,https://what3words.com/outdoors.region.doubt,RG7 8LA,Thames Valley,Thames Valley East,2
Tilehurst RES & WBS & Tower,https://what3words.com/sample.third.visual,RG3 5DR,Thames Valley,Thames Valley East,2
Idovers Drive (Toothill) WBS,https://what3words.com/formal.couches.darker,SN5 8DU,Thames Valley,Thames Valley West,3
Toys Hill (Brasted) WBS,https://what3words.com/scarf.cones.stays,TN16 1LR,London,South East London,2
Ufton Nervet WTW,https://what3words.com/tend.squabbles.magnetic,RG7 4HQ,Thames Valley,Thames Valley East,3
Upshire (Waltham Abbey) WBS,https://what3words.com/played.foal.guilty,EN9 1NP,London,North East London,3
Upper Slaughter RES & WBS,https://what3words.com/storybook.data.mailboxes,GL54 2JJ,Thames Valley,Thames Valley West,2
Upper Swell WTW,https://what3words.com/submit.ombudsman.vows,GL54 1EW,Thames Valley,Thames Valley West,4
Wainhill (Chinnor) WBS,https://what3words.com/ownership.overture.twitching,OX39 4AB,Thames Valley,Thames Valley East,2
Waltham Abbey WTW,https://what3words.com/pill.decks.curvy,EN9 1ES,London,North East London,2
Walton-on-Thames WTW,https://what3words.com/crisp.power.punch,KT12 2EG,London,South West London,4
White Barn (Boars Hill) WBS,https://what3words.com/digit.loser.sadly,OX1 5HN,Thames Valley,Thames Valley West,2
Well Hall (Eltham) WBS,https://what3words.com/coins.dust.earth,SE9 6UB,London,South East London,6
Westerham Hill WTW & RES,https://what3words.com/vibe.rare.badge,TN16 2EL,London,South East London,2
Whitefield A RES & WBS,https://what3words.com/sparkles.leaned.dips,SN4 0JF,Thames Valley,Thames Valley West,4
Whiteshoots RES & WBS,https://what3words.com/homelands.replying.unpainted,GL54 2LA,Thames Valley,Thames Valley West,2
Wickham RES & WBS,https://what3words.com/coconuts.tummy.airless,RG20 8PS,Thames Valley,Thames Valley East,2
Wigginton RES & WBS,https://what3words.com/conveying.line.composts,OX15 4LQ,Thames Valley,Thames Valley West,2
Willesden RES & WBS,https://what3words.com/pretty.spell.traps,NW10,London,North East London,2
Witheridge Hill WTW,https://what3words.com/enjoys.enforced.broached,RG9 5PJ,Thames Valley,Thames Valley West,2
Woodcote RES & WBS,https://what3words.com/ramming.mermaids.observers,RG8 0RH,Thames Valley,Thames Valley West,4
West Wickham RES & WBS,https://what3words.com/royal.priced.tree,BR2 6AR,London,South East London,1
Addington Res & WBS,https://what3words.com/test.advice.actors,CR0 5RE,London,South East London,3
Aldbury WBS,https://what3words.com/afflicted.levels.unroll,HP23 5RU,Thames Valley,Thames Valley East,2`;

// Manual coordinates for incomplete postal codes
const manualCoordinates = {
  'N4': { lat: 51.5583, lng: -0.0909 }, // Stoke Newington, Hackney
  'NW8': { lat: 51.5341, lng: -0.1752 }, // St John's Wood
  'NW10': { lat: 51.5362, lng: -0.2417 } // Willesden
};

function parseCSVLine(line) {
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
}

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const sites = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= 5) {
      sites.push({
        name: values[0].trim(),
        w3wUrl: values[1].trim(),
        postalCode: values[2].trim(),
        region: values[3].trim(),
        subRegion: values[4].trim(),
        assetCount: values.length >= 6 ? parseInt(values[5].trim()) || 0 : 0
      });
    }
  }
  return sites;
}

function geocodePostalCode(postalCode) {
  return new Promise((resolve, reject) => {
    // Check manual coordinates first
    if (manualCoordinates[postalCode]) {
      console.log(`Using manual coordinates for ${postalCode}`);
      resolve(manualCoordinates[postalCode]);
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postalCode)}&country=United+Kingdom&format=json&limit=1`;

    https.get(url, {
      headers: {
        'User-Agent': 'ThamesWaterSiteMapper/1.0'
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed && parsed.length > 0) {
            resolve({
              lat: parseFloat(parsed[0].lat),
              lng: parseFloat(parsed[0].lon)
            });
          } else {
            reject(new Error(`Postal code not found: ${postalCode}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processAllSites(sites) {
  const results = [];
  const errors = [];

  for (let i = 0; i < sites.length; i++) {
    const site = sites[i];
    console.log(`[${i + 1}/${sites.length}] Processing: ${site.name} (${site.postalCode})`);

    try {
      const coords = await geocodePostalCode(site.postalCode);
      results.push({ ...site, ...coords });
      console.log(`  ✓ Success: ${coords.lat}, ${coords.lng}`);
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      errors.push({ site: site.name, postalCode: site.postalCode, error: error.message });
    }

    // Rate limiting: wait 1 second between requests to respect Nominatim's usage policy
    if (i < sites.length - 1) {
      await sleep(1000);
    }
  }

  return { results, errors };
}

async function main() {
  console.log('Thames Water Site Geocoding Script');
  console.log('===================================\n');

  const sites = parseCSV(csvData);
  console.log(`Found ${sites.length} sites to geocode\n`);

  const { results, errors } = await processAllSites(sites);

  console.log('\n===================================');
  console.log('Geocoding Complete!');
  console.log(`Successfully geocoded: ${results.length}/${sites.length} sites`);

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    errors.forEach(err => {
      console.log(`  - ${err.site} (${err.postalCode}): ${err.error}`);
    });
  }

  // Save results to JSON file
  const outputPath = './data/site-coordinates.json';
  const dirPath = './data';

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nCoordinates saved to: ${outputPath}`);

  // Also save errors if any
  if (errors.length > 0) {
    const errorPath = './data/geocoding-errors.json';
    fs.writeFileSync(errorPath, JSON.stringify(errors, null, 2));
    console.log(`Errors saved to: ${errorPath}`);
  }
}

main().catch(console.error);
