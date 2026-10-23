import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Check, ChevronRight, Cloud, CreditCard, Database, Globe, Headphones, Lock, Menu, MessageCircle, Rocket, Search, Server, Shield, ShoppingCart, Sparkles, Star, X, Zap } from 'lucide-react';
import './style.css';
// Self-hosted original WDP Hosting PNG copied from the older WDP deployment at build time.
// The fallback SVG is the exact logo icon bundled with the original source archive.
const logo = '/wdphost-logo-original.png'; // Original PNG from legacy WDP Hosting project

const WHMCS = 'https://clients.wdphosting.com';

const plans = [
  { name: 'Starter Domain + Hosting', price: 'R300', period: '/year', tag: 'Most affordable', storage: '5GB SSD', emails: '5 business emails', domains: '1 domain registration included', url: 'https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20I%20want%20to%20order%20a%20website%20or%20hosting%20package', features: ['Free .co.za/.com domain registration support', '12 months hosting included', 'SSL-ready setup', 'Manual activation after payment'] },
  { name: 'Business Domain + Hosting', price: 'R500', period: '/year', tag: 'Best for SMEs', storage: '10GB SSD', emails: '15 business emails', domains: '1 domain registration included', url: 'https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20I%20want%20to%20order%20a%20website%20or%20hosting%20package', featured: true, features: ['Business emails included', 'WordPress-ready hosting', 'Priority migration help', 'Domain + hosting cannot be separated'] },
  { name: 'Premium Domain + Hosting', price: 'R1000', period: '/year', tag: 'Growing brands', storage: '20GB+ SSD', emails: '30 business emails', domains: '1 domain registration included', url: 'https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20I%20want%20to%20order%20a%20website%20or%20hosting%20package', features: ['More storage and email power', 'Advanced website support', 'Faster onboarding', 'Priority ticket support'] },
];

const webBundles = [
  { name: 'Ultimate Launch Package', price: 'R1200', tag: 'Domain + 12 months hosting + website', url: 'https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20I%20want%20to%20order%20a%20website%20or%20hosting%20package', features: ['Domain registration included', '12 months hosting included', 'Starter website included', 'See your website demo first, then pay when you approve'] },
  { name: 'Business Website Bundle', price: 'R1,500', tag: 'Professional website + hosting', url: 'https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20I%20want%20to%20order%20a%20website%20or%20hosting%20package', features: ['Multi-section website', 'Contact/lead form', 'SEO-ready pages', 'Hosting and domain bundled'] },
  { name: 'E-commerce Starter Bundle', price: 'R2,800+', tag: 'Sell online with hosting', url: 'https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20I%20want%20to%20order%20a%20website%20or%20hosting%20package', features: ['Online store structure', 'Product pages', 'Payment placeholders', 'Hosting and domain bundled'] },
];

const heroSlides = [
  { title: 'Domain + Hosting from R300/year', sub: 'Start with a complete bundle. No domain-only checkout — every domain comes with hosting.', icon: Globe },
  { title: 'Website + Domain + Hosting for R1200', sub: 'The ultimate launch package for small businesses that need to go online fast.', icon: Rocket },
  { title: 'Website & hosting support', sub: 'Order buttons are prepared for client billing, invoices, renewals and automation.', icon: CreditCard },
];

const why = [
  ['Unbeatable bundles', 'Domain registration and 12-month hosting combined into one simple offer.'],
  ['Built for small businesses', 'Affordable launch packages for entrepreneurs, shops, consultants and service providers.'],
  ['Client support', 'Client area, cart links, invoices and hosting automation can plug in when WHMCS is ready.'],
  ['WebDevPro support', 'Website, hosting and domain guidance from one team instead of scattered providers.'],
];

const faqs = [
  ['Can I buy only a domain?', 'The main WDP Hosting model is domain registration bundled with hosting, because every business needs both to go live properly.'],
  ['Where will invoices and renewals happen?', 'The website offers WhatsApp support on clients.wdphosting.com for orders, invoices, renewals and support tickets.'],
  ['Is the R1200 package once-off?', 'It is a launch package that includes domain registration, 12 months hosting and a starter website. Renewals are confirmed by our team before you pay.'],
  ['Can clients get their own hosting access?', 'Yes. Once the hosting setup is completed, client accounts can be provisioned and managed professionally.'],
];

