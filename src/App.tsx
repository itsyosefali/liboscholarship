import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Languages,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import {
  content,
  EMAIL,
  enquiryUrl,
  MAPS_URL,
  navIds,
  PHONE,
  WHATSAPP_URL,
  type Enquiry,
  type Language,
} from "./content";

const serviceIcons = [
  GraduationCap,
  BookOpen,
  Languages,
  Sparkles,
  HeartHandshake,
];
const stripIcons = [GraduationCap, Languages, HeartHandshake, MapPin];
const emptyForm: Enquiry = {
  name: "",
  service: "",
  destination: "",
  message: "",
};

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={`section-heading ${centered ? "centered" : ""}`}>
      <p className="eyebrow">
        <span />
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="contact-row">
      <span className="contact-icon">{icon}</span>
      <div>
        <span className="contact-label">{label}</span>
        {children}
      </div>
    </div>
  );
}

function initialLanguage(): Language {
  try {
    return localStorage.getItem("libo-language") === "en" ? "en" : "ar";
  } catch {
    return "ar";
  }
}

export default function App() {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState<Enquiry>(emptyForm);
  const [formError, setFormError] = useState(false);
  const [preparedUrl, setPreparedUrl] = useState("");
  const nameInput = useRef<HTMLInputElement>(null);
  const serviceInput = useRef<HTMLSelectElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const t = content[language];
  const DirectionArrow = language === "ar" ? ArrowLeft : ArrowRight;
  const genericWhatsApp = `${WHATSAPP_URL}?text=${encodeURIComponent(t.waGreeting)}`;

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = t.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t.description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", t.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", t.description);
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute("content", language === "ar" ? "ar_LY" : "en_GB");
    try {
      localStorage.setItem("libo-language", language);
    } catch {
      /* Language still works when storage is disabled. */
    }
  }, [language, t]);

  useEffect(() => {
    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", closeWithEscape);
    return () => document.removeEventListener("keydown", closeWithEscape);
  }, [menuOpen]);

  function changeForm(key: keyof Enquiry, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setPreparedUrl("");
    setFormError(false);
  }

  function chooseService(service: string, destination?: string) {
    setForm((previous) => ({
      ...previous,
      service,
      destination: destination ?? previous.destination,
    }));
    setPreparedUrl("");
    setFormError(false);
  }

  function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.service) {
      setFormError(true);
      if (!form.name.trim()) nameInput.current?.focus();
      else serviceInput.current?.focus();
      return;
    }
    const url = enquiryUrl(form, language);
    setPreparedUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>
            <Sparkles size={13} />
            {t.topLine}
          </span>
          <span>
            <MapPin size={13} />
            {t.locationShort}
            <i />
            <a href={`tel:+218921100078`} dir="ltr">
              {PHONE}
            </a>
          </span>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <a className="brand" href="#home" aria-label="LIBO SCHOLARSHIP">
            <img
              src="/images/libo-logo.jpeg"
              alt="LIBO SCHOLARSHIP"
              width="640"
              height="640"
            />
          </a>
          <nav
            id="main-navigation"
            className={`navigation ${menuOpen ? "is-open" : ""}`}
            aria-label={t.menu}
          >
            {t.nav.map((label, index) => (
              <a
                key={navIds[index]}
                href={`#${navIds[index]}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="language-button"
              aria-label={t.language}
              onClick={() => {
                setLanguage(language === "ar" ? "en" : "ar");
                setMenuOpen(false);
                setPreparedUrl("");
              }}
            >
              <Globe2 size={16} />
              <span>{language === "ar" ? "EN" : "العربية"}</span>
            </button>
            <a className="button button-gold header-cta" href="#contact">
              {t.consult}
              <DirectionArrow size={16} />
            </a>
            <button
              ref={menuButton}
              className="menu-button"
              aria-label={menuOpen ? t.closeMenu : t.menu}
              aria-expanded={menuOpen}
              aria-controls="main-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section id="home" className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">
                <span />
                {t.eyebrow}
              </p>
              <h1>
                {t.heroLine}
                <br />
                <span className="hero-highlight">
                  {t.heroAccent}
                  <svg viewBox="0 0 350 18" aria-hidden="true">
                    <path d="M5 12Q155-5 345 7M48 17Q170 5 312 12" />
                  </svg>
                </span>
                <span className="headline-star" aria-hidden="true">
                  ✳
                </span>
              </h1>
              <p className="hero-description">{t.heroDescription}</p>
              <div className="hero-buttons">
                <a
                  className="button button-gold"
                  href={genericWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t.heroCta}
                  <DirectionArrow size={19} />
                </a>
                <a className="text-link" href="#services">
                  {t.explore}
                  <ArrowDown size={17} />
                </a>
              </div>
              <p className="hero-note">
                <span>
                  <Check size={13} />
                </span>
                {t.heroNote}
              </p>
            </div>
            <div className="hero-visual">
              <div className="hero-outline" aria-hidden="true" />
              <div className="hero-photo">
                <img
                  src="/images/campus.jpg"
                  alt={t.campusAlt}
                  width="1400"
                  height="933"
                  fetchPriority="high"
                />
                <div className="photo-gradient" />
                <div className="hero-photo-caption">
                  <span>{t.photoCaption}</span>
                  <strong>{t.photoTitle}</strong>
                  <ArrowUpRight size={29} />
                </div>
              </div>
              <div className="floating-note">
                <span className="floating-note-icon">
                  <GraduationCap size={29} strokeWidth={1.5} />
                </span>
                <div>
                  <strong>{t.badgeTitle}</strong>
                  <span>{t.badgeText}</span>
                </div>
                <span className="note-dot" />
              </div>
              <div className="hero-seal">
                <Globe2 size={26} strokeWidth={1.25} />
                <span>{t.seal}</span>
              </div>
              <div className="hero-dots" aria-hidden="true" />
            </div>
          </div>
          <div className="container hero-bottom">
            <span className="tiny-marker" />
            <span>{t.scroll}</span>
            <ArrowDown size={14} />
            <div />
          </div>
        </section>

        <div className="promise-strip">
          <div className="container promise-grid">
            {t.strip.map((label, index) => {
              const Icon = stripIcons[index];
              return (
                <div key={label}>
                  <Icon size={23} strokeWidth={1.5} />
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <section id="services" className="section services-section">
          <div className="container">
            <div className="heading-row">
              <SectionHeading
                eyebrow={t.servicesEyebrow}
                title={t.servicesTitle}
                description={t.servicesDescription}
              />
              <span className="section-number" aria-hidden="true">
                01 /
              </span>
            </div>
            <div className="services-grid">
              {t.services.map((service, index) => {
                const Icon = serviceIcons[index];
                return (
                  <a
                    className={`service-card ${index === 0 ? "featured-service" : ""}`}
                    href="#contact"
                    key={service.id}
                    onClick={() => chooseService(service.id)}
                  >
                    <div className="service-card-top">
                      <span className="service-icon">
                        <Icon size={27} strokeWidth={1.5} />
                      </span>
                      <span className="service-number">0{index + 1}</span>
                    </div>
                    <span className="service-label">{service.label}</span>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    <span className="service-link">
                      {t.serviceLink}
                      <DirectionArrow size={17} />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section id="destinations" className="section destinations-section">
          <div className="container">
            <div className="heading-row">
              <SectionHeading
                eyebrow={t.destinationsEyebrow}
                title={t.destinationsTitle}
                description={t.destinationsDescription}
              />
              <span className="section-number" aria-hidden="true">
                02 /
              </span>
            </div>
            <div className="destinations-grid">
              {t.destinations.map((destination, index) => (
                <a
                  className="destination-card"
                  key={destination.id}
                  href="#contact"
                  aria-label={`${t.destinationCta} ${destination.title}`}
                  onClick={() => chooseService("admissions", destination.title)}
                >
                  <img
                    src={`/images/${destination.id}.jpg`}
                    alt={destination.alt}
                    loading="lazy"
                    width="800"
                    height="1000"
                  />
                  <div className="destination-shade" />
                  <span className="destination-index">0{index + 1}</span>
                  <div className="destination-caption">
                    <h3>{destination.title}</h3>
                    <p>{destination.subtitle}</p>
                  </div>
                  <span className="destination-arrow">
                    <DirectionArrow size={20} />
                  </span>
                </a>
              ))}
            </div>
            <div className="destinations-more">
              <Globe2 size={19} />
              <span>{t.otherDestination}</span>
              <a href="#contact">
                {t.otherDestinationLink}
                <DirectionArrow size={16} />
              </a>
            </div>
          </div>
        </section>

        <section className="section steps-section">
          <div className="container">
            <SectionHeading
              eyebrow={t.stepsEyebrow}
              title={t.stepsTitle}
              description={t.stepsDescription}
              centered
            />
            <div className="steps-grid">
              {t.steps.map((step, index) => (
                <div className="step" key={step.title}>
                  <span className="step-number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="container about-grid">
            <div className="about-visual">
              <img
                src="/images/graduates-men.png"
                alt={t.aboutAlt}
                width="800"
                height="900"
                loading="lazy"
              />
              <div className="about-photo-note">
                <GraduationCap size={24} />
                <span>{t.aboutCaption}</span>
              </div>
              <span className="about-spark" aria-hidden="true">
                ✳
              </span>
            </div>
            <div className="about-copy">
              <SectionHeading eyebrow={t.aboutEyebrow} title={t.aboutTitle} />
              <p>{t.aboutText}</p>
              <p>{t.aboutNote}</p>
              <a href="#contact" className="text-link about-link">
                {t.aboutCta}
                <DirectionArrow size={19} />
              </a>
              <div className="about-location">
                <MapPin size={18} />
                <span>{t.locationShort}</span>
                <span className="location-rule" />
                <span>{t.aboutSignature}</span>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="section faq-section">
          <div className="container faq-grid">
            <div>
              <SectionHeading
                eyebrow={t.faqEyebrow}
                title={t.faqTitle}
                description={t.faqDescription}
              />
              <a
                className="text-link faq-link"
                href={genericWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />
                {t.heroCta}
                <DirectionArrow size={17} />
              </a>
            </div>
            <div className="faq-list">
              {t.faqs.map((faq, index) => (
                <details key={index} name="faq">
                  <summary>
                    <span className="faq-number">0{index + 1}</span>
                    <span>{faq.question}</span>
                    <ChevronDown size={18} />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container contact-grid">
            <div className="contact-copy">
              <SectionHeading
                eyebrow={t.contactEyebrow}
                title={t.contactTitle}
                description={t.contactDescription}
              />
              <div className="contact-details">
                <ContactRow icon={<Phone size={20} />} label={t.phoneLabel}>
                  <a
                    className="contact-value"
                    href="tel:+218921100078"
                    dir="ltr"
                  >
                    {PHONE}
                  </a>
                </ContactRow>
                <ContactRow icon={<Mail size={20} />} label={t.emailLabel}>
                  <a
                    className="contact-value email-value"
                    href={`mailto:${EMAIL}`}
                    dir="ltr"
                  >
                    {EMAIL}
                  </a>
                </ContactRow>
                <ContactRow icon={<MapPin size={20} />} label={t.addressLabel}>
                  <p className="contact-value address-value">{t.address}</p>
                  <a
                    className="map-link"
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.maps}
                    <ArrowUpRight size={15} />
                  </a>
                </ContactRow>
              </div>
            </div>
            <form className="enquiry-form" onSubmit={submitEnquiry} noValidate>
              <div className="form-heading">
                <h3>{t.formTitle}</h3>
                <span>
                  <Send size={23} />
                </span>
              </div>
              <p className="form-description">{t.formDescription}</p>
              <div className="form-two-columns">
                <div className="field">
                  <label htmlFor="name">
                    {t.nameLabel} <span>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    ref={nameInput}
                    autoComplete="name"
                    required
                    maxLength={100}
                    placeholder={t.namePlaceholder}
                    value={form.name}
                    onChange={(e) => changeForm("name", e.target.value)}
                    aria-invalid={formError && !form.name.trim()}
                    aria-describedby={
                      formError && !form.name.trim() ? "form-error" : undefined
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="service">
                    {t.serviceLabel} <span>*</span>
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="service"
                      name="service"
                      ref={serviceInput}
                      required
                      value={form.service}
                      onChange={(e) => changeForm("service", e.target.value)}
                      aria-invalid={formError && !form.service}
                      aria-describedby={
                        formError && !form.service ? "form-error" : undefined
                      }
                    >
                      <option value="" disabled>
                        {t.servicePlaceholder}
                      </option>
                      {t.services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
              <div className="field">
                <label htmlFor="destination">
                  {t.destinationLabel} <small>({t.optional})</small>
                </label>
                <input
                  id="destination"
                  name="destination"
                  maxLength={150}
                  placeholder={t.destinationPlaceholder}
                  value={form.destination}
                  onChange={(e) => changeForm("destination", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="message">
                  {t.messageLabel} <small>({t.optional})</small>
                </label>
                <textarea
                  id="message"
                  name="message"
                  maxLength={1500}
                  rows={3}
                  placeholder={t.messagePlaceholder}
                  value={form.message}
                  onChange={(e) => changeForm("message", e.target.value)}
                />
              </div>
              {formError && (
                <p className="form-error" id="form-error" role="alert">
                  {t.formRequired}
                </p>
              )}
              <button className="button button-gold form-submit" type="submit">
                <MessageCircle size={19} />
                {t.submit}
                <DirectionArrow size={18} />
              </button>
              <p className="form-note">{t.formNote}</p>
              {preparedUrl && (
                <div className="form-status" role="status">
                  <p>{t.formOpened}</p>
                  <a
                    href={preparedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.popupFallback}
                  </a>
                </div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a className="brand" href="#home" aria-label="LIBO SCHOLARSHIP">
                <img
                  src="/images/libo-logo.jpeg"
                  alt="LIBO SCHOLARSHIP"
                  width="640"
                  height="640"
                  loading="lazy"
                />
              </a>
              <p>{t.footerDescription}</p>
            </div>
            <div className="footer-links">
              <h3>{t.footerNav}</h3>
              {t.nav.slice(1).map((label, index) => (
                <a href={`#${navIds[index + 1]}`} key={label}>
                  {label}
                </a>
              ))}
            </div>
            <div className="footer-links">
              <h3>{t.footerContact}</h3>
              <a href={`mailto:${EMAIL}`} dir="ltr">
                {EMAIL}
              </a>
              <a href="tel:+218921100078" dir="ltr">
                {PHONE}
              </a>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                {t.address}
              </a>
            </div>
            <a className="back-top" href="#home" aria-label={t.backTop}>
              <ArrowRight size={22} />
            </a>
          </div>
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} <bdi>LIBO SCHOLARSHIP.</bdi>{" "}
              {t.footerBottom}
            </p>
            <span>
              {t.footerTagline}
              <Globe2 size={14} />
            </span>
          </div>
        </div>
      </footer>
      <a
        className="whatsapp-float"
        href={genericWhatsApp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.whatsappLabel}
      >
        <MessageCircle size={27} />
        <span className="whatsapp-tooltip">{t.whatsappLabel}</span>
      </a>
    </>
  );
}
