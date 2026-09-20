import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
  Check,
} from "lucide-react";

// ---- Data (same charities as your landing/register page) ----
// Tip: move this array into its own file (for example data/charities.js) and import it
// in both places, so the two pages always show the same list.

const categories = ["All", "Environment", "Education", "Health", "Community"];

const charities = [
  { id: "clean-water", name: "Clean Water for All", category: "Environment", description: "Providing clean water to communities worldwide.", raised: "₹58,500", members: 240, icon: Droplet, tint: "from-sky-500 to-sky-700" },
  { id: "education-for-all", name: "Education for All", category: "Education", description: "Supporting education for underprivileged children.", raised: "₹1,00,000", members: 180, icon: GraduationCap, tint: "from-amber-500 to-orange-600" },
  { id: "save-environment", name: "Save the Environment", category: "Environment", description: "Protecting our planet for future generations.", raised: "₹1,25,000", members: 150, icon: Leaf, tint: "from-green-500 to-green-700" },
  { id: "health-wellness", name: "Health & Wellness", category: "Health", description: "Improving healthcare access for all.", raised: "₹96,000", members: 98, icon: HeartPulse, tint: "from-rose-500 to-rose-700" },
  { id: "food-bank", name: "Community Food Bank", category: "Community", description: "Fighting hunger, one meal at a time.", raised: "₹42,300", members: 210, icon: HandHeart, tint: "from-yellow-500 to-amber-600" },
  { id: "literacy-kids", name: "Literacy for Kids", category: "Education", description: "Building reading skills in underserved schools.", raised: "₹73,800", members: 132, icon: BookOpen, tint: "from-indigo-500 to-indigo-700" },
  { id: "reforestation", name: "Reforestation Project", category: "Environment", description: "Planting trees to restore damaged ecosystems.", raised: "₹88,200", members: 176, icon: Sprout, tint: "from-emerald-500 to-emerald-700" },
  { id: "mental-health", name: "Mental Health Support", category: "Health", description: "Free counselling for those who need it most.", raised: "₹61,400", members: 120, icon: HeartPulse, tint: "from-purple-500 to-purple-700" },
  { id: "youth-mentorship", name: "Youth Mentorship", category: "Community", description: "Connecting young people with mentors who care.", raised: "₹34,900", members: 95, icon: Users, tint: "from-teal-500 to-teal-700" },
  { id: "ocean-cleanup", name: "Ocean Cleanup Initiative", category: "Environment", description: "Removing plastic waste from oceans and rivers.", raised: "₹1,10,500", members: 205, icon: Waves, tint: "from-cyan-500 to-blue-700" },
  { id: "rural-clinic", name: "Rural Health Clinic", category: "Health", description: "Bringing basic medical care to remote villages.", raised: "₹79,600", members: 143, icon: HeartPulse, tint: "from-red-500 to-red-700" },
];

const VISIBLE_COUNT = 6; // cards shown before "Show more charities"

// ---- One charity card ----

const CharityCard = ({ charity, isSelected, isSaving, onSelect }) => {
  const Icon = charity.icon;

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
        isSelected ? "border-[#0B5D3B] ring-2 ring-emerald-100" : "border-gray-100"
      }`}
    >
      <div className={`flex h-28 items-center justify-center bg-linear-to-br ${charity.tint}`}>
        <Icon className="h-10 w-10 text-white/90" strokeWidth={1.75} />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{charity.name}</h3>
        <p className="text-xs text-gray-400">{charity.category}</p>
        <p className="mt-2 text-sm text-gray-500">{charity.description}</p>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium text-[#0B5D3B]">{charity.raised} raised</span>
          <span>{charity.members} members</span>
        </div>

        <button
          onClick={() => onSelect(charity.id)}
          disabled={isSelected || isSaving}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-colors ${
            isSelected
              ? "cursor-default bg-emerald-50 text-[#0B5D3B]"
              : "bg-[#0B5D3B] text-white hover:bg-[#094d31] disabled:opacity-60"
          }`}
        >
          {isSelected && <Check size={16} />}
          {isSelected ? "Selected" : isSaving ? "Saving..." : "Select"}
        </button>
      </div>
    </div>
  );
};

// ---- Page ----

const Charity = ({ token, backendUrl, currentCharity = "" }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState(currentCharity); // the charity id saved on the user
  const [savingId, setSavingId] = useState("");

  const filtered = charities.filter((charity) => {
    const matchesCategory = category === "All" || charity.category === category;
    const matchesQuery = charity.name.toLowerCase().includes(query.trim().toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const visible = showAll ? filtered : filtered.slice(0, VISIBLE_COUNT);

  const handleSelect = async (charityId) => {
    setSavingId(charityId);
    try {
      const { data } = await axios.put(
        backendUrl + "/api/user/charity",
        { charity: charityId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setSelected(charityId);
        const name = charities.find((c) => c.id === charityId)?.name;
        toast.success(`You're now supporting ${name}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-bold text-[#0B5D3B]">Support a Cause</h1>
      <p className="mb-5 text-sm text-gray-500">
        Choose a charity and make a difference. A portion of your subscription helps fund it.
      </p>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowAll(false);
          }}
          placeholder="Search charities..."
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Category buttons */}
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
                ? "bg-[#0B5D3B] text-white"
                : "bg-white text-gray-600 hover:bg-emerald-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Charity cards */}
      {visible.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((charity) => (
            <CharityCard
              key={charity.id}
              charity={charity}
              isSelected={selected === charity.id}
              isSaving={savingId === charity.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-gray-400">
          No charities match your search. Try a different name or category.
        </p>
      )}

      {/* Show more */}
      {!showAll && filtered.length > VISIBLE_COUNT && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="rounded-full border border-[#0B5D3B]/30 bg-white px-6 py-2.5 text-sm font-semibold text-[#0B5D3B] transition-colors hover:bg-emerald-50"
          >
            Show more charities
          </button>
        </div>
      )}
    </div>
  );
};

export default Charity;
