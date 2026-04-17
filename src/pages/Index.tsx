import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const NAV_LINKS = ["Главная", "Тарифы", "Контакты"];

const PLANS = [
  {
    name: "BASIC",
    price: "290",
    period: "мес",
    desc: "Базовая защита для личного использования",
    features: ["1 устройство", "10 серверов", "AES-128 шифрование", "Скорость 100 Мбит/с", "Техподдержка 24/7"],
    highlight: false,
    badge: null,
  },
  {
    name: "NEXUS",
    price: "590",
    period: "мес",
    desc: "Максимальная защита для профессионалов",
    features: ["5 устройств", "50+ серверов", "AES-256 шифрование", "Скорость без ограничений", "Приоритетная поддержка", "Kill Switch"],
    highlight: true,
    badge: "ПОПУЛЯРНЫЙ",
  },
  {
    name: "QUANTUM",
    price: "990",
    period: "мес",
    desc: "Корпоративный уровень защиты данных",
    features: ["Неограниченно устройств", "100+ серверов", "Quantum-resistant шифрование", "Выделенный IP", "SLA 99.99%", "Kill Switch", "Dedicated менеджер"],
    highlight: false,
    badge: "ENTERPRISE",
  },
];

const FEATURES = [
  { icon: "Shield", title: "AES-256 шифрование", desc: "Военный стандарт защиты. Невозможно взломать за время жизни Вселенной." },
  { icon: "Zap", title: "Нулевые логи", desc: "Мы не храним данные о вашей активности. Ваша приватность — абсолют." },
  { icon: "Globe", title: "100+ серверов", desc: "Серверы в 45 странах. Обходите блокировки и получайте контент со всего мира." },
  { icon: "Lock", title: "Kill Switch", desc: "Автоматическое отключение интернета при разрыве VPN. Нет утечек." },
];

function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ";
    const fontSize = 13;
    const cols = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1);

    let animId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = "rgba(5, 10, 18, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 255, 180, 0.35)";
      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />;
}

