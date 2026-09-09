import {
  ArrowUpRight,
  BedDouble,
  Check,
  ChevronDown,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { formatBRLFromCents } from "@/lib/currency";

const WHATSAPP = "5562995111648";
const logoSrc = "/manus-storage/logo-wfc_8d426acc.jpg";

const properties = [
  {
    id: "01310",
    title: "Casa dos Sonhos",
    location: "Senador Canedo · Jardim das Oliveiras",
    type: "Casa",
    price_cents: 42000000,
    bedrooms: 3,
    baths: 2,
    area: "148 m²",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
    tag: "Destaque",
  },
  {
    id: "01304",
    title: "Casa térrea com jardim",
    location: "Senador Canedo · Residencial Anápolis",
    type: "Casa",
    price_cents: 35000000,
    bedrooms: 2,
    baths: 2,
    area: "92 m²",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=85",
    tag: "Financiável",
  },
  {
    id: "01288",
    title: "Chácara Recanto Verde",
    location: "Bela Vista de Goiás · 28 min de Senador Canedo",
    type: "Chácara",
    price_cents: 26500000,
    bedrooms: 3,
    baths: 2,
    area: "1.200 m²",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85",
    tag: "Natureza",
  },
  {
    id: "01270",
    title: "Lote para construir",
    location: "Senador Canedo · Jardim Boa Vista",
    type: "Lote",
    price_cents: 9900000,
    bedrooms: 0,
    baths: 0,
    area: "240 m²",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85",
    tag: "Oportunidade",
  },
  {
    id: "01261",
    title: "Galpão Nova Cidade",
    location: "Senador Canedo · Nova Cidade",
    type: "Comercial",
    price_cents: 78000000,
    bedrooms: 0,
    baths: 2,
    area: "480 m²",
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=85",
    tag: "Comercial",
  },
  {
    id: "01242",
    title: "Sobrado com varanda",
    location: "Goiânia · Parque Atheneu",
    type: "Casa",
    price_cents: 59990000,
    bedrooms: 4,
    baths: 3,
    area: "210 m²",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85",
    tag: "Novo",
  },
];

const categories = [
  { label: "Casas", detail: "Para morar bem", image: properties[0].image },
  { label: "Lotes", detail: "Seu projeto começa aqui", image: properties[3].image },
  { label: "Chácaras", detail: "Mais espaço para viver", image: properties[2].image },
];

function whatsappLink(property?: (typeof properties)[number]) {
  const message = property
    ? `Olá, tenho interesse no imóvel ${property.id} — ${property.title}. Gostaria de receber mais informações e agendar uma visita.`
    : "Olá, quero encontrar um imóvel com a WFC Imóveis.";
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

function SectionLabel({ children }: { children: string }) {
  return <p className="section-label">{children}</p>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [type, setType] = useState("Todos");
  const [location, setLocation] = useState("Toda a região");
  const [searchTerm, setSearchTerm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredProperties = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return properties.filter((property) => {
      const matchesType = type === "Todos" || property.type === type;
      const matchesLocation =
        location === "Toda a região" || property.location.includes(location);
      const matchesTerm =
        !term ||
        property.title.toLowerCase().includes(term) ||
        property.location.toLowerCase().includes(term);
      return matchesType && matchesLocation && matchesTerm;
    });
  }, [location, searchTerm, type]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    document.getElementById("imoveis")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="site-shell">
      <div className="topline">
        <div className="container top-line-inner">
          <span><Sparkles size={14} /> Atendimento próximo em Senador Canedo e região</span>
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">Fale com um corretor <ArrowUpRight size={14} /></a>
        </div>
      </div>

      <header className="site-header">
        <div className="container nav-inner">
          <a className="brand" href="#inicio" aria-label="WFC Imóveis — início">
            <img src={logoSrc} alt="WFC Imóveis" />
          </a>
          <nav className={menuOpen ? "main-nav is-open" : "main-nav"}>
            <a href="/catalogo" onClick={() => setMenuOpen(false)}>Imóveis</a>
            <a href="/clientes" onClick={() => setMenuOpen(false)}>Nossos clientes</a>
            <a href="#especialidades" onClick={() => setMenuOpen(false)}>Especialidades</a>
            <a href="/equipe" onClick={() => setMenuOpen(false)}>Nossa equipe</a>
            <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
          </nav>
          <a className="nav-cta" href={whatsappLink()} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a>
          <button className="menu-toggle" onClick={() => setMenuOpen((current) => !current)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>

      <main id="inicio">
        <section className="hero-section">
          <div className="hero-glow" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <SectionLabel>Uma imobiliária de perto</SectionLabel>
              <h1>Seu próximo endereço começa <em>aqui.</em></h1>
              <p className="hero-lede">Casas, lotes e chácaras escolhidos para você viver o melhor de Senador Canedo e região — com orientação clara em cada etapa.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#imoveis">Explorar imóveis <ArrowUpRight size={17} /></a>
                <a className="text-link" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">Quero falar com a WFC <span>↗</span></a>
              </div>
              <div className="trust-row">
                <span><ShieldCheck size={17} /> CRECI 21496</span>
                <span><Check size={17} /> Atendimento humano</span>
              </div>
            </div>
            <div className="hero-visual" aria-label="Casa contemporânea cercada por natureza">
              <div className="hero-image-main">
                <img src={properties[0].image} alt="Casa contemporânea com jardim" />
              </div>
              <div className="hero-image-small">
                <img src={properties[2].image} alt="Área verde de uma chácara" />
              </div>
              <div className="hero-stat"><strong>98</strong><span>oportunidades<br />no catálogo</span></div>
              <div className="hero-seal"><span>WFC</span><small>desde<br />2014</small></div>
            </div>
          </div>
          <div className="container search-wrap">
            <form className="search-panel" onSubmit={handleSearch}>
              <div className="search-heading"><Search size={20} /><div><strong>Encontre o seu imóvel</strong><span>Comece por uma busca rápida</span></div></div>
              <label className="field-group"><span>O que você procura?</span><select value={type} onChange={(event) => setType(event.target.value)}><option>Todos</option><option>Casa</option><option>Lote</option><option>Chácara</option><option>Comercial</option></select><ChevronDown size={16} /></label>
              <label className="field-group"><span>Onde?</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option>Toda a região</option><option>Senador Canedo</option><option>Goiânia</option><option>Bela Vista de Goiás</option></select><ChevronDown size={16} /></label>
              <label className="field-group search-field"><span>Busque por nome ou bairro</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Ex.: Jardim das Oliveiras" /></label>
              <button className="button button-dark" type="submit"><Search size={17} /> Buscar imóveis</button>
            </form>
            {submitted && <p className="search-feedback"><Check size={15} /> Mostrando {filteredProperties.length} oportunidade{filteredProperties.length === 1 ? "" : "s"} para a sua busca.</p>}
          </div>
        </section>

        <section className="section featured-section" id="imoveis">
          <div className="container">
            <div className="section-head"><div><SectionLabel>Curadoria WFC</SectionLabel><h2>Oportunidades que<br /><em>merecem ser vistas.</em></h2></div><a className="text-link" href="#imoveis">Ver catálogo completo <ArrowUpRight size={17} /></a></div>
            <div className="property-grid">
              {filteredProperties.map((property) => (
                <article className="property-card" key={property.id}>
                  <a href={whatsappLink(property)} target="_blank" rel="noreferrer" className="property-image-wrap">
                    <img src={property.image} alt={property.title} />
                    <span className="property-tag">{property.tag}</span>
                    <span className="property-code">Cód. {property.id}</span>
                  </a>
                  <div className="property-body">
                    <div className="property-type">{property.type}</div>
                    <h3>{property.title}</h3>
                    <p className="property-location"><MapPin size={15} /> {property.location}</p>
                    <div className="property-details"><span><BedDouble size={16} /> {property.bedrooms ? `${property.bedrooms} quartos` : "Amplo"}</span><span>{property.baths ? `${property.baths} banheiros` : "Versátil"}</span><span>{property.area}</span></div>
                    <div className="property-footer"><strong>{formatBRLFromCents(property.price_cents)}</strong><a href={whatsappLink(property)} target="_blank" rel="noreferrer" aria-label={`Ver detalhes de ${property.title}`}><ArrowUpRight size={18} /></a></div>
                  </div>
                </article>
              ))}
            </div>
            {filteredProperties.length === 0 && <div className="empty-state"><Search size={26} /><h3>Não encontramos esse perfil ainda.</h3><p>Fale com a WFC e montamos uma busca sob medida para você.</p><a className="button button-primary" href={whatsappLink()} target="_blank" rel="noreferrer">Falar com um corretor</a></div>}
          </div>
        </section>

        <section className="section intention-section">
          <div className="container intention-grid">
            <div className="intention-intro"><SectionLabel>Por onde começar?</SectionLabel><h2>Uma decisão grande,<br /><em>um caminho simples.</em></h2><p>Você não precisa entender de financiamento, documentação ou mercado imobiliário. A gente traduz tudo e acompanha de perto.</p><a className="text-link light-link" href={whatsappLink()} target="_blank" rel="noreferrer">Converse com a nossa equipe <ArrowUpRight size={17} /></a></div>
            <div className="intention-list"><a href="#imoveis"><span>01</span><div><strong>Quero comprar</strong><small>Encontre uma casa com a sua cara</small></div><ArrowUpRight size={20} /></a><a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá, quero entender as opções de financiamento para um imóvel.")}`} target="_blank" rel="noreferrer"><span>02</span><div><strong>Quero financiar</strong><small>Entenda as possibilidades sem complicação</small></div><ArrowUpRight size={20} /></a><a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá, quero anunciar meu imóvel com a WFC.")}`} target="_blank" rel="noreferrer"><span>03</span><div><strong>Quero vender</strong><small>Conte com conhecimento local para anunciar</small></div><ArrowUpRight size={20} /></a></div>
          </div>
        </section>

        <section className="section category-section" id="especialidades">
          <div className="container"><div className="section-head"><div><SectionLabel>Do seu jeito</SectionLabel><h2>Espaço para cada<br /><em>novo começo.</em></h2></div><p className="section-note">Da primeira chave ao terreno para o futuro, encontre possibilidades que combinam com o seu momento.</p></div><div className="category-grid">{categories.map((category, index) => <a href="#imoveis" className={`category-card category-${index + 1}`} key={category.label}><img src={category.image} alt={category.label} /><div className="category-overlay" /><div className="category-content"><span>0{index + 1}</span><h3>{category.label}</h3><p>{category.detail}</p><ArrowUpRight size={20} /></div></a>)}</div></div>
        </section>

        <section className="section about-section" id="sobre">
          <div className="container about-grid"><div className="about-image"><img src={properties[1].image} alt="Interior iluminado de uma casa" /><div className="about-caption"><strong>Conhecer bem<br />é cuidar melhor.</strong><span>WFC Imóveis</span></div></div><div className="about-copy"><SectionLabel>Sobre a WFC</SectionLabel><h2>Conhecimento local.<br /><em>Olhar para o futuro.</em></h2><p>A WFC nasceu para aproximar pessoas de bons lugares. Em Senador Canedo e no entorno, conhecemos os bairros, as oportunidades e o que faz cada família se sentir em casa.</p><p>Nosso trabalho começa ouvindo você — e continua depois da entrega das chaves, com transparência, agilidade e presença.</p><div className="about-signature"><span>W</span><div><strong>WFC Imóveis</strong><small>Seu próximo endereço começa aqui.</small></div></div></div></div>
        </section>

        <section className="contact-section" id="contato"><div className="container contact-grid"><div><SectionLabel>Vamos conversar?</SectionLabel><h2>Seu lugar pode estar<br /><em>mais perto do que parece.</em></h2></div><div className="contact-card"><p>Conte o que você procura. A equipe WFC responde pelo WhatsApp e ajuda você a dar o próximo passo.</p><a className="button button-light" href={whatsappLink()} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Falar com a WFC</a><span>Resposta rápida · Atendimento humanizado</span></div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><img src={logoSrc} alt="WFC Imóveis" /><p>Seu próximo endereço começa aqui.</p></div><div className="footer-column"><strong>Navegue</strong><a href="#imoveis">Encontrar imóvel</a><a href="#especialidades">Especialidades</a><a href="#sobre">Sobre a WFC</a></div><div className="footer-column"><strong>Fale conosco</strong><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">(62) 99511-1648</a><a href="https://www.instagram.com/wfc_imoveis/" target="_blank" rel="noreferrer"><Instagram size={15} /> @wfc_imoveis</a><span>Senador Canedo e região</span></div></div><div className="container footer-bottom"><span>© 2026 WFC Imóveis. CRECI 21496.</span><span>Feito para encontrar bons lugares.</span></div></footer>
      <a className="floating-whatsapp" href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="Falar com a WFC no WhatsApp"><MessageCircle size={22} /></a>
    </div>
  );
}