function useTyping(words: string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[index % words.length];
    const t = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1));
        if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), 900);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text.length === 0) { setDeleting(false); setIndex((i) => i + 1); }
      }
    }, deleting ? 40 : 85);
    return () => clearTimeout(t);
  }, [text, deleting, index, words]);
  return text;
}

function App() {
  const [menu, setMenu] = useState(false);
  const [slide, setSlide] = useState(0);
  const [domain, setDomain] = useState('');
  const [chat, setChat] = useState(false);
  const [faq, setFaq] = useState(0);
  const typed = useTyping(['Domain + Hosting', 'Website + Hosting', 'Website design and hosting', 'website demo before payment']);
  const current = heroSlides[slide % heroSlides.length];
  const HeroIcon = current.icon;

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 4500);
    return () => clearInterval(timer);
  }, []);


  const [chatStep, setChatStep] = useState<'welcome'|'domain'|'hosting'|'website'|'appointment'|'learn'|'summary'>('welcome');
  const [lead, setLead] = useState({ name: '', phone: '', company: '', domain: '', package: 'R1200 Website + Domain + Hosting', time: '', message: '' });

  const chatbotAnswers: Record<string, string> = {
    domain: 'A domain is your online address, for example yourbusiness.co.za. With WDP Hosting, domain registration is bundled with hosting so the business is ready to go live.',
    hosting: 'Hosting is the online space where your website, emails and files live. The best starter option is domain + 12 months hosting so you do not buy a name without somewhere to host it.',
    website: 'A website is the actual business page customers see. The R1200 launch package includes domain registration, 12 months hosting and a starter website.',
    whmcs: 'Our team can help you with enquiries, invoices, renewals, and hosting setup on WhatsApp.',
  };

  const leadMessage = useMemo(() => {
    return encodeURIComponent(`Hi WDP Hosting, I need help with my online launch.

Name: ${lead.name || 'Not provided'}
Phone: ${lead.phone || 'Not provided'}
Company: ${lead.company || 'Not provided'}
Preferred domain: ${lead.domain || 'Not provided'}
Package interest: ${lead.package || 'Not selected'}
Preferred call time: ${lead.time || 'Any time'}
Message: ${lead.message || 'Please help me choose the best domain + hosting package.'}

Please contact me within 24 hours.`);
  }, [lead]);

  const chatLink = `https://wa.me/27812159792?text=${leadMessage}`;

  return (
    <div className="site">
      <header className="header">
        <a href="#home" className="brand"><img src={logo} alt="Original WDP Hosting logo" onError={e=>{ e.currentTarget.onerror = null; e.currentTarget.src = '/wdphost-logo.svg'; }}/><span>WDP Hosting</span></a>
        <nav className={menu ? 'nav open' : 'nav'}>
          <a href="#packages">Packages</a><a href="#domains">Domains</a><a href="#websites">Websites</a><a href="#whmcs">How it works</a><a href="#support">Support</a>
          <a className="login" href="https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20please%20help%20me%20with%20my%20website%20or%20hosting">Contact Support</a>
        </nav>
        <a className="cta" href="#packages">Enquire on WhatsApp</a>
        <button className="hamb" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
      </header>

      <main id="home">
        <section className="hero">
          <div className="heroBg one"/><div className="heroBg two"/>
          <div className="heroText reveal">
            <div className="pill"><Sparkles size={18}/> Domain + hosting bundles for South Africa & global clients</div>
            <h1>Launch online with <span>{typed}</span><i>|</i></h1>
            <p>WDP Hosting helps businesses register a domain, activate reliable hosting, and launch a professional website. Domain registration is bundled with hosting so clients are ready to go live from day one.</p>
            <div className="heroActions"><a className="btn primary" href="#websites">Get R1200 Website Bundle <ChevronRight/></a><a className="btn ghost" href="#packages">View Hosting Combos</a></div>
            <div className="stats"><div><b>R1200</b><small>website + domain + hosting</small></div><div><b>12</b><small>months hosting included</small></div><div><b>24h</b><small>activation guidance</small></div></div>
          </div>
          <div className="heroCard reveal delay">
            <div className="orb"><HeroIcon size={72}/></div>
            <h2>{current.title}</h2><p>{current.sub}</p>
            <div className="dots">{heroSlides.map((_, i)=><button key={i} onClick={()=>setSlide(i)} className={i===slide?'active':''}/>)}</div>
          </div>
        </section>

        <section id="domains" className="searchSection">
          <div><p className="eyebrow">Domain search</p><h2>Search first. Then choose a hosting bundle.</h2><p>Domain-only purchases are not the focus. Every domain order should be attached to hosting or a website package.</p></div>
          <form action={`${WHMCS}/cart.php`} method="post" target="_blank" className="domainBox" aria-label="Search live domains in WHMCS"><input type="hidden" name="a" value="checkDomain" /><Search/><input name="domain" value={domain} onChange={e=>setDomain(e.target.value)} placeholder="yourbusiness.co.za or yourbrand.com" aria-label="Domain name" autoComplete="off" required maxLength={253} pattern="(?=.{3,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,63}" title="Enter a complete domain such as yourbusiness.co.za"/><button type="submit">Search Live Domains <ChevronRight size={18}/></button></form>
          <p className="domainHelp">Checks availability through the WHMCS domain registration system in a new tab. Final results and prices depend on the connected registrar.</p>
          <a className="domainDirectLink" href={`${WHMCS}/cart.php?a=add&domain=register`} target="_blank" rel="noopener noreferrer">Open WHMCS domain checker directly ↗</a>
        </section>

        <section id="packages" className="section">
          <div className="sectionHead"><p className="eyebrow">Shared hosting combo packages</p><h2>Domain registration + 12-month hosting</h2><p>These packages are designed to make money from hosting while giving clients an easy domain registration path.</p></div>
          <div className="cards three">{plans.map((p)=><article className={p.featured?'plan featured':'plan'} key={p.name}><span className="tag">{p.tag}</span><h3>{p.name}</h3><div className="price">{p.price}<small>{p.period}</small></div><p className="meta">{p.storage} · {p.emails}</p><p className="bundle">{p.domains}</p><ul>{p.features.map(f=><li key={f}><Check size={16}/>{f}</li>)}</ul><a className="btn primary full" href={p.url}>Enquire on WhatsApp</a></article>)}</div>
        </section>

        <section id="websites" className="section webBundle">
          <div className="sectionHead"><p className="eyebrow">Main hero offer</p><h2>Ultimate website + domain + hosting package</h2><p>Push this as the strongest offer: clients pay once, register their domain, get hosting, and receive a starter website.</p></div>
          <div className="cards three">{webBundles.map((p)=><article className="plan glow" key={p.name}><span className="tag red">{p.tag}</span><h3>{p.name}</h3><div className="price">{p.price}</div><ul>{p.features.map(f=><li key={f}><Check size={16}/>{f}</li>)}</ul><a className="btn primary full" href={p.url}>Buy Now</a></article>)}</div>
        </section>

        <section className="section split">
          <div><p className="eyebrow">Why choose us</p><h2>No one beats the value of a complete online launch.</h2><p>Instead of selling a domain alone, WDP Hosting bundles the services clients need to actually appear online: domain, hosting, emails and optional website design.</p><a href="#packages" className="btn primary">Get Started</a></div>
          <div className="whyGrid">{why.map(([t,d])=><div className="why" key={t}><Shield/><h3>{t}</h3><p>{d}</p></div>)}</div>
        </section>

        <section id="whmcs" className="section whmcs">
          <div className="sectionHead"><p className="eyebrow">Customer assistance</p><h2>Simple ordering and personal assistance</h2><p>Domain searches open our WHMCS portal. Hosting purchases and client account automation require active WHMCS services and verified product IDs.</p></div>
          <div className="process"><div><ShoppingCart/><b>1. Client orders</b><p>Client chooses a bundle, not a domain-only purchase.</p></div><div><CreditCard/><b>2. Confirmed invoice</b><p>Our support team confirms payment details and assists with renewals.</p></div><div><Server/><b>3. DirectAdmin account</b><p>Hosting can be provisioned from your reseller account.</p></div><div><Database/><b>4. Support & renewals</b><p>Tickets, invoices and renewals remain organized.</p></div></div>
          <div className="portalButtons"><a className="btn ghost" href="https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20please%20help%20me%20with%20my%20website%20or%20hosting">Contact Support</a><a className="btn ghost" href="https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20please%20help%20me%20with%20my%20website%20or%20hosting">Support Ticket</a><a className="btn ghost" href="https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20please%20help%20me%20with%20my%20website%20or%20hosting">Register Domain with Bundle</a></div>
        </section>

        <section id="support" className="section support">
          <div><p className="eyebrow">FAQ</p><h2>Answers before you order</h2></div>
          <div className="faq">{faqs.map(([q,a],i)=><div key={q} className="faqItem"><button onClick={()=>setFaq(faq===i?-1:i)}><span>{q}</span><ChevronRight className={faq===i?'rot':''}/></button>{faq===i&&<p>{a}</p>}</div>)}</div>
        </section>
      </main>

      <footer><div><img src={logo} alt="WDP Hosting"/><b>WDP Hosting</b><p>Domain registration, hosting and website launch packages.</p></div><div><b>Portal links</b><a href="https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20please%20help%20me%20with%20my%20website%20or%20hosting">Contact Support</a><a href="https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20please%20help%20me%20with%20my%20website%20or%20hosting">Request a Quote</a><a href="https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20please%20help%20me%20with%20my%20website%20or%20hosting">Support</a></div><div><b>Packages</b><a href="#packages">Hosting combos</a><a href="#websites">Website bundle</a><a href="#domains">Domain search</a></div><div><b>Credit</b><p>Web app designed by www.webdevpro.co.za · +27 812 159 792.</p></div></footer>

      <button className="chatBtn" onClick={()=>setChat(!chat)}><MessageCircle/> Contact</button>
      {chat && <div className="chatPanel smartChat">
        <button onClick={()=>setChat(false)} className="close"><X size={18}/></button>
        <div className="botHead"><div className="botAvatar"><MessageCircle size={22}/></div><div><h3>WDP Hosting Assistant</h3><small>Domain · Hosting · Website guidance</small></div></div>
        <div className="chatBubble bot">Hi 👋 Welcome to WDP Hosting. I can help you choose a domain + hosting package, explain how websites work, or book a callback within 24 hours.</div>

        {chatStep === 'welcome' && <div className="quickGrid">
          <button onClick={()=>setChatStep('domain')}>What is a domain?</button>
          <button onClick={()=>setChatStep('hosting')}>What is hosting?</button>
          <button onClick={()=>setChatStep('website')}>Website + domain package</button>
          <button onClick={()=>setChatStep('appointment')}>Book a callback</button>
        </div>}

        {['domain','hosting','website'].includes(chatStep) && <div className="chatFlow">
          <div className="chatBubble bot">{chatbotAnswers[chatStep]}</div>
          <div className="quickGrid">
            <button onClick={()=>setLead({...lead, package:'Starter Domain + Hosting - R300/year'})}>Starter R300/year</button>
            <button onClick={()=>setLead({...lead, package:'Ultimate Website Bundle - R1200'})}>R1200 website bundle</button>
            <button onClick={()=>setChatStep('appointment')}>Let support call me</button>
            <button onClick={()=>setChatStep('welcome')}>Back</button>
          </div>
        </div>}

        {chatStep === 'appointment' && <div className="leadFormMini">
          <label>Your name<input value={lead.name} onChange={e=>setLead({...lead,name:e.target.value})} placeholder="Full name"/></label>
          <label>Phone / WhatsApp<input value={lead.phone} onChange={e=>setLead({...lead,phone:e.target.value})} placeholder="Your phone number"/></label>
          <label>Company name<input value={lead.company} onChange={e=>setLead({...lead,company:e.target.value})} placeholder="Company / project name"/></label>
          <label>Preferred domain<input value={lead.domain} onChange={e=>setLead({...lead,domain:e.target.value})} placeholder="example.co.za"/></label>
          <label>Package<select value={lead.package} onChange={e=>setLead({...lead,package:e.target.value})}>
            <option>R1200 Website + Domain + Hosting</option><option>Starter Domain + Hosting - R300/year</option><option>Business Domain + Hosting - R500/year</option><option>Premium Domain + Hosting - R1000/year</option><option>I need advice first</option>
          </select></label>
          <label>Best call time<input value={lead.time} onChange={e=>setLead({...lead,time:e.target.value})} placeholder="Today / Tomorrow / Morning"/></label>
          <label>Message<textarea value={lead.message} onChange={e=>setLead({...lead,message:e.target.value})} placeholder="Tell us what you need help with"/></label>
          <a className="btn primary full" href={chatLink}>Send to WhatsApp</a>
        </div>}

        <div className="chatFooter"><button onClick={()=>setChatStep('welcome')}>Menu</button><a href="https://wa.me/27812159792?text=Hello%20WDP%20Hosting%2C%20please%20help%20me%20with%20my%20website%20or%20hosting">WhatsApp Support</a></div>
      </div>}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
