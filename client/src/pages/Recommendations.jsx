import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Recommendations() {
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);

  const refresh = async () => {
    if (!userId) return alert("Please log in first.");
    const res = await api.get(`/recommendations/${userId}`);
    setItems(res.items || []);
  };

  const markWatched = async (id) => {
    if (!userId) return;
    await api.post(`/user/${userId}/watched/${id}`);
    await refresh();
  };

  const addFav = async (id) => {
    if (!userId) return;
    await api.post(`/user/${userId}/favorites/${id}`);
    alert("Added to favorites.");
  };

  useEffect(() => { refresh(); }, []);

  return (
    <div>
      <h2>Recommendations</h2>
      <button onClick={refresh}>Refresh</button>
      <ul>
        {items.map(i => (
          <li key={i.id} style={{ margin: "8px 0" }}>
            <strong>{i.title}</strong> ({i.kind}) • {i.genres?.join(", ")} • {i.year}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => markWatched(i.id)}>Mark Watched</button>
              <button onClick={() => addFav(i.id)}>Add to Favorites</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
