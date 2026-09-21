import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import CharityList from "../components/CharityList";
import AddCharity from "../components/AddCharity";
import { demoCharities } from "../Data/demo";

// Main Admin Page - composes the 2 components
const Charities = ({ token, backendUrl }) => {
  const [charities, setCharities] = useState(demoCharities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const fetchCharities = async () => {
    try {
      const url = backendUrl ? `${backendUrl}/api/charities` : "/api/charities";
      const { data } = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const list = Array.isArray(data) ? data : data.charities || [];
      if (list.length > 0) setCharities(list);
    } catch (err) {
      console.log("Using demo charities");
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const handleAddClick = () => {
    setEditingCharity(null);
    setIsModalOpen(true);
  };

  const handleEdit = (charity) => {
    setEditingCharity(charity);
    setIsModalOpen(true);
  };

  // Now receives FormData with image FILE
  const handleSubmit = async (formData) => {
    // Basic validation
    if (!formData.get("name") || !formData.get("category") || !formData.get("description")) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!formData.get("image")) {
      toast.error("Please select an image file");
      return;
    }

    setSaving(true);
    try {
      const url = backendUrl ? `${backendUrl}/api/charities` : "/api/charities";
      const config = {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingCharity) {
        await axios.put(`${url}/${editingCharity._id}`, formData, config);
        toast.success("Charity updated");
      } else {
        await axios.post(url, formData, config);
        toast.success("Charity created");
      }
      setIsModalOpen(false);
      setEditingCharity(null);
      fetchCharities();
    } catch (err) {
      // Fallback for demo mode (no backend or when using local preview without multer)
      if (!backendUrl || err.response?.status === 404) {
        const name = formData.get("name");
        const category = formData.get("category");
        const description = formData.get("description");
        const raised = Number(formData.get("raised")) || 0;
        const members = Number(formData.get("members")) || 0;
        const imageFile = formData.get("image");

        // Create preview URL for demo - if it's a File, use object URL, else keep string
        let imageUrl = "";
        if (imageFile instanceof File) {
          imageUrl = URL.createObjectURL(imageFile);
        } else if (typeof imageFile === "string") {
          imageUrl = imageFile;
        }

        if (editingCharity) {
          setCharities((prev) =>
            prev.map((c) => (c._id === editingCharity._id ? { ...c, name, category, description, raised, members, image: imageUrl || c.image } : c))
          );
          toast.success("Charity updated (demo)");
        } else {
          setCharities((prev) => [{ _id: `demo_${Date.now()}`, name, category, description, raised, members, image: imageUrl }, ...prev]);
          toast.success("Charity created (demo)");
        }
        setIsModalOpen(false);
        setEditingCharity(null);
      } else {
        toast.error(err.response?.data?.error || "Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this charity? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const url = backendUrl ? `${backendUrl}/api/charities` : "/api/charities";
      await axios.delete(`${url}/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      toast.success("Charity deleted");
      fetchCharities();
    } catch (err) {
      if (!backendUrl || err.response?.status === 404) {
        setCharities((prev) => prev.filter((c) => c._id !== id));
        toast.success("Charity deleted (demo)");
      } else {
        toast.error("Failed to delete");
      }
    } finally {
      setDeletingId("");
    }
  };

  const totalRaised = charities.reduce((s, c) => s + (Number(c.raised) || 0), 0);
  const totalMembers = charities.reduce((s, c) => s + (Number(c.members) || 0), 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 bg-[#f6f8f6] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-[#0B5D3B]">Support a Cause</h1>
            <span className="bg-emerald-50 text-[#0B5D3B] text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-emerald-100">
              ADMIN • {charities.length} CHARITIES
            </span>
          </div>
          <p className="mt-1 text-[13px] text-gray-500">
            Choose a charity and make a difference. • ${totalRaised.toLocaleString()} raised • {totalMembers.toLocaleString()} members
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-[#0B5D3B] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold flex items-center gap-2 hover:bg-[#094d31] transition shrink-0 shadow-sm"
        >
          <Plus size={16} />
          Add Charity
        </button>
      </div>

      <div className="mt-6">
        <CharityList charities={charities} onEdit={handleEdit} onDelete={handleDelete} deletingId={deletingId} />
      </div>

      <AddCharity
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCharity(null);
        }}
        onSubmit={handleSubmit}
        editingCharity={editingCharity}
        saving={saving}
      />
    </div>
  );
};

export default Charities;
