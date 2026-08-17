import { PlantCareItem } from "../types";

export interface GardenerPlantPreset {
  id: string;
  name: string;
  hindiName: string;
  category: "Vegetable" | "Herb" | "Flower" | "Fruit";
  imageEmoji: string;
  image: string;
  sunlight: "Full Sun (6h+)" | "Partial Sun (3-5h)" | "Bright Indirect" | "Partial Shade";
  sunlightIcon: "sun" | "sun-medium" | "sun-dim" | "cloud-sun";
  waterFrequency: string;
  waterIntervalDays: number;
  soilPreference: string;
  potSize: string;
  growthStages: {
    stage: "seedling" | "growing" | "flowering_fruiting" | "harvest_mature";
    label: string;
    description: string;
  }[];
  commonProblems: {
    problem: string;
    cause: string;
    fix: string;
    icon: string;
  }[];
  careTip: string;
}

export const GARDENER_PLANT_PRESETS: GardenerPlantPreset[] = [
  {
    id: "preset-tomato",
    name: "Tomato",
    hindiName: "टमाटर (Cherry / Hybrid)",
    category: "Vegetable",
    imageEmoji: "🍅",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80",
    sunlight: "Full Sun (6h+)",
    sunlightIcon: "sun",
    waterFrequency: "Every 1-2 days (when top 1 inch is dry)",
    waterIntervalDays: 1,
    soilPreference: "Well-draining potting soil with 40% compost",
    potSize: "12-16 inch pot with drainage holes",
    growthStages: [
      { stage: "seedling", label: "Seedling", description: "2-4 true leaves, tender green stem" },
      { stage: "growing", label: "Vegetative Bush", description: "Strong bushy stems, needs staking support" },
      { stage: "flowering_fruiting", label: "Flowering & Fruiting", description: "Yellow blossoms & green tomatoes forming" },
      { stage: "harvest_mature", label: "Harvest Ready", description: "Deep red ripe tomatoes ready to pick" },
    ],
    commonProblems: [
      { problem: "Yellow Lower Leaves", cause: "Overwatering or low nitrogen", fix: "Let soil dry out 1 day; add 1 handful vermicompost", icon: "🍂" },
      { problem: "Curling Leaves", cause: "Heat stress or aphids on undersides", fix: "Move to afternoon shade; spray 5ml neem oil/L water", icon: "🐛" },
      { problem: "Flowers Dropping", cause: "Lack of potassium or excessive heat", fix: "Feed banana peel tea once a week", icon: "🍌" },
    ],
    careTip: "Water at the soil base, avoid wetting leaves to prevent fungal spots.",
  },
  {
    id: "preset-chili",
    name: "Green Chili",
    hindiName: "हरी मिर्च (Jwala Chili)",
    category: "Vegetable",
    imageEmoji: "🌶️",
    image: "https://images.unsplash.com/photo-1588879460618-9249e7d947d1?w=600&auto=format&fit=crop&q=80",
    sunlight: "Full Sun (6h+)",
    sunlightIcon: "sun",
    waterFrequency: "Every 2 days (avoid soggy soil)",
    waterIntervalDays: 2,
    soilPreference: "Sandy loam with 30% vermicompost",
    potSize: "10-12 inch deep pot",
    growthStages: [
      { stage: "seedling", label: "Seedling", description: "Small green shoot with 4 leaves" },
      { stage: "growing", label: "Growing Plant", description: "Branches spreading with dark green leaves" },
      { stage: "flowering_fruiting", label: "Flowering & Pods", description: "Small white starry flowers & green chilies" },
      { stage: "harvest_mature", label: "Harvest Ready", description: "Crisp spicy chilies ready to snip" },
    ],
    commonProblems: [
      { problem: "Leaf Curl (Churda-Murda)", cause: "Thrips or mites", fix: "Spray diluted sour buttermilk (1:9) or neem spray", icon: "🥛" },
      { problem: "Blossoms Falling", cause: "Irregular watering", fix: "Maintain steady moisture; do not let soil go bone dry", icon: "💧" },
      { problem: "Pale Stunted Leaves", cause: "Needs organic feed", fix: "Add 2 spoons bone meal or vermicompost around stem", icon: "🪴" },
    ],
    careTip: "Pinch off the main top shoot when 6 inches tall for bushier flowering.",
  },
  {
    id: "preset-mint",
    name: "Fresh Mint (Pudina)",
    hindiName: "पुदीना (Pudina)",
    category: "Herb",
    imageEmoji: "🌱",
    image: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=600&auto=format&fit=crop&q=80",
    sunlight: "Partial Shade",
    sunlightIcon: "cloud-sun",
    waterFrequency: "Daily (likes moist soil, not waterlogged)",
    waterIntervalDays: 1,
    soilPreference: "Moisture-retaining rich compost mix",
    potSize: "Wide shallow planter / bowl pot (8-10 inch)",
    growthStages: [
      { stage: "seedling", label: "Rooted Cuttings", description: "Fresh sprigs rooting into soil" },
      { stage: "growing", label: "Spreading Runners", description: "Runners spreading across the pot" },
      { stage: "flowering_fruiting", label: "Lush Bush", description: "Dense aromatic green foliage" },
      { stage: "harvest_mature", label: "Harvest Ready", description: "Snip top leaves regularly for chutney & tea" },
    ],
    commonProblems: [
      { problem: "Blackening Stems", cause: "Waterlogged soggy soil", fix: "Ensure drainage holes are unclogged; reduce watering", icon: "⚠️" },
      { problem: "Leggy Pale Stems", cause: "Too dark / insufficient light", fix: "Move to bright window or balcony with 2-3h morning sun", icon: "☀️" },
      { problem: "Root Bound", cause: "Runners crowded", fix: "Trim roots and repot half into fresh compost every 6 months", icon: "✂️" },
    ],
    careTip: "Harvest top leaves frequently — the more you trim, the bushier it grows!",
  },
  {
    id: "preset-tulsi",
    name: "Holy Basil (Tulsi)",
    hindiName: "पवित्र तुलसी (Krishna/Rama Tulsi)",
    category: "Herb",
    imageEmoji: "🌿",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
    sunlight: "Bright Indirect",
    sunlightIcon: "sun-medium",
    waterFrequency: "Every 2 days (check topsoil)",
    waterIntervalDays: 2,
    soilPreference: "Porous garden soil with coarse sand & compost",
    potSize: "10-12 inch terracotta / clay pot",
    growthStages: [
      { stage: "seedling", label: "Young Sapling", description: "Small aromatic pair of leaves" },
      { stage: "growing", label: "Bushy Canopy", description: "Multi-branched aromatic bush" },
      { stage: "flowering_fruiting", label: "Manjari (Flower Spikes)", description: "Purple/green flower spikes forming" },
      { stage: "harvest_mature", label: "Mature Sacred Plant", description: "Full bushy sacred plant with fresh leaves" },
    ],
    commonProblems: [
      { problem: "Drooping Leaves", cause: "Underwatering or dry winter air", fix: "Give gentle drink at base; mist leaves in morning", icon: "💧" },
      { problem: "Black / Brown Leaf Spots", cause: "Fungal humidity issue", fix: "Pinch affected leaves; spray diluted sour curd water", icon: "🥛" },
      { problem: "Plant Becoming Woody", cause: "Flower spikes allowed to seed", fix: "Prune all flower spikes (manjari) immediately", icon: "✂️" },
    ],
    careTip: "Pinch off flower spikes (manjari) as soon as they appear to keep the bush lush.",
  },
  {
    id: "preset-rose",
    name: "Desi Rose (Gulab)",
    hindiName: "देसी गुलाब (Fragrant Rose)",
    category: "Flower",
    imageEmoji: "🌹",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&auto=format&fit=crop&q=80",
    sunlight: "Full Sun (6h+)",
    sunlightIcon: "sun",
    waterFrequency: "Every 2-3 days (deep watering)",
    waterIntervalDays: 2,
    soilPreference: "Rich loamy soil with 50% decomposed cow dung/vermicompost",
    potSize: "12-14 inch deep clay pot",
    growthStages: [
      { stage: "seedling", label: "Pruned Stalk / Cutting", description: "Fresh reddish shoots emerging" },
      { stage: "growing", label: "Leafy Canes", description: "Healthy serrated 5-leaflet foliage" },
      { stage: "flowering_fruiting", label: "Flower Buds", description: "Swollen tight buds ready to open" },
      { stage: "harvest_mature", label: "Full Fragrant Bloom", description: "Fragrant petals open in full glory" },
    ],
    commonProblems: [
      { problem: "Black Spot on Leaves", cause: "Fungal spores from wet foliage", fix: "Prune infected leaves; spray baking soda solution (1 tsp/L)", icon: "🍂" },
      { problem: "No New Blooms", cause: "Lack of potassium & iron", fix: "Bury 1 banana peel & 1 tbsp used tea leaves in soil", icon: "🍌" },
      { problem: "Aphids on Tender Buds", cause: "Sap-sucking pests", fix: "Wash off with gentle water spray or neem oil", icon: "🐛" },
    ],
    careTip: "Add used, rinsed tea leaves around the base for deep fragrant blooms.",
  },
  {
    id: "preset-marigold",
    name: "Marigold (Genda)",
    hindiName: "गेंदा फूल (African/French Genda)",
    category: "Flower",
    imageEmoji: "🌼",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=600&auto=format&fit=crop&q=80",
    sunlight: "Full Sun (6h+)",
    sunlightIcon: "sun",
    waterFrequency: "Every 2 days",
    waterIntervalDays: 2,
    soilPreference: "Standard well-draining garden potting soil",
    potSize: "8-10 inch pot",
    growthStages: [
      { stage: "seedling", label: "Seedling", description: "Fast growing bright green sprouts" },
      { stage: "growing", label: "Vegetative Plant", description: "Feathery aromatic foliage" },
      { stage: "flowering_fruiting", label: "Tight Green Buds", description: "Button-sized buds forming on stems" },
      { stage: "harvest_mature", label: "Golden Blooms", description: "Vibrant yellow/orange flowers blooming" },
    ],
    commonProblems: [
      { problem: "Powdery White Dust", cause: "Powdery mildew in stagnant air", fix: "Move to sunny airy spot; spray diluted milk solution", icon: "🥛" },
      { problem: "Faded Spent Flowers", cause: "Old blooms taking energy", fix: "Deadhead/pinch faded flowers to trigger new buds", icon: "✂️" },
    ],
    careTip: "Great companion plant! Marigold roots naturally repel pests from tomato and chili pots.",
  },
  {
    id: "preset-spinach",
    name: "Spinach (Palak)",
    hindiName: "पालक (Desi Palak)",
    category: "Vegetable",
    imageEmoji: "🥬",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
    sunlight: "Partial Sun (3-5h)",
    sunlightIcon: "sun-medium",
    waterFrequency: "Daily light watering (keep moist)",
    waterIntervalDays: 1,
    soilPreference: "Rich nitrogen compost potting mix",
    potSize: "Wide rectangular shallow tray (6-8 inch deep)",
    growthStages: [
      { stage: "seedling", label: "Sprouts (Day 5)", description: "Tender two-leaf cotyledons" },
      { stage: "growing", label: "Baby Leaves (Day 15)", description: "Crinkled bright green baby spinach" },
      { stage: "flowering_fruiting", label: "Full Canopy (Day 30)", description: "Large broad juicy green leaves" },
      { stage: "harvest_mature", label: "Harvest Ready (Day 35+)", description: "Cut outer leaves, leave center to regrow" },
    ],
    commonProblems: [
      { problem: "Yellowing Leaf Edges", cause: "Overwatering or poor drainage", fix: "Water gently with spray bottle; check drain holes", icon: "💧" },
      { problem: "Holes in Tender Leaves", cause: "Caterpillars or leaf miners", fix: "Handpick pests; spray neem solution in evening", icon: "🐛" },
    ],
    careTip: "Harvest only the outer big leaves — new leaves will keep growing from the center for 4-5 harvests!",
  },
  {
    id: "preset-coriander",
    name: "Coriander (Dhaniya)",
    hindiName: "हरा धनिया (Dhaniya)",
    category: "Herb",
    imageEmoji: "🌿",
    image: "https://images.unsplash.com/photo-1589135233689-d56d11f67f65?w=600&auto=format&fit=crop&q=80",
    sunlight: "Partial Sun (3-5h)",
    sunlightIcon: "sun-medium",
    waterFrequency: "Daily gentle misting",
    waterIntervalDays: 1,
    soilPreference: "Loose airy soil with fine vermicompost",
    potSize: "6-8 inch shallow broad bowl or tray",
    growthStages: [
      { stage: "seedling", label: "Germination (Day 7)", description: "Crushed seeds sprouting green tips" },
      { stage: "growing", label: "Feathery Greens (Day 20)", description: "Soft fragrant cilantro stems growing" },
      { stage: "flowering_fruiting", label: "Lush Forest (Day 35)", description: "Dense green aromatic canopy" },
      { stage: "harvest_mature", label: "Harvest Ready (Day 40+)", description: "Cut with scissors 1 inch above soil level" },
    ],
    commonProblems: [
      { problem: "Bolting (Flowering Early)", cause: "Excessive afternoon heat", fix: "Keep in morning sun only; harvest leaves early", icon: "☀️" },
      { problem: "Damping Off / Rot", cause: "Excessive heavy water pouring", fix: "Use a gentle spray mist bottle instead of pouring mug", icon: "🚿" },
    ],
    careTip: "Gently crush whole coriander seeds into halves before sowing to double the sprout speed.",
  },
  {
    id: "preset-aloe",
    name: "Aloe Vera",
    hindiName: "एलोवेरा (घृतकुमारी)",
    category: "Herb",
    imageEmoji: "🪴",
    image: "https://images.unsplash.com/photo-1567689265664-1c48de61db0b?w=600&auto=format&fit=crop&q=80",
    sunlight: "Bright Indirect",
    sunlightIcon: "sun-medium",
    waterFrequency: "Every 5-7 days (soak and let dry out)",
    waterIntervalDays: 5,
    soilPreference: "Sandy succulent / cactus mix (50% sand & gravel)",
    potSize: "8-10 inch terracotta pot with wide base",
    growthStages: [
      { stage: "seedling", label: "Baby Pup (Offset)", description: "Small offset rooted next to mother plant" },
      { stage: "growing", label: "Fleshy Stems", description: "Thick upright spear-like leaves with soft spines" },
      { stage: "flowering_fruiting", label: "Mature Rosette", description: "Plump gel-filled leaves spreading outward" },
      { stage: "harvest_mature", label: "Harvest Ready", description: "Cut outermost lower leaf at base for pure gel" },
    ],
    commonProblems: [
      { problem: "Brown Mushy Leaves", cause: "Overwatering / soggy roots", fix: "Stop watering immediately; remove rotten roots", icon: "⚠️" },
      { problem: "Reddish / Bronze Color", cause: "Too much harsh afternoon sun", fix: "Move to bright indirect light or morning sun only", icon: "☀️" },
    ],
    careTip: "Strictly avoid overwatering. When in doubt, wait 2 more days before watering.",
  },
  {
    id: "preset-curry",
    name: "Curry Leaves (Kadi Patta)",
    hindiName: "कढ़ी पत्ता (Meetha Neem)",
    category: "Herb",
    imageEmoji: "🍃",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&auto=format&fit=crop&q=80",
    sunlight: "Full Sun (6h+)",
    sunlightIcon: "sun",
    waterFrequency: "Every 2 days (keep soil slightly moist)",
    waterIntervalDays: 2,
    soilPreference: "Slightly acidic potting soil with vermicompost",
    potSize: "12-14 inch deep container",
    growthStages: [
      { stage: "seedling", label: "Sapling", description: "Single stem with delicate aromatic pinnate leaves" },
      { stage: "growing", label: "Branching Stem", description: "Sturdy woody stem forming multiple branches" },
      { stage: "flowering_fruiting", label: "Bushy Treelet", description: "Lush fragrant dark green leaf crown" },
      { stage: "harvest_mature", label: "Harvest Ready", description: "Pluck fresh leaf stalks for seasoning" },
    ],
    commonProblems: [
      { problem: "Pale Yellowish Leaves", cause: "Iron & magnesium deficiency", fix: "Add 1 cup diluted sour buttermilk or 1 tsp Epsom salt", icon: "🥛" },
      { problem: "Mealybugs / Scale Pests", cause: "White sticky bugs on stem nodes", fix: "Wipe with soap water sponge & spray neem oil", icon: "🐛" },
    ],
    careTip: "Pouring 1 cup of diluted sour buttermilk once a month makes leaves dark green and ultra-fragrant.",
  },
  {
    id: "preset-hibiscus",
    name: "Hibiscus (Gudhal)",
    hindiName: "गुड़हल (Red/Pink Gudhal)",
    category: "Flower",
    imageEmoji: "🌺",
    image: "https://images.unsplash.com/photo-1550950158-d0d960dff51b?w=600&auto=format&fit=crop&q=80",
    sunlight: "Full Sun (6h+)",
    sunlightIcon: "sun",
    waterFrequency: "Every 1-2 days (daily in peak summer)",
    waterIntervalDays: 1,
    soilPreference: "Rich organic potting loam with vermicompost",
    potSize: "12-16 inch deep pot",
    growthStages: [
      { stage: "seedling", label: "Rooted Cutting", description: "New green leaf buds pushing through node" },
      { stage: "growing", label: "Leafy Shrub", description: "Glossy dark green scalloped leaves" },
      { stage: "flowering_fruiting", label: "Bud Stage", description: "Large teardrop flower buds forming" },
      { stage: "harvest_mature", label: "Showy Bloom", description: "Spectacular trumpet-shaped petals open" },
    ],
    commonProblems: [
      { problem: "Buds Dropping Before Opening", cause: "Irregular watering or mealybugs", fix: "Keep soil evenly moist; spray neem soap solution", icon: "🐛" },
      { problem: "Yellow Leaf Fall", cause: "Abrupt temperature change", fix: "Keep in steady sunny spot away from harsh AC vents", icon: "🍂" },
    ],
    careTip: "Hibiscus is a heavy feeder — feed 2 handfuls of vermicompost + banana peel tea every 15 days.",
  },
  {
    id: "preset-lemon",
    name: "Potted Lemon (Nimbu)",
    hindiName: "कागज़ी नींबू (Dwarf Pot Lemon)",
    category: "Fruit",
    imageEmoji: "🍋",
    image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&auto=format&fit=crop&q=80",
    sunlight: "Full Sun (6h+)",
    sunlightIcon: "sun",
    waterFrequency: "Every 2-3 days (deep soak, allow drain)",
    waterIntervalDays: 2,
    soilPreference: "Well-draining terracotta mix with sand & vermicompost",
    potSize: "14-18 inch deep planter with multiple drainage holes",
    growthStages: [
      { stage: "seedling", label: "Young Grafted Plant", description: "Sturdy stem with thorny glossy branches" },
      { stage: "growing", label: "Canopy Growth", description: "Aromatic citrus leaves spreading" },
      { stage: "flowering_fruiting", label: "White Fragrant Blossoms", description: "Sweet scented blossoms & tiny green fruitlets" },
      { stage: "harvest_mature", label: "Ripe Juicy Lemons", description: "Plump yellow juicy lemons ready to twist" },
    ],
    commonProblems: [
      { problem: "Yellow Leaves with Green Veins", cause: "Citrus chlorosis (iron deficiency)", fix: "Add 1 tsp Epsom salt + compost to soil", icon: "🍂" },
      { problem: "Tiny Fruits Dropping Off", cause: "Inconsistent watering during fruit set", fix: "Maintain steady watering; do not let rootball dry out completely", icon: "💧" },
      { problem: "Citrus Leaf Miner Lines", cause: "Serpentine silver trails on leaves", fix: "Prune affected shoots; spray neem oil early morning", icon: "🐛" },
    ],
    careTip: "Keep your potted lemon in the sunniest spot of your balcony for maximum juicy fruits!",
  },
];

