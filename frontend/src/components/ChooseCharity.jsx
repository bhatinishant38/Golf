import { useState } from "react";
import {
  Search,
  Users,
  Droplet,
  GraduationCap,
  Leaf,
  HeartPulse,
  Waves,
  Sprout,
  BookOpen,
  HandHeart,
} from "lucide-react";

const categories = ["All", "Environment", "Education", "Health", "Community"];

const charities = [
  {
    id: "clean-water",
    name: "Clean Water for All",
    category: "Environment",
    description: "Providing clean water to communities worldwide.",
    raised: "₹58,500",
    members: 240,
    icon: Droplet,
    tint: "from-sky-500 to-sky-700",
  },
  {
    id: "education-for-all",
    name: "Education for All",
    category: "Education",
    description: "Supporting education for underprivileged children.",
    raised: "₹1,00,000",
    members: 180,
    icon: GraduationCap,
    tint: "from-amber-500 to-orange-600",
  },
  {
    id: "save-environment",
    name: "Save the Environment",
    category: "Environment",
    description: "Protecting our planet for future generations.",
    raised: "₹1,25,000",
    members: 150,
    icon: Leaf,
    tint: "from-green-500 to-green-700",
  },
  {
    id: "health-wellness",
    name: "Health & Wellness",
    category: "Health",
    description: "Improving healthcare access for all.",
    raised: "₹96,000",
    members: 98,
    icon: HeartPulse,
    tint: "from-rose-500 to-rose-700",
  },
  {
    id: "food-bank",
    name: "Community Food Bank",
    category: "Community",
    description: "Fighting hunger, one meal at a time.",
    raised: "₹42,300",
    members: 210,
    icon: HandHeart,
    tint: "from-yellow-500 to-amber-600",
  },
  {
    id: "literacy-kids",
    name: "Literacy for Kids",
    category: "Education",
    description: "Building reading skills in underserved schools.",
    raised: "₹73,800",
    members: 132,
    icon: BookOpen,
    tint: "from-indigo-500 to-indigo-700",
  },
  {
    id: "reforestation",
    name: "Reforestation Project",
    category: "Environment",
    description: "Planting trees to restore damaged ecosystems.",
    raised: "₹88,200",
    members: 176,
    icon: Sprout,
    tint: "from-emerald-500 to-emerald-700",
  },
  {
    id: "mental-health",
    name: "Mental Health Support",
    category: "Health",
    description: "Free counselling for those who need it most.",
    raised: "₹61,400",
    members: 120,
    icon: HeartPulse,
    tint: "from-purple-500 to-purple-700",
  },
  {
    id: "youth-mentorship",
    name: "Youth Mentorship",
    category: "Community",
    description: "Connecting young people with mentors who care.",
    raised: "₹34,900",
    members: 95,
    icon: Users,
    tint: "from-teal-500 to-teal-700",
  },
  {
    id: "ocean-cleanup",
    name: "Ocean Cleanup Initiative",
    category: "Environment",
    description: "Removing plastic waste from oceans and rivers.",
    raised: "₹1,10,500",
    members: 205,
    icon: Waves,
    tint: "from-cyan-500 to-blue-700",
  },
  {
    id: "rural-clinic",
    name: "Rural Health Clinic",
    category: "Health",
    description: "Bringing basic medical care to remote villages.",
    raised: "₹79,600",
    members: 143,
    icon: HeartPulse,
    tint: "from-red-500 to-red-700",
  },
];

const VISIBLE_COUNT = 4;

function CharityCard({ charity, isLoggedIn }) {
  const Icon = charity.icon;
  const href = isLoggedIn
    ? `/charities/${charity.id}`
    : `/register?charity=${charity.id}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md">
      <div className={`flex h-28 items-center justify-center bg-linear-to-br ${charity.tint}`}>
        <Icon className="h-10 w-10 text-white/90" strokeWidth={1.75} />
      </div>

      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-900">{charity.name}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          {charity.description}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium text-green-700">{charity.raised} raised</span>
          <span>{charity.members} members</span>
        </div>

        <a
          href={href}
          className="mt-4 block w-full rounded-md bg-green-800 py-2 text-center text-sm font-semibold text-white transition hover:bg-green-900"
        >
          Select
        </a>
      </div>
    </div>
  );
}

export default function ChooseCharity({ isLoggedIn = false }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = charities.filter((charity) => {
    const matchesCategory = category === "All" || charity.category === category;
    const matchesQuery = charity.name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const visible = showAll ? filtered : filtered.slice(0, VISIBLE_COUNT);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Choose a charity
        </h1>
        <p className="mt-1.5 max-w-lg text-sm text-slate-500">
          Support a cause that matters. A portion of your subscription helps
          fund your selected charity.
        </p>

        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowAll(false);
            }}
            placeholder="Search charities..."
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                setShowAll(false);
              }}
              aria-pressed={category === cat}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-green-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {visible.map((charity) => (
              <CharityCard key={charity.id} charity={charity} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-slate-500">
            No charities match your search.
          </p>
        )}

        {!showAll && filtered.length > VISIBLE_COUNT && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="rounded-full border border-green-700/30 px-6 py-2.5 text-sm font-semibold text-green-800 transition hover:bg-green-50"
            >
              Show more charities
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
