import { project } from "./dublin";

// Crime Control — central demo seed data.
// One source of truth. Same guards, sites and clients appear across every module.
// Deterministic (no Math.random / Date.now) so server and client render identically.

export type ServiceKind = "guarding" | "property";

export type SiteType =
  | "Construction"
  | "Vacant residential"
  | "Retail"
  | "Void housing";

export type SiteStatus = "On site" | "Checked out" | "Late" | "No show";

export type Guard = {
  id: string;
  name: string;
  initials: string;
  phone: string;
  area: string;
  licenceNo: string;
  licenceExpiry: string; // DD/MM/YYYY
  hoursThisWeek: number;
  available: boolean;
  subcontractor: boolean;
  firm?: string;
  rate: number; // € per hour
  certs: string[];
};

export type Client = {
  id: string;
  name: string;
  services: ServiceKind[];
  monthlyValue: number; // €
  renewal: string;
  lastContact: string;
  lastContactDays: number;
  loyaltyYears: number;
  contacts: { name: string; role: string; email: string }[];
};

export type PatrolEntry = { time: string; note: string };
export type Incident = { time: string; note: string; photo: string };

export type Site = {
  id: string;
  name: string;
  address: string;
  clientId: string;
  type: SiteType;
  area: string;
  map: { x: number; y: number }; // % position on the board map
  window: string; // shift window
  guardId: string | null;
  status: SiteStatus;
  rosteredIn: string;
  actualIn: string | null;
  rosteredOut: string;
  actualOut: string | null;
  lateBy?: number; // minutes
  lastPatrol: string;
  patrolLog: PatrolEntry[];
  incidents: Incident[];
};

export type OpenShift = {
  id: string;
  siteId: string;
  time: string;
  date: string;
  reason: "Sick" | "No show" | "Unfilled";
};

export type EquipmentType = "Heater" | "Fridge" | "Cooker" | "Dehumidifier";
export type EquipmentStatus =
  | "In store"
  | "Out on hire"
  | "Overdue"
  | "Written off";

export type Asset = {
  id: string;
  type: EquipmentType;
  condition: "Good" | "Fair" | "Worn";
  status: EquipmentStatus;
  value: number;
  deposit: number;
  unit: string | null;
  tenant: string | null;
  clientId: string | null;
  dateOut: string | null;
  dateDue: string | null;
  history: { date: string; note: string }[];
};

export type JobStatus =
  | "Requested"
  | "Assigned"
  | "In progress"
  | "Complete"
  | "Invoiced";
export type JobType =
  | "Repair"
  | "Clean"
  | "Void inspection"
  | "Key handover"
  | "Equipment delivery";

export type Job = {
  id: string;
  ref: string;
  address: string;
  clientId: string;
  type: JobType;
  contractor: string | null;
  raised: string;
  slaHours: number; // remaining
  status: JobStatus;
  emailFrom: string;
  emailSubject: string;
  emailBody: string;
  notes: string[];
  proof: boolean;
};

export type Timesheet = {
  id: string;
  guardId: string;
  siteId: string;
  rostered: number; // hours
  actual: number; // hours
  rate: number;
  status: "Pending" | "Approved";
};

// ---------------------------------------------------------------------------
// Areas — coordinates used for distance ranking on the Cover Desk.
// ---------------------------------------------------------------------------
export const AREAS: Record<string, { x: number; y: number }> = {
  "Dublin 1": { x: 52, y: 44 },
  "Dublin 2": { x: 53, y: 50 },
  "Dublin 4": { x: 58, y: 54 },
  "Dublin 6": { x: 51, y: 58 },
  "Dublin 7": { x: 47, y: 42 },
  "Dublin 8": { x: 46, y: 50 },
  "Dublin 9": { x: 54, y: 34 },
  "Dublin 12": { x: 43, y: 58 },
  "Dublin 15": { x: 32, y: 38 },
  "Dublin 18": { x: 64, y: 70 },
  Tallaght: { x: 34, y: 66 },
  Swords: { x: 56, y: 18 },
  Blanchardstown: { x: 34, y: 34 },
  "Dún Laoghaire": { x: 70, y: 62 },
  Bray: { x: 72, y: 82 },
  Naas: { x: 18, y: 74 },
  Maynooth: { x: 18, y: 44 },
  Drogheda: { x: 70, y: 6 },
  Lucan: { x: 28, y: 50 },
  Clondalkin: { x: 34, y: 56 },
};
const AREA_KEYS = Object.keys(AREAS);

export function distanceKm(a: string, b: string): number {
  const pa = AREAS[a] ?? { x: 50, y: 50 };
  const pb = AREAS[b] ?? { x: 50, y: 50 };
  const d = Math.hypot(pa.x - pb.x, pa.y - pb.y);
  return Math.round(d * 0.42 * 10) / 10;
}

