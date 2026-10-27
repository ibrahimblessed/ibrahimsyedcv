import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { defaultSkills, type Skill } from "../data/cv";

/**
 * Live skills from Firestore. If the collection is empty or unreachable,
 * the built-in defaults from the CV are returned and `live` is false.
 */
export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "skills"),
      (snap) => {
        if (snap.empty) {
          setSkills(defaultSkills);
          setLive(false);
        } else {
          setSkills(
            snap.docs.map((d) => {
              const x = d.data();
              return {
                id: d.id,
                name: String(x.name ?? ""),
                category: String(x.category ?? "Other"),
                level: Number(x.level ?? 0),
                order: Number(x.order ?? 0),
              };
            }),
          );
          setLive(true);
        }
        setError(null);
        setLoading(false);
      },
      (err) => {
        setSkills(defaultSkills);
        setLive(false);
        setError(err.message);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  return { skills, live, loading, error };
}
