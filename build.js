const fs = require('fs'), P = require('path');
const S = JSON.parse(fs.readFileSync('site.json', 'utf8'));
fs.rmSync('dist', { recursive: true, force: true });
const T = S.phone.replace(/\s/g, '').replace(/^0/, '+33');
const U = S.demo ? '' : S.domain.replace(/\/$/, '');
const R = String(S.rating).replace('.', ',');
const sl = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const urls = [];
const logo = '<svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2C8 8 5 15 8 22c2 4 6 7 8 8 2-1 6-4 8-8 3-7 0-14-8-20z" fill="#1f6b43"/><path d="M16 10v18M16 17l-4-3M16 21l4-3" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

const biz = {
  '@context': 'https://schema.org', '@type': 'LocalBusiness', name: S.name, telephone: S.phone, email: S.email,
  url: U || undefined, foundingDate: String(S.since), priceRange: '€€',
  address: { '@type': 'PostalAddress', streetAddress: S.street, postalCode: S.zip, addressLocality: S.city, addressCountry: 'FR' },
  openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: S.rating, reviewCount: S.reviews },
  areaServed: [S.city, ...S.cities.map(c => c.name), ...S.extended].map(n => ({ '@type': 'City', name: n })),
  sameAs: S.sameAs
};

const cityL = () => `<ul class="c">${S.cities.map(c => `<li><a href="/elagueur-${sl(c.name)}/">Élagueur à ${e(c.name)}</a></li>`).join('')}</ul>`;
const faqL = f => f.map(x => `<details><summary>${e(x.q)}</summary><p>${e(x.a)}</p></details>`).join('');
const zone = () => `<section class="s" id="zone"><div class="w"><h2>Zone d'intervention autour de ${e(S.city)}</h2>${cityL()}<p>Selon le projet, nous nous déplaçons aussi à ${S.extended.map(e).join(', ')}.</p></div></section>`;
const form = `<section class="s" id="devis"><div class="w"><form class="f" method="post" action="${e(S.formAction)}"><h2>Devis gratuit sous 48 h</h2><label>Nom<input name="nom" required autocomplete="name"></label><label>Téléphone<input name="tel" type="tel" required autocomplete="tel"></label><label>Commune<input name="commune"></label><label>Votre demande<textarea name="message" rows="4" placeholder="Type d'arbre, hauteur, accès, urgence"></textarea></label><input type="text" name="_gotcha" hidden><button>Envoyer ma demande</button></form></div></section>`;