// deterministic pseudo count of prior shifts a guard has done at a site
export function timesWorked(guardId: string, siteId: string): number {
  let h = 0;
  const s = guardId + "|" + siteId;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
  return h % 10;
}

// ---------------------------------------------------------------------------
// Guards — 55 staff, Irish and non-Irish, own + subcontracted.
// ---------------------------------------------------------------------------
const GUARD_FIRST = [
  "Liam", "Seán", "Conor", "Darragh", "Cathal", "Adebayo", "Marek", "Tomasz",
  "Ionut", "Kwame", "Paddy", "Declan", "Niall", "Eoin", "Fiachra", "Ade",
  "Piotr", "Andrei", "Sipho", "Karol", "Brian", "Gerry", "Shane", "Ruairi",
  "Oleksandr", "Mihai", "Chidi", "Wojciech", "Fionn", "Barry", "Cian", "Alex",
  "Dmytro", "Femi", "Lukasz", "Padraig", "Kevin", "Dean", "Emeka", "Radu",
  "Colm", "Jakub", "Blessing", "Aidan", "Stephen", "Vasile", "Tunde", "Grzegorz",
  "Ronan", "Keith", "Osaze", "Krzysztof", "Terry", "Malachy", "Bogdan",
];
const GUARD_LAST = [
  "Byrne", "O'Neill", "Doyle", "Adeyemi", "Nowak", "Kowalski", "Popescu",
  "Mensah", "Kelly", "Murphy", "Walsh", "Okafor", "Nolan", "Fitzpatrick",
  "Dunphy", "Balogun", "Wójcik", "Ionescu", "Dlamini", "Kaczmarek", "Brennan",
  "Gallagher", "Whelan", "Moloney", "Shevchenko", "Radu", "Eze", "Zieliński",
  "Cassidy", "Keane", "Lynch", "Boyle", "Kovalenko", "Adebola", "Lewandowski",
  "Reilly", "Casey", "Farrell", "Obi", "Dumitru", "Sheehan", "Nowicki",
  "Afolabi", "Hogan", "Ryan", "Munteanu", "Bello", "Woźniak", "Devlin",
  "Callaghan", "Idris", "Mazur", "Coyle", "Duggan", "Ksiazek",
];

export const guards: Guard[] = Array.from({ length: 55 }, (_, i) => {
  const first = GUARD_FIRST[i % GUARD_FIRST.length];
  const last = GUARD_LAST[i % GUARD_LAST.length];
  const name = `${first} ${last}`;
  const area = AREA_KEYS[i % AREA_KEYS.length];
  const sub = i % 4 === 0;
  // expiries spread; a handful inside 30 days, two already expired
  const expMonth = 8 + (i % 10); // months from a base
  const expYear = 2026 + Math.floor((expMonth - 1) / 12);
  const mm = String(((expMonth - 1) % 12) + 1).padStart(2, "0");
  const dd = String(((i * 7) % 27) + 1).padStart(2, "0");
  let licenceExpiry = `${dd}/${mm}/${expYear}`;
  if (i === 3) licenceExpiry = "02/09/2026"; // inside 30 days
  if (i === 14) licenceExpiry = "28/08/2026"; // inside 30 days
  if (i === 27) licenceExpiry = "05/09/2026"; // inside 30 days
  if (i === 9) licenceExpiry = "31/07/2026"; // expired
  if (i === 41) licenceExpiry = "10/08/2026"; // expired
  return {
    id: `g${i + 1}`,
    name,
    initials: (first[0] + last.replace(/[^A-Za-z]/g, "")[0]).toUpperCase(),
    phone: `08${(i % 3) + 3} ${String(100 + i).slice(-3)} ${String(1000 + i * 7).slice(-4)}`,
    area,
    licenceNo: `PSA-${20000 + i * 13}`,
    licenceExpiry,
    hoursThisWeek: [22, 31, 44, 38, 51, 12, 47, 29, 40, 35, 49, 18][i % 12],
    available: i % 5 !== 0,
    subcontractor: sub,
    firm: sub ? ["Sentinel Security", "Rampart Guarding", "Vanguard Ops"][i % 3] : undefined,
    rate: sub ? 21 : 17 + (i % 3),
    certs: ["PSA licence", i % 2 ? "First aid" : "Fire warden", i % 3 ? "Manual handling" : "Conflict mgmt"],
  };
});

const guardById = Object.fromEntries(guards.map((g) => [g.id, g]));
export const getGuard = (id: string | null) => (id ? guardById[id] : undefined);

