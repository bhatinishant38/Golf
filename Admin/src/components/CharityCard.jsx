import { Pencil, Trash2 } from "lucide-react";
import { tints } from "../Data/demo";


// Component 1: Single Charity Card - Same UI as your example, green & white
const CharityCard = ({ charity, onEdit, onDelete, isDeleting }) => {
  const tint = tints[charity.category] || "from-[#0B5D3B] to-emerald-700";

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm border-gray-100 group hover:shadow-md transition-shadow">
      {/* Top gradient + image - matches your original design */}
      <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${tint} overflow-hidden`}>
        {charity.image && (
          <>
            <img
              src={charity.image}
              alt={charity.name}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition duration-700"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${tint} opacity-90`}></div>
          </>
        )}
        <div className="relative w-12 h-12 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
          <span className="text-white font-bold text-[18px]">{charity.name.charAt(0).toUpperCase()}</span>
        </div>

        <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(charity)}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur grid place-items-center hover:bg-white shadow-sm"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => onDelete(charity._id)}
            className="w-7 h-7 rounded-full bg-white/90 backdrop-blur grid place-items-center hover:bg-red-50 hover:text-red-600 shadow-sm"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[14px] text-gray-900 leading-tight line-clamp-1">{charity.name}</h3>
        <p className="text-[11px] text-gray-400 mt-0.5">{charity.category}</p>
        <p className="mt-2 text-[12px] text-gray-500 line-clamp-2 leading-relaxed min-h-[32px]">{charity.description}</p>

        <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
          <span className="font-semibold text-[#0B5D3B]">${Number(charity.raised || 0).toLocaleString()} raised</span>
          <span>{Number(charity.members || 0).toLocaleString()} members</span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onEdit(charity)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#0B5D3B] py-2 text-[12px] font-semibold text-white hover:bg-[#094d31] transition"
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete(charity._id)}
            disabled={isDeleting}
            className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharityCard;
