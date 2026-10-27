import { Link } from "react-router-dom";
import { useSkills } from "../hooks/useSkills";
import {
  beyondTheDesk,
  certifications,
  education,
  experience,
  groupSkills,
  LEVEL_LABELS,
  profile,
  stats,
} from "../data/cv";

function SectionHead({ index, id, title, blurb }: { index: string; id: string; title: string; blurb?: string }) {
  return (
    <header className="section-head">
      <span className="mono eyebrow">
        // {index} · {id}
      </span>
      <h2>{title}</h2>
      {blurb && <p className="muted">{blurb}</p>}
    </header>
  );
}

function LevelBar({ level, name }: { level: number; name: string }) {
  if (level < 1) return null;
  return (
    <span className="level" role="img" aria-label={`${name}: ${LEVEL_LABELS[level] ?? ""}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= level ? "on" : ""} />
      ))}
    </span>
  );
}

export default function CVPage() {
  const { skills, live, loading } = useSkills();
  const grouped = groupSkills(skills);

  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-in">
          <a href="#top" className="brand mono">
            IBRAHIM<span className="accent">.</span>SYED
          </a>
          <nav aria-label="Sections" className="nav mono">
            <a href="#experience">Experience</a>
            <a href="#skills">Skills</a>
            <a href="#education">Education</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* ───────── Hero ───────── */}
        <section className="hero wrap">
          <div className="hero-copy">
            <span className="pill mono">
              <i className="dot" /> {profile.availability}
            </span>
            <h1>{profile.name}</h1>
            <p className="role mono">{profile.title}</p>
            <p className="lede">{profile.summary}</p>
            <div className="actions no-print">
              <button type="button" className="btn primary" onClick={() => window.print()}>
                Print / Save as PDF
              </button>
              <a className="btn" href={`mailto:${profile.email}`}>
                Get in touch
              </a>
            </div>
          </div>

          <div className="term" aria-hidden="true">
            <div className="term-bar">
              <i />
              <i />
              <i />
              <span className="mono">ibrahim@portfolio ~</span>
            </div>
            <pre className="mono">
              <span className="prompt">$</span> whoami{"\n"}
              <span className="out">ibrahim_syed</span>
              {"\n\n"}
              <span className="prompt">$</span> cat profile.json{"\n"}
              <span className="out">
                {"{"}
                {"\n"}
                {'  "role": "Graduate Software Developer",\n'}
                {'  "studying": "BSc Honours in Computing (UNISA)",\n'}
                {'  "certified": ["AWS AI Practitioner",\n'}
                {'                "SAP S/4HANA FI"],\n'}
                {'  "in_progress": "AWS Solutions Architect – Associate",\n'}
                {'  "heading_towards": "Cloud & AI Solutions Architecture"\n'}
                {"}"}
              </span>
              {"\n\n"}
              <span className="prompt">$</span> ls projects/{"\n"}
              <span className="out">
                madrasatul-asma/ chrisfit/ research-mgmt-system/{"\n"}
                censible/ givly/
              </span>
              {"\n"}
              <span className="prompt">$</span> <span className="cursor" />
            </pre>
          </div>
        </section>

        <section className="wrap stats" aria-label="Highlights">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label mono">{s.label}</span>
              <span className="muted small">{s.sub}</span>
            </div>
          ))}
        </section>

        {/* ───────── Experience ───────── */}
        <section id="experience" className="wrap section">
          <SectionHead
            index="01"
            id="experience"
            title="Experience & Projects"
            blurb="Production work delivered for real clients, plus a school platform currently in development."
          />
          <div className="timeline">
            {experience.map((e) => (
              <article className="card job" key={e.role}>
                <div className="job-head">
                  <div>
                    <h3>{e.role}</h3>
                    <p className="muted">{e.org}</p>
                  </div>
                  <span className="chip mono">{e.period}</span>
                </div>
                <ul>
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                {e.link && (
                  <p className="small">
                    Live at{" "}
                    <a href={e.link.href} target="_blank" rel="noreferrer">
                      {e.link.label}
                    </a>
                  </p>
                )}
                <div className="tags">
                  {e.tags.map((t) => (
                    <span className="tag mono" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ───────── Skills ───────── */}
        <section id="skills" className="wrap section">
          <SectionHead
            index="02"
            id="skills_matrix"
            title="Skills & Technology"
            blurb={live ? undefined : loading ? "Loading skills…" : undefined}
          />
          <div className="skills-grid">
            {grouped.map(([category, list]) => (
              <div className="card" key={category}>
                <h3 className="mono cat">{category}</h3>
                <ul className="skill-list">
                  {list.map((s) => (
                    <li key={s.id}>
                      <span>{s.name}</span>
                      <LevelBar level={s.level} name={s.name} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ───────── Education & certifications ───────── */}
        <section id="education" className="wrap section two-col">
          <div>
            <SectionHead index="03" id="education" title="Education" />
            <div className="stack">
              {education.map((ed) => (
                <article className="card" key={ed.title}>
                  <h3>{ed.title}</h3>
                  <p className="muted">
                    {ed.place} · {ed.period}
                  </p>
                  {ed.points.length > 0 && (
                    <ul>
                      {ed.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>

            <h3 className="mono cat spaced">Beyond the desk</h3>
            <ul className="plain muted">
              {beyondTheDesk.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHead index="04" id="certifications" title="Certifications" />
            <div className="stack">
              {certifications.map((c) => (
                <article className="card cert" key={c.name}>
                  <span className={`status mono ${c.status === "In progress" ? "warn" : c.status === "Certified" ? "ok" : ""}`}>
                    {c.status}
                  </span>
                  <h3>{c.name}</h3>
                  <p className="muted small">{c.issuer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── Contact ───────── */}
        <section id="contact" className="wrap section">
          <div className="card contact">
            <SectionHead index="05" id="contact" title="Let's talk" />
            <p className="muted">
              Looking for a graduate or internship role where I can ship production code and keep learning fast.
            </p>
            <ul className="plain contact-list">
              <li>
                <span className="mono muted">email</span>{" "}
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              <li>
                <span className="mono muted">linkedin</span>{" "}
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  {profile.linkedinLabel}
                </a>
              </li>
              <li>
                <span className="mono muted">location</span> {profile.location} · {profile.citizenship}
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer no-print">
        <div className="wrap footer-in mono">
          <span className="muted">© {new Date().getFullYear()} Ibrahim Syed</span>
          <Link to="/login" className="muted">
            Admin
          </Link>
        </div>
      </footer>
    </>
  );
}