export const GARDENER_LOCATION_OPTIONS = [
  { id: "Balcony", title: "Balcony", hindiTitle: "बालकनी", iconEmoji: "🏢", desc: "Pots & railing planters" },
  { id: "Terrace", title: "Terrace", hindiTitle: "छत / टेरेस", iconEmoji: "🏡", desc: "Grow bags & larger containers" },
  { id: "Kitchen Garden", title: "Kitchen Garden", hindiTitle: "किचन गार्डन", iconEmoji: "🍳", desc: "Herbs & daily greens" },
  { id: "Pots", title: "Pots & Planters", hindiTitle: "गमले", iconEmoji: "🪴", desc: "Indoor & windowsill pots" },
  { id: "Small Backyard", title: "Small Backyard", hindiTitle: "छोटा बगीचा", iconEmoji: "🌳", desc: "Small ground bed & boundary" },
];

export const GARDENER_EXPERIENCE_OPTIONS = [
  { id: "New to gardening", title: "New to gardening", hindiTitle: "पहली बार गार्डनिंग", iconEmoji: "🌱", desc: "Step-by-step easy guidance" },
  { id: "Some experience", title: "Some experience", hindiTitle: "थोड़ा अनुभव है", iconEmoji: "🌿", desc: "Growing a few home pots" },
  { id: "Experienced", title: "Experienced", hindiTitle: "अनुभवी माली", iconEmoji: "🧑‍🌾", desc: "Seasoned container gardener" },
];