function TerminalText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className="font-mono-tech text-[hsl(var(--cyan))]">
      {displayed}
      {!done && <span className="animate-blink">_</span>}
    </span>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("Главная");
  const [mobileOpen, setMobileOpen] = useState(false);

  const sectionIds: Record<string, string> = {
    "Главная": "hero",
    "Тарифы": "pricing",
    "Контакты": "contacts",
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const label = Object.entries(sectionIds).find(([, id]) => id === e.target.id)?.[0];
            if (label) setActiveSection(label);
          }
        });
      },
      { threshold: 0.4 }
    );
    Object.values(sectionIds).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(var(--border))] bg-[rgba(5,10,18,0.85)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative flex items-center justify-center border-2 border-[hsl(var(--cyan))] rotate-45">
              <Icon name="Shield" size={14} className="text-[hsl(var(--cyan))] -rotate-45" />
            </div>
            <span className="font-['Orbitron'] font-bold text-lg tracking-widest text-[hsl(var(--cyan))] text-glow">
              AVIATO VPN
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(sectionIds[link])}
                className={`px-4 py-2 font-mono-tech text-sm tracking-widest transition-all duration-200 relative
                  ${activeSection === link
                    ? "text-[hsl(var(--cyan))] text-glow"
                    : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--cyan))]"
                  }`}
              >
                {activeSection === link && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[hsl(var(--cyan))]" />
                )}
                {link}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2 font-mono-tech text-sm text-[hsl(var(--cyan))] border border-[hsl(var(--border))] hover:border-[hsl(var(--cyan))] transition-all duration-200 clip-corner-sm">
              ВОЙТИ
            </button>
            <button
              onClick={() => scrollTo("pricing")}
              className="px-5 py-2 font-mono-tech text-sm bg-[hsl(var(--cyan))] text-[hsl(220,20%,4%)] font-semibold hover:opacity-90 transition-all duration-200 clip-corner-sm"
            >
              ПОПРОБОВАТЬ
            </button>
          </div>

          <button className="md:hidden text-[hsl(var(--cyan))]" onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[hsl(var(--border))] bg-[rgba(5,10,18,0.95)] px-6 py-4 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(sectionIds[link])}
                className="text-left px-3 py-2 font-mono-tech text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--cyan))] transition-colors"
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <MatrixCanvas />
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(0,255,200,0.02)] to-[hsl(var(--background))]" />

        <div className="absolute right-1/4 top-1/3 hidden lg:block">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 rounded-full border border-[hsl(var(--cyan))] opacity-20" style={{animation: "pulse-ring 3s ease-out infinite"}} />
            <div className="absolute inset-0 rounded-full border border-[hsl(var(--cyan))] opacity-15" style={{animation: "pulse-ring 3s ease-out 0.5s infinite"}} />
            <div className="absolute inset-8 rounded-full border border-[hsl(var(--cyan))] opacity-30 animate-float">
              <img
                src="https://cdn.poehali.dev/projects/23981ce0-bedd-4b31-85b5-8c802fc8b41a/files/b3f1b1d9-d66c-4636-a73b-edb69d1ad01c.jpg"
                alt="VPN Shield"
                className="w-full h-full object-cover rounded-full opacity-60"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1.5 border border-[hsl(var(--cyan))] clip-corner-sm bg-[rgba(0,255,200,0.05)] animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
            <span className="font-mono-tech text-xs text-[hsl(var(--cyan))] tracking-widest">СИСТЕМА АКТИВНА · ШИФРОВАНИЕ ВКЛЮЧЕНО</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 leading-none animate-fade-up delay-100 opacity-0">
            <span className="text-[hsl(var(--foreground))]">AVIATO</span>
            <span className="text-glow text-[hsl(var(--cyan))]">VPN</span>
          </h1>

          <div className="text-xl md:text-2xl mb-6 font-light animate-fade-up delay-200 opacity-0">
            <TerminalText text="Защита данных военного класса для всех" />
          </div>

          <p className="max-w-xl text-[hsl(var(--muted-foreground))] text-base md:text-lg mb-10 leading-relaxed animate-fade-up delay-300 opacity-0">
            Шифруйте трафик с AES-256, скрывайте IP-адрес и обходите любые блокировки.
            Более 2 миллионов пользователей уже защищены NexusVPN.
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-up delay-400 opacity-0">
            <button
              onClick={() => scrollTo("pricing")}
              className="relative px-8 py-4 bg-[hsl(var(--cyan))] text-[hsl(220,20%,4%)] font-['Orbitron'] font-bold text-sm tracking-widest clip-corner hover:scale-105 transition-transform duration-200"
            >
              НАЧАТЬ БЕСПЛАТНО
            </button>
            <button className="px-8 py-4 border border-[hsl(var(--border))] hover:border-[hsl(var(--cyan))] font-['Orbitron'] text-sm tracking-widest clip-corner transition-all duration-200 text-[hsl(var(--foreground))]">
              УЗНАТЬ БОЛЬШЕ →
            </button>
          </div>

          <div className="flex flex-wrap gap-8 mt-16 animate-fade-up delay-500 opacity-0">
            {[
              { val: "2M+", label: "пользователей" },
              { val: "45", label: "стран" },
              { val: "99.9%", label: "uptime" },
              { val: "0", label: "логов" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="font-['Orbitron'] text-3xl font-black text-[hsl(var(--cyan))] text-glow">{s.val}</span>
                <span className="font-mono-tech text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-[hsl(var(--cyan))] opacity-20" />
        <div className="absolute top-20 right-0 w-20 h-20 border-t-2 border-r-2 border-[hsl(var(--cyan))] opacity-20" />
      </section>

      {/* FEATURES */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-mono-tech text-xs text-[hsl(var(--cyan))] tracking-[0.3em] mb-4 uppercase">// технологии защиты</div>
            <h2 className="text-4xl md:text-5xl font-black text-[hsl(var(--foreground))]">
              КАК МЫ ВАС <span className="text-[hsl(var(--cyan))] text-glow">ЗАЩИЩАЕМ</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="relative p-6 border border-[hsl(var(--border))] clip-corner border-glow-hover transition-all duration-300 bg-[hsl(var(--card))] group cursor-default"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsl(var(--cyan))] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-12 h-12 mb-4 flex items-center justify-center border border-[hsl(var(--border))] group-hover:border-[hsl(var(--cyan))] transition-colors duration-300 clip-corner-sm">
                  <Icon name={f.icon as "Shield" | "Zap" | "Globe" | "Lock"} size={22} className="text-[hsl(var(--cyan))]" />
                </div>
                <h3 className="font-['Orbitron'] text-sm font-bold mb-2 text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--cyan))] transition-colors duration-300">{f.title}</h3>
                <p className="text-[hsl(var(--muted-foreground))] text-sm leading-relaxed">{f.desc}</p>
                <div className="absolute bottom-2 right-2 font-mono-tech text-xs text-[hsl(var(--border))]">0{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))] via-[rgba(0,255,200,0.02)] to-[hsl(var(--background))]" />
        <div className="absolute inset-0 grid-bg opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-mono-tech text-xs text-[hsl(var(--cyan))] tracking-[0.3em] mb-4 uppercase">// выбери уровень защиты</div>
            <h2 className="text-4xl md:text-5xl font-black text-[hsl(var(--foreground))]">
              ТАРИФНЫЕ <span className="text-[hsl(var(--cyan))] text-glow">ПЛАНЫ</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative p-8 border clip-corner transition-all duration-300 group
                  ${plan.highlight
                    ? "border-[hsl(var(--cyan))] bg-[rgba(0,255,200,0.05)] border-glow"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--card))] border-glow-hover"
                  }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-6 px-3 py-1 font-mono-tech text-xs tracking-widest
                    ${plan.highlight ? "bg-[hsl(var(--cyan))] text-[hsl(220,20%,4%)]" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"}`}>
                    {plan.badge}
                  </div>
                )}

                <div className="font-['Orbitron'] text-xs tracking-[0.3em] text-[hsl(var(--muted-foreground))] mb-3 uppercase">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`font-['Orbitron'] text-5xl font-black ${plan.highlight ? "text-[hsl(var(--cyan))] text-glow" : "text-[hsl(var(--foreground))]"}`}>
                    {plan.price}₽
                  </span>
                  <span className="font-mono-tech text-sm text-[hsl(var(--muted-foreground))]">/{plan.period}</span>
                </div>
                <p className="text-[hsl(var(--muted-foreground))] text-sm mb-6 leading-relaxed">{plan.desc}</p>

                <div className="h-px bg-[hsl(var(--border))] mb-6" />

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Icon name="Check" size={14} className={plan.highlight ? "text-[hsl(var(--cyan))]" : "text-[hsl(var(--accent))]"} />
                      <span className="text-[hsl(var(--foreground))]">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 font-['Orbitron'] text-sm font-bold tracking-widest clip-corner-sm transition-all duration-200
                    ${plan.highlight
                      ? "bg-[hsl(var(--cyan))] text-[hsl(220,20%,4%)] hover:opacity-90"
                      : "border border-[hsl(var(--border))] hover:border-[hsl(var(--cyan))] text-[hsl(var(--foreground))] hover:text-[hsl(var(--cyan))]"
                    }`}
                >
                  ВЫБРАТЬ ПЛАН
                </button>

                <div className="absolute bottom-3 right-3 font-mono-tech text-xs text-[hsl(var(--border))]">v{i + 1}.0</div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-4 border border-[hsl(var(--border))] bg-[hsl(var(--card))] max-w-xl mx-auto clip-corner">
            <div className="font-mono-tech text-xs text-[hsl(var(--muted-foreground))] space-y-1">
              <div><span className="text-[hsl(var(--cyan))]">$</span> nexus-vpn connect --server=RU-MSK-01</div>
              <div className="text-[hsl(var(--accent))]">✓ Подключено. Ваш IP скрыт.</div>
              <div><span className="text-[hsl(var(--cyan))]">$</span> nexus-vpn status --verbose</div>
              <div>Шифрование: <span className="text-[hsl(var(--cyan))]">AES-256-GCM</span> | Утечек: <span className="text-[hsl(var(--accent))]">0</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-30" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsl(var(--cyan))] to-transparent opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="font-mono-tech text-xs text-[hsl(var(--cyan))] tracking-[0.3em] mb-4 uppercase">// связаться с нами</div>
            <h2 className="text-4xl md:text-5xl font-black text-[hsl(var(--foreground))]">
              КОНТАКТЫ & <span className="text-[hsl(var(--cyan))] text-glow">ПОДДЕРЖКА</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 border border-[hsl(var(--border))] bg-[hsl(var(--card))] clip-corner relative">
              <div className="font-['Orbitron'] text-xs tracking-widest text-[hsl(var(--muted-foreground))] mb-6 uppercase">// новое обращение</div>

              <div className="space-y-4">
                <div>
                  <label className="font-mono-tech text-xs text-[hsl(var(--cyan))] tracking-widest uppercase block mb-1.5">Имя</label>
                  <input
                    type="text"
                    placeholder="введите имя..."
                    className="w-full px-4 py-3 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-mono-tech text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--cyan))] transition-colors clip-corner-sm"
                  />
                </div>
                <div>
                  <label className="font-mono-tech text-xs text-[hsl(var(--cyan))] tracking-widest uppercase block mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-mono-tech text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--cyan))] transition-colors clip-corner-sm"
                  />
                </div>
                <div>
                  <label className="font-mono-tech text-xs text-[hsl(var(--cyan))] tracking-widest uppercase block mb-1.5">Сообщение</label>
                  <textarea
                    rows={4}
                    placeholder="опишите вашу задачу..."
                    className="w-full px-4 py-3 bg-[hsl(var(--input))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-mono-tech text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:border-[hsl(var(--cyan))] transition-colors resize-none clip-corner-sm"
                  />
                </div>
                <button className="w-full py-4 bg-[hsl(var(--cyan))] text-[hsl(220,20%,4%)] font-['Orbitron'] font-bold text-sm tracking-widest clip-corner hover:opacity-90 transition-opacity">
                  ОТПРАВИТЬ ЗАПРОС
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: "Mail", label: "Email", value: "support@aviato-vpn.ru", sub: "Ответим в течение 1 часа" },
                { icon: "MessageCircle", label: "Telegram", value: "@aviatovpn_support", sub: "Круглосуточная поддержка" },
                { icon: "Phone", label: "Телефон", value: "+7 900 361-08-00", sub: "Бесплатно по России" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-4 p-5 border border-[hsl(var(--border))] bg-[hsl(var(--card))] clip-corner border-glow-hover transition-all duration-300 group">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-[hsl(var(--border))] group-hover:border-[hsl(var(--cyan))] transition-colors clip-corner-sm">
                    <Icon name={c.icon as "Mail" | "MessageCircle" | "Phone"} size={18} className="text-[hsl(var(--cyan))]" />
                  </div>
                  <div>
                    <div className="font-mono-tech text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-0.5">{c.label}</div>
                    <div className="font-['Orbitron'] text-sm font-semibold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--cyan))] transition-colors">{c.value}</div>
                    <div className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{c.sub}</div>
                  </div>
                </div>
              ))}

              <div className="p-5 border border-[hsl(var(--accent))] bg-[rgba(0,255,128,0.05)] clip-corner">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
                  <span className="font-mono-tech text-xs text-[hsl(var(--accent))] uppercase tracking-widest">Все системы работают</span>
                </div>
                <div className="font-mono-tech text-xs text-[hsl(var(--muted-foreground))] space-y-1">
                  <div>Uptime за 30 дней: <span className="text-[hsl(var(--accent))]">99.97%</span></div>
                  <div>Активных серверов: <span className="text-[hsl(var(--accent))]">104/104</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[hsl(var(--border))] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-['Orbitron'] text-sm font-bold text-[hsl(var(--cyan))] text-glow tracking-widest">AVIATO VPN</div>
          <div className="font-mono-tech text-xs text-[hsl(var(--muted-foreground))] text-center">
            © 2024 AviatoVPN · Ваши данные защищены · Политика конфиденциальности
          </div>
          <div className="flex items-center gap-2 font-mono-tech text-xs text-[hsl(var(--muted-foreground))]">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
            AES-256 ACTIVE
          </div>
        </div>
      </footer>
    </div>
  );
}