export function licenceDaysLeft(expiry: string, today = "17/08/2026"): number {
  const p = (s: string) => {
    const [d, m, y] = s.split("/").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((p(expiry) - p(today)) / 86400000);
}

// ---------------------------------------------------------------------------
// Clients — 22 estate agent / property firms. Top two = 41% of revenue.
// ---------------------------------------------------------------------------
type ClientSeed = {
  name: string;
  services: ServiceKind[];
  monthlyValue: number;
  renewal: string;
  lastContactDays: number;
  loyaltyYears: number;
};

const CLIENT_SEED: ClientSeed[] = [
  { name: "Fitzgerald Property Group", services: ["guarding"], monthlyValue: 26000, renewal: "31/12/2026", lastContactDays: 2, loyaltyYears: 22 },
  { name: "Blackwood Estates", services: ["guarding", "property"], monthlyValue: 17500, renewal: "30/09/2026", lastContactDays: 5, loyaltyYears: 18 },
  { name: "Ardmore Lettings", services: ["property"], monthlyValue: 6200, renewal: "14/02/2027", lastContactDays: 41, loyaltyYears: 31 },
  { name: "Kilbride Asset Management", services: ["guarding"], monthlyValue: 5800, renewal: "01/11/2026", lastContactDays: 9, loyaltyYears: 12 },
  { name: "Sandymount Residential", services: ["property"], monthlyValue: 4100, renewal: "20/10/2026", lastContactDays: 63, loyaltyYears: 40 },
  { name: "Rathgar Estate Agents", services: ["guarding"], monthlyValue: 4600, renewal: "05/01/2027", lastContactDays: 14, loyaltyYears: 27 },
  { name: "Clontarf Property Partners", services: ["guarding", "property"], monthlyValue: 5200, renewal: "28/02/2027", lastContactDays: 3, loyaltyYears: 15 },
  { name: "Northside Homes", services: ["property"], monthlyValue: 2900, renewal: "12/12/2026", lastContactDays: 88, loyaltyYears: 34 },
  { name: "Grafton Commercial", services: ["guarding"], monthlyValue: 3800, renewal: "18/09/2026", lastContactDays: 21, loyaltyYears: 9 },
  { name: "Liffey Valley Lettings", services: ["property"], monthlyValue: 2400, renewal: "03/03/2027", lastContactDays: 52, loyaltyYears: 24 },
  { name: "Malahide Coastal Estates", services: ["guarding"], monthlyValue: 3100, renewal: "22/11/2026", lastContactDays: 6, loyaltyYears: 20 },
  { name: "Templeogue Residential", services: ["property"], monthlyValue: 1900, renewal: "09/01/2027", lastContactDays: 74, loyaltyYears: 38 },
  { name: "Docklands Facilities", services: ["guarding", "property"], monthlyValue: 4400, renewal: "15/10/2026", lastContactDays: 4, loyaltyYears: 7 },
  { name: "Stillorgan Property Co", services: ["guarding"], monthlyValue: 2600, renewal: "27/12/2026", lastContactDays: 33, loyaltyYears: 16 },
  { name: "Portmarnock Lettings", services: ["property"], monthlyValue: 1700, renewal: "11/02/2027", lastContactDays: 96, loyaltyYears: 29 },
  { name: "Terenure Estates", services: ["guarding"], monthlyValue: 2200, renewal: "30/11/2026", lastContactDays: 12, loyaltyYears: 23 },
  { name: "Howth Head Management", services: ["property"], monthlyValue: 1500, renewal: "06/03/2027", lastContactDays: 47, loyaltyYears: 26 },
  { name: "Citywest Business Park", services: ["guarding", "property"], monthlyValue: 3600, renewal: "19/09/2026", lastContactDays: 8, loyaltyYears: 11 },
  { name: "Ranelagh Residential", services: ["property"], monthlyValue: 1300, renewal: "24/01/2027", lastContactDays: 58, loyaltyYears: 35 },
  { name: "Finglas Property Trust", services: ["guarding"], monthlyValue: 1800, renewal: "02/12/2026", lastContactDays: 17, loyaltyYears: 13 },
  { name: "Dalkey Prime Estates", services: ["property"], monthlyValue: 1250, renewal: "16/02/2027", lastContactDays: 39, loyaltyYears: 30 },
  { name: "Ballsbridge Holdings", services: ["guarding", "property"], monthlyValue: 2760, renewal: "08/10/2026", lastContactDays: 1, loyaltyYears: 6 },
];

const CONTACT_FIRST = ["Aoife", "Declan", "Sinéad", "Brendan", "Órla", "Ciarán", "Nuala", "Fergus"];
const CONTACT_LAST = ["Gallagher", "O'Sullivan", "Brady", "Cronin", "Healy", "Kavanagh", "Fahey", "Doherty"];

function daysToDate(days: number): string {
  const base = Date.UTC(2026, 7, 17);
  const d = new Date(base - days * 86400000);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
}

export const clients: Client[] = CLIENT_SEED.map((c, i) => {
  const slug = c.name.toLowerCase().replace(/[^a-z]+/g, "");
  return {
    id: `c${i + 1}`,
    name: c.name,
    services: c.services,
    monthlyValue: c.monthlyValue,
    renewal: c.renewal,
    lastContact: daysToDate(c.lastContactDays),
    lastContactDays: c.lastContactDays,
    loyaltyYears: c.loyaltyYears,
    contacts: [
      {
        name: `${CONTACT_FIRST[i % CONTACT_FIRST.length]} ${CONTACT_LAST[i % CONTACT_LAST.length]}`,
        role: "Property Manager",
        email: `${CONTACT_FIRST[i % CONTACT_FIRST.length].toLowerCase()}@${slug}.ie`,
      },
      {
        name: `${CONTACT_FIRST[(i + 3) % CONTACT_FIRST.length]} ${CONTACT_LAST[(i + 4) % CONTACT_LAST.length]}`,
        role: "Accounts",
        email: `accounts@${slug}.ie`,
      },
    ],
  };
});

const clientById = Object.fromEntries(clients.map((c) => [c.id, c]));
export const getClient = (id: string | null) => (id ? clientById[id] : undefined);

export const totalMonthlyRevenue = clients.reduce((s, c) => s + c.monthlyValue, 0);
export const clientShare = (c: Client) => (c.monthlyValue / totalMonthlyRevenue) * 100;
const sortedByValue = [...clients].sort((a, b) => b.monthlyValue - a.monthlyValue);
export const topTwoShare = Math.round(
  ((sortedByValue[0].monthlyValue + sortedByValue[1].monthlyValue) / totalMonthlyRevenue) * 100
);
export const REVENUE_TARGET = 20;
export const singleServiceClients = clients.filter((c) => c.services.length === 1);

// which service a single-service client is missing, and the value of a peer that holds it
export function crossSell(c: Client): { missing: ServiceKind; peerValue: number } | null {
  if (c.services.length !== 1) return null;
  const missing: ServiceKind = c.services[0] === "guarding" ? "property" : "guarding";
  const peers = clients.filter((p) => p.services.includes(missing));
  const peerValue = Math.round(peers.reduce((s, p) => s + p.monthlyValue, 0) / peers.length);
  return { missing, peerValue };
}

// ---------------------------------------------------------------------------
// Sites — 35 active sites across Dublin & Leinster.
// ---------------------------------------------------------------------------
const guardingClientIds = clients.filter((c) => c.services.includes("guarding")).map((c) => c.id);

const SITE_SEED: { name: string; address: string; type: SiteType; area: string }[] = [
  { name: "Grangegorman Block C", address: "Grangegorman Lower, Dublin 7", type: "Construction", area: "Dublin 7" },
  { name: "Poolbeg SDZ Site 4", address: "Sean Moore Rd, Dublin 4", type: "Construction", area: "Dublin 4" },
  { name: "Cherrywood Plot 12", address: "Cherrywood, Dublin 18", type: "Construction", area: "Dublin 18" },
  { name: "Clongriffin Phase 3", address: "Main St, Clongriffin, Dublin 13", type: "Construction", area: "Dublin 9" },
  { name: "Adamstown Central", address: "Adamstown, Lucan", type: "Construction", area: "Lucan" },
  { name: "Naas Town Centre", address: "South Main St, Naas", type: "Retail", area: "Naas" },
  { name: "Blanchardstown Retail Unit 9", address: "Blanchardstown Centre", type: "Retail", area: "Blanchardstown" },
  { name: "Swords Pavilions Kiosk", address: "Pavilions, Swords", type: "Retail", area: "Swords" },
  { name: "Tallaght Square Unit 22", address: "The Square, Tallaght", type: "Retail", area: "Tallaght" },
  { name: "Henry St Vacant Unit", address: "Henry St, Dublin 1", type: "Retail", area: "Dublin 1" },
  { name: "Dorset St Voids", address: "Dorset St Lower, Dublin 1", type: "Void housing", area: "Dublin 1" },
  { name: "Ballymun Tower B", address: "Ballymun, Dublin 9", type: "Void housing", area: "Dublin 9" },
  { name: "Crumlin Terrace Voids", address: "Crumlin Rd, Dublin 12", type: "Void housing", area: "Dublin 12" },
  { name: "Finglas Court Voids", address: "Finglas East, Dublin 11", type: "Void housing", area: "Dublin 15" },
  { name: "Inchicore Row", address: "Emmet Rd, Dublin 8", type: "Void housing", area: "Dublin 8" },
  { name: "Sandyford Vacant Block", address: "Blackthorn Rd, Dublin 18", type: "Vacant residential", area: "Dublin 18" },
  { name: "Dún Laoghaire Seafront Apts", address: "Marine Rd, Dún Laoghaire", type: "Vacant residential", area: "Dún Laoghaire" },
  { name: "Bray Harbour Court", address: "Strand Rd, Bray", type: "Vacant residential", area: "Bray" },
  { name: "Maynooth Manor Vacant", address: "Straffan Rd, Maynooth", type: "Vacant residential", area: "Maynooth" },
  { name: "Drogheda Quay Block", address: "Marsh Rd, Drogheda", type: "Vacant residential", area: "Drogheda" },
  { name: "Docklands Point East", address: "North Wall Quay, Dublin 1", type: "Construction", area: "Dublin 1" },
  { name: "Citywest Logistics Shell", address: "Citywest Business Campus", type: "Construction", area: "Tallaght" },
  { name: "Clondalkin Retail Park", address: "Ninth Lock Rd, Clondalkin", type: "Retail", area: "Clondalkin" },
  { name: "Rathmines Vacant Terrace", address: "Rathmines Rd, Dublin 6", type: "Vacant residential", area: "Dublin 6" },
  { name: "Stoneybatter Voids", address: "Manor St, Dublin 7", type: "Void housing", area: "Dublin 7" },
  { name: "Malahide Marina Units", address: "Marina Village, Malahide", type: "Vacant residential", area: "Swords" },
  { name: "Terenure Vacant Store", address: "Terenure Rd, Dublin 6", type: "Retail", area: "Dublin 6" },
  { name: "Portobello Canal Block", address: "South Circular Rd, Dublin 8", type: "Construction", area: "Dublin 8" },
  { name: "Blackrock Village Unit", address: "Main St, Blackrock", type: "Retail", area: "Dún Laoghaire" },
  { name: "Ashtown Gate Site", address: "Navan Rd, Dublin 15", type: "Construction", area: "Dublin 15" },
  { name: "Kilmainham Voids", address: "Old Kilmainham, Dublin 8", type: "Void housing", area: "Dublin 8" },
  { name: "Coolock Retail Unit 5", address: "Malahide Rd, Dublin 5", type: "Retail", area: "Dublin 9" },
  { name: "Lucan Weir Apts", address: "Lucan Village", type: "Vacant residential", area: "Lucan" },
  { name: "Palmerstown Shell", address: "Kennelsfort Rd, Dublin 20", type: "Construction", area: "Clondalkin" },
  { name: "Newbridge Retail Row", address: "Main St, Newbridge", type: "Retail", area: "Naas" },
];

// Real lng/lat for each site (same order as SITE_SEED), projected onto the map.
const SITE_GEO: [number, number][] = [
  [-6.286, 53.355], // Grangegorman D7
  [-6.205, 53.342], // Poolbeg / Ringsend
  [-6.142, 53.244], // Cherrywood D18
  [-6.158, 53.399], // Clongriffin D13
  [-6.445, 53.34], // Adamstown, Lucan
  [-6.659, 53.219], // Naas (clamped W)
  [-6.377, 53.393], // Blanchardstown
  [-6.218, 53.459], // Swords Pavilions
  [-6.373, 53.288], // Tallaght
  [-6.263, 53.349], // Henry St D1
  [-6.263, 53.358], // Dorset St D1
  [-6.264, 53.396], // Ballymun
  [-6.315, 53.327], // Crumlin D12
  [-6.298, 53.393], // Finglas
  [-6.323, 53.339], // Inchicore D8
  [-6.222, 53.278], // Sandyford D18
  [-6.135, 53.294], // Dún Laoghaire
  [-6.099, 53.204], // Bray
  [-6.591, 53.381], // Maynooth (clamped W)
  [-6.349, 53.717], // Drogheda (clamped N)
  [-6.228, 53.348], // Docklands / North Wall
  [-6.423, 53.283], // Citywest
  [-6.395, 53.322], // Clondalkin
  [-6.265, 53.324], // Rathmines D6
  [-6.288, 53.351], // Stoneybatter D7
  [-6.155, 53.451], // Malahide
  [-6.289, 53.309], // Terenure D6
  [-6.267, 53.331], // Portobello D8
  [-6.178, 53.301], // Blackrock
  [-6.335, 53.377], // Ashtown D15
  [-6.31, 53.342], // Kilmainham D8
  [-6.198, 53.393], // Coolock D5
  [-6.449, 53.356], // Lucan
  [-6.375, 53.356], // Palmerstown D20
  [-6.8, 53.181], // Newbridge (clamped W)
];

const PATROL_NOTES = [
  "Perimeter walk, all clear",
  "Checked ground floor entries, secure",
  "Hoarding intact, no incursion",
  "Rear gate locked, checked",
  "Site lighting on, no issues",
  "Logged delivery gate, secured after",
];

function siteStatusFor(i: number): SiteStatus {
  if (i === 0) return "No show";
  if (i === 4 || i === 11) return "Late";
  if (i % 6 === 5) return "Checked out";
  return "On site";
}

export const sites: Site[] = SITE_SEED.map((s, i) => {
  const clientId = guardingClientIds[i % guardingClientIds.length];
  const guardId = i === 0 ? null : `g${((i * 3) % 55) + 1}`;
  const status = siteStatusFor(i);
  const rosteredIn = ["19:00", "20:00", "18:00", "21:00"][i % 4];
  const rosteredOut = ["07:00", "06:00", "08:00", "05:00"][i % 4];
  const window = `${rosteredIn} – ${rosteredOut}`;
  const late = status === "Late" ? [12, 23][i % 2] : undefined;
  const actualIn =
    status === "No show"
      ? null
      : status === "Late"
        ? addMinutes(rosteredIn, late ?? 0)
        : addMinutes(rosteredIn, -(i % 5));
  const actualOut = status === "Checked out" ? rosteredOut : null;
  return {
    id: `s${i + 1}`,
    name: s.name,
    address: s.address,
    clientId,
    type: s.type,
    area: s.area,
    map: project(SITE_GEO[i][0], SITE_GEO[i][1]),
    window,
    guardId,
    status,
    rosteredIn,
    actualIn,
    rosteredOut,
    actualOut,
    lateBy: late,
    lastPatrol:
      status === "No show" ? "—" : ["23:40", "00:15", "01:30", "02:10", "22:55"][i % 5],
    patrolLog:
      status === "No show"
        ? []
        : Array.from({ length: 3 + (i % 3) }, (_, k) => ({
            time: ["22:05", "23:10", "00:20", "01:35", "02:40"][k % 5],
            note: PATROL_NOTES[(i + k) % PATROL_NOTES.length],
          })),
    incidents:
      i % 7 === 2
        ? [{ time: "01:12", note: "Attempted access at rear hoarding, moved on, Gardaí notified", photo: "incident" }]
        : [],
  };
});

function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  let total = h * 60 + m + mins;
  total = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}