export const GARDENER_DAILY_TIPS = [
  {
    tip: "Finger Moisture Test: Insert your finger 1 inch into the pot soil. If it feels dry, water gently at the base.",
    audioText: "Do the 1 inch finger test. If the top inch feels dry, give a gentle soak at the base.",
    emoji: "💧",
  },
  {
    tip: "Morning Watering: Always water balcony pots between 7:00 AM and 9:00 AM so plants stay hydrated through the sunny day.",
    audioText: "Water your balcony pots in the early morning between 7 and 9 AM for best root absorption.",
    emoji: "☀️",
  },
  {
    tip: "Pinch Flower Spikes on Tulsi: Removing manjari spikes keeps your holy basil bush dense and vibrant.",
    audioText: "Pinch flower spikes on your Tulsi plant to encourage bushy fragrant growth.",
    emoji: "✂️",
  },
  {
    tip: "Banana Peel Potassium Tea: Soak 2 banana peels in water for 48 hours to create a natural flower booster for Roses & Tomatoes.",
    audioText: "Banana peel water is a natural potassium booster for heavy flowering in roses and tomatoes.",
    emoji: "🍌",
  },
  {
    tip: "Rotate Balcony Pots: Rotate your pots 90 degrees every weekend so all sides receive balanced natural sunlight.",
    audioText: "Rotate your pots every weekend so all leaves get equal sunlight.",
    emoji: "🔄",
  },
];

