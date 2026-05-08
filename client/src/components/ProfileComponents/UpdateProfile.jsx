import { useState, useEffect } from "react";
import useUser from "../hooks/useUser";

export default function UpdateProfile() {
  const { user, token } = useUser();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  console.log(user.profile.username)

  // Pre-populate form when user loads
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          bio,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await res.json();
      console.log("Updated user:", data);

      // Optional: update user state if your hook allows it
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update Profile"}
      </button>
    </form>
  );
}