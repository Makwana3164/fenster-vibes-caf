import { useCallback, useEffect, useRef, useState } from "react";
import { BookingStatus } from "./backend";
import { useActor } from "./hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Review {
  name: string;
  reviewText: string;
  rating: bigint;
}

interface BookingForm {
  fullName: string;
  phoneNumber: string;
  email: string;
  numberOfGuests: string;
  date: string;
  timeSlot: string;
  specialRequest: string;
}

// ─── Image Paths ──────────────────────────────────────────────────────────────
const IMG = {
  hero: "/assets/1bad15c814f0d89aa62447cd525ae7ad-019d5743-7089-74f7-af02-c46c1d64a5a2.jpg",
  coffee: "/assets/coffie-019d5719-7d34-7324-ac6f-a1afd99e28cd.jpg",
  iceDrink: "/assets/ice_drink-019d5719-7de7-72fc-863c-b1c60ae5b19f.jpg",
  nutellaFrappe:
    "/assets/nutella_frappe-019d5719-7d71-74f1-b5fd-8a5ace0e1e5f.jpg",
  italianPizza:
    "/assets/italiyan_pizza-019d5719-7d70-731f-81a3-33df0c6d5be4.jpg",
  pizza: "/assets/pizza-019d5719-846c-73ac-bfdc-dcd87f34012b.png",
  pasta: "/assets/white_sauce_pasta-019d5719-7d57-7468-8892-891f4d2d6570.jpg",
  snacks: "/assets/generated/cafe-snacks.dim_600x600.jpg",
};

// ─── Menu Data ────────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    id: 1,
    name: "Espresso",
    desc: "Rich, bold single-origin espresso shot",
    price: 150,
    cat: "Coffee & Beverages",
    img: IMG.coffee,
  },
  {
    id: 2,
    name: "Cappuccino",
    desc: "Velvety espresso with perfectly steamed milk foam",
    price: 180,
    cat: "Coffee & Beverages",
    img: IMG.coffee,
  },
  {
    id: 3,
    name: "Cold Coffee",
    desc: "Chilled brew over ice with a hint of vanilla",
    price: 200,
    cat: "Coffee & Beverages",
    img: IMG.coffee,
  },
  {
    id: 4,
    name: "Iced Latte",
    desc: "Smooth espresso over crushed ice with oat milk",
    price: 220,
    cat: "Coffee & Beverages",
    img: IMG.iceDrink,
  },
  {
    id: 5,
    name: "Nutella Frappe",
    desc: "Indulgent Nutella blended with cold espresso & cream",
    price: 280,
    cat: "Coffee & Beverages",
    img: IMG.nutellaFrappe,
  },
  {
    id: 6,
    name: "Mocha Frappe",
    desc: "Dark chocolate mocha blended with espresso & milk",
    price: 260,
    cat: "Coffee & Beverages",
    img: IMG.nutellaFrappe,
  },
  {
    id: 7,
    name: "Italian Pizza",
    desc: "Stone-baked pizza with fresh mozzarella & basil",
    price: 380,
    cat: "Pizza & Pasta",
    img: IMG.italianPizza,
  },
  {
    id: 8,
    name: "Margherita Pizza",
    desc: "Classic tomato, mozzarella and fresh basil",
    price: 350,
    cat: "Pizza & Pasta",
    img: IMG.pizza,
  },
  {
    id: 9,
    name: "Pepperoni Pizza",
    desc: "Loaded with premium pepperoni and mozzarella",
    price: 420,
    cat: "Pizza & Pasta",
    img: IMG.pizza,
  },
  {
    id: 10,
    name: "White Sauce Pasta",
    desc: "Penne in creamy béchamel with garlic and herbs",
    price: 320,
    cat: "Pizza & Pasta",
    img: IMG.pasta,
  },
  {
    id: 11,
    name: "Penne Arrabbiata",
    desc: "Spicy tomato sauce with garlic and fresh chilli",
    price: 300,
    cat: "Pizza & Pasta",
    img: IMG.pasta,
  },
  {
    id: 12,
    name: "Bruschetta",
    desc: "Toasted sourdough with tomato, garlic & basil",
    price: 200,
    cat: "Snacks & Desserts",
    img: IMG.snacks,
  },
  {
    id: 13,
    name: "Garlic Bread",
    desc: "Crispy baguette slices with herb butter",
    price: 180,
    cat: "Snacks & Desserts",
    img: IMG.snacks,
  },
  {
    id: 14,
    name: "Chocolate Brownie",
    desc: "Fudgy dark chocolate brownie with vanilla ice cream",
    price: 220,
    cat: "Snacks & Desserts",
    img: IMG.snacks,
  },
  {
    id: 15,
    name: "Tiramisu",
    desc: "Italian classic with mascarpone, espresso & cocoa",
    price: 280,
    cat: "Snacks & Desserts",
    img: IMG.snacks,
  },
  {
    id: 16,
    name: "Chicken Sandwich",
    desc: "Grilled chicken with lettuce, pesto & sourdough",
    price: 250,
    cat: "Snacks & Desserts",
    img: IMG.snacks,
  },
  {
    id: 17,
    name: "Nachos",
    desc: "Crispy nachos with salsa, guacamole & sour cream",
    price: 230,
    cat: "Snacks & Desserts",
    img: IMG.snacks,
  },
  {
    id: 18,
    name: "Waffle",
    desc: "Belgian waffle with maple syrup & fresh berries",
    price: 240,
    cat: "Snacks & Desserts",
    img: IMG.snacks,
  },
];

