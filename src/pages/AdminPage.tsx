import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { addDoc, collection, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../auth/AuthContext";
import { useSkills } from "../hooks/useSkills";
import { CATEGORY_ORDER, defaultSkills, groupSkills, LEVEL_LABELS, type Skill } from "../data/cv";

type Form = { name: string; category: string; level: number };
const emptyForm: Form = { name: "", category: CATEGORY_ORDER[0], level: 0 };

function describe(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/permission|insufficient/i.test(msg)) {
    return "Permission denied. Publish firestore.rules with your UID (shown at the bottom of this page), then try again.";
  }
  return msg;
}

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const { skills, live, loading, error: loadError } = useSkills();

  const [form, setForm] = useState<Form>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const grouped = useMemo(() => groupSkills(skills), [skills]);
  const categories = useMemo(
    () => [...new Set([...CATEGORY_ORDER, ...skills.map((s) => s.category)])],
    [skills],
  );

  async function guard(fn: () => Promise<void>, okText: string) {
    setBusy(true);
    setNotice(null);
    try {
      await fn();
      setNotice({ kind: "ok", text: okText });
    } catch (err) {
      setNotice({ kind: "err", text: describe(err) });
    } finally {
      setBusy(false);
    }
  }

  function nextOrder(category: string): number {
    const inCat = skills.filter((s) => s.category === category).map((s) => s.order);
    return inCat.length ? Math.max(...inCat) + 1 : 0;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const category = form.category.trim();
    if (!category) return;

    if (editingId) {
      const name = form.name.trim();
      if (!name) return;
      void guard(async () => {
        await updateDoc(doc(db, "skills", editingId), { name, category, level: form.level });
        setEditingId(null);
        setForm({ ...emptyForm, category });
      }, "Skill updated.");
      return;
    }

    // Adding: allow several skills at once, separated by commas.
    const names = form.name
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    if (!names.length) return;
    void guard(async () => {
      let order = nextOrder(category);
      for (const name of names) {
        await addDoc(collection(db, "skills"), { name, category, level: form.level, order: order++ });
      }
      setForm({ ...emptyForm, category, level: form.level });
    }, names.length === 1 ? "Skill added." : `${names.length} skills added.`);
  }

  function startEdit(s: Skill) {
    setEditingId(s.id);
    setForm({ name: s.name, category: s.category, level: s.level });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function remove(s: Skill) {
    if (!window.confirm(`Delete "${s.name}"?`)) return;
    void guard(async () => {
      await deleteDoc(doc(db, "skills", s.id));
      if (editingId === s.id) cancelEdit();
    }, "Skill deleted.");
  }

  function importDefaults() {
    void guard(async () => {
      const batch = writeBatch(db);
      for (const s of defaultSkills) {
        batch.set(doc(collection(db, "skills")), {
          name: s.name,
          category: s.category,
          level: s.level,
          order: s.order,
        });
      }
      await batch.commit();
    }, "Imported the skills from your CV. You can now edit them.");
  }

  return (
    <div className="wrap admin">
      <header className="admin-head">
        <div>
          <span className="mono eyebrow">// admin</span>
          <h1 className="admin-title">Manage skills</h1>
          <p className="muted small mono">{user?.email}</p>
        </div>
        <div className="actions">
          <Link to="/" className="btn">
            View CV
          </Link>
          <button type="button" className="btn" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </header>

      {notice && (
        <p className={notice.kind === "ok" ? "alert ok" : "alert"} role={notice.kind === "ok" ? "status" : "alert"}>
          {notice.text}
        </p>
      )}
      {loadError && (
        <p className="alert" role="alert">
          Couldn't load skills: {loadError}
        </p>
      )}

      <section className="card">
        <h2 className="panel-title">{editingId ? "Edit skill" : "Add a skill"}</h2>
        <form className="form skill-form" onSubmit={onSubmit}>
          <label className="grow">
            <span className="mono">{editingId ? "Name" : "Name (separate several with commas)"}</span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={editingId ? "" : "e.g. Docker, Terraform"}
              required
            />
          </label>
          <label>
            <span className="mono">Category</span>
            <input
              list="categories"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
            <datalist id="categories">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label>
            <span className="mono">Proficiency bar</span>
            <select value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}>
              {LEVEL_LABELS.map((label, i) => (
                <option key={label} value={i}>
                  {i === 0 ? label : `${i} · ${label}`}
                </option>
              ))}
            </select>
          </label>
          <div className="actions">
            <button className="btn primary" type="submit" disabled={busy || !live}>
              {editingId ? "Save changes" : "Add skill"}
            </button>
            {editingId && (
              <button className="btn" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
        {!live && !loading && (
          <p className="muted small">
            Your CV is currently showing the built-in skills. Import them once to start editing.
          </p>
        )}
      </section>

      {!live && !loading && (
        <section className="card import">
          <div>
            <h2 className="panel-title">Start from your CV</h2>
            <p className="muted small">
              Copies the {defaultSkills.length} skills from your CV into Firestore so you can edit, remove or add to them.
            </p>
          </div>
          <button className="btn primary" type="button" onClick={importDefaults} disabled={busy}>
            Import skills from CV
          </button>
        </section>
      )}

      {live && (
        <section className="admin-list">
          {grouped.map(([category, list]) => (
            <div className="card" key={category}>
              <h2 className="mono cat">{category}</h2>
              <ul className="admin-skills">
                {list.map((s) => (
                  <li key={s.id} className={s.id === editingId ? "editing" : ""}>
                    <span className="grow">
                      {s.name}
                      {s.level > 0 && <span className="muted small mono"> · {LEVEL_LABELS[s.level]}</span>}
                    </span>
                    <button className="link-btn" type="button" onClick={() => startEdit(s)} disabled={busy}>
                      Edit
                    </button>
                    <button className="link-btn danger" type="button" onClick={() => remove(s)} disabled={busy}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <footer className="uid mono muted small">
        Your UID (for firestore.rules): <code>{user?.uid}</code>
      </footer>
    </div>
  );
}
