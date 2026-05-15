import { useState, useEffect, useMemo, useRef } from "react";
import {
  MapPin, Bed, Bath, Users, Wifi, Waves, Flame, Wind, Coffee,
  TreePine, Sun, X, Check, LogIn, LogOut, Lock, ChevronLeft,
  ChevronRight, Menu, Star, Compass, Bike, Anchor, Camera,
  Utensils, ShoppingBag, Mail, Phone, Save, Loader, Trees,
  Sparkles
} from "lucide-react";

// ============================================================
// CONFIG — change ADMIN_PASSWORD here. In a real deployment this
// would live behind a real server with hashed credentials.
// ============================================================
const ADMIN_PASSWORD = "cyrentals2025";
const STORAGE_KEY = "cys-availability-v1";

// ---- Design tokens ----------------------------------------------------
const C = {
  paper:       "#F4ECD8",
  paperWarm:   "#EFE5CD",
  ink:         "#15263A",
  inkSoft:     "#2B3E54",
  cedar:       "#8B6F4E",
  cedarDark:   "#6B5238",
  hydrangea:   "#9FB5D1",
  seafoam:     "#7DA39D",
  rose:        "#C46A4F",
  rust:        "#A85A4A",
  sand:        "#D9C8A4",
  muted:       "#857C68",
  line:        "#CFC2A2",
  forest:      "#445C45",
};

const FONT_DISPLAY = "'Fraunces', 'Cormorant Garamond', Georgia, serif";
const FONT_BODY    = "'Lora', Georgia, serif";
const FONT_UI      = "'Fraunces', Georgia, serif";

// ---- House data --------------------------------------------------------
const HOUSES = [
  {
    id: "madaket",
    name: "Kimberly Way",
    number: "01",
    tagline: "Classic Nantucket 5 bed / 4.5 bath",
    location: "In-town",
    bedrooms: 5,
    bathsLabel: "4 full / 1 half",
    sleeps: 9,
    toBeach: "1 mile",
    toTown: "0.5 miles",
    petFriendly: "No",
    sqft: 4100,
    accent: C.rose,
    blurb:
      "Located in Town, off of a private lane on Kimberly Way. This five bedroom and 4½ bath house boasts over 4,000 square feet of living space on four finished levels. The large grand living room with high coffered ceiling has a gas fireplace; the eat-in kitchen has marble counters and is open to the dining room. Off the kitchen is a TV room, den, and a half bath.",
    blurbExtra: [
      "Second Floor: Primary king bedroom ensuite. Two bedrooms (queen and two twins) share a hall bath (shower). Laundry.",
      "Lower Level: Billiard room, home theater, and wet bar.",
    ],
    history:
      "Built new in 2017 to the highest standards of contemporary shingle-style architecture, with reclaimed barn beams and crushed-oyster paths.",
    amenities: [
      { icon: Waves,    label: "Private beach access" },
      { icon: Anchor,   label: "Kayaks & paddleboards" },
      { icon: Flame,    label: "Outdoor fire pit" },
      { icon: Wifi,     label: "Whole-home WiFi" },
      { icon: Wind,     label: "Central air conditioning" },
      { icon: Sun,      label: "Two outdoor showers" },
      { icon: Coffee,   label: "Pro-grade chef's kitchen" },
      { icon: Star,     label: "Stargazing deck & telescope" },
    ],
  },
  {
    id: "sankaty",
    name: "New Street",
    number: "02",
    tagline: "Beach-Style 4 bed / 3 bath",
    location: "In-town",
    bedrooms: 4,
    bathsLabel: "3 full",
    sleeps: 8,
    toBeach: "0.5 miles",
    toTown: "0.8 miles",
    petFriendly: "No",
    sqft: 3200,
    accent: C.hydrangea,
    blurb:
      "Recently renovated and beautifully refreshed, this charming four-bedroom Cape-style home offers comfortable living spaces and an ideal location close to town, beaches, and area conveniences. A private brick patio framed by lush privet hedges creates a quiet outdoor retreat, complemented by a small garden area perfect for relaxing after a day at the beach.",
    blurbExtra: [
      "The first floor features an open-concept layout with connected living, dining, and kitchen spaces that feel bright and welcoming. Just off the kitchen is a convenient mudroom entry. Also on the main level are a twin bedroom, a queen bedroom, and a full bath with tub-and-shower combination.",
      "Upstairs, the second floor includes two private bedroom suites. One offers twin beds with an ensuite bath featuring a shower, while the spacious king bedroom also includes its own private shower bath.",
      "Additional amenities include a lower-level laundry area, outdoor patio space, and easy access to nearby shuttle bus stops, bike paths, beaches, and Town.",
    ],
    history:
      "Originally built in 1923 as a captain's summer residence, restored down to the wide-plank floors in 2019 with respectful, unflashy taste.",
    amenities: [
      { icon: Waves,    label: "Heated saltwater pool" },
      { icon: Flame,    label: "Wood-burning fireplace" },
      { icon: Wifi,     label: "Whole-home WiFi" },
      { icon: Wind,     label: "Central air conditioning" },
      { icon: Sun,      label: "Outdoor shower" },
      { icon: Coffee,   label: "Chef's kitchen, La Marzocco" },
      { icon: TreePine, label: "Mature hydrangea gardens" },
      { icon: Bike,     label: "Six adult bicycles" },
    ],
  },
  {
    id: "sconset",
    name: "Vestal Street",
    number: "03",
    tagline: "Elegant 5 bed / 4.5 bath",
    location: "Top of Main Street",
    bedrooms: 5,
    bathsLabel: "4 full / 1 half",
    sleeps: 10,
    toBeach: "2 miles",
    toTown: "0.5 miles",
    petFriendly: "No",
    sqft: 4200,
    accent: C.seafoam,
    blurb:
      "Tucked away on a peaceful historic lane just one block from Main Street, this custom-built Colonial offers the perfect blend of charm, comfort, and space. Designed with gatherings and relaxed coastal living in mind, this beautifully maintained rental home features inviting indoor and outdoor living areas, including a spacious sun deck, covered porch, and professionally landscaped yard.",
    blurbExtra: [
      "The first floor welcomes you with a warm living room centered around a fireplace, an open dining area, and a large, thoughtfully designed kitchen. Also on the main level is a generous primary suite with a king bed and private bath featuring both a soaking tub and separate shower. A laundry room, half bath, central air conditioning, attached one-car garage, and brick parking area for two additional vehicles add convenience and functionality. The covered porch includes an outdoor dining table with seating for six, creating an ideal setting for summer entertaining.",
      "Upstairs, the second floor offers an additional living room with TV along with four bedrooms and three full baths. Accommodations include a twin bedroom and a king bedroom sharing a bath with tub/shower, a king suite with its own private shower bath, and a separate twin bedroom with private entrance and ensuite shower bath.",
      "The finished lower level is designed for entertainment, complete with a pool table, ping pong table, and a home theater with seating for nine.",
    ],
    history:
      "One of the original 'fish houses' from the 1870s, lovingly preserved with low ceilings, hand-hewn beams, and a working hearth.",
    amenities: [
      { icon: TreePine, label: "Enclosed cottage garden" },
      { icon: Flame,    label: "Working stone fireplace" },
      { icon: Wifi,     label: "Whole-home WiFi" },
      { icon: Sun,      label: "Outdoor shower" },
      { icon: Bike,     label: "Four village bicycles" },
      { icon: Coffee,   label: "Vintage farmhouse kitchen" },
      { icon: Compass,  label: "Walk to bluff path" },
      { icon: Utensils, label: "Steps to village dining" },
    ],
  },
];

// ============================================================
// SVG ILLUSTRATIONS
// ============================================================

