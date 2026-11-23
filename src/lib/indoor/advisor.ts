export interface IndoorAdviceItem {
  id: string;
  category: "low_cost" | "ventilation" | "purifiers" | "household" | "myths";
  title: string;
  summary: string;
  details: string;
  impactScore: "High" | "Medium" | "Essential";
  costLevel: "Free" | "Low-Cost" | "Investment";
  tags: string[];
}

export interface MythFactItem {
  id: string;
  myth: string;
  fact: string;
  explanation: string;
  takeaway: string;
}

export const INDOOR_ADVICE_DATABASE: IndoorAdviceItem[] = [
  // Low-Cost Actions
  {
    id: "low-cost-damp-cleaning",
    category: "low_cost",
    title: "Adopt Wet Mopping & Microfiber Dusting",
    summary:
      "Avoid dry broom sweeping, which kicks settled PM2.5 and PM10 particles back into your family's breathing zone.",
    details:
      "Traditional broom sweeping resuspends up to 80% of settled fine dust particles, keeping them suspended in room air for 4 to 8 hours. Using a damp microfiber cloth or mop binds particles directly, removing them from the floor surface without aerosolizing them.",
    impactScore: "High",
    costLevel: "Free",
    tags: ["Cleaning", "Zero-Cost", "Daily Practice"],
  },
  {
    id: "low-cost-combustion-ban",
    category: "low_cost",
    title: "Eliminate Indoor Combustion (Incense & Coils)",
    summary:
      "A single incense stick or mosquito coil generates dense PM2.5, carbon monoxide, and volatile organic compounds.",
    details:
      "Burning an incense stick in an unventilated room can generate PM2.5 concentrations exceeding 300 µg/m³ within 20 minutes—rivaling severe outdoor smog. Swap mosquito coils for physical mosquito nets, window screens, or liquid vaporizers.",
    impactScore: "Essential",
    costLevel: "Free",
    tags: ["Combustion", "Hazard Prevention", "Family Health"],
  },
  {
    id: "low-cost-cooking-exhaust",
    category: "low_cost",
    title: "Kitchen Exhaust Hood & Cookware Lids",
    summary:
      "Frying and tempering spices release high concentrations of ultrafine oil droplets and combustion soot.",
    details:
      "Always turn on the kitchen chimney or exhaust fan 1 minute before lighting burners, and keep it running for 5 minutes after cooking finishes. Keep pots covered and close interior kitchen doors to stop cooking smoke from permeating bedrooms.",
    impactScore: "High",
    costLevel: "Free",
    tags: ["Kitchen", "Ventilation", "Daily Habit"],
  },

  // Ventilation
  {
    id: "ventilation-timing-rules",
    category: "ventilation",
    title: "Strategic Midday Ventilation Windows",
    summary:
      "Never ventilate during early morning or late night thermal inversions when ground smog is trapped.",
    details:
      "Winter mornings often experience temperature inversion, where cold ground air traps vehicular exhaust and biomass smoke at human height. If ambient AQI drops to moderate or good during midday (typically 12:00 PM – 3:30 PM as solar heating mixes the boundary layer), open opposite windows for 20-30 minutes for a rapid fresh air exchange.",
    impactScore: "High",
    costLevel: "Free",
    tags: ["Windows", "Air Exchange", "Inversion"],
  },
  {
    id: "ventilation-shut-windows-warning",
    category: "ventilation",
    title: "Why Shut Windows Alone Aren't Enough",
    summary:
      "Closing windows reduces outdoor influx, but carbon dioxide (CO2) and indoor pollutants can silently build up.",
    details:
      "In a tightly shut room with multiple occupants, CO2 concentrations can rise from 450 ppm to over 1,500 ppm in 3 hours, causing lethargy, headaches, and impaired cognition. Balancing brief, timed air flushes with active filtration prevents suffocating indoor staleness.",
    impactScore: "Medium",
    costLevel: "Free",
    tags: ["CO2", "Freshness", "Cognitive Health"],
  },

  // Air Purifiers
  {
    id: "purifier-cadr-room-sizing",
    category: "purifiers",
    title: "Match Purifier CADR to Room Volume",
    summary:
      "An undersized air purifier will run constantly at maximum noise without lowering room PM2.5 effectively.",
    details:
      "Look for True HEPA (H13 certified) with a Clean Air Delivery Rate (CADR) that provides at least 4 to 5 Air Changes per Hour (ACH) for your room size. Calculate: Room Area (sq. ft) × Ceiling Height (ft) × 5 ÷ 60 = required CADR (CFM). Keep the purifier 1-2 feet away from walls for 360-degree intake.",
    impactScore: "High",
    costLevel: "Investment",
    tags: ["HEPA", "CADR", "Hardware Guide"],
  },
  {
    id: "purifier-pre-filter-maintenance",
    category: "purifiers",
    title: "Clean Pre-Filters Every 2 Weeks",
    summary:
      "Clogged pre-filters restrict airflow, forcing the fan motor to work harder while trapping fewer fine particles.",
    details:
      "The coarse mesh pre-filter catches pet hair and large dust. Vacuum or wash it bi-weekly so the main HEPA filter can focus solely on micro-particles (PM2.5). Never wash the HEPA filter with water unless the manufacturer specifically designates it as washable, as water destroys electrostatic fibrous charges.",
    impactScore: "Medium",
    costLevel: "Free",
    tags: ["Maintenance", "Filter Life", "Efficiency"],
  },

  // Household Guidance
  {
    id: "household-roadside-gap-sealing",
    category: "household",
    title: "Draft Proofing for Homes Near Busy Roads",
    summary:
      "Ultrafine particles (PM0.1) from diesel exhausts penetrate window tracks and door gaps under negative wind pressure.",
    details:
      "Install self-adhesive rubber weatherstripping foam tape on window frames and silicone bottom sweeps on entrance doors. For road-facing balconies, installing heavy curtains creates an additional particulate buffer barrier.",
    impactScore: "High",
    costLevel: "Low-Cost",
    tags: ["Roadside", "Apartment", "Insulation"],
  },
  {
    id: "household-pediatric-safe-zone",
    category: "household",
    title: "Pediatric Safe Sleep Zone",
    summary:
      "Position infants' and children's cribs and beds away from exterior windows and draft pathways.",
    details:
      "Cold air currents carrying fine particulate infiltration settle near floor level and windowsill drafts. Elevating cribs and keeping sleeping zones near interior walls significantly buffers children from nighttime peak outdoor smog surges.",
    impactScore: "High",
    costLevel: "Free",
    tags: ["Children", "Infants", "Sleep Health"],
  },
];

