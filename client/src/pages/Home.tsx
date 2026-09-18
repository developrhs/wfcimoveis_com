import { ArrowUpRight, BedDouble, Check, ChevronDown, MapPin, Menu, MessageCircle, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatBRLFromCents } from "@/lib/currency";
import { fetchPublicProperties, propertyContactLink, PublicProperty } from "@/lib/publicProperties";

const WHATSAPP = "5562995111648";
const logoSrc = "/manus-storage/logo-wfc_8d426acc.jpg";

function whatsappLink(property?: PublicProperty) {
  return property ? propertyContactLink(property, WHATSAPP) : `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá, quero encontrar um imóvel com a WFC Imóveis.")}`;
}
function SectionLabel({ children }: { children: string }) { return <p className="section-label">{children}</p>; }
function ImageOrEmpty({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  return src ? <img className={className} src={src} alt={alt} /> : <div className={`${className ?? ""} image-unavailable`} role="img" aria-label="Imagem ainda não cadastrada" />;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [type, setType] = useState("Todos");
  const [location, setLocation] = useState("Toda a região");
  const [searchTerm, setSearchTerm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetchPublicProperties(controller.signal).then(setProperties).catch((reason: unknown) => {
      if ((reason as Error)?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Não foi possível carregar o catálogo.");
    }).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const filteredProperties = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return properties.filter((property) => {
      const matchesType = type === "Todos" || property.type === type;
      const matchesLocation = location === "Toda a região" || property.location.toLowerCase().includes(location.toLowerCase());
      const matchesTerm = !term || `${property.title} ${property.location}`.toLowerCase().includes(term);
      return matchesType && matchesLocation && matchesTerm;
    });
  }, [location, properties, searchTerm, type]);

  const heroProperty = properties[0];
  const secondaryProperty = properties[1] ?? heroProperty;
  const categories = [...new Set(properties.map((property) => property.type))].slice(0, 3).map((label, index) => ({ label, detail: "Opções disponíveis no catálogo", image: properties.find((property) => property.type === label)?.image ?? null, index }));

  function handleSearch(event: FormEvent) {
    event.preventDefault(); setSubmitted(true); document.getElementById("imoveis")?.scrollIntoView({ behavior: "smooth" });
  }

  return <div className="site-shell">
    <div className="topline"><div className="container top-line-inner"><span><Sparkles size={14} /> Atendimento próximo em Senador Canedo e região</span><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">Fale com um corretor <ArrowUpRight size={14} /></a></div></div>
    <header className="site-header"><div className="container nav-inner"><a className="brand" href="#inicio" aria-label="WFC Imóveis — início"><img src={logoSrc} alt="WFC Imóveis" /></a><nav className={menuOpen ? "main-nav is-open" : "main-nav"}><a href="/catalogo" onClick={() => setMenuOpen(false)}>Imóveis</a><a href="/clientes" onClick={() => setMenuOpen(false)}>Nossos clientes</a><a href="#especialidades" onClick={() => setMenuOpen(false)}>Especialidades</a><a href="/equipe" onClick={() => setMenuOpen(false)}>Nossa equipe</a><a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a></nav><a className="nav-cta" href={whatsappLink()} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a><button className="menu-toggle" onClick={() => setMenuOpen((current) => !current)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button></div></header>
    <main id="inicio">
      <section className="hero-section"><div className="hero-glow" /><div className="container hero-grid"><div className="hero-copy"><SectionLabel>Uma imobiliária de perto</SectionLabel><h1>Seu próximo endereço começa <em>aqui.</em></h1><p className="hero-lede">Casas, lotes e chácaras escolhidos para você viver o melhor de Senador Canedo e região — com orientação clara em cada etapa.</p><div className="hero-actions"><a className="button button-primary" href="#imoveis">Explorar imóveis <ArrowUpRight size={17} /></a><a className="text-link" href={whatsappLink()} target="_blank" rel="noreferrer">Quero falar com a WFC <span>↗</span></a></div><div className="trust-row"><span><ShieldCheck size={17} /> CRECI 21496</span><span><Check size={17} /> Atendimento humano</span></div></div><div className="hero-visual" aria-label="Imagens do catálogo WFC"><div className="hero-image-main"><ImageOrEmpty src={heroProperty?.image ?? null} alt={heroProperty?.title ?? "Imóvel do catálogo"} /></div><div className="hero-image-small"><ImageOrEmpty src={secondaryProperty?.image ?? null} alt={secondaryProperty?.title ?? "Imóvel do catálogo"} /></div><div className="hero-stat"><strong>{loading ? "…" : properties.length}</strong><span>imóveis<br />no catálogo</span></div><div className="hero-seal"><span>WFC</span><small>dados<br />atualizados</small></div></div></div>
        <div className="container search-wrap"><form className="search-panel" onSubmit={handleSearch}><div className="search-heading"><Search size={20} /><div><strong>Encontre o seu imóvel</strong><span>Comece por uma busca rápida</span></div></div><label className="field-group"><span>O que você procura?</span><select value={type} onChange={(event) => setType(event.target.value)}><option>Todos</option>{[...new Set(properties.map((property) => property.type))].map((value) => <option key={value}>{value}</option>)}</select><ChevronDown size={16} /></label><label className="field-group"><span>Onde?</span><select value={location} onChange={(event) => setLocation(event.target.value)}><option>Toda a região</option>{[...new Set(properties.map((property) => property.location.split("·")[0].trim()).filter(Boolean))].map((value) => <option key={value}>{value}</option>)}</select><ChevronDown size={16} /></label><label className="field-group search-field"><span>Busque por nome ou bairro</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Ex.: Jardim das Oliveiras" /></label><button className="button button-dark" type="submit"><Search size={17} /> Buscar imóveis</button></form>{submitted && <p className="search-feedback"><Check size={15} /> Mostrando {filteredProperties.length} oportunidade{filteredProperties.length === 1 ? "" : "s"} para a sua busca.</p>}</div>
      </section>
      <section className="section featured-section" id="imoveis"><div className="container"><div className="section-head"><div><SectionLabel>Catálogo atualizado</SectionLabel><h2>Oportunidades que<br /><em>merecem ser vistas.</em></h2></div><a className="text-link" href="/catalogo">Ver catálogo completo <ArrowUpRight size={17} /></a></div>{loading && <div className="empty-state"><p>Carregando imóveis do banco de dados…</p></div>}{error && <div className="empty-state"><Search size={26} /><h3>Catálogo temporariamente indisponível</h3><p>{error} Tente novamente em instantes.</p></div>}{!loading && !error && <div className="property-grid">{filteredProperties.map((property) => <article className="property-card" key={property.id}><a href={whatsappLink(property)} target="_blank" rel="noreferrer" className="property-image-wrap"><ImageOrEmpty src={property.image} alt={property.title} /><span className="property-tag">{property.tag}</span><span className="property-code">Cód. {property.id}</span></a><div className="property-body"><div className="property-type">{property.type}</div><h3>{property.title}</h3><p className="property-location"><MapPin size={15} /> {property.location}</p><div className="property-details"><span><BedDouble size={16} /> {property.bedrooms ? `${property.bedrooms} quartos` : "Amplo"}</span><span>{property.baths ? `${property.baths} banheiros` : "Versátil"}</span><span>{property.area}</span></div><div className="property-footer"><strong>{formatBRLFromCents(property.price)}</strong><a href={whatsappLink(property)} target="_blank" rel="noreferrer" aria-label={`Ver detalhes de ${property.title}`}><ArrowUpRight size={18} /></a></div></div></article>)}</div>}{!loading && !error && filteredProperties.length === 0 && <div className="empty-state"><Search size={26} /><h3>Nenhum imóvel encontrado</h3><p>Não há imóveis do banco correspondentes a essa busca.</p></div>}</div></section>
      <section className="section intention-section"><div className="container intention-grid"><div className="intention-intro"><SectionLabel>Por onde começar?</SectionLabel><h2>Uma decisão grande,<br /><em>um caminho simples.</em></h2><p>Você não precisa entender de financiamento, documentação ou mercado imobiliário. A gente traduz tudo e acompanha de perto.</p><a className="text-link light-link" href={whatsappLink()} target="_blank" rel="noreferrer">Converse com a nossa equipe <ArrowUpRight size={17} /></a></div><div className="intention-list"><a href="#imoveis"><span>01</span><div><strong>Quero comprar</strong><small>Encontre uma casa com a sua cara</small></div><ArrowUpRight size={20} /></a><a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá, quero entender as opções de financiamento para um imóvel.")}`} target="_blank" rel="noreferrer"><span>02</span><div><strong>Quero financiar</strong><small>Entenda as possibilidades sem complicação</small></div><ArrowUpRight size={20} /></a><a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Olá, quero anunciar meu imóvel com a WFC.")}`} target="_blank" rel="noreferrer"><span>03</span><div><strong>Quero vender</strong><small>Conte com conhecimento local para anunciar</small></div><ArrowUpRight size={20} /></a></div></div></section>
      <section className="section category-section" id="especialidades"><div className="container"><div className="section-head"><div><SectionLabel>Do seu jeito</SectionLabel><h2>Espaço para cada<br /><em>novo começo.</em></h2></div><p className="section-note">Categorias formadas pelos imóveis atualmente publicados no banco de dados.</p></div><div className="category-grid">{categories.map((category) => <a href="#imoveis" className={`category-card category-${category.index + 1}`} key={category.label}><ImageOrEmpty src={category.image} alt={category.label} /><div className="category-overlay" /><div className="category-content"><span>0{category.index + 1}</span><h3>{category.label}</h3><p>{category.detail}</p><ArrowUpRight size={20} /></div></a>)}</div></div></section>
      <section className="section about-section" id="sobre"><div className="container about-grid"><div className="about-image"><ImageOrEmpty src={secondaryProperty?.image ?? null} alt={secondaryProperty?.title ?? "Imóvel do catálogo"} /><div className="about-caption"><strong>Conhecer bem<br />é cuidar melhor.</strong><span>WFC Imóveis</span></div></div><div className="about-copy"><SectionLabel>Sobre a WFC</SectionLabel><h2>Conhecimento local.<br /><em>Olhar para o futuro.</em></h2><p>A WFC nasceu para aproximar pessoas de bons lugares. Em Senador Canedo e no entorno, conhecemos os bairros, as oportunidades e o que faz cada família se sentir em casa.</p><p>Nosso trabalho começa ouvindo você — e continua depois da entrega das chaves, com transparência, agilidade e presença.</p><div className="about-signature"><span>W</span><div><strong>WFC Imóveis</strong><small>Seu próximo endereço começa aqui.</small></div></div></div></div></section>
      <section className="contact-section" id="contato"><div className="container contact-grid"><div><SectionLabel>Vamos conversar?</SectionLabel><h2>Seu lugar pode estar<br /><em>mais perto do que parece.</em></h2></div><div className="contact-card"><p>Conte o que você procura. A equipe WFC responde pelo WhatsApp e ajuda você a dar o próximo passo.</p><a className="button button-light" href={whatsappLink()} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Falar com a WFC</a><span>Resposta rápida · Atendimento humanizado</span></div></div></section>
    </main>
    <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><img src={logoSrc} alt="WFC Imóveis" /><p>Seu próximo endereço começa aqui.</p></div><div className="footer-column"><strong>Navegue</strong><a href="#imoveis">Encontrar imóvel</a><a href="#especialidades">Especialidades</a><a href="#sobre">Sobre a WFC</a></div><div className="footer-column"><strong>Fale conosco</strong><a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">WhatsApp</a></div></div></footer>
  </div>;
}