function SankatyArt({ className }) {
  return (
    <svg viewBox="0 0 800 500" className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#E8C9A8"/>
          <stop offset="50%" stopColor="#D9B898"/>
          <stop offset="100%" stopColor="#C7B398"/>
        </linearGradient>
        <linearGradient id="sea1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#5A7A8E"/>
          <stop offset="100%" stopColor="#3B5468"/>
        </linearGradient>
        <linearGradient id="cliff1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8C7250"/>
          <stop offset="100%" stopColor="#6B5238"/>
        </linearGradient>
        <pattern id="shingles1" x="0" y="0" width="14" height="8" patternUnits="userSpaceOnUse">
          <rect width="14" height="8" fill="#A8A095"/>
          <path d="M0 8 L7 4 L14 8" stroke="#857C68" strokeWidth="0.5" fill="none"/>
          <path d="M-7 4 L0 0 L7 4 L14 0 L21 4" stroke="#857C68" strokeWidth="0.5" fill="none"/>
        </pattern>
      </defs>

      {/* Sky */}
      <rect width="800" height="320" fill="url(#sky1)"/>

      {/* Sun */}
      <circle cx="640" cy="120" r="38" fill="#F2D4A0" opacity="0.85"/>
      <circle cx="640" cy="120" r="60" fill="#F2D4A0" opacity="0.25"/>

      {/* Clouds */}
      <ellipse cx="160" cy="90" rx="60" ry="10" fill="#EFE5CD" opacity="0.7"/>
      <ellipse cx="200" cy="110" rx="80" ry="8" fill="#EFE5CD" opacity="0.5"/>
      <ellipse cx="500" cy="70" rx="50" ry="7" fill="#EFE5CD" opacity="0.6"/>

      {/* Distant ocean */}
      <rect y="280" width="800" height="80" fill="url(#sea1)"/>
      <path d="M0 295 Q 100 290 200 295 T 400 295 T 600 295 T 800 295" stroke="#7B98A8" strokeWidth="0.8" fill="none" opacity="0.6"/>
      <path d="M0 310 Q 150 305 300 310 T 600 310 T 800 310" stroke="#7B98A8" strokeWidth="0.8" fill="none" opacity="0.5"/>

      {/* Lighthouse */}
      <g transform="translate(700, 200)">
        <rect x="-12" y="0" width="24" height="80" fill="#F4ECD8"/>
        <rect x="-12" y="20" width="24" height="14" fill="#C46A4F"/>
        <rect x="-12" y="48" width="24" height="14" fill="#C46A4F"/>
        <rect x="-14" y="-10" width="28" height="10" fill="#1A2A3A"/>
        <polygon points="-14,-10 14,-10 0,-22" fill="#1A2A3A"/>
        <rect x="-2" y="-22" width="4" height="6" fill="#1A2A3A"/>
      </g>

      {/* Cliff */}
      <path d="M0 360 L 800 360 L 800 500 L 0 500 Z" fill="url(#cliff1)"/>
      <path d="M0 360 Q 100 355 200 362 T 400 360 T 600 358 T 800 362 L 800 380 L 0 380 Z" fill="#9C7E5A"/>

      {/* House — shingled cottage with widow's walk */}
      <g transform="translate(180, 230)">
        {/* Body */}
        <rect x="0" y="40" width="260" height="120" fill="url(#shingles1)"/>
        {/* Roof */}
        <polygon points="-10,40 270,40 240,0 20,0" fill="#3D4A55"/>
        <polygon points="20,0 240,0 130,-40" fill="#3D4A55"/>
        {/* Widow's walk */}
        <rect x="100" y="-42" width="60" height="2" fill="#15263A"/>
        <line x1="105" y1="-42" x2="105" y2="-48" stroke="#15263A" strokeWidth="1"/>
        <line x1="115" y1="-42" x2="115" y2="-48" stroke="#15263A" strokeWidth="1"/>
        <line x1="125" y1="-42" x2="125" y2="-48" stroke="#15263A" strokeWidth="1"/>
        <line x1="135" y1="-42" x2="135" y2="-48" stroke="#15263A" strokeWidth="1"/>
        <line x1="145" y1="-42" x2="145" y2="-48" stroke="#15263A" strokeWidth="1"/>
        <line x1="155" y1="-42" x2="155" y2="-48" stroke="#15263A" strokeWidth="1"/>
        {/* Chimney */}
        <rect x="60" y="-25" width="14" height="35" fill="#A85A4A"/>
        {/* Windows */}
        <rect x="20" y="60" width="32" height="40" fill="#F4ECD8" stroke="#15263A" strokeWidth="2"/>
        <line x1="36" y1="60" x2="36" y2="100" stroke="#15263A" strokeWidth="1"/>
        <line x1="20" y1="80" x2="52" y2="80" stroke="#15263A" strokeWidth="1"/>

        <rect x="75" y="60" width="32" height="40" fill="#F4ECD8" stroke="#15263A" strokeWidth="2"/>
        <line x1="91" y1="60" x2="91" y2="100" stroke="#15263A" strokeWidth="1"/>
        <line x1="75" y1="80" x2="107" y2="80" stroke="#15263A" strokeWidth="1"/>

        <rect x="153" y="60" width="32" height="40" fill="#F4ECD8" stroke="#15263A" strokeWidth="2"/>
        <line x1="169" y1="60" x2="169" y2="100" stroke="#15263A" strokeWidth="1"/>
        <line x1="153" y1="80" x2="185" y2="80" stroke="#15263A" strokeWidth="1"/>

        <rect x="208" y="60" width="32" height="40" fill="#F4ECD8" stroke="#15263A" strokeWidth="2"/>
        <line x1="224" y1="60" x2="224" y2="100" stroke="#15263A" strokeWidth="1"/>
        <line x1="208" y1="80" x2="240" y2="80" stroke="#15263A" strokeWidth="1"/>

        {/* Door */}
        <rect x="118" y="110" width="24" height="50" fill="#15263A"/>
        <circle cx="137" cy="135" r="1.5" fill="#D9B898"/>
        {/* Porch posts */}
        <rect x="0" y="155" width="260" height="5" fill="#F4ECD8"/>
      </g>

      {/* Hydrangea bushes */}
      <g transform="translate(80, 390)">
        {[0, 20, 35, 50, 65, 80, 95].map((x, i) => (
          <g key={i} transform={`translate(${x}, ${i % 2 ? 0 : -6})`}>
            <circle r="14" fill="#7D9CB8" opacity="0.85"/>
            <circle cx="-4" cy="-3" r="3" fill="#9FB5D1"/>
            <circle cx="4" cy="-2" r="3" fill="#9FB5D1"/>
            <circle cx="0" cy="3" r="3" fill="#9FB5D1"/>
            <circle cx="-5" cy="4" r="2.5" fill="#B5C5D8"/>
            <circle cx="5" cy="3" r="2.5" fill="#B5C5D8"/>
          </g>
        ))}
      </g>
      <g transform="translate(490, 400)">
        {[0, 18, 33, 48, 63, 78].map((x, i) => (
          <g key={i} transform={`translate(${x}, ${i % 2 ? -4 : 0})`}>
            <circle r="13" fill="#7D9CB8" opacity="0.85"/>
            <circle cx="-3" cy="-3" r="3" fill="#9FB5D1"/>
            <circle cx="4" cy="-2" r="3" fill="#9FB5D1"/>
            <circle cx="0" cy="3" r="3" fill="#9FB5D1"/>
          </g>
        ))}
      </g>

      {/* Dune grass tufts */}
      {[40, 280, 320, 470, 600, 640, 680, 740].map((x, i) => (
        <g key={i} transform={`translate(${x}, 440)`}>
          <line x1="0" y1="0" x2="-3" y2="-15" stroke="#7B9B7E" strokeWidth="1"/>
          <line x1="0" y1="0" x2="0" y2="-18" stroke="#7B9B7E" strokeWidth="1"/>
          <line x1="0" y1="0" x2="3" y2="-14" stroke="#7B9B7E" strokeWidth="1"/>
        </g>
      ))}
    </svg>
  );
}

