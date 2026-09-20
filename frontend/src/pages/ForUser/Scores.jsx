import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";

import ScoreTable from "../../components/ForUser/ScoreTable";
import { formatDate } from "../../components/ForUser/formatDate";
import ScoreModal from "../../components/ForUser/ScoreModal";

const Scores = ({ token, backendUrl }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // the score being edited, or null when adding

  const api = `${backendUrl}/api/user/scores`;
  const headers = { Authorization: `Bearer ${token}` };

  const loadScores = useCallback(async () => {
    try {
      const { data } = await axios.get(api, { headers });
      if (data.success) setScores(data.scores);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load scores");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, token]);

  useEffect(() => {
    // The request updates component state when it completes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadScores();
  }, [loadScores]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (score) => {
    setEditing(score);
    setModalOpen(true);
  };

  const handleSave = async ({ date, score }) => {
    // One entry per date: check here for instant feedback (backend must check too)
    const duplicate = scores.some(
      (s) => s.date.slice(0, 10) === date && s._id !== editing?._id,
    );
    if (duplicate) {
      toast.error(
        "You already have a score for this date. Edit that entry instead.",
      );
      return;
    }

    setSaving(true);
    try {
      const { data } = editing
        ? await axios.put(`${api}/${editing._id}`, { date, score }, { headers })
        : await axios.post(api, { date, score }, { headers });

      if (data.success) {
        toast.success(editing ? "Score updated" : "Score added");
        setModalOpen(false);
        loadScores();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (score) => {
    if (
      !window.confirm(
        `Delete your score of ${score.score} from ${formatDate(score.date)}?`,
      )
    )
      return;

    try {
      const { data } = await axios.delete(`${api}/${score._id}`, { headers });
      if (data.success) {
        toast.success("Score deleted");
        loadScores();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <main className="flex-1 space-y-6 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0B5D3B]">
              My Golf Scores
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Your last 5 Stableford scores (newest first).
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 rounded-lg bg-[#0B5D3B] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#094d31]"
          >
            <Plus size={16} />
            Add Score
          </button>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-gray-400">
            Loading scores...
          </p>
        ) : (
          <ScoreTable
            scores={scores}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}

        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-gray-600">
          <span className="font-semibold text-[#0B5D3B]">Note:</span> Only one
          score entry is permitted per date. Duplicate scores for the same date
          are not allowed. An existing entry may only be edited or deleted.
        </div>
      </div>

      <ScoreModal
        key={`${editing?._id || "new"}-${modalOpen}`}
        open={modalOpen}
        initial={editing}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </main>
  );
};

export default Scores;