const siteById = Object.fromEntries(sites.map((s) => [s.id, s]));
export const getSite = (id: string | null) => (id ? siteById[id] : undefined);

// ---------------------------------------------------------------------------
// Open shifts needing cover — the no-show plus six unfilled.
// ---------------------------------------------------------------------------
export const openShifts: OpenShift[] = [
  { id: "os1", siteId: "s1", time: "19:00 – 07:00", date: "17/08/2026", reason: "No show" },
  { id: "os2", siteId: "s6", time: "20:00 – 06:00", date: "17/08/2026", reason: "Sick" },
  { id: "os3", siteId: "s9", time: "18:00 – 08:00", date: "17/08/2026", reason: "Unfilled" },
  { id: "os4", siteId: "s13", time: "21:00 – 05:00", date: "18/08/2026", reason: "Unfilled" },
  { id: "os5", siteId: "s17", time: "19:00 – 07:00", date: "18/08/2026", reason: "Sick" },
  { id: "os6", siteId: "s22", time: "20:00 – 06:00", date: "18/08/2026", reason: "Unfilled" },
  { id: "os7", siteId: "s28", time: "18:00 – 08:00", date: "19/08/2026", reason: "Unfilled" },
];

// Ranked candidates for a given open shift, computed from guard fields.
export type Candidate = {
  guard: Guard;
  worked: number;
  distance: number;
  overtime: boolean;
  licenceValid: boolean;
  score: number;
};