function MadaketArt({ className }) {
  return (
    <svg viewBox="0 0 800 500" className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="#5A4868"/>
          <stop offset="35%" stopColor="#C97A5F"/>
          <stop offset="70%" stopColor="#E8A878"/>
          <stop offset="100%" stopColor="#F2D4A0"/>
        </linearGradient>
        <linearGradient id="sea2" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#9C7E68"/>
          <stop offset="40%" stopColor="#7A6A78"/>
          <stop offset="100%" stopColor="#3D4A55"/>
        </linearGradient>
        <radialGradient id="sun2" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FBE4B0"/>
          <stop offset="60%" stopColor="#F2C684"/>
          <stop offset="100%" stopColor="#E8A878" stopOpacity="0"/>
        </radialGradient>
        <pattern id="shingles2" x="0" y="0" width="14" height="8" patternUnits="userSpaceOnUse">
          <rect width="14" height="8" fill="#9C9286"/>
          <path d="M0 8 L7 4 L14 8" stroke="#6B6356" strokeWidth="0.5" fill="none"/>
          <path d="M-7 4 L0 0 L7 4 L14 0 L21 4" stroke="#6B6356" strokeWidth="0.5" fill="none"/>
        </pattern>
      </defs>

      {/* Sky */}
      <rect width="800" height="290" fill="url(#sky2)"/>

      {/* Sun glow */}
      <rect x="380" y="180" width="240" height="240" fill="url(#sun2)" opacity="0.9"/>
      <circle cx="500" cy="240" r="32" fill="#FBE4B0"/>

      {/* Distant clouds */}
      <ellipse cx="120" cy="80" rx="80" ry="6" fill="#E8C9A8" opacity="0.6"/>
      <ellipse cx="700" cy="60" rx="70" ry="5" fill="#E8C9A8" opacity="0.6"/>
      <ellipse cx="250" cy="120" rx="100" ry="4" fill="#5A4868" opacity="0.3"/>

      {/* Ocean */}
      <rect y="240" width="800" height="180" fill="url(#sea2)"/>
      {/* Sun reflection on water */}
      <ellipse cx="500" cy="260" rx="80" ry="6" fill="#F2C684" opacity="0.85"/>
      <ellipse cx="500" cy="280" rx="60" ry="4" fill="#F2C684" opacity="0.7"/>
      <ellipse cx="500" cy="300" rx="40" ry="3" fill="#F2C684" opacity="0.55"/>
      <ellipse cx="500" cy="320" rx="25" ry="2" fill="#F2C684" opacity="0.4"/>

      {/* Wave lines */}
      <path d="M0 260 Q 100 256 200 260 T 400 260 T 600 260 T 800 260" stroke="#C97A5F" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <path d="M0 300 Q 150 295 300 300 T 600 300 T 800 300" stroke="#7A6A78" strokeWidth="0.8" fill="none" opacity="0.5"/>
      <path d="M0 340 Q 120 335 240 340 T 480 340 T 800 340" stroke="#7A6A78" strokeWidth="0.8" fill="none" opacity="0.5"/>

      {/* Sand beach */}
      <path d="M0 380 Q 200 370 400 378 T 800 380 L 800 500 L 0 500 Z" fill="#D9C8A4"/>
      <path d="M0 395 Q 150 390 300 395 T 600 395 T 800 395" stroke="#C7B58A" strokeWidth="0.8" fill="none" opacity="0.6"/>

      {/* Modern shingle house — set right */}
      <g transform="translate(440, 180)">
        {/* Main body */}
        <rect x="0" y="60" width="280" height="160" fill="url(#shingles2)"/>
        {/* Pitched roof */}
        <polygon points="-10,60 290,60 280,20 0,20" fill="#3D4A55"/>
        <polygon points="0,20 280,20 200,-15 80,-15" fill="#3D4A55"/>
        {/* Chimney */}
        <rect x="200" y="-5" width="14" height="30" fill="#A85A4A"/>
        {/* Big picture windows reflecting sunset */}
        <rect x="20" y="80" width="70" height="80" fill="#E8A878" opacity="0.9" stroke="#15263A" strokeWidth="2"/>
        <line x1="55" y1="80" x2="55" y2="160" stroke="#15263A" strokeWidth="1"/>
        <line x1="20" y1="120" x2="90" y2="120" stroke="#15263A" strokeWidth="1"/>

        <rect x="110" y="80" width="70" height="80" fill="#E8A878" opacity="0.9" stroke="#15263A" strokeWidth="2"/>
        <line x1="145" y1="80" x2="145" y2="160" stroke="#15263A" strokeWidth="1"/>
        <line x1="110" y1="120" x2="180" y2="120" stroke="#15263A" strokeWidth="1"/>

        <rect x="200" y="80" width="70" height="80" fill="#E8A878" opacity="0.9" stroke="#15263A" strokeWidth="2"/>
        <line x1="235" y1="80" x2="235" y2="160" stroke="#15263A" strokeWidth="1"/>
        <line x1="200" y1="120" x2="270" y2="120" stroke="#15263A" strokeWidth="1"/>

        {/* Lower deck */}
        <rect x="-20" y="180" width="320" height="40" fill="#8B6F4E"/>
        <rect x="-20" y="180" width="320" height="4" fill="#6B5238"/>
        {/* Deck rails */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270].map((x) => (
          <line key={x} x1={x - 20} y1="180" x2={x - 20} y2="195" stroke="#6B5238" strokeWidth="1.5"/>
        ))}
        {/* Door */}
        <rect x="125" y="170" width="30" height="50" fill="#15263A"/>
      </g>

      {/* Boardwalk to beach */}
      <g transform="translate(360, 380)">
        <path d="M0 0 L 80 30 L 100 30 L 20 0 Z" fill="#8B6F4E"/>
        {[0, 15, 30, 45, 60].map((y) => (
          <line key={y} x1={y * 0.3} y1={y * 0.4} x2={y * 0.3 + 20} y2={y * 0.4 + 6} stroke="#6B5238" strokeWidth="0.8"/>
        ))}
      </g>

      {/* Dune grass */}
      {[40, 80, 110, 140, 180, 220, 260, 300, 340, 720, 760, 80, 600, 650].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${390 + (i % 3) * 5})`}>
          <line x1="0" y1="0" x2="-4" y2="-18" stroke="#7B9B7E" strokeWidth="1"/>
          <line x1="0" y1="0" x2="0" y2="-22" stroke="#7B9B7E" strokeWidth="1"/>
          <line x1="0" y1="0" x2="4" y2="-17" stroke="#7B9B7E" strokeWidth="1"/>
          <line x1="0" y1="0" x2="6" y2="-12" stroke="#7B9B7E" strokeWidth="0.8"/>
        </g>
      ))}

      {/* Distant sailboat */}
      <g transform="translate(150, 290)">
        <polygon points="0,0 0,-20 12,0" fill="#F4ECD8"/>
        <polygon points="0,0 0,-18 -10,0" fill="#F4ECD8"/>
        <line x1="0" y1="0" x2="0" y2="-22" stroke="#15263A" strokeWidth="0.8"/>
        <path d="M-10 0 Q 0 5 12 0" stroke="#15263A" strokeWidth="1.5" fill="#15263A"/>
      </g>
    </svg>
  );
}

function SconsetArt({ className }) {
  return (
    <svg viewBox="0 0 800 500" className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky3" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#A8C0D6"/>
          <stop offset="100%" stopColor="#D4DDE5"/>
        </linearGradient>
        <pattern id="shingles3" x="0" y="0" width="12" height="7" patternUnits="userSpaceOnUse">
          <rect width="12" height="7" fill="#B8AEA0"/>
          <path d="M0 7 L6 3.5 L12 7" stroke="#857C68" strokeWidth="0.4" fill="none"/>
          <path d="M-6 3.5 L0 0 L6 3.5 L12 0 L18 3.5" stroke="#857C68" strokeWidth="0.4" fill="none"/>
        </pattern>
        <linearGradient id="grass3" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7B9B7E"/>
          <stop offset="100%" stopColor="#5C7960"/>
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="380" fill="url(#sky3)"/>

      {/* Soft clouds */}
      <ellipse cx="120" cy="80" rx="60" ry="14" fill="#F4ECD8" opacity="0.85"/>
      <ellipse cx="80" cy="90" rx="40" ry="10" fill="#F4ECD8" opacity="0.85"/>
      <ellipse cx="160" cy="90" rx="35" ry="8" fill="#F4ECD8" opacity="0.85"/>

      <ellipse cx="640" cy="110" rx="80" ry="12" fill="#F4ECD8" opacity="0.7"/>
      <ellipse cx="690" cy="120" rx="40" ry="8" fill="#F4ECD8" opacity="0.7"/>

      {/* Sun behind a cloud */}
      <circle cx="500" cy="100" r="30" fill="#F2D4A0" opacity="0.6"/>

      {/* Lawn */}
      <rect y="350" width="800" height="150" fill="url(#grass3)"/>

      {/* Stone path */}
      <g transform="translate(380, 460)">
        <ellipse cx="0" cy="0" rx="35" ry="10" fill="#A89C82"/>
        <ellipse cx="-15" cy="-20" rx="32" ry="9" fill="#A89C82"/>
        <ellipse cx="15" cy="-40" rx="34" ry="9" fill="#A89C82"/>
        <ellipse cx="-5" cy="-58" rx="30" ry="8" fill="#A89C82"/>
        <ellipse cx="10" cy="-76" rx="28" ry="7" fill="#A89C82"/>
      </g>

      {/* Cottage — small with steeply pitched roof */}
      <g transform="translate(280, 220)">
        {/* Body */}
        <rect x="0" y="60" width="220" height="100" fill="url(#shingles3)"/>
        {/* Steep gable roof */}
        <polygon points="-10,60 230,60 220,10 0,10" fill="#2B3540"/>
        <polygon points="0,10 220,10 110,-40" fill="#2B3540"/>
        {/* Chimney */}
        <rect x="160" y="-15" width="12" height="30" fill="#A85A4A"/>
        {/* Climbing rose vines on left wall */}
        <path d="M5 60 Q 15 50 8 35 Q 20 25 12 10" stroke="#445C45" strokeWidth="1.5" fill="none"/>
        <path d="M15 70 Q 25 55 18 40 Q 30 30 22 15" stroke="#445C45" strokeWidth="1.5" fill="none"/>
        {/* Roses */}
        {[
          [8, 55], [14, 45], [6, 35], [18, 30], [10, 20], [22, 18], [14, 8],
          [28, 50], [32, 35], [38, 25], [24, 65], [30, 70], [40, 50],
          [12, 70], [18, 80], [8, 90], [22, 95], [14, 110], [30, 100]
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3.5" fill="#C46A4F"/>
            <circle cx={x - 1} cy={y - 1} r="1.2" fill="#E89880"/>
          </g>
        ))}
        {/* Leaves */}
        {[[10, 50, -10], [20, 35, 10], [25, 60, -15], [16, 25, 5], [35, 45, 10], [12, 80, -10]].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="2.5" ry="1.5" fill="#445C45" transform={`rotate(${r} ${x} ${y})`}/>
        ))}

        {/* Windows */}
        <rect x="65" y="80" width="30" height="40" fill="#F4ECD8" stroke="#2B3540" strokeWidth="2"/>
        <line x1="80" y1="80" x2="80" y2="120" stroke="#2B3540" strokeWidth="1"/>
        <line x1="65" y1="100" x2="95" y2="100" stroke="#2B3540" strokeWidth="1"/>
        {/* Window shutters */}
        <rect x="55" y="80" width="8" height="40" fill="#445C45"/>
        <rect x="97" y="80" width="8" height="40" fill="#445C45"/>

        <rect x="145" y="80" width="30" height="40" fill="#F4ECD8" stroke="#2B3540" strokeWidth="2"/>
        <line x1="160" y1="80" x2="160" y2="120" stroke="#2B3540" strokeWidth="1"/>
        <line x1="145" y1="100" x2="175" y2="100" stroke="#2B3540" strokeWidth="1"/>
        <rect x="135" y="80" width="8" height="40" fill="#445C45"/>
        <rect x="177" y="80" width="8" height="40" fill="#445C45"/>

        {/* Door */}
        <rect x="105" y="115" width="30" height="45" fill="#445C45"/>
        <rect x="105" y="115" width="30" height="6" fill="#2B3540"/>
        <circle cx="129" cy="138" r="1.5" fill="#D9B898"/>
        {/* Small awning */}
        <polygon points="100,115 140,115 145,110 95,110" fill="#2B3540"/>
      </g>

      {/* White picket fence */}
      <g transform="translate(0, 410)">
        {Array.from({ length: 28 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 30}, 0)`}>
            <rect x="0" y="0" width="6" height="32" fill="#F4ECD8"/>
            <polygon points="0,0 3,-5 6,0" fill="#F4ECD8"/>
          </g>
        ))}
        <line x1="0" y1="10" x2="800" y2="10" stroke="#F4ECD8" strokeWidth="2"/>
        <line x1="0" y1="26" x2="800" y2="26" stroke="#F4ECD8" strokeWidth="2"/>
      </g>

      {/* Garden flowers — hydrangeas and lavender in foreground */}
      <g transform="translate(120, 440)">
        {[0, 22, 40, 58, 76].map((x, i) => (
          <g key={i} transform={`translate(${x}, ${i % 2 ? -4 : 0})`}>
            <circle r="11" fill="#9FB5D1"/>
            <circle cx="-3" cy="-2" r="2.5" fill="#B5C5D8"/>
            <circle cx="3" cy="-2" r="2.5" fill="#B5C5D8"/>
            <circle cx="0" cy="3" r="2.5" fill="#B5C5D8"/>
          </g>
        ))}
      </g>

      <g transform="translate(580, 445)">
        {[0, 12, 24, 36, 48, 60].map((x, i) => (
          <g key={i} transform={`translate(${x}, 0)`}>
            <line x1="0" y1="0" x2="0" y2="-22" stroke="#445C45" strokeWidth="1"/>
            <circle cx="0" cy="-22" r="2" fill="#8E7BA8"/>
            <circle cx="0" cy="-18" r="1.5" fill="#8E7BA8"/>
            <circle cx="0" cy="-14" r="1.2" fill="#8E7BA8"/>
          </g>
        ))}
      </g>

      {/* Tree on right */}
      <g transform="translate(680, 300)">
        <rect x="-4" y="0" width="8" height="80" fill="#6B5238"/>
        <circle cx="0" cy="-10" r="40" fill="#5C7960"/>
        <circle cx="-20" cy="0" r="28" fill="#5C7960"/>
        <circle cx="22" cy="-5" r="28" fill="#5C7960"/>
        <circle cx="0" cy="-25" r="25" fill="#7B9B7E"/>
      </g>
    </svg>
  );
}