const tree = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4 12 34h10L8 52h20v8h8v-8h20L42 34h10z" fill="currentColor"/></svg>';
const cards = () => `<ul class="g">${S.services.map(s => `<li><a href="/${s.slug}/"><span class="im">${s.img ? `<img src="${e(s.img)}" alt="${e(s.name)} à ${e(S.city)}" loading="lazy">` : tree}</span><b>${e(s.name)}</b><span class="tt">${e(s.text.split(/(?<=\\.) /)[0])}</span></a></li>`).join('')}</ul>`;
const eng = `<section class="eng"><div class="w">${S.engagements.map(x => `<div><b>${e(x[0])}</b><p>${e(x[1])}</p></div>`).join('')}</div></section>`;
const mq = () => { const t = [S.city, ...S.cities.map(c => c.name), ...S.extended].map(n => `<span>${e(n)}</span>`).join(''); return `<div class="mq" aria-hidden="true"><div>${t}${t}</div></div>`; };
const stats = [[R, 'sur 5 en note Google'], [S.since, 'année de création'], [S.cities.length + 1, 'communes autour de Pau'], ['48 h', 'pour recevoir le devis']];
function page(url, title, desc, h1, lead, body, faq) {
  const ld = [biz];
  if (faq) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(title)}</title><meta name="description" content="${e(desc)}">${S.demo ? '<meta name="robots" content="noindex,nofollow">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}${U ? `<link rel="canonical" href="${U}${url}">` : ''}<meta property="og:type" content="website"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(desc)}"><meta property="og:locale" content="fr_FR"><meta name="theme-color" content="#0f3d26"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="/s.css"><script type="application/ld+json">${JSON.stringify(ld)}</script></head><body><header class="top"><div class="w tw"><a class="lg" href="/">${logo}<span>${e(S.name)}</span></a><button class="mb" aria-label="Menu" aria-expanded="false" aria-controls="nv"><i></i><i></i><i></i></button><nav id="nv"><a href="/#services">Services</a><a href="/#zone">Zone d'intervention</a><a href="/#devis">Contact</a><a class="cta" href="tel:${T}">${e(S.phone)}</a></nav></div></header><main><section class="hero"${S.heroImage ? ` style="--img:url(${S.heroImage})"` : ''}><div class="w"><p class="eb">${e(S.city)}, depuis ${S.since}</p><h1>${e(h1)}</h1><p class="lead">${e(lead)}</p><a class="tel" href="tel:${T}">${e(S.phone)}</a><p class="sub">Urgence ${e(S.hours)}. Devis gratuit sous 48 h.</p></div></section>${body}${form}</main><footer><div class="w"><p><b>${e(S.name)}</b>, ${e(S.street)}, ${e(S.zip)} ${e(S.city)}. Tél. <a href="tel:${T}">${e(S.phone)}</a>, <a href="mailto:${e(S.email)}">${e(S.email)}</a>. Depuis ${S.since}.</p><p><a href="/mentions-legales/">Mentions légales</a></p></div></footer><script>const b=document.querySelector(".mb"),n=document.getElementById("nv"),c=o=>{n.classList.toggle("open",o);b.setAttribute("aria-expanded",o)};b.onclick=()=>c(!n.classList.contains("open"));n.onclick=v=>{if(v.target.tagName==="A")c(false)}</script><div class="bar"><a href="tel:${T}">Appeler</a><a class="b2" href="#devis">Devis gratuit</a></div></body></html>`;
  const d = P.join('dist', url); fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(P.join(d, 'index.html'), html); urls.push(url);
}

const H = S.home;
const photos = S.photos.length ? `<section class="s"><div class="w"><h2>Nos chantiers</h2><div class="ph">${S.photos.map(p => `<img src="${e(p.src)}" alt="${e(p.alt)}" loading="lazy">`).join('')}</div></div></section>` : '';
page('/', H.title, H.desc, H.h1, H.lead,
  `${eng}${mq()}
<section class="s"><div class="w ab"><div><h2>${e(S.about.title)}</h2>${S.about.text.map(t => `<p class="tx">${e(t)}</p>`).join('')}<a class="btn" href="#devis">Demander un devis</a></div><div class="st">${stats.map(x => `<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div></div></section>
<section class="s" id="services"><div class="w"><h2>Ce qu'on fait, du sol à la cime</h2>${cards()}</div></section>
<section class="s"><div class="w aud">${S.audiences.map(a => `<div><h3>${e(a[0])}</h3><p>${e(a[1])}</p></div>`).join('')}</div></section>
<section class="s rv"><div class="w"><b>${R}/5</b><p>${S.reviews} avis clients sur Google</p><a class="btn" href="${e(S.sameAs[0])}">Lire les avis</a></div></section>
<section class="s"><div class="w"><h2>Ce qui nous distingue</h2><div class="why">${S.why.map(w => `<div><h3>${e(w[0])}</h3><p>${e(w[1])}</p></div>`).join('')}</div></div></section>${photos}${zone()}
<section class="s"><div class="w"><h2>Questions fréquentes</h2>${faqL(S.faq)}</div></section>`, S.faq);

for (const s of S.services) {
  page(`/${s.slug}/`, `${s.name} à ${S.city} | ${S.name}`, `${s.name} à ${S.city} et alentours : ${s.text.split(/(?<=\.) /)[0]} Devis gratuit sous 48 h.`.slice(0, 160),
    `${s.name} à ${S.city}`, `Devis gratuit sous 48 h, urgence ${S.hours}.`,
    `<section class="s"><div class="w"><p class="tx">${e(s.text)}</p><p class="tx">Basés au ${e(S.street)} à ${e(S.city)}, nous intervenons à ${e(S.city)} et dans les communes voisines : ${S.cities.map(c => e(c.name)).join(', ')}.</p><h2>Nos autres services</h2>${cards()}</div></section>${zone()}`);
}
for (const c of S.cities) {
  page(`/elagueur-${sl(c.name)}/`, `Élagueur à ${c.name} | ${S.name}`, `Élagueur à ${c.name} : élagage, abattage, haies, entretien de jardin. Urgence ${S.hours}, devis gratuit sous 48 h.`,
    `Élagueur à ${c.name}`, `Élagage, abattage et entretien de jardin à ${c.name}, depuis ${S.city}.`,
    `<section class="s"><div class="w"><p class="tx">${e(c.blurb)}</p><h2>Nos services</h2>${cards()}</div></section>`);
}
page('/mentions-legales/', `Mentions légales | ${S.name}`, `Mentions légales de ${S.name}.`, 'Mentions légales', S.name,
  `<section class="s"><div class="w"><p class="tx">${e(S.name)}, ${e(S.street)}, ${e(S.zip)} ${e(S.city)}. SIRET ${e(S.siret)}. Contact : ${e(S.email)}, ${e(S.phone)}. Hébergeur : Cloudflare, Inc. Site réalisé par Digiluce.</p></div></section>`);

fs.copyFileSync('style.css', 'dist/s.css');
if (fs.existsSync('public')) fs.cpSync('public', 'dist', { recursive: true });
fs.writeFileSync('dist/robots.txt', S.demo ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${U}/sitemap.xml\n`);
fs.writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.filter(u => u !== '/mentions-legales/').map(u => `<url><loc>${S.domain.replace(/\/$/, '')}${u}</loc></url>`).join('')}</urlset>`);
console.log(`${urls.length} pages générées dans dist/`);
