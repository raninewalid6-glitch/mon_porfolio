import { useEffect, useRef, useState } from "react";
import { profile, skills, projects } from "./data";

const links = [
  { href: "#apropos", label: "À propos" },
  { href: "#competences", label: "Compétences" },
  { href: "#projets", label: "Projets" },
  { href: "#contact", label: "Contact" },
];

// Effet machine à écrire qui fait défiler les rôles du profil
function useTypewriter(words, speed = 70, pause = 1600) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    let t;
    if (!deleting && text === word) {
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      t = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => i + 1);
      }, speed);
    } else {
      t = setTimeout(
        () => setText(word.slice(0, text.length + (deleting ? -1 : 1))),
        deleting ? speed / 2 : speed
      );
    }
    return () => clearTimeout(t);
  }, [text, deleting, index, words, speed, pause]);

  return text;
}

// Fait apparaître les sections au défilement
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// Barre fine en haut de page qui suit le défilement
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="progress" style={{ width: `${progress}%` }} />;
}

// Repère la section visible à l'écran pour la surligner dans le menu
function useActiveSection(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const sectionIds = ["accueil", ...links.map((l) => l.href.slice(1))];
const initials = profile.name
  .split(" ")
  .map((w) => w[0])
  .join("");

// Mode clair / sombre : le thème initial est posé par le script de index.html (choix mémorisé ou réglage du système)
function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === "dark");

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // stockage indisponible : le choix ne sera simplement pas mémorisé
    }
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={dark ? "Mode clair" : "Mode sombre"}
    >
      {dark ? (
        <svg key="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg key="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""} ${open ? "nav--open" : ""}`}>
      <div className="nav__inner">
        <a href="#accueil" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__mark">{initials}</span>
          <span className="brand__text">
            <strong>{profile.name}</strong>
            <small>{profile.role}</small>
          </span>
        </a>
        <nav className="nav__links" aria-label="Navigation principale">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={`nav__link ${active === l.href.slice(1) ? "nav__link--active" : ""}`}
              style={{ "--i": i }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn btn--primary nav__cta nav__cta--mobile"
            style={{ "--i": links.length }}
            onClick={() => setOpen(false)}
          >
            Me contacter
          </a>
        </nav>
        <ThemeToggle />
        <a href="#contact" className="btn btn--primary nav__cta">
          Me contacter <span aria-hidden="true">→</span>
        </a>
        <button
          className="nav__toggle"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

// Petites étoiles et cœurs qui scintillent dans le fond de l'accueil
const sparkles = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 37 + 7) % 100,
  y: (i * 53 + 11) % 90,
  size: 10 + ((i * 7) % 12),
  delay: (i * 0.7) % 6,
  dur: 5 + ((i * 3) % 5),
  char: i % 3 === 0 ? "♥" : "✦",
}));

// Inclinaison 3D de la photo qui suit la souris
function tiltPhoto(e) {
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  e.currentTarget.style.setProperty("--rx", `${-y * 14}deg`);
  e.currentTarget.style.setProperty("--ry", `${x * 14}deg`);
}

function resetTilt(e) {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
}

// Traînée d'étincelles derrière la souris et petite pluie de cœurs au clic
function useCursorMagic() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) return;

    const spawn = (x, y, className, char, vars = {}) => {
      const el = document.createElement("span");
      el.className = className;
      el.textContent = char;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, v));
      el.addEventListener("animationend", () => el.remove());
      document.body.appendChild(el);
    };

    let last = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      spawn(e.clientX, e.clientY, "trail", Math.random() < 0.3 ? "♥" : "✦", {
        "--dx": `${(Math.random() - 0.5) * 30}px`,
      });
    };

    const onClick = (e) => {
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        spawn(e.clientX, e.clientY, "burst", i % 2 ? "♥" : "✦", {
          "--tx": `${Math.cos(angle) * 60}px`,
          "--ty": `${Math.sin(angle) * 60}px`,
        });
      }
    };

    if (fine) document.addEventListener("pointermove", onMove);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("click", onClick);
    };
  }, []);
}

function Hero() {
  const typed = useTypewriter(profile.roles);
  return (
    <section id="accueil" className="hero container">
      <div className="sparkles" aria-hidden="true">
        {sparkles.map((s, i) => (
          <span
            key={i}
            className="sparkle"
            style={{ left: `${s.x}%`, top: `${s.y}%`, "--size": `${s.size}px`, "--delay": `${s.delay}s`, "--dur": `${s.dur}s` }}
          >
            {s.char}
          </span>
        ))}
      </div>
      <div className="hero__text">
        <p className="status">
          <span className="status__dot" /> Disponible pour de nouvelles opportunités
        </p>
        <p className="mono accent">
          Bonjour <span className="wave">👋</span>, je suis
        </p>
        <h1 className="name" aria-label={profile.name}>
          {[...`${profile.name}.`].map((ch, i) => (
            <span key={i} className="name__letter" style={{ "--i": i }} aria-hidden="true">
              {ch === " " ? " " : ch}
            </span>
          ))}
        </h1>
        <p className="hero__typed">
          {typed}
          <span className="cursor">|</span>
        </p>
        <p className="hero__intro">{profile.about[0]}</p>
        <div className="hero__actions">
          <a href="#projets" className="btn btn--primary">
            Voir mes projets
          </a>
          <a href="#contact" className="btn">
            Me contacter
          </a>
        </div>
      </div>
      <div className="photo" onPointerMove={tiltPhoto} onPointerLeave={resetTilt}>
        <div className="photo__tilt">
          <div className="photo__ring" />
          <img src={profile.photo} alt={`Portrait de ${profile.name}`} />
        </div>
        <span className="float-badge float-badge--1">React</span>
        <span className="float-badge float-badge--2">Next.js</span>
        <span className="float-badge float-badge--3">Node.js</span>
      </div>
    </section>
  );
}

// Bandeau de technologies qui défile en continu
function TechMarquee() {
  const items = skills.flatMap((g) => g.items);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee__item">
            {item}
            <span className="marquee__sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Compte de 0 jusqu'à la valeur (ex. « 100% ») quand le chiffre devient visible
function CountUp({ value }) {
  const target = parseInt(value, 10);
  const suffix = value.replace(/^\d+/, "");
  const [n, setN] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / 1400, 1);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <span ref={ref} className="stat__value">
      {n}
      {suffix}
    </span>
  );
}

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <a href="#accueil" className={`to-top ${visible ? "to-top--visible" : ""}`} aria-label="Revenir en haut">
      ↑
    </a>
  );
}

// Halo lumineux qui suit la souris sur les cartes
function useCardSpotlight() {
  useEffect(() => {
    const onMove = (e) => {
      const card = e.target.closest?.(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove);
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
}

function Terminal() {
  return (
    <div className="terminal" aria-hidden="true">
      <div className="terminal__bar">
        <span className="dot dot--red" />
        <span className="dot dot--yellow" />
        <span className="dot dot--green" />
        <span className="terminal__title mono">~/portfolio</span>
      </div>
      <pre className="terminal__body mono">
        <span className="muted">$</span> cat profil.json{"\n"}
        {"{"}
        {"\n"}  <span className="key">"nom"</span>: <span className="str">"{profile.name}"</span>,
        {"\n"}  <span className="key">"role"</span>: <span className="str">"{profile.role}"</span>,
        {"\n"}  <span className="key">"stack"</span>: [<span className="str">"React"</span>, <span className="str">"Next.js"</span>, <span className="str">"Node.js"</span>],
        {"\n"}  <span className="key">"disponible"</span>: <span className="bool">true</span>
        {"\n"}
        {"}"}
        {"\n"}<span className="muted">$</span> <span className="cursor">▋</span>
      </pre>
    </div>
  );
}

function SectionTitle({ num, children }) {
  return (
    <h2 className="section__title">
      <span className="mono accent">0{num}.</span> {children}
    </h2>
  );
}

function About() {
  return (
    <section id="apropos" className="section container reveal">
      <SectionTitle num={1}>À propos</SectionTitle>
      <div className="about">
        <figure className="about__photo">
          <img src={profile.photo2} alt={`${profile.name} au travail`} loading="lazy" />
        </figure>
        <div>
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="stats">
            {profile.stats.map((s) => (
              <div key={s.label} className="stat">
                <CountUp value={s.value} />
                <span className="stat__label">{s.label}</span>
              </div>
            ))}
          </div>
          <Terminal />
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="competences" className="section container reveal">
      <SectionTitle num={2}>Compétences</SectionTitle>
      <div className="grid grid--3">
        {skills.map((group, i) => (
          <div key={group.title} className="card reveal" style={{ "--d": i }}>
            <h3>{group.title}</h3>
            <ul className="chips">
              {group.items.map((item, j) => (
                <li key={item} className="chip" style={{ "--j": j }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projets" className="section container reveal">
      <SectionTitle num={3}>Projets</SectionTitle>
      <div className="grid grid--2">
        {projects.map((p, i) => (
          <article
            key={p.title}
            className={`card project reveal ${p.featured ? "project--featured" : ""}`}
            style={{ "--d": i % 2 }}
          >
            <div className="project__head">
              <span className="folder" aria-hidden="true">
                ▤
              </span>
              <div className="project__links">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noreferrer">
                    GitHub ↗
                  </a>
                )}
                {p.demo && (
                  <a href={p.demo} target="_blank" rel="noreferrer">
                    Démo ↗
                  </a>
                )}
              </div>
            </div>
            {p.featured && <p className="mono accent small">Projet phare</p>}
            {p.team && <p className="badge mono small">{p.team}</p>}
            <h3>{p.title}</h3>
            <p className="muted">{p.description}</p>
            <ul className="tags mono">
              {p.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  // mailto: ne fait rien si aucune application mail n'est configurée : on ouvre Gmail directement
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      window.prompt("Copie mon adresse :", profile.email);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="section container reveal">
      <SectionTitle num={4}>Contact</SectionTitle>
      <div className="contact__grid">
        <div>
          <h2 className="contact__title">Travaillons ensemble</h2>
          <p className="muted">
            Un projet, une opportunité de stage ou d'emploi, ou simplement une question ?
            Écris-moi via le formulaire ou contacte-moi directement.
          </p>
          <div className="contact__list">
            <div className="contact__item">
              <span className="contact__icon">
                <Icon name="mail" />
              </span>
              <a href={gmailUrl} target="_blank" rel="noreferrer">
                <span className="contact__label">E-mail</span>
                <span className="contact__value">{profile.email}</span>
              </a>
              <button type="button" className="copy-btn" onClick={copyEmail}>
                {copied ? "Copié ✓" : "Copier"}
              </button>
            </div>
            <a href={`tel:${profile.phoneLink}`} className="contact__item">
              <span className="contact__icon">
                <Icon name="phone" />
              </span>
              <span>
                <span className="contact__label">Téléphone</span>
                <span className="contact__value">{profile.phone}</span>
              </span>
            </a>
            <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="contact__item">
              <span className="contact__icon">
                <Icon name="chat" />
              </span>
              <span>
                <span className="contact__label">WhatsApp</span>
                <span className="contact__value">M'écrire sur WhatsApp</span>
              </span>
            </a>
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="contact__item">
                <span className="contact__icon">
                  <Icon name="code" />
                </span>
                <span>
                  <span className="contact__label">GitHub</span>
                  <span className="contact__value">{profile.github.replace("https://", "")}</span>
                </span>
              </a>
            )}
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact__item">
                <span className="contact__icon">
                  <Icon name="user" />
                </span>
                <span>
                  <span className="contact__label">LinkedIn</span>
                  <span className="contact__value">Voir mon profil</span>
                </span>
              </a>
            )}
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

// Le formulaire passe par FormSubmit (gratuit, sans serveur) qui transfère les messages vers ton e-mail
function ContactForm() {
  const [status, setStatus] = useState("idle");

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return;
    setStatus("sending");
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          _subject: `Portfolio : nouveau message de ${data.nom}`,
          _template: "table",
        }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form__row">
        <label className="field">
          Nom
          <input name="nom" required placeholder="Ton nom" autoComplete="name" />
        </label>
        <label className="field">
          E-mail
          <input name="email" type="email" required placeholder="toi@exemple.com" autoComplete="email" />
        </label>
      </div>
      <label className="field">
        Sujet
        <input name="sujet" placeholder="Stage, projet, question…" />
      </label>
      <label className="field">
        Message
        <textarea name="message" required placeholder="Bonjour Ranine, …" />
      </label>
      <input type="text" name="_honey" className="form__honey" tabIndex={-1} autoComplete="off" />
      <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
        {status === "sending" ? "Envoi en cours…" : "Envoyer le message"}
      </button>
      {status === "sent" && (
        <p className="form__status form__status--ok">Merci ! Ton message a bien été envoyé, je te réponds vite.</p>
      )}
      {status === "error" && (
        <p className="form__status form__status--error">
          Oups, l'envoi a échoué. Réessaie ou écris-moi directement par e-mail ou WhatsApp.
        </p>
      )}
    </form>
  );
}

const iconPaths = {
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2-8 5-8-5",
  phone:
    "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",
  chat: "M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z",
  code: "m16 18 6-6-6-6M8 6l-6 6 6 6",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  );
}

export default function App() {
  useReveal();
  useCardSpotlight();
  useCursorMagic();
  return (
    <>
      <div className="blobs" aria-hidden="true">
        <span className="blob blob--1" />
        <span className="blob blob--2" />
        <span className="blob blob--3" />
      </div>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer className="footer mono">
        Conçu et développé par {profile.name} · {new Date().getFullYear()}
      </footer>
      <BackToTop />
    </>
  );
}
