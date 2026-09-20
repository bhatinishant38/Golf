import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";
import { AppContext } from "../../context/AppContext";

// ---- Helpers ----

// Charity ids saved on the user -> names to show.
// (Same ids as your Charity page. Move both to one shared file when you can.)
const charityNames = {
  "clean-water": "Clean Water for All",
  "education-for-all": "Education for All",
  "save-environment": "Save the Environment",
  "health-wellness": "Health & Wellness",
  "food-bank": "Community Food Bank",
  "literacy-kids": "Literacy for Kids",
  reforestation: "Reforestation Project",
  "mental-health": "Mental Health Support",
  "youth-mentorship": "Youth Mentorship",
  "ocean-cleanup": "Ocean Cleanup Initiative",
  "rural-clinic": "Rural Health Clinic",
};

const genderOptions = ["Not selected", "Male", "Female", "Other"];

// Turn the user from the backend into the values our form uses
const userToForm = (user) => ({
  name: user.name || "",
  phone: user.phone || "",
  gender: user.gender || "Not selected",
  // A date input needs "yyyy-mm-dd". Old users may have text like "Not Selected", so ignore that.
  dob: /^\d{4}-\d{2}-\d{2}/.test(user.dob || "") ? user.dob.slice(0, 10) : "",
});

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-emerald-100";

// ---- Page ----

const Profile = () => {
  const { token, backendUrl } = useContext(AppContext);
  const [user, setUser] = useState(null); // what is saved on the server
  const [form, setForm] = useState(userToForm({}));
  const [imageFile, setImageFile] = useState(null); // a new photo the user picked
  const [preview, setPreview] = useState(""); // preview of that new photo
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const api = backendUrl + "/api/user/profile";
  const headers = { Authorization: `Bearer ${token}` };

  // Load the profile once when the page opens
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await axios.get(api, { headers });
        if (data.success) {
          setUser(data.user);
          setForm(userToForm(data.user));
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Could not load your profile",
        );
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleImageChosen = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("Please choose a PNG, JPG or WebP image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image is too large. The limit is 2 MB.");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Has the user changed anything? Used to enable/disable the Save button.
  const hasChanges =
    user &&
    (imageFile !== null ||
      JSON.stringify(form) !== JSON.stringify(userToForm(user)));

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name can't be empty.");
      return;
    }
    if (form.phone && !/^\+?[0-9]{7,15}$/.test(form.phone)) {
      toast.error("Enter a valid phone number (digits only, 7 to 15 numbers).");
      return;
    }
    if (form.dob && new Date(form.dob) > new Date()) {
      toast.error("Date of birth can't be in the future.");
      return;
    }

    // FormData lets us send text and the image file together
    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("phone", form.phone);
    formData.append("gender", form.gender);
    formData.append("dob", form.dob);
    if (imageFile) formData.append("image", imageFile);

    setSaving(true);
    try {
      const { data } = await axios.put(api, formData, { headers });
      if (data.success) {
        toast.success("Profile updated");
        setUser(data.user);
        setForm(userToForm(data.user));
        setImageFile(null);
        setPreview("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(userToForm(user));
    setImageFile(null);
    setPreview("");
  };

  if (loading) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        Loading your profile...
      </p>
    );
  }
  if (!user) {
    return (
      <p className="py-10 text-center text-sm text-gray-400">
        We couldn't load your profile. Please refresh the page.
      </p>
    );
  }

  const photo = preview || user.image;
  const isExpired =
    user.subscriptionEnd && new Date(user.subscriptionEnd) < new Date();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-xl font-bold text-[#0B5D3B]">My Profile</h1>
      <p className="mb-6 text-sm text-gray-500">
        Update your personal details.
      </p>

      {/* Personal details (editable) */}
      <form
        onSubmit={handleSave}
        className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        {/* Photo */}
        <div className="mb-6 flex items-center gap-5">
          <div className="relative">
            {photo ? (
              <img
                src={photo}
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0B5D3B] text-3xl font-semibold text-white">
                {user.name?.[0]?.toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              aria-label="Change photo"
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#0B5D3B] text-white hover:bg-[#094d31]"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={handleImageChosen}
              className="hidden"
            />
          </div>

          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG or WebP, up to 2 MB
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={inputClass}
            >
              {genderOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Date of birth
            </label>
            <input
              name="dob"
              type="date"
              value={form.dob}
              max={new Date().toISOString().slice(0, 10)}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Email is shown but can't be changed */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={user.email}
              disabled
              className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-500`}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={!hasChanges || saving}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!hasChanges || saving}
            className="rounded-lg bg-[#0B5D3B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#094d31] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      {/* Subscription and charity (read only) */}
      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">
          Subscription & charity
        </h2>

        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-gray-500">Plan</p>
            <p className="font-semibold capitalize text-gray-900">
              {user.subscriptionPlan}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Plan ends on</p>
            <p className="font-semibold text-gray-900">
              {user.subscriptionEnd ? formatDate(user.subscriptionEnd) : "-"}
              {isExpired && (
                <span className="ml-2 text-xs font-medium text-red-600">
                  Expired
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Supporting</p>
            <p className="font-semibold text-gray-900">
              {charityNames[user.charity] || user.charity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