export const GARDENER_WEATHER_TIPS = [
  {
    id: "tip-heat-evap",
    title: "Morning Sun Hydration",
    hindiTitle: "सुबह के समय पानी दें",
    tip: "With temperatures reaching 32°C today, balcony pot soil dries quickly. Water early at the soil base before 9 AM to prevent leaf scorch.",
    hindiTip: "आज तापमान 32°C तक पहुंचेगा, गमलों की मिट्टी जल्दी सूख सकती है। सुबह 9 बजे से पहले पौधों की जड़ों में पानी दें ताकि पत्तियां न झुलसें।",
    emoji: "☀️",
  },
  {
    id: "tip-leaf-mist",
    title: "Afternoon Leaf Protection",
    hindiTitle: "दोपहर में सीधी धूप से बचाव",
    tip: "Move tender leafy pots like Mint and Coriander to bright partial shade during peak afternoon sun (12 PM - 3 PM).",
    hindiTip: "पुदीना और धनिए जैसे नाजुक गमलों को दोपहर 12 से 3 बजे के बीच हल्की छाया वाली जगह रखें।",
    emoji: "🌿",
  },
  {
    id: "tip-mulch",
    title: "Pot Mulching Tip",
    hindiTitle: "मिट्टी में नमी बनाए रखें",
    tip: "Spread a thin layer of dried leaves or coco-peat over topsoil to keep roots cool and reduce moisture loss by 50%.",
    hindiTip: "गमले की मिट्टी के ऊपर सूखे पत्तों या कोकोपीट की हल्की परत बिछाएं, इससे नमी लंबे समय तक बनी रहती है।",
    emoji: "🪴",
  },
];