const MENU_CATS = [
  "All",
  "Coffee & Beverages",
  "Pizza & Pasta",
  "Snacks & Desserts",
];

const STATIC_REVIEWS = [
  {
    name: "Priya S.",
    rating: 5,
    reviewText:
      "Best café in Surat! The ambiance is absolutely dreamy. Coming here every weekend now!",
  },
  {
    name: "Rahul M.",
    rating: 5,
    reviewText:
      "Perfect date spot. Coffee is amazing and the place is super Instagrammable!",
  },
  {
    name: "Ananya K.",
    rating: 4,
    reviewText:
      "Love the pet-friendly vibe. My dog loved it too! Great food and chill atmosphere.",
  },
  {
    name: "Dev P.",
    rating: 5,
    reviewText:
      "The Nutella Frappe is absolutely incredible. Late night vibes are unmatched!",
  },
  {
    name: "Meera R.",
    rating: 5,
    reviewText:
      "Fenster Cafe is our go-to for content creation. Every corner is photogenic!",
  },
];

const TIME_SLOTS = [
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
];

const GALLERY_IMGS = [
  { src: IMG.hero, alt: "Fenster Cafe ambiance", size: "tall" },
  { src: IMG.coffee, alt: "Artisan coffee", size: "normal" },
  { src: IMG.italianPizza, alt: "Italian pizza", size: "normal" },
  { src: IMG.nutellaFrappe, alt: "Nutella frappe", size: "tall" },
  { src: IMG.pizza, alt: "Pizza close-up", size: "normal" },
  { src: IMG.pasta, alt: "White sauce pasta", size: "normal" },
  { src: IMG.iceDrink, alt: "Iced drinks", size: "normal" },
  { src: IMG.snacks, alt: "Café menu items", size: "normal" },
];