export function candidatesFor(shift: OpenShift): Candidate[] {
  const site = getSite(shift.siteId);
  if (!site) return [];
  return guards
    .map((g) => {
      const worked = timesWorked(g.id, site.id);
      const distance = distanceKm(g.area, site.area);
      const overtime = g.hoursThisWeek >= 48;
      const licenceValid = licenceDaysLeft(g.licenceExpiry) > 0;
      let score = 0;
      score += worked * 8;
      score += Math.max(0, 30 - distance);
      score += g.available ? 25 : -40;
      score += licenceValid ? 15 : -100;
      score += overtime ? -20 : 10;
      score -= g.hoursThisWeek * 0.4;
      return { guard: g, worked, distance, overtime, licenceValid, score };
    })
    .filter((c) => c.licenceValid)
    .sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------
// Roster — week grid. Sites x Mon–Sun. Six unfilled cells.
// ---------------------------------------------------------------------------
export const rosterDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const rosterDates = ["17/08", "18/08", "19/08", "20/08", "21/08", "22/08", "23/08"];

export type RosterCell = { guardId: string | null; hours: number };

const rosterSiteIds = sites.slice(0, 10).map((s) => s.id);

// deterministic grid; exactly six unfilled cells flagged
const UNFILLED: string[] = ["s1-Mon", "s3-Wed", "s6-Thu", "s6-Fri", "s9-Sat", "s10-Tue"];

export function rosterCell(siteId: string, day: string, idx: number): RosterCell {
  if (UNFILLED.includes(`${siteId}-${day}`)) return { guardId: null, hours: 0 };
  const site = getSite(siteId);
  const gi = (idx * 5 + day.charCodeAt(0)) % 55;
  const hours = site ? shiftHours(site.window) : 12;
  return { guardId: `g${gi + 1}`, hours };
}

function shiftHours(window: string): number {
  const [a, b] = window.split(" – ");
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  let mins = bh * 60 + bm - (ah * 60 + am);
  if (mins <= 0) mins += 1440;
  return Math.round((mins / 60) * 10) / 10;
}

export const rosterSites = rosterSiteIds;
export const rosterStats = (() => {
  let scheduled = 0;
  let unfilled = 0;
  let hours = 0;
  rosterSiteIds.forEach((sid, i) => {
    rosterDays.forEach((d) => {
      const cell = rosterCell(sid, d, i);
      if (cell.guardId) {
        scheduled++;
        hours += cell.hours;
      } else {
        unfilled++;
      }
    });
  });
  return { scheduled, unfilled, hours: Math.round(hours) };
})();

// ---------------------------------------------------------------------------
// Timesheets — month rows with variance. Hero: 12h rostered vs 8h40 actual.
// ---------------------------------------------------------------------------
export const timesheets: Timesheet[] = (() => {
  const rows: Timesheet[] = [];
  // hero row first: 12h rostered, 8.667 actual (8h40)
  rows.push({ id: "t1", guardId: "g10", siteId: "s3", rostered: 12, actual: 8.667, rate: 18, status: "Pending" });
  const variances = [0, -0.25, 0.5, -1.5, 0, 0.15, -0.75, 2, -0.1, 0, -3.25, 0.4, 0, -0.5, 1.25, 0, -0.2, -2.5, 0.75, 0];
  for (let i = 0; i < 44; i++) {
    const g = guards[(i * 3 + 5) % 55];
    const s = sites[(i * 2 + 1) % sites.length];
    const rostered = [12, 10, 14, 11, 8][i % 5];
    const v = variances[i % variances.length];
    rows.push({
      id: `t${i + 2}`,
      guardId: g.id,
      siteId: s.id,
      rostered,
      actual: Math.max(0, Math.round((rostered + v) * 1000) / 1000),
      rate: g.rate,
      status: i % 3 === 0 && v > -0.5 && v < 0.5 ? "Approved" : "Pending",
    });
  }
  return rows;
})();

export const timesheetMonths = ["July 2026", "August 2026", "June 2026"];

// ---------------------------------------------------------------------------
// Equipment — 72 assets, 31% loss rate, 11 overdue, 11 written off.
// ---------------------------------------------------------------------------
const EQUIP_TYPES: EquipmentType[] = ["Heater", "Fridge", "Cooker", "Dehumidifier"];
const EQUIP_VALUE: Record<EquipmentType, number> = { Heater: 220, Fridge: 340, Cooker: 480, Dehumidifier: 290 };
const TENANT_NAMES = [
  "Unit 4B Sandymount", "Apt 12 Rathmines", "14 Dorset St", "Unit 7 Clontarf",
  "Apt 3 Ranelagh", "22 Terenure Rd", "Unit 9 Malahide", "Apt 1 Portobello",
  "18 Stoneybatter", "Unit 6 Dalkey", "Apt 5 Blackrock", "31 Finglas East",
];
const TENANT_PEOPLE = [
  "S. Doyle", "M. Nowak", "A. Byrne", "C. Okafor", "L. Murphy", "R. Popescu",
  "N. Kelly", "T. Adeyemi", "F. Walsh", "K. Nolan", "D. Mensah", "B. Brennan",
];

export const assets: Asset[] = Array.from({ length: 72 }, (_, i) => {
  const type = EQUIP_TYPES[i % 4];
  let status: EquipmentStatus;
  if (i < 11) status = "Overdue";
  else if (i < 22) status = "Written off";
  else if (i < 40) status = "In store";
  else status = "Out on hire";
  const onHire = status === "Out on hire" || status === "Overdue";
  const unit = onHire ? TENANT_NAMES[i % TENANT_NAMES.length] : null;
  const tenant = onHire ? TENANT_PEOPLE[i % TENANT_PEOPLE.length] : null;
  const clientId = onHire ? clients.filter((c) => c.services.includes("property"))[i % 8].id : null;
  const dateOut = onHire ? daysToDate(status === "Overdue" ? 40 + (i % 30) : 8 + (i % 20)) : null;
  const dateDue = onHire ? daysToDate(status === "Overdue" ? 6 + (i % 20) : -(10 + (i % 20))) : null;
  return {
    id: `CC-${1000 + i}`,
    type,
    condition: (["Good", "Fair", "Worn"] as const)[i % 3],
    status,
    value: EQUIP_VALUE[type],
    deposit: status === "Written off" ? 0 : [150, 200, 250][i % 3],
    unit,
    tenant,
    clientId,
    dateOut,
    dateDue,
    history: [
      { date: dateOut ?? daysToDate(60), note: `Issued${unit ? ` to ${unit}` : " into store"}${tenant ? ` (${tenant})` : ""}` },
      ...(status === "Overdue" ? [{ date: dateDue ?? "", note: "Return date passed, reminder sent" }] : []),
      ...(status === "Written off" ? [{ date: daysToDate(15), note: "Marked written off, deposit forfeited" }] : []),
    ],
  };
});

export const equipmentStats = (() => {
  const owned = assets.length;
  const out = assets.filter((a) => a.status === "Out on hire" || a.status === "Overdue").length;
  const overdue = assets.filter((a) => a.status === "Overdue").length;
  const lost = assets.filter((a) => a.status === "Overdue" || a.status === "Written off");
  const lossRate = Math.round((lost.length / owned) * 100);
  const unrecovered = lost.reduce((s, a) => s + a.value, 0);
  return { owned, out, overdue, lossRate, unrecovered };
})();

// ---------------------------------------------------------------------------
// Property jobs — 52 across the board.
// ---------------------------------------------------------------------------
const JOB_TYPES: JobType[] = ["Repair", "Clean", "Void inspection", "Key handover", "Equipment delivery"];
const CONTRACTORS = [
  "Murphy Maintenance", "Leinster Cleaning Co", "Dublin Locks & Keys",
  "Rapid Repairs Ltd", "Coastal Property Services", "Citywide Contractors", null,
];
const JOB_ADDRESSES = [
  "Unit 4B, Sandymount Ave", "Apt 12, Rathmines Rd", "14 Dorset St Lower",
  "Unit 7, Clontarf Rd", "Apt 3, Ranelagh Village", "22 Terenure Rd",
  "Unit 9, Malahide Marina", "Apt 1, Portobello Harbour", "18 Stoneybatter",
  "Unit 6, Dalkey Village", "Apt 5, Blackrock Main St", "31 Finglas East",
];
const JOB_STATUSES: JobStatus[] = ["Requested", "Assigned", "In progress", "Complete"];

export const jobs: Job[] = Array.from({ length: 52 }, (_, i) => {
  const type = JOB_TYPES[i % JOB_TYPES.length];
  const propertyClients = clients.filter((c) => c.services.includes("property"));
  const client = propertyClients[i % propertyClients.length];
  const status = JOB_STATUSES[i % 4];
  const contractor = status === "Requested" ? null : CONTRACTORS[i % CONTRACTORS.length];
  const address = JOB_ADDRESSES[i % JOB_ADDRESSES.length];
  const contact = client.contacts[0];
  return {
    id: `j${i + 1}`,
    ref: `PJ-${2400 + i}`,
    address,
    clientId: client.id,
    type,
    contractor,
    raised: daysToDate((i % 12) + 1),
    slaHours: [4, 8, 12, 24, 36, 48, -3][i % 7],
    status,
    emailFrom: contact.email,
    emailSubject: `${type} request — ${address}`,
    emailBody: jobEmailBody(type, address, contact.name),
    notes:
      status === "Requested"
        ? []
        : [
            `Assigned to ${contractor ?? "contractor"} by Jackie`,
            ...(status === "In progress" || status === "Complete" ? ["Contractor on site, work underway"] : []),
            ...(status === "Complete" ? ["Work signed off, proof photo uploaded"] : []),
          ],
    proof: status === "Complete",
  };
});

function jobEmailBody(type: JobType, address: string, from: string): string {
  const lines: Record<JobType, string> = {
    Repair: `Hi, we've had a tenant report at ${address}. Can your team take a look and quote? Needs sorting this week if possible.`,
    Clean: `Morning, the unit at ${address} is between tenants. Can you arrange a full clean before the next viewing?`,
    "Void inspection": `Can you send someone to inspect ${address}? It's been void a few weeks and we want condition confirmed.`,
    "Key handover": `New tenant moving into ${address} Friday. Can you handle the key handover and meter readings?`,
    "Equipment delivery": `Tenant at ${address} has requested a heater and dehumidifier on the usual hire terms. Can you deliver this week?`,
  };
  return `From: ${from}\n\n${lines[type]}\n\nThanks`;
}

let jobSeq = jobs.length;
export function nextJobRef(): { id: string; ref: string } {
  jobSeq++;
  return { id: `j${jobSeq}`, ref: `PJ-${2400 + jobSeq - 1}` };
}

// ---------------------------------------------------------------------------
// Named users
// ---------------------------------------------------------------------------
export const users = {
  christy: { name: "Christy Nolan", role: "Owner", initials: "CN" },
  megan: { name: "Megan Nolan", role: "Accounts", initials: "MN" },
  jackie: { name: "Jackie Behan", role: "Property Manager", initials: "JB" },
};

// Portal accounts the presenter can switch between
export const portalAccounts = [
  { clientId: "c1", label: "Fitzgerald Property Group" },
  { clientId: "c2", label: "Blackwood Estates" },
];