export const MYTHS_AND_FACTS: MythFactItem[] = [
  {
    id: "myth-plants-clean-rooms",
    myth: "Indoor plants like Snake Plants or Peace Lilies can purify an entire room's air from smog.",
    fact: "Plants cannot filter high ambient PM2.5 or replace mechanical HEPA air filtration.",
    explanation:
      "The famous 1989 NASA Clean Air Study tested plants in tiny, sealed airtight chambers against specific gaseous VOCs over days. In real-world homes with natural air exchange, peer-reviewed environmental studies show you would need between 10 and 100 plants per square meter to equal the air-cleaning capacity of even an entry-level HEPA purifier.",
    takeaway:
      "Keep indoor plants for psychological wellbeing and mild humidity moderation, but rely on HEPA filters or wet cleaning for particulate protection.",
  },
  {
    id: "myth-closed-windows-pure-air",
    myth: "If all my windows and doors are closed, my indoor air is completely safe and clean.",
    fact: "Indoor air can become 2 to 5 times more toxic than outdoor air if domestic sources exist.",
    explanation:
      "Fine particulates (PM2.5) infiltrate through wall seams and window cracks. Furthermore, indoor activities such as cooking oils, gas burner nitrogen dioxide, pet dander, incense, and aerosol sprays stay trapped inside without continuous mechanical filtration or timed ventilation flushes.",
    takeaway:
      "Closed windows reduce outdoor intrusion, but you must actively eliminate indoor combustion sources.",
  },
  {
    id: "myth-ceiling-fan-cleans-air",
    myth: "Running my ceiling fan or table fan cleans the room air.",
    fact: "Fans only circulate air; they do not remove or filter microscopic PM2.5 particles.",
    explanation:
      "Fans produce air currents that blow air across your skin, creating a cooling sensation. However, without a physical dense HEPA filter matrix, fans do not trap sub-micron pollutants. In fact, high-speed ceiling fans often resuspend settled floor dust into the air you breathe.",
    takeaway:
      "Do not rely on regular fans for air purification. If running a fan, keep it at low speed and ensure surfaces have been wet-mopped.",
  },
  {
    id: "myth-cloth-mask-sufficient",
    myth: "A cotton handkerchief or standard surgical mask provides adequate protection against heavy smog.",
    fact: "Surgical and cloth masks allow over 70–80% of fine PM2.5 particulates to pass through.",
    explanation:
      "Surgical masks are designed to catch large exhaled droplets, not microscopic aerosol particles. They also leak substantially around the nose and cheeks. Fine particulate matter (PM2.5) easily bypasses loose cloth weaves. Certified particulate respirators (N95, FFP2, or KF94) with a snug face seal are required to filter particles down to 0.3 microns.",
    takeaway:
      "When AQI exceeds 150, choose an authentic N95 or FFP2 respirator with an adjustable nose clip for real protection.",
  },
  {
    id: "myth-smog-only-harmful-when-visible",
    myth: "Air pollution is only dangerous if you can see a thick grey haze outside.",
    fact: "Harmful concentrations of fine particles and toxic gases can be invisible on sunny days.",
    explanation:
      "PM2.5 particles are approximately 30 times thinner than a single strand of human hair. Even when sunlight appears clear, PM2.5 levels can exceed 100 µg/m³ (multiple times higher than WHO daily guidelines). In addition, ground-level ozone (O3) and carbon monoxide are completely colorless.",
    takeaway:
      "Check measured digital AQI data rather than relying purely on visual estimation through your window.",
  },
];