export const GARDENER_DIY_RECIPES = [
  {
    id: "diy-banana-tea",
    title: "Banana Peel Tea (Potassium Booster)",
    emoji: "🍌",
    category: "Organic Flower Booster",
    target: "For heavy flowering in Roses, Hibiscus & Tomatoes",
    ingredients: "2-3 fresh banana peels + 1 litre clean water",
    recipe: "Chop banana peels into small pieces and soak in 1L water for 48 hours in a closed jar. Strain and pour 100ml per pot once a week.",
    benefit: "Rich in potassium and phosphorus for big fragrant flowers and firm fruits.",
  },
  {
    id: "diy-buttermilk-spray",
    title: "Sour Buttermilk Spray (Natural Fungicide)",
    emoji: "🥛",
    category: "Fungus & Pest Defense",
    target: "For Tulsi leaf spots, Tomato blight & Powdery mildew",
    ingredients: "100ml sour buttermilk/curd + 900ml water",
    recipe: "Mix 1 cup sour curd/buttermilk with 9 cups water. Spray thoroughly on top and undersides of leaves during early morning sunlight.",
    benefit: "Lactic acid bacteria suppress fungal spores naturally without harsh chemicals.",
  },
  {
    id: "diy-eggshell-calcium",
    title: "Crushed Eggshell Powder (Calcium Defense)",
    emoji: "🥚",
    category: "Root & Stem Strength",
    target: "Prevents tomato blossom end rot & strengthens stems",
    ingredients: "4-5 dried clean eggshells",
    recipe: "Rinse eggshells, sun-dry for 1 day, then grind into fine powder. Mix 1-2 tablespoons into the top 2 inches of pot soil.",
    benefit: "Slow-release organic calcium prevents fruit bottom rot and boosts cell wall strength.",
  },
  {
    id: "diy-neem-soap-spray",
    title: "Neem Oil & Liquid Soap Spray",
    emoji: "🍃",
    category: "Home Insect Defense",
    target: "Clears aphids, mealybugs, whiteflies & spider mites",
    ingredients: "5ml pure cold-pressed neem oil + 2 drops mild dish soap + 1L water",
    recipe: "Mix neem oil with soap drops first (emulsifies oil), then shake well in 1L water. Spray 50-100ml on affected leaves in the evening.",
    benefit: "Repels and disrupts pests naturally while keeping balcony plants safe for children and pets.",
  },
  {
    id: "diy-woodash-potassium",
    title: "Wood Ash & Compost Tea",
    emoji: "🪵",
    category: "Alkaline Soil Balance",
    target: "Curry leaves, Chili & Flowering plants",
    ingredients: "1 tablespoon wood ash + 2 handfuls vermicompost",
    recipe: "Sprinkle around the pot perimeter away from direct stem contact. Water thoroughly.",
    benefit: "Adds potash and minerals, deterring snails, slugs, and fungal dampness.",
  },
];