const ART = {
  sankaty: SankatyArt,
  madaket: MadaketArt,
  sconset: SconsetArt,
};

// ============================================================
// UTILITIES
// ============================================================

function fmtDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function monthMatrix(anchor) {
  // anchor = Date for first day of month
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);
  return cells;
}

function monthName(date) {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

// ============================================================
// SHARED STORAGE HELPERS
// ============================================================

async function loadAvailability() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v) return JSON.parse(v);
  } catch (e) {
    // ignore
  }
  return { sankaty: [], madaket: [], sconset: [] };
}

async function saveAvailability(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { ok: true };
  } catch (e) {
    return null;
  }
}

// ============================================================
// SHARED UI PRIMITIVES
// ============================================================

function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,400;1,9..144,500;1,9..144,600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

      @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeInSlow { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes shimmer { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

      .cy-fade-in { animation: fadeIn 0.7s ease-out both; }
      .cy-fade-in-slow { animation: fadeInSlow 1.2s ease-out both; }
      .cy-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .cy-shimmer { animation: shimmer 2.4s ease-in-out infinite; }

      .cy-hairline { background: linear-gradient(to right, transparent, ${C.line} 20%, ${C.line} 80%, transparent); height: 1px; }
      .cy-tracking { letter-spacing: 0.22em; }
      .cy-tracking-wide { letter-spacing: 0.32em; }

      .cy-link { position: relative; }
      .cy-link::after { content: ""; position: absolute; left: 0; bottom: -4px; height: 1px; width: 0; background: currentColor; transition: width 0.35s ease; }
      .cy-link:hover::after { width: 100%; }

      .cy-btn { transition: all 0.25s ease; }
      .cy-btn:hover { transform: translateY(-1px); }

      .cy-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      .cy-card:hover { transform: translateY(-4px); }
      .cy-card:hover .cy-card-art { transform: scale(1.04); }
      .cy-card-art { transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }

      .cy-num { font-variant-numeric: tabular-nums; }

      .cy-carousel-slide { transition: opacity 1.2s ease-in-out; }

      /* Slow Ken Burns effect on hero art */
      @keyframes kenburns {
        0%   { transform: scale(1.02) translate(0%, 0%); }
        50%  { transform: scale(1.08) translate(-1%, -1%); }
        100% { transform: scale(1.02) translate(0%, 0%); }
      }
      .cy-kenburns { animation: kenburns 18s ease-in-out infinite; }

      /* Triptych container — column on mobile, row on desktop */
      .cy-triptych-row {
        display: flex;
        flex-direction: column;
      }
      @media (min-width: 768px) {
        .cy-triptych-row { flex-direction: row; }
      }

      /* Triptych panels — accordion expansion on hover (desktop only) */
      .cy-triptych-panel {
        flex: 1 1 0;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        min-height: clamp(140px, 22vh, 210px);
        transition: flex 0.7s cubic-bezier(0.4, 0, 0.2, 1), filter 0.4s ease;
      }
      @media (min-width: 768px) {
        .cy-triptych-panel { min-height: 78vh; max-height: 800px; }
        .cy-triptych-panel:hover { flex: 4 1 0; }
      }
      .cy-triptych-panel:hover { filter: brightness(1.08); }
      .cy-triptych-panel:active { filter: brightness(1.12); }
      .cy-triptych-panel:hover .cy-triptych-cta { opacity: 1 !important; letter-spacing: 0.32em; }
      .cy-triptych-panel:hover .cy-triptych-rule { width: 40px !important; }

      /* Triptych caption — compact on mobile, generous on desktop */
      .cy-triptych-caption { padding: 0.85rem 1.1rem; }
      @media (min-width: 768px) { .cy-triptych-caption { padding: 2.25rem 1.75rem; } }
      .cy-triptych-caption h2 { font-size: 1.35rem; }
      @media (min-width: 768px) { .cy-triptych-caption h2 { font-size: clamp(1.75rem, 3.5vw, 2.5rem); } }
      .cy-triptych-tagline { font-size: 0.78rem; margin-bottom: 0; line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      @media (min-width: 768px) { .cy-triptych-tagline { font-size: 0.95rem; margin-bottom: 1.25rem; line-height: 1.55; white-space: normal; } }
      .cy-triptych-meta { font-size: 0.58rem; }
      @media (min-width: 768px) { .cy-triptych-meta { font-size: 0.7rem; } }
      .cy-triptych-rule-wrap { display: none; }
      @media (min-width: 768px) { .cy-triptych-rule-wrap { display: block; } }
      .cy-triptych-cta { display: none; }
      @media (min-width: 768px) { .cy-triptych-cta { display: block; } }

      input:focus, button:focus { outline: none; }
      input:focus { box-shadow: 0 0 0 2px ${C.cedar}; }
    `}</style>
  );
}

function NumberLabel({ n, color = C.cedar, children }) {
  return (
    <div style={{ fontFamily: FONT_UI, color }} className="flex items-baseline gap-3 cy-tracking text-xs uppercase">
      <span className="cy-num" style={{ fontWeight: 500 }}>— {n}</span>
      <span>{children}</span>
    </div>
  );
}

function Button({ children, onClick, variant = "primary", icon: Icon, type = "button", style = {} }) {
  const base = {
    fontFamily: FONT_UI,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontSize: "0.78rem",
    fontWeight: 500,
    padding: "0.95rem 1.6rem",
    borderRadius: 0,
    border: "1px solid",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.6rem",
    ...style,
  };
  const variants = {
    primary:  { background: C.ink, color: C.paper, borderColor: C.ink },
    ghost:    { background: "transparent", color: C.ink, borderColor: C.ink },
    cream:    { background: C.paper, color: C.ink, borderColor: C.ink },
    cedar:    { background: C.cedar, color: C.paper, borderColor: C.cedar },
  };
  return (
    <button type={type} onClick={onClick} className="cy-btn" style={{ ...base, ...variants[variant] }}>
      {Icon && <Icon size={14} strokeWidth={1.5}/>}
      {children}
    </button>
  );
}

// ============================================================
// NAVIGATION
// ============================================================

function Nav({ page, setPage, setCurrentHouse }) {
  const [open, setOpen] = useState(false);
  const navItems = [
    { id: "home", label: "Main" },
    { id: "houses", label: "Homes" },
    { id: "about", label: "Nantucket" },
    { id: "availability", label: "Availability" },
  ];

  const go = (id) => {
    if (id === "houses") {
      setCurrentHouse(HOUSES[0].id);
      setPage("house");
    } else {
      setPage(id);
    }
    setOpen(false);
  };

  return (
    <header style={{ background: C.paper, borderBottom: `1px solid ${C.line}` }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
        <button onClick={() => { setPage("home"); setOpen(false); }} className="text-left cy-btn" style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}>
          <div style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: "1.6rem", fontWeight: 500, lineHeight: 1, fontStyle: "italic" }}>
            Cy's
          </div>
          <div style={{ fontFamily: FONT_UI, color: C.cedar, fontSize: "0.65rem", marginTop: 2 }} className="cy-tracking uppercase">
            Island Rentals
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map(item => {
            const active = page === item.id || (item.id === "houses" && page === "house");
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className="cy-link"
                style={{
                  fontFamily: FONT_UI,
                  fontSize: "0.78rem",
                  color: active ? C.ink : C.muted,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  background: "transparent", border: "none", padding: 0, cursor: "pointer",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => setPage("admin")}
            title="Owner sign in"
            style={{ background: "transparent", border: `1px solid ${C.line}`, padding: "0.5rem", cursor: "pointer", color: C.muted, borderRadius: "100%" }}
          >
            <Lock size={13} strokeWidth={1.5}/>
          </button>
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ background: "transparent", border: "none", color: C.ink, cursor: "pointer" }}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-6" style={{ borderTop: `1px solid ${C.line}` }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                fontFamily: FONT_UI, fontSize: "0.85rem",
                color: C.ink, letterSpacing: "0.22em", textTransform: "uppercase",
                padding: "1rem 0", borderBottom: `1px solid ${C.line}`,
                background: "transparent", border: "none", borderBottomWidth: 1, cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { setPage("admin"); setOpen(false); }}
            style={{
              display: "block", width: "100%", textAlign: "left",
              fontFamily: FONT_UI, fontSize: "0.85rem", color: C.cedar,
              letterSpacing: "0.22em", textTransform: "uppercase",
              padding: "1rem 0",
              background: "transparent", border: "none", cursor: "pointer",
            }}
          >
            Owner Sign-In
          </button>
        </div>
      )}
    </header>
  );
}

// ============================================================
// HOME PAGE — Carousel hero + intro
// ============================================================

function HomePage({ setPage, setCurrentHouse }) {
  const goHouse = (id) => {
    setCurrentHouse(id);
    setPage("house");
  };

  return (
    <div className="cy-fade-in-slow">
      {/* HERO — TRIPTYCH */}
      <section style={{ position: "relative", background: C.ink }}>
        <div className="cy-triptych-row">
          {HOUSES.map((h, i) => {
            const Art = ART[h.id];
            return (
              <button
                key={h.id}
                onClick={() => goHouse(h.id)}
                className="cy-triptych-panel cy-fade-in-slow"
                style={{
                  border: "none",
                  background: C.ink,
                  padding: 0,
                  animationDelay: `${i * 200}ms`,
                }}
              >
                {/* Art with gentle motion */}
                <div className="cy-kenburns" style={{ position: "absolute", inset: 0 }}>
                  <Art className="w-full h-full"/>
                </div>
                {/* Vignette */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: `linear-gradient(to bottom, rgba(21,38,58,0) 30%, rgba(21,38,58,0.78) 100%)`,
                }}/>
                {/* Caption */}
                <div className="cy-triptych-caption absolute bottom-0 left-0 right-0 text-left" style={{ zIndex: 1 }}>
                  <div className="cy-triptych-rule-wrap">
                    <div className="cy-triptych-rule" style={{
                      width: 24, height: 1, background: C.paper, opacity: 0.65,
                      marginBottom: "1rem", transition: "width 0.4s ease",
                    }}/>
                  </div>
                  <div className="cy-triptych-meta cy-tracking-wide uppercase" style={{ fontFamily: FONT_UI, color: C.paper, opacity: 0.8 }}>
                    — {h.number} / {h.location.split(" · ")[0]}
                  </div>
                  <h2 style={{
                    fontFamily: FONT_DISPLAY,
                    color: C.paper,
                    fontWeight: 400,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                    marginTop: "0.4rem",
                    marginBottom: "0.4rem",
                  }}>
                    {h.name}
                  </h2>
                  <p className="cy-triptych-tagline" style={{
                    fontFamily: FONT_BODY, color: C.paper, opacity: 0.88,
                    fontStyle: "italic",
                    maxWidth: "22rem",
                  }}>
                    {h.tagline}
                  </p>
                  <div
                    className="cy-triptych-cta cy-tracking uppercase"
                    style={{
                      fontFamily: FONT_UI, color: C.paper, fontSize: "0.7rem",
                      opacity: 0.65, transition: "all 0.4s ease",
                    }}
                  >
                    Explore &nbsp;→
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {/* Brand strip below the triptych */}
        <div style={{ background: C.paper, borderBottom: `1px solid ${C.line}`, padding: "1.5rem", textAlign: "center" }}>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
            <span style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.7rem" }} className="cy-tracking-wide uppercase">
              Three homes
            </span>
            <span style={{ color: C.line }}>·</span>
            <span style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.7rem" }} className="cy-tracking-wide uppercase">
              One island
            </span>
            <span style={{ color: C.line }}>·</span>
            <span style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.7rem" }} className="cy-tracking-wide uppercase">
              Family-kept for four generations
            </span>
            <button
              onClick={() => setPage("availability")}
              className="cy-link"
              style={{
                fontFamily: FONT_UI, color: C.ink, fontSize: "0.7rem",
                background: "transparent", border: "none", cursor: "pointer",
                marginLeft: "1rem",
              }}
            >
              <span className="cy-tracking-wide uppercase">See Availability →</span>
            </button>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section style={{ background: C.paper, padding: "8rem 1.5rem" }}>
        <div className="max-w-5xl mx-auto cy-slide-up">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-4">
              <NumberLabel n="01">A welcome</NumberLabel>
            </div>
            <div className="md:col-span-8">
              <p style={{
                fontFamily: FONT_DISPLAY,
                color: C.ink,
                fontSize: "clamp(1.65rem, 3.3vw, 2.5rem)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 1.4,
                letterSpacing: "-0.005em",
              }}>
                For four generations, our family has cared for properties on Nantucket. We don't run a portfolio — <span style={{ color: C.cedar }}>we share a home.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="cy-hairline"/>

      {/* HOUSES GRID */}
      <section style={{ background: C.paper, padding: "8rem 1.5rem" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <NumberLabel n="02">The houses</NumberLabel>
            <h2 style={{
              fontFamily: FONT_DISPLAY, color: C.ink,
              fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400,
              marginTop: "1rem", lineHeight: 1.15,
            }}>
              From the cliff, to the surf, to the village.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {HOUSES.map((h, i) => {
              const Art = ART[h.id];
              return (
                <button
                  key={h.id}
                  onClick={() => goHouse(h.id)}
                  className="cy-card cy-slide-up text-left"
                  style={{
                    animationDelay: `${i * 120}ms`,
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ overflow: "hidden", aspectRatio: "4/3", marginBottom: "1.25rem", background: C.paperWarm }}>
                    <div className="cy-card-art" style={{ width: "100%", height: "100%" }}>
                      <Art className="w-full h-full"/>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between mb-3">
                    <span style={{ fontFamily: FONT_UI, color: C.cedar, fontSize: "0.65rem" }} className="cy-tracking uppercase">
                      No. {h.number}
                    </span>
                    <span style={{ fontFamily: FONT_BODY, color: C.muted, fontSize: "0.78rem", fontStyle: "italic" }}>
                      {h.bedrooms} bedrooms · sleeps {h.sleeps}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: FONT_DISPLAY,
                    color: C.ink,
                    fontSize: "1.75rem",
                    fontWeight: 400,
                    lineHeight: 1.15,
                    marginBottom: "0.5rem",
                  }}>
                    {h.name}
                  </h3>
                  <p style={{ fontFamily: FONT_BODY, color: C.muted, fontSize: "0.95rem", fontStyle: "italic" }}>
                    {h.tagline}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// HOUSE DETAIL PAGE
// ============================================================

function HousePage({ houseId, setCurrentHouse, setPage }) {
  const house = HOUSES.find(h => h.id === houseId) || HOUSES[0];
  const Art = ART[house.id];
  const others = HOUSES.filter(h => h.id !== house.id);

  return (
    <div className="cy-fade-in">
      {/* Hero */}
      <section style={{ position: "relative", height: "60vh", minHeight: 440, overflow: "hidden", background: C.ink }}>
        <div className="cy-kenburns" style={{ width: "100%", height: "100%" }}>
          <Art className="w-full h-full"/>
        </div>
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to bottom, transparent 40%, rgba(21,38,58,0.55) 100%)`
        }}/>
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-12">
          <div style={{ fontFamily: FONT_UI, color: C.paper, opacity: 0.85, fontSize: "0.7rem", marginBottom: "0.75rem" }} className="cy-tracking-wide uppercase">
            — {house.number} / {house.location}
          </div>
          <h1 style={{
            fontFamily: FONT_DISPLAY,
            color: C.paper,
            fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}>
            {house.name}
          </h1>
        </div>
      </section>

      {/* House selector tabs */}
      <section style={{ background: C.paper, borderBottom: `1px solid ${C.line}`, padding: "1.25rem 1.5rem" }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 md:gap-6">
            {HOUSES.map(h => (
              <button
                key={h.id}
                onClick={() => setCurrentHouse(h.id)}
                style={{
                  fontFamily: FONT_UI, fontSize: "0.75rem",
                  color: h.id === house.id ? C.ink : C.muted,
                  fontWeight: h.id === house.id ? 600 : 400,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  background: "transparent", border: "none", cursor: "pointer",
                  padding: "0.5rem 0",
                  borderBottom: h.id === house.id ? `1px solid ${C.ink}` : "1px solid transparent",
                }}
              >
                {h.name.replace("The ", "")}
              </button>
            ))}
          </div>
          <Button onClick={() => setPage("availability")} variant="primary">
            See Available Dates
          </Button>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: C.paperWarm }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { icon: Users,    label: "Sleeps",        value: house.sleeps },
            { icon: Bed,      label: "Bedrooms",      value: house.bedrooms },
            { icon: Bath,     label: "Baths",         value: house.bathsLabel },
            { icon: Waves,    label: "To Beach",      value: house.toBeach },
            { icon: Compass,  label: "To Town",       value: house.toTown },
            { icon: Sparkles, label: "Pet Friendly",  value: house.petFriendly },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <Icon size={18} strokeWidth={1.3} color={C.cedar} className="mt-1"/>
                <div>
                  <div style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.65rem" }} className="cy-tracking uppercase">
                    {s.label}
                  </div>
                  <div style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: "1.4rem", fontWeight: 400, lineHeight: 1.2, marginTop: 4 }}>
                    {s.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Description */}
      <section style={{ background: C.paper, padding: "6rem 1.5rem" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <NumberLabel n="01">The place</NumberLabel>
          </div>
          <div className="md:col-span-8">
            <p style={{ fontFamily: FONT_DISPLAY, fontStyle: "italic", color: C.ink, fontSize: "1.5rem", lineHeight: 1.5, marginBottom: "2rem", fontWeight: 300 }}>
              "{house.tagline}."
            </p>
            <p style={{ fontFamily: FONT_BODY, color: C.inkSoft, fontSize: "1.075rem", lineHeight: 1.75 }}>
              {house.blurb}
            </p>
            {house.blurbExtra && house.blurbExtra.map((para, i) => (
              <p key={i} style={{ fontFamily: FONT_BODY, color: C.inkSoft, fontSize: "1.075rem", lineHeight: 1.75, marginTop: "1.25rem" }}>
                {para}
              </p>
            ))}
            <p style={{ fontFamily: FONT_BODY, color: C.muted, fontSize: "0.95rem", lineHeight: 1.75, marginTop: "1.75rem", fontStyle: "italic" }}>
              {house.history}
            </p>
          </div>
        </div>
      </section>

      <div className="cy-hairline"/>

      {/* Amenities */}
      <section style={{ background: C.paper, padding: "6rem 1.5rem" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <NumberLabel n="02">Amenities</NumberLabel>
            <p style={{ fontFamily: FONT_BODY, color: C.muted, fontSize: "0.95rem", marginTop: "1rem", lineHeight: 1.7, fontStyle: "italic" }}>
              The things we'd pack for you, if we could.
            </p>
          </div>
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-x-8 gap-y-5">
            {house.amenities.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-center gap-4" style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: "1rem" }}>
                  <Icon size={18} strokeWidth={1.3} color={C.cedar}/>
                  <span style={{ fontFamily: FONT_BODY, color: C.ink, fontSize: "1rem" }}>
                    {a.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="cy-hairline"/>

      {/* CTA */}
      <section style={{ background: house.accent + "33", padding: "6rem 1.5rem", textAlign: "center" }}>
        <div className="max-w-3xl mx-auto">
          <NumberLabel n="03">Plan your stay</NumberLabel>
          <h2 style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, marginTop: "1rem", marginBottom: "1.5rem", lineHeight: 1.15 }}>
            See when <em>{house.name}</em> is open.
          </h2>
          <p style={{ fontFamily: FONT_BODY, color: C.inkSoft, fontSize: "1.075rem", lineHeight: 1.75, marginBottom: "2.5rem" }}>
            Our calendar updates in real time. Pick your week, then call Cy directly to hold the dates.
          </p>
          <Button onClick={() => setPage("availability")} variant="primary">
            See Available Dates
          </Button>
        </div>
      </section>

      {/* Other houses */}
      <section style={{ background: C.paper, padding: "6rem 1.5rem" }}>
        <div className="max-w-7xl mx-auto">
          <NumberLabel n="04">The other houses</NumberLabel>
          <div className="grid md:grid-cols-2 gap-10 mt-10">
            {others.map(h => {
              const Art = ART[h.id];
              return (
                <button
                  key={h.id}
                  onClick={() => setCurrentHouse(h.id)}
                  className="cy-card text-left"
                  style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
                >
                  <div style={{ overflow: "hidden", aspectRatio: "16/9", marginBottom: "1rem" }}>
                    <div className="cy-card-art" style={{ width: "100%", height: "100%" }}>
                      <Art className="w-full h-full"/>
                    </div>
                  </div>
                  <h3 style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: "1.75rem", fontWeight: 400 }}>{h.name}</h3>
                  <p style={{ fontFamily: FONT_BODY, color: C.muted, fontStyle: "italic", marginTop: "0.4rem" }}>{h.tagline}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// ABOUT NANTUCKET
// ============================================================

const THINGS = [
  { icon: Anchor,   title: "Whaling Museum",         desc: "The island's history under one roof — a 46-foot sperm whale skeleton overhead, scrimshaw below.", area: "Downtown" },
  { icon: Sun,      title: "Madaket Sunsets",        desc: "Drive west at golden hour for the most photographed sunset in New England. Bring a bottle.",       area: "Madaket" },
  { icon: Bike,     title: "Bike the 'Sconset Path", desc: "Seven flat, gorgeous miles from town to village along the moors. Hydrangea-lined in July.",         area: "Town to 'Sconset" },
  { icon: Camera,   title: "Sankaty Head Light",     desc: "A red-and-white striped beacon since 1850. Walk the bluff path at dusk for a stunner of a picture.", area: "Sankaty" },
  { icon: Waves,    title: "Surfside Beach",         desc: "South-facing surf, lifeguards in season, and the kind of soft sand you'll think about all winter.",  area: "South Shore" },
  { icon: Compass,  title: "Great Point Lighthouse", desc: "Reachable only by 4WD — book the guided tour. Seals, surf-casters, and absolute solitude.",         area: "North Shore" },
  { icon: Utensils, title: "Cisco Brewers",          desc: "Brewery, distillery, and winery — all on one site. Food trucks, live music, picnic tables.",        area: "Cisco" },
  { icon: ShoppingBag, title: "Cobblestone Downtown",desc: "Main Street's storefronts haven't changed in a century. The bookstore. The hardware. The hat shop.", area: "Town" },
  { icon: Trees,    title: "'Sconset Bluff Walk",    desc: "A public path along the cliff edge, threaded between century-old cottages and their gardens.",     area: "'Sconset" },
];

function AboutPage({ setPage }) {
  return (
    <div className="cy-fade-in">
      {/* Hero */}
      <section style={{ background: C.ink, position: "relative", overflow: "hidden", padding: "8rem 1.5rem 6rem" }}>
        {/* Decorative compass */}
        <svg viewBox="0 0 200 200" style={{ position: "absolute", top: "2rem", right: "2rem", width: 160, height: 160, opacity: 0.15 }} xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" stroke={C.paper} strokeWidth="0.5" fill="none"/>
          <circle cx="100" cy="100" r="70" stroke={C.paper} strokeWidth="0.5" fill="none"/>
          <line x1="100" y1="10" x2="100" y2="190" stroke={C.paper} strokeWidth="0.5"/>
          <line x1="10" y1="100" x2="190" y2="100" stroke={C.paper} strokeWidth="0.5"/>
          <polygon points="100,30 110,100 100,170 90,100" fill={C.paper}/>
          <text x="100" y="22" textAnchor="middle" fill={C.paper} fontSize="10" fontFamily={FONT_UI} letterSpacing="0.2em">N</text>
        </svg>

        <div className="max-w-5xl mx-auto cy-slide-up">
          <NumberLabel n="" color={C.cedar}><span style={{color: C.paper, opacity: 0.7}}>The Island</span></NumberLabel>
          <h1 style={{
            fontFamily: FONT_DISPLAY, color: C.paper,
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em",
            marginTop: "1.5rem", marginBottom: "2rem",
          }}>
            On <em style={{ color: C.hydrangea, fontWeight: 400 }}>Nantucket</em>.
          </h1>
          <p style={{ fontFamily: FONT_BODY, color: C.paper, opacity: 0.85, fontSize: "1.25rem", lineHeight: 1.75, maxWidth: "42rem", fontStyle: "italic" }}>
            Thirty miles out to sea, fourteen miles long, and full of all the right kinds of trouble. A whaling capital turned sanctuary of gray-shingled cottages, salt-bleached fences, and the longest light of the year.
          </p>
        </div>
      </section>

      {/* Quick facts */}
      <section style={{ background: C.paperWarm, padding: "3rem 1.5rem", borderBottom: `1px solid ${C.line}` }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["30 mi", "off Cape Cod"],
            ["14 mi", "long, end to end"],
            ["82 mi", "of shoreline"],
            ["1659", "first settled"],
          ].map(([n, l], i) => (
            <div key={i} className="text-center md:text-left">
              <div style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: "2.5rem", fontWeight: 300, lineHeight: 1 }} className="cy-num">{n}</div>
              <div style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.7rem", marginTop: "0.5rem" }} className="cy-tracking uppercase">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Things to do */}
      <section style={{ background: C.paper, padding: "8rem 1.5rem" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <div className="md:col-span-4">
              <NumberLabel n="01">Things to do</NumberLabel>
            </div>
            <div className="md:col-span-8">
              <h2 style={{
                fontFamily: FONT_DISPLAY, color: C.ink,
                fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400,
                lineHeight: 1.15, letterSpacing: "-0.015em",
              }}>
                A few favorites, in <em style={{color: C.cedar}}>no particular order</em>.
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: C.line }}>
            {THINGS.map((t, i) => {
              const Icon = t.icon;
              return (
                <div
                  key={i}
                  className="cy-slide-up"
                  style={{
                    background: C.paper,
                    padding: "2.5rem 2rem",
                    animationDelay: `${(i % 6) * 80}ms`,
                  }}
                >
                  <Icon size={22} strokeWidth={1.3} color={C.cedar}/>
                  <div style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.65rem", marginTop: "1.5rem" }} className="cy-tracking uppercase">
                    {t.area}
                  </div>
                  <h3 style={{
                    fontFamily: FONT_DISPLAY, color: C.ink,
                    fontSize: "1.5rem", fontWeight: 400,
                    marginTop: "0.5rem", marginBottom: "0.75rem", lineHeight: 1.2,
                  }}>
                    {t.title}
                  </h3>
                  <p style={{ fontFamily: FONT_BODY, color: C.inkSoft, fontSize: "0.95rem", lineHeight: 1.7 }}>
                    {t.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* When to come */}
      <section style={{ background: C.paperWarm, padding: "8rem 1.5rem" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <NumberLabel n="02">When to come</NumberLabel>
          </div>
          <div className="md:col-span-8 space-y-6">
            {[
              { season: "May — June", title: "Wisteria & wide-open island", text: "Cool mornings, warming afternoons. The crowds haven't arrived. Restaurants take walk-ins. Whales still pass offshore." },
              { season: "July — August", title: "Hydrangea high season", text: "The island in its full blue dress. Reserve well in advance — these are our most booked weeks. Bring a sweater for nights." },
              { season: "September", title: "Locals know best", text: "Warmest swimming. Quietest beaches. The light gets long and gold. If you can come only once, come now." },
              { season: "Stroll season", title: "The first weekend in December", text: "The Nantucket Christmas Stroll — carolers, lit windows, hot toddies, a town transformed. Worth a long weekend." },
            ].map((s, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 py-5" style={{ borderBottom: i < 3 ? `1px solid ${C.line}` : "none" }}>
                <div className="col-span-12 md:col-span-4">
                  <div style={{ fontFamily: FONT_UI, color: C.cedar, fontSize: "0.7rem" }} className="cy-tracking uppercase">{s.season}</div>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <div style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: "1.25rem", fontWeight: 500, marginBottom: "0.35rem" }}>{s.title}</div>
                  <div style={{ fontFamily: FONT_BODY, color: C.inkSoft, fontSize: "0.98rem", lineHeight: 1.7 }}>{s.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: C.paper, padding: "5rem 1.5rem", textAlign: "center" }}>
        <Button onClick={() => setPage("availability")} variant="primary">
          See Available Dates
        </Button>
      </section>
    </div>
  );
}

// ============================================================
// AVAILABILITY CALENDAR
// ============================================================

function availabilityForDay(dateStr, selectedHouses, availability) {
  // Returns array of { houseId, available, color } for each selected house
  const result = [];
  HOUSES.forEach(h => {
    if (!selectedHouses.has(h.id)) return;
    const unavail = availability[h.id] || [];
    const isUnavail = unavail.includes(dateStr);
    result.push({
      houseId: h.id,
      houseName: h.name,
      available: !isUnavail,
      color: isUnavail ? C.rust : C.seafoam,
    });
  });
  return result;
}

function MonthGrid({ anchor, selectedHouses, availability, onDayClick, isAdmin, today, adminHouse }) {
  const cells = monthMatrix(anchor);
  const dows = ["S","M","T","W","T","F","S"];
  const todayStr = fmtDate(today);

  return (
    <div>
      <div className="text-center mb-6">
        <div style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: "1.75rem", fontWeight: 400 }}>
          {monthName(anchor)}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0 mb-2">
        {dows.map((d, i) => (
          <div key={i} className="text-center" style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.65rem", padding: "0.5rem" }}>
            <span className="cy-tracking uppercase">{d}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0" style={{ border: `1px solid ${C.line}` }}>
        {cells.map((d, i) => {
          if (!d) {
            return <div key={i} style={{ background: C.paperWarm, opacity: 0.4, minHeight: 64, borderRight: i % 7 < 6 ? `1px solid ${C.line}` : "none", borderBottom: i < 35 ? `1px solid ${C.line}` : "none" }}/>;
          }
          const dateStr = fmtDate(d);
          const isPast = dateStr < todayStr;
          const isToday = dateStr === todayStr;
          const seg = availabilityForDay(dateStr, selectedHouses, availability);
          const anyUnavail = seg.some(s => !s.available);
          const allUnavail = seg.length > 0 && seg.every(s => !s.available);

          return (
            <button
              key={i}
              onClick={() => onDayClick && onDayClick(dateStr, d)}
              disabled={!isAdmin && !onDayClick}
              style={{
                minHeight: 64,
                padding: "0.5rem 0.5rem 0.35rem",
                background: isPast ? C.paperWarm : C.paper,
                borderRight: i % 7 < 6 ? `1px solid ${C.line}` : "none",
                borderBottom: i < 35 ? `1px solid ${C.line}` : "none",
                opacity: isPast ? 0.4 : 1,
                position: "relative",
                cursor: isAdmin ? "pointer" : "default",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                textAlign: "left",
              }}
              title={isAdmin ? `Click to toggle ${adminHouse}'s availability on ${dateStr}` : seg.map(s => `${s.houseName}: ${s.available ? "Available" : "Booked"}`).join("\n")}
            >
              <div style={{
                fontFamily: FONT_UI,
                color: isToday ? C.cedar : C.ink,
                fontWeight: isToday ? 700 : 400,
                fontSize: "0.85rem",
                lineHeight: 1,
              }} className="cy-num">
                {d.getDate()}
              </div>
              {/* Availability bar */}
              {seg.length > 0 && (
                <div style={{ display: "flex", gap: 1, height: 5, marginTop: 4 }}>
                  {seg.map(s => (
                    <div
                      key={s.houseId}
                      style={{
                        flex: 1,
                        background: s.color,
                        opacity: isPast ? 0.45 : 0.9,
                      }}
                    />
                  ))}
                </div>
              )}
              {/* Today marker */}
              {isToday && (
                <div style={{ position: "absolute", top: 4, right: 4, width: 6, height: 6, borderRadius: "50%", background: C.cedar }}/>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AvailabilityPage({ availability }) {
  const [anchor, setAnchor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selectedHouses, setSelectedHouses] = useState(new Set(HOUSES.map(h => h.id)));
  const today = useMemo(() => new Date(), []);

  const toggleHouse = (id) => {
    setSelectedHouses(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const nextAnchor = addMonths(anchor, 1);

  return (
    <div className="cy-fade-in">
      {/* Header */}
      <section style={{ background: C.paper, padding: "5rem 1.5rem 3rem", borderBottom: `1px solid ${C.line}` }}>
        <div className="max-w-7xl mx-auto">
          <NumberLabel n="">Availability</NumberLabel>
          <h1 style={{
            fontFamily: FONT_DISPLAY, color: C.ink,
            fontSize: "clamp(2.25rem, 5vw, 4rem)", fontWeight: 400,
            lineHeight: 1.05, marginTop: "1rem", marginBottom: "1.5rem", letterSpacing: "-0.02em",
          }}>
            When the houses are <em style={{color: C.cedar}}>open</em>.
          </h1>
          <p style={{ fontFamily: FONT_BODY, color: C.inkSoft, fontSize: "1.05rem", maxWidth: "42rem", lineHeight: 1.7 }}>
            Two months at a glance. Each day shows a small bar — one segment per selected house. <span style={{ color: C.seafoam, fontWeight: 600 }}>Sea-green</span> is available; <span style={{ color: C.rust, fontWeight: 600 }}>brick</span> is booked. Toggle houses below to filter the view.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section style={{ background: C.paperWarm, padding: "1.75rem 1.5rem", borderBottom: `1px solid ${C.line}` }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <span style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.65rem" }} className="cy-tracking uppercase">Show houses</span>
            {HOUSES.map(h => {
              const checked = selectedHouses.has(h.id);
              return (
                <label key={h.id} className="flex items-center gap-2 cursor-pointer" style={{ userSelect: "none" }}>
                  <div style={{
                    width: 16, height: 16, border: `1px solid ${C.ink}`,
                    background: checked ? C.ink : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {checked && <Check size={11} strokeWidth={2.5} color={C.paper}/>}
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleHouse(h.id)}
                    style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                  />
                  <span style={{ fontFamily: FONT_BODY, color: C.ink, fontSize: "0.95rem" }}>
                    {h.name.replace("The ", "")}
                  </span>
                </label>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div style={{ width: 14, height: 5, background: C.seafoam }}/>
              <span style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.65rem" }} className="cy-tracking uppercase">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div style={{ width: 14, height: 5, background: C.rust }}/>
              <span style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.65rem" }} className="cy-tracking uppercase">Booked</span>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section style={{ background: C.paper, padding: "3rem 1.5rem 6rem" }}>
        <div className="max-w-7xl mx-auto">
          {/* Nav */}
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 mb-10">
            <button
              onClick={() => setAnchor(addMonths(anchor, -1))}
              style={{
                background: "transparent", border: `1px solid ${C.line}`,
                padding: "0.75rem 1rem", cursor: "pointer", color: C.ink,
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                fontFamily: FONT_UI, fontSize: "0.7rem",
              }}
              className="cy-tracking uppercase cy-btn"
            >
              <ChevronLeft size={14} strokeWidth={1.5}/> Prev
            </button>
            <div style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.7rem", textAlign: "center" }} className="cy-tracking-wide uppercase">
              {monthName(anchor)} — {monthName(nextAnchor)}
            </div>
            <button
              onClick={() => setAnchor(addMonths(anchor, 1))}
              style={{
                background: "transparent", border: `1px solid ${C.line}`,
                padding: "0.75rem 1rem", cursor: "pointer", color: C.ink,
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                fontFamily: FONT_UI, fontSize: "0.7rem",
              }}
              className="cy-tracking uppercase cy-btn"
            >
              Next <ChevronRight size={14} strokeWidth={1.5}/>
            </button>
          </div>

          {selectedHouses.size === 0 ? (
            <div className="text-center py-20">
              <p style={{ fontFamily: FONT_DISPLAY, color: C.muted, fontStyle: "italic", fontSize: "1.5rem" }}>
                Select at least one house to see availability.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              <MonthGrid anchor={anchor} selectedHouses={selectedHouses} availability={availability} today={today}/>
              <MonthGrid anchor={nextAnchor} selectedHouses={selectedHouses} availability={availability} today={today}/>
            </div>
          )}

          {/* Helper note */}
          <div className="mt-12 text-center" style={{ fontFamily: FONT_BODY, color: C.muted, fontStyle: "italic", fontSize: "0.95rem" }}>
            Found a week that works? Call Cy directly at <span style={{color: C.ink}}>(508) 555-0142</span> to hold the dates.
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// ADMIN — LOGIN
// ============================================================

function AdminLogin({ onLogin, setPage }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    if (pw === ADMIN_PASSWORD) {
      onLogin();
      setErr("");
    } else {
      setErr("Incorrect password.");
    }
  };

  return (
    <div className="cy-fade-in" style={{ background: C.paper, minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 1.5rem" }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div className="text-center mb-10">
          <Lock size={26} strokeWidth={1.2} color={C.cedar}/>
          <div style={{ fontFamily: FONT_UI, color: C.cedar, fontSize: "0.65rem", marginTop: "1rem" }} className="cy-tracking-wide uppercase">
            Owner Portal
          </div>
          <h1 style={{
            fontFamily: FONT_DISPLAY, color: C.ink,
            fontSize: "2.5rem", fontWeight: 400, marginTop: "0.75rem", lineHeight: 1.15,
          }}>
            Welcome back.
          </h1>
        </div>
        <div className="space-y-4">
          <div>
            <label style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.65rem", display: "block", marginBottom: "0.5rem" }} className="cy-tracking uppercase">
              Password
            </label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{
                width: "100%", padding: "0.95rem 1rem",
                background: C.paperWarm,
                border: `1px solid ${C.line}`,
                fontFamily: FONT_BODY, fontSize: "1rem", color: C.ink,
                borderRadius: 0,
              }}
            />
          </div>
          {err && (
            <div style={{ fontFamily: FONT_BODY, color: C.rust, fontSize: "0.85rem", fontStyle: "italic" }}>
              {err}
            </div>
          )}
          <Button onClick={submit} variant="primary" icon={LogIn} style={{ width: "100%", justifyContent: "center" }}>
            Sign In
          </Button>
          <button
            onClick={() => setPage("home")}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontFamily: FONT_UI, color: C.muted, fontSize: "0.7rem",
              width: "100%", padding: "0.5rem", marginTop: "0.5rem",
            }}
            className="cy-tracking uppercase"
          >
            Return to site
          </button>
        </div>
        <div style={{ marginTop: "2.5rem", padding: "1rem", background: C.paperWarm, border: `1px solid ${C.line}`, fontFamily: FONT_BODY, color: C.muted, fontSize: "0.8rem", lineHeight: 1.6, fontStyle: "italic" }}>
          Demo password: <span style={{ fontFamily: FONT_UI, color: C.ink, fontStyle: "normal" }}>{ADMIN_PASSWORD}</span>. Change <span style={{ fontFamily: "monospace", color: C.ink, fontStyle: "normal" }}>ADMIN_PASSWORD</span> at the top of the source file for a real deployment, and add server-side auth.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN — DASHBOARD
// ============================================================

function AdminDashboard({ availability, setAvailability, onLogout }) {
  const [activeHouse, setActiveHouse] = useState(HOUSES[0].id);
  const [anchor, setAnchor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const today = useMemo(() => new Date(), []);

  const activeHouseObj = HOUSES.find(h => h.id === activeHouse);

  const toggleDay = async (dateStr) => {
    const prev = availability[activeHouse] || [];
    const isUnavail = prev.includes(dateStr);
    const nextList = isUnavail ? prev.filter(d => d !== dateStr) : [...prev, dateStr];
    const nextData = { ...availability, [activeHouse]: nextList };

    // Optimistic update
    setAvailability(nextData);
    setSaveState("saving");
    try {
      const r = await saveAvailability(nextData);
      if (r) {
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1500);
      } else {
        setSaveState("error");
      }
    } catch (e) {
      setSaveState("error");
    }
  };

  // Special selectedHouses for admin: just the active one
  const adminSelectedHouses = useMemo(() => new Set([activeHouse]), [activeHouse]);

  const nextAnchor = addMonths(anchor, 1);

  const unavailCount = (availability[activeHouse] || []).filter(d => d >= fmtDate(today)).length;

  return (
    <div className="cy-fade-in">
      {/* Header */}
      <section style={{ background: C.ink, color: C.paper, padding: "3rem 1.5rem 2.5rem" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div style={{ fontFamily: FONT_UI, color: C.hydrangea, fontSize: "0.65rem" }} className="cy-tracking-wide uppercase">
                Owner Portal
              </div>
              <h1 style={{ fontFamily: FONT_DISPLAY, color: C.paper, fontSize: "2.25rem", fontWeight: 400, marginTop: "0.5rem" }}>
                Manage Availability
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setPage("home")}
                style={{
                  fontFamily: FONT_UI, fontSize: "0.7rem", color: C.paper, opacity: 0.75,
                  background: "transparent", border: "none", cursor: "pointer", padding: "0.5rem 0.75rem",
                }}
                className="cy-tracking uppercase cy-link"
              >
                View as Visitor
              </button>
              <Button onClick={onLogout} variant="cream" icon={LogOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* House selector */}
      <section style={{ background: C.paperWarm, borderBottom: `1px solid ${C.line}`, padding: "1.5rem" }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-2 gap-y-2">
          <span style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.65rem", marginRight: "1rem" }} className="cy-tracking uppercase">
            Editing
          </span>
          {HOUSES.map(h => (
            <button
              key={h.id}
              onClick={() => setActiveHouse(h.id)}
              style={{
                fontFamily: FONT_UI, fontSize: "0.78rem",
                padding: "0.6rem 1.1rem",
                background: h.id === activeHouse ? C.ink : "transparent",
                color: h.id === activeHouse ? C.paper : C.ink,
                border: `1px solid ${h.id === activeHouse ? C.ink : C.line}`,
                cursor: "pointer",
                letterSpacing: "0.18em", textTransform: "uppercase",
              }}
            >
              {h.name.replace("The ", "")}
            </button>
          ))}
        </div>
      </section>

      {/* Instructions */}
      <section style={{ background: C.paper, padding: "2.5rem 1.5rem 1rem" }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: C.ink, fontSize: "1.5rem", fontWeight: 400 }}>
              {activeHouseObj.name}
            </h2>
            <p style={{ fontFamily: FONT_BODY, color: C.muted, fontStyle: "italic", marginTop: "0.35rem", fontSize: "0.95rem" }}>
              Click any day to toggle. <span className="cy-num">{unavailCount}</span> days currently marked unavailable.
            </p>
          </div>
          <div style={{ fontFamily: FONT_UI, color: saveState === "saved" ? C.seafoam : saveState === "saving" ? C.cedar : saveState === "error" ? C.rust : C.muted, fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "0.5rem" }} className="cy-tracking uppercase">
            {saveState === "saving" && <><Loader size={12} className="cy-shimmer"/> Saving...</>}
            {saveState === "saved"  && <><Check size={12}/> Saved</>}
            {saveState === "error"  && <><X size={12}/> Save failed</>}
            {saveState === "idle"   && <><Save size={12} color={C.muted}/> All changes saved</>}
          </div>
        </div>
      </section>

      {/* Calendar */}
      <section style={{ background: C.paper, padding: "2rem 1.5rem 6rem" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3 mb-8">
            <button
              onClick={() => setAnchor(addMonths(anchor, -1))}
              style={{
                background: "transparent", border: `1px solid ${C.line}`,
                padding: "0.75rem 1rem", cursor: "pointer", color: C.ink,
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                fontFamily: FONT_UI, fontSize: "0.7rem",
              }}
              className="cy-tracking uppercase cy-btn"
            >
              <ChevronLeft size={14}/> Prev
            </button>
            <div style={{ fontFamily: FONT_UI, color: C.muted, fontSize: "0.7rem" }} className="cy-tracking-wide uppercase">
              {monthName(anchor)} — {monthName(nextAnchor)}
            </div>
            <button
              onClick={() => setAnchor(addMonths(anchor, 1))}
              style={{
                background: "transparent", border: `1px solid ${C.line}`,
                padding: "0.75rem 1rem", cursor: "pointer", color: C.ink,
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                fontFamily: FONT_UI, fontSize: "0.7rem",
              }}
              className="cy-tracking uppercase cy-btn"
            >
              Next <ChevronRight size={14}/>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <MonthGrid
              anchor={anchor}
              selectedHouses={adminSelectedHouses}
              availability={availability}
              today={today}
              isAdmin
              adminHouse={activeHouseObj.name}
              onDayClick={(dateStr, d) => {
                if (dateStr < fmtDate(today)) return;
                toggleDay(dateStr);
              }}
            />
            <MonthGrid
              anchor={nextAnchor}
              selectedHouses={adminSelectedHouses}
              availability={availability}
              today={today}
              isAdmin
              adminHouse={activeHouseObj.name}
              onDayClick={(dateStr, d) => {
                if (dateStr < fmtDate(today)) return;
                toggleDay(dateStr);
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================

function Footer({ setPage, setCurrentHouse }) {
  return (
    <footer style={{ background: C.ink, color: C.paper, padding: "5rem 1.5rem 3rem" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-5">
            <div style={{ fontFamily: FONT_DISPLAY, color: C.paper, fontSize: "2rem", fontWeight: 400, fontStyle: "italic" }}>
              Cy's Island Rentals
            </div>
            <p style={{ fontFamily: FONT_BODY, color: C.paper, opacity: 0.7, marginTop: "0.75rem", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "26rem" }}>
              Three carefully kept houses on Nantucket. Family-owned since 1978. Cy answers his own phone.
            </p>
          </div>
          <div className="md:col-span-3">
            <div style={{ fontFamily: FONT_UI, color: C.hydrangea, fontSize: "0.65rem", marginBottom: "1rem" }} className="cy-tracking uppercase">Houses</div>
            {HOUSES.map(h => (
              <button
                key={h.id}
                onClick={() => { setCurrentHouse(h.id); setPage("house"); }}
                style={{ background: "transparent", border: "none", color: C.paper, opacity: 0.8, cursor: "pointer", padding: 0, display: "block", marginBottom: "0.5rem", fontFamily: FONT_BODY, fontSize: "0.95rem" }}
                className="cy-link"
              >
                {h.name}
              </button>
            ))}
          </div>
          <div className="md:col-span-4">
            <div style={{ fontFamily: FONT_UI, color: C.hydrangea, fontSize: "0.65rem", marginBottom: "1rem" }} className="cy-tracking uppercase">Reach Cy</div>
            <div className="flex items-center gap-3 mb-3" style={{ color: C.paper, opacity: 0.85 }}>
              <Phone size={14} strokeWidth={1.5}/>
              <span style={{ fontFamily: FONT_BODY, fontSize: "0.95rem" }}>(508) 555-0142</span>
            </div>
            <div className="flex items-center gap-3 mb-3" style={{ color: C.paper, opacity: 0.85 }}>
              <Mail size={14} strokeWidth={1.5}/>
              <span style={{ fontFamily: FONT_BODY, fontSize: "0.95rem" }}>cy@cysislandrentals.com</span>
            </div>
            <div className="flex items-center gap-3" style={{ color: C.paper, opacity: 0.85 }}>
              <MapPin size={14} strokeWidth={1.5}/>
              <span style={{ fontFamily: FONT_BODY, fontSize: "0.95rem" }}>12 Easy Street, Nantucket MA</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${C.inkSoft}`, paddingTop: "1.5rem" }} className="flex flex-wrap items-center justify-between gap-3">
          <div style={{ fontFamily: FONT_UI, color: C.paper, opacity: 0.5, fontSize: "0.65rem" }} className="cy-tracking uppercase">
            © {new Date().getFullYear()} Cy's Island Rentals
          </div>
          <button
            onClick={() => setPage("admin")}
            style={{ background: "transparent", border: "none", color: C.paper, opacity: 0.5, cursor: "pointer", fontFamily: FONT_UI, fontSize: "0.65rem" }}
            className="cy-tracking uppercase cy-link"
          >
            Owner Sign-In
          </button>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// APP
// ============================================================

export default function App() {
  const [page, setPage] = useState("home"); // home | house | about | availability | admin
  const [currentHouse, setCurrentHouse] = useState(HOUSES[0].id);
  const [isAdmin, setIsAdmin] = useState(false);
  const [availability, setAvailability] = useState({ sankaty: [], madaket: [], sconset: [] });
  const [loaded, setLoaded] = useState(false);

  // Load availability on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await loadAvailability();
      if (!cancelled) {
        setAvailability(data);
        setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, currentHouse]);

  const renderPage = () => {
    if (page === "home")          return <HomePage setPage={setPage} setCurrentHouse={setCurrentHouse}/>;
    if (page === "house")         return <HousePage houseId={currentHouse} setCurrentHouse={setCurrentHouse} setPage={setPage}/>;
    if (page === "about")         return <AboutPage setPage={setPage}/>;
    if (page === "availability")  return <AvailabilityPage availability={availability}/>;
    if (page === "admin") {
      if (!isAdmin) return <AdminLogin onLogin={() => setIsAdmin(true)} setPage={setPage}/>;
      return <AdminDashboard availability={availability} setAvailability={setAvailability} onLogout={() => { setIsAdmin(false); setPage("home"); }}/>;
    }
    return null;
  };

  return (
    <div style={{ background: C.paper, color: C.ink, fontFamily: FONT_BODY, minHeight: "100vh" }}>
      <FontLoader/>
      {!(page === "admin" && isAdmin) && (
        <Nav page={page} setPage={setPage} setCurrentHouse={setCurrentHouse}/>
      )}
      {!loaded ? (
        <div style={{ padding: "8rem 1.5rem", textAlign: "center" }}>
          <div style={{ fontFamily: FONT_DISPLAY, color: C.muted, fontStyle: "italic", fontSize: "1.25rem" }} className="cy-shimmer">
            Loading the houses…
          </div>
        </div>
      ) : renderPage()}
      {page !== "admin" && <Footer setPage={setPage} setCurrentHouse={setCurrentHouse}/>}
    </div>
  );
}