// ─── Hooks ─────────────────────────────────────────────────────────────────────
function useFadeIn(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Make visible immediately if already in viewport
    el.classList.add("visible");
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -50px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function StarIcon({
  filled = true,
  size = 18,
}: { filled?: boolean; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function MenuIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDown({ size = 24 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Components ────────────────────────────────────────────────────────────────

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5 text-cafe-gold">
      {Array.from({ length: max }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: star positions are positional by nature
        <StarIcon key={i} filled={i < rating} size={16} />
      ))}
    </div>
  );
}

function SectionTitle({
  subtitle,
  title,
  center = true,
}: { subtitle?: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "text-center mb-12" : "mb-8"}>
      {subtitle && (
        <p className="font-body text-cafe-gold text-sm font-bold uppercase tracking-widest mb-3">
          {subtitle}
        </p>
      )}
      <h2 className="font-serif text-4xl md:text-5xl text-cafe-cream">
        {title}
      </h2>
      <div
        className={`mt-4 h-0.5 w-16 bg-cafe-gold ${center ? "mx-auto" : ""}`}
      />
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Menu", href: "#menu" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#reviews" },
    { label: "Book Table", href: "#booking" },
    { label: "Contact", href: "#contact" },
  ];

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cafe-bg/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#home"
            className="font-serif text-xl md:text-2xl font-bold text-cafe-gold tracking-wide hover:text-cafe-gold-light transition-colors"
          >
            Fenster Cafe
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-ocid={`nav.${link.label.toLowerCase().replace(" ", "_")}.link`}
                className="nav-link font-body text-sm text-cafe-cream/80 hover:text-cafe-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((p) => !p)}
            data-ocid="nav.menu.toggle"
            className="md:hidden text-cafe-cream hover:text-cafe-gold transition-colors p-1"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-cafe-bg/98 backdrop-blur-md border-t border-cafe-border">
          <div className="px-4 py-4 flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="font-body text-cafe-cream/80 hover:text-cafe-gold transition-colors py-2 border-b border-cafe-border/40 last:border-0"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <img
        src={IMG.hero}
        alt="Fenster Cafe"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="font-body text-cafe-gold text-xs md:text-sm uppercase tracking-[0.25em] mb-4 font-bold">
          Welcome to
        </p>
        <h1 className="shimmer-text font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
          Fenster Cafe
        </h1>
        <p className="font-body text-cafe-cream/90 text-lg md:text-xl lg:text-2xl mb-10 font-light tracking-wide">
          Where Every Sip Tells a Story
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#booking"
            data-ocid="hero.booking.primary_button"
            className="btn-gold px-8 py-3 rounded-md text-sm uppercase tracking-wider font-bold inline-block"
          >
            Book a Table
          </a>
          <a
            href="#menu"
            data-ocid="hero.menu.secondary_button"
            className="btn-outline-gold px-8 py-3 rounded-md text-sm uppercase tracking-wider inline-block"
          >
            View Menu
          </a>
        </div>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cafe-cream/60 animate-bounce">
        <ChevronDown size={32} />
      </div>
    </section>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────
function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref);

  const badges = [
    { icon: "🐾", label: "Pet Friendly" },
    { icon: "🌙", label: "Late Night (till 12 AM)" },
    { icon: "💑", label: "Perfect for Dates" },
    { icon: "📸", label: "Instagram Worthy" },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="section-fade py-20 md:py-28 bg-cafe-panel"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div>
            <SectionTitle
              subtitle="Our Story"
              title="A Space Made for Moments"
              center={false}
            />
            <p className="font-body text-cafe-cream/75 leading-relaxed mb-4 text-base">
              Nestled in the heart of Sunday Hub, Katargam, Surat — Fenster Cafe
              is more than just a coffee shop. It's a curated experience for
              those who appreciate the art of good coffee, great food, and even
              better company.
            </p>
            <p className="font-body text-cafe-cream/75 leading-relaxed mb-8 text-base">
              Whether you're on a romantic date, a creative photoshoot, or a
              late-night hangout with friends, Fenster sets the perfect stage.
              Our doors stay open till midnight, and yes — your furry friends
              are always welcome.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-3 bg-cafe-card rounded-lg p-3 border border-cafe-border/60"
                >
                  <span className="text-xl">{b.icon}</span>
                  <span className="font-body text-sm text-cafe-cream/85 font-medium">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-3 border border-cafe-gold/30 rounded-2xl" />
            <img
              src={IMG.snacks}
              alt="Fenster Cafe food and ambiance"
              className="w-full h-80 md:h-96 object-cover object-center rounded-xl shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-cafe-gold text-cafe-bg rounded-xl px-4 py-3 shadow-lg">
              <p className="font-serif text-xl font-bold">4.9 ★</p>
              <p className="font-body text-xs font-bold uppercase tracking-wider">
                Rated in Surat
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Menu Section ─────────────────────────────────────────────────────────────
function MenuSection() {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((m) => m.cat === activeCategory);

  return (
    <section
      id="menu"
      ref={ref}
      className="section-fade py-20 md:py-28 bg-cafe-bg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Food & Drinks" title="Our Menu" />

        {/* Category Tabs */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-10"
          data-ocid="menu.filter.tab"
        >
          {MENU_CATS.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-body px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeCategory === cat
                  ? "bg-cafe-gold text-cafe-bg border-cafe-gold"
                  : "bg-transparent text-cafe-cream/70 border-cafe-border hover:border-cafe-gold hover:text-cafe-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              data-ocid={`menu.item.${idx + 1}`}
              className="menu-card bg-cafe-card border border-cafe-border/60 rounded-xl overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-cafe-cream text-lg font-semibold">
                    {item.name}
                  </h3>
                  <span className="font-body text-cafe-gold font-bold text-base ml-2 shrink-0">
                    ₹{item.price}
                  </span>
                </div>
                <p className="font-body text-cafe-muted text-sm leading-relaxed">
                  {item.desc}
                </p>
                <span className="inline-block mt-3 text-xs font-body text-cafe-gold/70 uppercase tracking-wider border border-cafe-gold/30 rounded-full px-2.5 py-0.5">
                  {item.cat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
function GallerySection() {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref);

  return (
    <section
      id="gallery"
      ref={ref}
      className="section-fade py-20 md:py-28 bg-cafe-panel"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Visual Stories" title="Our Vibe" />

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {GALLERY_IMGS.map((img, idx) => (
            <div
              key={img.alt}
              data-ocid={`gallery.item.${idx + 1}`}
              className={`gallery-item rounded-xl overflow-hidden block ${
                img.size === "tall"
                  ? "break-inside-avoid mb-3"
                  : "break-inside-avoid mb-3"
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className={`w-full object-cover object-center rounded-xl ${
                  idx % 3 === 0 ? "h-64" : idx % 3 === 1 ? "h-40" : "h-52"
                }`}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://www.instagram.com/fenster.cafe"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="gallery.instagram.link"
            className="btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-md text-sm uppercase tracking-wider"
          >
            <InstagramIcon size={18} />
            Follow us on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────
function ReviewsSection() {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref);
  const { actor } = useActor();

  const [current, setCurrent] = useState(0);
  const [backendReviews, setBackendReviews] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    text: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const allReviews = [
    ...STATIC_REVIEWS,
    ...backendReviews.map((r) => ({
      name: r.name,
      rating: Number(r.rating),
      reviewText: r.reviewText,
    })),
  ];

  useEffect(() => {
    if (!actor) return;
    actor
      .getAllReviews()
      .then(setBackendReviews)
      .catch(() => {});
  }, [actor]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p + 1) % allReviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [allReviews.length]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSubmitting(true);
    try {
      await actor.submitReview(
        reviewForm.name,
        BigInt(reviewForm.rating),
        reviewForm.text,
      );
      setSubmitSuccess(true);
      setReviewForm({ name: "", rating: 5, text: "" });
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  const visible = allReviews
    .slice(current, current + 3)
    .concat(allReviews.slice(0, Math.max(0, current + 3 - allReviews.length)));

  return (
    <section
      id="reviews"
      ref={ref}
      className="section-fade py-20 md:py-28 bg-cafe-bg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          subtitle="Guest Testimonials"
          title="What Our Guests Say"
        />

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {visible.map((rev, idx) => (
            <div
              key={`${rev.name}-${idx}`}
              data-ocid={`reviews.item.${idx + 1}`}
              className="review-card bg-cafe-card border border-cafe-border/60 rounded-xl p-6 relative"
            >
              <div className="text-cafe-gold/30 text-5xl font-serif absolute top-4 right-5 leading-none select-none">
                &#8220;
              </div>
              <StarRating rating={rev.rating} />
              <p className="font-body text-cafe-cream/80 mt-3 mb-5 text-sm leading-relaxed">
                {rev.reviewText}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cafe-gold/20 flex items-center justify-center text-cafe-gold font-serif font-bold text-sm">
                  {rev.name[0]}
                </div>
                <span className="font-body text-cafe-gold text-sm font-semibold">
                  {rev.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {allReviews.map((rev, i) => (
            <button
              type="button"
              key={`dot-${rev.name}`}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current
                  ? "bg-cafe-gold w-5"
                  : "bg-cafe-border hover:bg-cafe-gold/50"
              }`}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            data-ocid="reviews.write.open_modal_button"
            className="btn-outline-gold px-8 py-3 rounded-md text-sm uppercase tracking-wider"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          data-ocid="reviews.write.modal"
        >
          <div className="bg-cafe-card border border-cafe-border rounded-2xl w-full max-w-md p-8 relative">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              data-ocid="reviews.write.close_button"
              className="absolute top-4 right-4 text-cafe-muted hover:text-cafe-cream transition-colors"
            >
              <CloseIcon size={20} />
            </button>
            <h3 className="font-serif text-2xl text-cafe-cream mb-6">
              Share Your Experience
            </h3>

            {submitSuccess ? (
              <div
                data-ocid="reviews.write.success_state"
                className="text-center py-8"
              >
                <div className="text-4xl mb-4">✨</div>
                <p className="font-body text-cafe-gold text-lg font-semibold">
                  Thank you for your review!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label
                    htmlFor="review-name"
                    className="block font-body text-cafe-muted text-sm mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    required
                    value={reviewForm.name}
                    onChange={(e) =>
                      setReviewForm((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="reviews.name.input"
                    className="w-full bg-cafe-panel border border-cafe-border rounded-lg px-4 py-2.5 font-body text-cafe-cream text-sm focus:outline-none focus:border-cafe-gold transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="review-rating-1"
                    className="block font-body text-cafe-muted text-sm mb-1.5"
                  >
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        type="button"
                        key={n}
                        onClick={() =>
                          setReviewForm((p) => ({ ...p, rating: n }))
                        }
                        className={`text-xl transition-transform hover:scale-110 ${
                          n <= reviewForm.rating
                            ? "text-cafe-gold"
                            : "text-cafe-border"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="review-text"
                    className="block font-body text-cafe-muted text-sm mb-1.5"
                  >
                    Your Review
                  </label>
                  <textarea
                    id="review-text"
                    required
                    value={reviewForm.text}
                    onChange={(e) =>
                      setReviewForm((p) => ({ ...p, text: e.target.value }))
                    }
                    data-ocid="reviews.text.textarea"
                    rows={4}
                    className="w-full bg-cafe-panel border border-cafe-border rounded-lg px-4 py-2.5 font-body text-cafe-cream text-sm focus:outline-none focus:border-cafe-gold transition-colors resize-none"
                    placeholder="Tell us about your experience..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  data-ocid="reviews.write.submit_button"
                  className="btn-gold w-full py-3 rounded-lg text-sm uppercase tracking-wider disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Booking Section ──────────────────────────────────────────────────────────
function BookingSection() {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref);
  const { actor } = useActor();

  const today = new Date().toISOString().split("T")[0];
  const emptyForm: BookingForm = {
    fullName: "",
    phoneNumber: "",
    email: "",
    numberOfGuests: "2",
    date: "",
    timeSlot: "",
    specialRequest: "",
  };

  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const setField = useCallback(
    (field: keyof BookingForm) =>
      (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
      ) =>
        setForm((p) => ({ ...p, [field]: e.target.value })),
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      setError("Please wait for the app to connect and try again.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await actor.submitBooking({
        status: BookingStatus.pending,
        date: form.date,
        fullName: form.fullName,
        email: form.email,
        timestamp: BigInt(Date.now()),
        specialRequest: form.specialRequest,
        phoneNumber: form.phoneNumber,
        numberOfGuests: BigInt(Number.parseInt(form.numberOfGuests)),
        timeSlot: form.timeSlot,
      });
      setSuccess(true);
    } catch {
      setError(
        "Something went wrong. Please try again or WhatsApp us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-cafe-card border border-cafe-border rounded-lg px-4 py-3 font-body text-cafe-cream text-sm focus:outline-none focus:border-cafe-gold transition-colors placeholder:text-cafe-muted/60";
  const labelClass =
    "block font-body text-cafe-muted text-sm mb-1.5 font-medium";

  return (
    <section
      id="booking"
      ref={ref}
      className="section-fade py-20 md:py-28 bg-cafe-panel"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Reservations" title="Reserve Your Table" />

        {success ? (
          <div
            data-ocid="booking.success_state"
            className="text-center py-12 bg-cafe-card border border-cafe-border rounded-2xl px-8"
          >
            <div className="text-6xl mb-6">🎉</div>
            <h3 className="font-serif text-2xl text-cafe-gold mb-3">
              Booking Confirmed!
            </h3>
            <p className="font-body text-cafe-cream/75 mb-6">
              Thank you, {form.fullName}! Your table for {form.numberOfGuests}{" "}
              on {form.date} at {form.timeSlot} has been reserved.
            </p>
            <a
              href="https://wa.me/917046200025"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="booking.whatsapp.link"
              className="btn-gold inline-flex items-center gap-2 px-8 py-3 rounded-lg text-sm uppercase tracking-wider"
            >
              <WhatsAppIcon size={18} />
              Confirm on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setForm(emptyForm);
              }}
              className="block mx-auto mt-4 font-body text-cafe-muted text-sm hover:text-cafe-cream transition-colors"
            >
              Make another booking
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-cafe-card border border-cafe-border/60 rounded-2xl p-6 md:p-8 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="booking-name" className={labelClass}>
                  Full Name *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={setField("fullName")}
                  data-ocid="booking.name.input"
                  className={inputClass}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="booking-phone" className={labelClass}>
                  Phone Number *
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  required
                  value={form.phoneNumber}
                  onChange={setField("phoneNumber")}
                  data-ocid="booking.phone.input"
                  className={inputClass}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div>
              <label htmlFor="booking-email" className={labelClass}>
                Email Address *
              </label>
              <input
                id="booking-email"
                type="email"
                required
                value={form.email}
                onChange={setField("email")}
                data-ocid="booking.email.input"
                className={inputClass}
                placeholder="your@email.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label htmlFor="booking-guests" className={labelClass}>
                  Guests *
                </label>
                <select
                  id="booking-guests"
                  required
                  value={form.numberOfGuests}
                  onChange={setField("numberOfGuests")}
                  data-ocid="booking.guests.select"
                  className={inputClass}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="booking-date" className={labelClass}>
                  Date *
                </label>
                <input
                  id="booking-date"
                  type="date"
                  required
                  min={today}
                  value={form.date}
                  onChange={setField("date")}
                  data-ocid="booking.date.input"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="booking-timeslot" className={labelClass}>
                  Time Slot *
                </label>
                <select
                  id="booking-timeslot"
                  required
                  value={form.timeSlot}
                  onChange={setField("timeSlot")}
                  data-ocid="booking.timeslot.select"
                  className={inputClass}
                >
                  <option value="">Select time</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="booking-request" className={labelClass}>
                Special Request (Optional)
              </label>
              <textarea
                id="booking-request"
                rows={3}
                value={form.specialRequest}
                onChange={setField("specialRequest")}
                data-ocid="booking.request.textarea"
                className={`${inputClass} resize-none`}
                placeholder="Any special occasion, dietary requirements, seating preference..."
              />
            </div>

            {error && (
              <p
                data-ocid="booking.error_state"
                className="font-body text-red-400 text-sm"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              data-ocid="booking.submit_button"
              className="btn-gold w-full py-3.5 rounded-lg text-sm uppercase tracking-wider disabled:opacity-60"
            >
              {submitting ? "Confirming..." : "Confirm Booking"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  useFadeIn(ref);

  return (
    <section
      id="contact"
      ref={ref}
      className="section-fade py-20 md:py-28 bg-cafe-bg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle subtitle="Find Us" title="Get In Touch" />

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-cafe-card border border-cafe-border/60 rounded-xl p-6">
              <div className="flex gap-4 items-start">
                <span className="text-2xl mt-0.5">📍</span>
                <div>
                  <h3 className="font-serif text-cafe-gold text-lg mb-1">
                    Location
                  </h3>
                  <p className="font-body text-cafe-cream/75 text-sm leading-relaxed">
                    Sunday Hub, Katargam,
                    <br />
                    Surat, Gujarat 395004
                    <br />
                    India
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cafe-card border border-cafe-border/60 rounded-xl p-6">
              <div className="flex gap-4 items-start">
                <span className="text-2xl mt-0.5">📞</span>
                <div>
                  <h3 className="font-serif text-cafe-gold text-lg mb-1">
                    Phone
                  </h3>
                  <a
                    href="tel:+917046200025"
                    className="font-body text-cafe-cream/75 text-sm hover:text-cafe-gold transition-colors"
                  >
                    +91 7046200025
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-cafe-card border border-cafe-border/60 rounded-xl p-6">
              <div className="flex gap-4 items-start">
                <span className="text-2xl mt-0.5">🕐</span>
                <div>
                  <h3 className="font-serif text-cafe-gold text-lg mb-2">
                    Hours
                  </h3>
                  <div className="font-body text-cafe-cream/75 text-sm space-y-1">
                    <div className="flex justify-between gap-8">
                      <span>Monday – Sunday</span>
                      <span className="text-cafe-gold font-semibold">
                        11:00 AM – 12:00 AM
                      </span>
                    </div>
                    <p className="text-cafe-muted text-xs mt-2">
                      Open 7 days a week · Open till midnight
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-cafe-card border border-cafe-border/60 rounded-xl p-6">
              <div className="flex gap-4 items-start">
                <span className="text-2xl mt-0.5">📸</span>
                <div>
                  <h3 className="font-serif text-cafe-gold text-lg mb-1">
                    Instagram
                  </h3>
                  <a
                    href="https://www.instagram.com/fenster.cafe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-cafe-cream/75 text-sm hover:text-cafe-gold transition-colors"
                  >
                    @fenster.cafe
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden border border-cafe-border/60 shadow-2xl h-[420px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.8167439066!2d72.83843967490498!3d21.219534980487855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f5d7a4c7d1f%3A0x7b8d6e0c1d2a3b4c!2sSunday%20Hub%2C%20Katargam%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Fenster Cafe Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-cafe-panel border-t border-cafe-border/40 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-cafe-gold text-xl font-bold mb-2">
              Fenster Cafe
            </h3>
            <p className="font-body text-cafe-muted text-sm mb-4">
              Where Every Sip Tells a Story
            </p>
            <a
              href="https://www.instagram.com/fenster.cafe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cafe-muted hover:text-cafe-gold transition-colors inline-flex items-center gap-2 font-body text-sm"
            >
              <InstagramIcon size={18} />
              @fenster.cafe
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-cafe-cream text-base mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                ["Home", "#home"],
                ["About", "#about"],
                ["Menu", "#menu"],
                ["Gallery", "#gallery"],
                ["Book a Table", "#booking"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="font-body text-cafe-muted text-sm hover:text-cafe-gold transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-cafe-cream text-base mb-4">
              Visit Us
            </h4>
            <div className="font-body text-cafe-muted text-sm space-y-2">
              <p>Sunday Hub, Katargam</p>
              <p>Surat, Gujarat 395004</p>
              <a
                href="tel:+917046200025"
                className="hover:text-cafe-gold transition-colors block"
              >
                +91 7046200025
              </a>
              <p className="text-cafe-gold/80">Mon–Sun: 11 AM – 12 AM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-cafe-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-cafe-muted text-xs">
            © {year} Fenster Cafe. All rights reserved.
          </p>
          <p className="font-body text-cafe-muted text-xs">
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cafe-gold transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating WhatsApp Button ─────────────────────────────────────────────────
function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/917046200025"
      target="_blank"
      rel="noopener noreferrer"
      data-ocid="whatsapp.float.button"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group float-btn"
    >
      <div className="relative flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-400 transition-colors rounded-full shadow-2xl">
        <WhatsAppIcon size={28} />
        <span className="absolute right-16 bg-cafe-card border border-cafe-border text-cafe-cream text-xs font-body rounded-lg px-3 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          Chat on WhatsApp
        </span>
      </div>
    </a>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-cafe-bg text-cafe-cream">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <MenuSection />
        <GallerySection />
        <ReviewsSection />
        <BookingSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
