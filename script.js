/* ══════════════════════════════════════════
   DiárioHoje — script.js
   ══════════════════════════════════════════ */


/* ── 1. CARREGA NOTÍCIAS DO JSON ── */
async function carregarNoticias() {
  try {
    const res  = await fetch('noticias.json');
    const data = await res.json();
    renderizarFeatured(data.featured);
    renderizarNoticias(data.noticias);
    renderizarDestaque(data.destaque);
  } catch (err) {
    console.error('Erro ao carregar noticias.json:', err);
  }
}

function renderizarDestaque(destaque) {
  const titulo    = document.querySelector('.hero-title');
  const subtitulo = document.querySelector('.hero-subtitle');
  if (titulo)    titulo.textContent    = destaque.titulo;
  if (subtitulo) subtitulo.textContent = destaque.subtitulo;
}

function renderizarFeatured(lista) {
  const grid = document.querySelector('.featured-grid');
  if (!grid) return;
  grid.innerHTML = lista.map(n => `
    <article class="featured-card" data-categoria="${n.categoria}">
      <div class="featured-card-img">
        <div class="img-placeholder ${n.categoria}">${n.categoriaLabel.toUpperCase()}</div>
      </div>
      <div class="featured-content">
        <span class="news-category ${n.categoria}">${n.categoriaLabel}</span>
        <h3>${n.titulo}</h3>
        <p>${n.descricao}</p>
        <span class="news-time">${n.tempo}</span>
      </div>
    </article>
  `).join('');
  aplicarEventosCards();
}

function renderizarNoticias(lista) {
  const grid = document.querySelector('.news-grid');
  if (!grid) return;
  grid.innerHTML = lista.map(n => `
    <article class="news-item" data-categoria="${n.categoria}">
      <div class="news-item-img">
        <div class="img-placeholder ${n.categoria}">${n.categoriaLabel.toUpperCase()}</div>
      </div>
      <div class="news-info">
        <span class="news-category ${n.categoria}">${n.categoriaLabel}</span>
        <h4>${n.titulo}</h4>
        <p>${n.descricao}</p>
        <span class="news-time">${n.tempo}</span>
      </div>
    </article>
  `).join('');
  aplicarEventosCards();
  aplicarObserver();
}


/* ── 2. NAVEGAÇÃO ATIVA ── */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    filtrarPorCategoria(link.textContent.trim().toLowerCase());
  });
});


/* ── 3. FILTRO DE NOTÍCIAS ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtrarGrid(btn.textContent.trim().toLowerCase());
  });
});

function filtrarGrid(filtro) {
  document.querySelectorAll('.news-item').forEach(item => {
    const cat = item.querySelector('.news-category')?.textContent.trim().toLowerCase() || '';
    const ok =
      filtro === 'todas' ||
      (filtro === 'brasil' && ['política', 'economia', 'esportes'].includes(cat)) ||
      (filtro === 'mundo'  && ['mundo', 'ciência'].includes(cat));
    item.style.display   = ok ? '' : 'none';
    item.style.animation = ok ? 'fade-in-up 0.35s ease both' : '';
  });
}

function filtrarPorCategoria(categoria) {
  const map = { política:'política', economia:'economia', tecnologia:'tecnologia', mundo:'mundo', ciência:'ciência', esportes:'esportes' };
  const cat = map[categoria];
  document.querySelectorAll('.news-item, .featured-card').forEach(item => {
    const itemCat = item.querySelector('.news-category')?.textContent.trim().toLowerCase() || '';
    const ok = !cat || itemCat === cat;
    item.style.display   = ok ? '' : 'none';
    item.style.animation = ok ? 'fade-in-up 0.35s ease both' : '';
  });
  if (categoria === 'inicial') document.querySelectorAll('.news-item, .featured-card').forEach(i => i.style.display = '');
}


/* ── 4. BUSCA ── */
const searchInput = document.querySelector('.search-input');
const searchBtn   = document.querySelector('.search-btn');

function executarBusca() {
  const termo = searchInput?.value.trim().toLowerCase();
  if (!termo) return resetarBusca();
  let encontrou = false;
  document.querySelectorAll('.news-item, .featured-card').forEach(item => {
    const titulo = item.querySelector('h3, h4')?.textContent.toLowerCase() || '';
    const descr  = item.querySelector('p')?.textContent.toLowerCase()      || '';
    const ok = titulo.includes(termo) || descr.includes(termo);
    item.style.display   = ok ? '' : 'none';
    item.style.animation = ok ? 'fade-in-up 0.3s ease both' : '';
    if (ok) encontrou = true;
  });
  mostrarMensagemBusca(termo, encontrou);
}

function resetarBusca() {
  document.querySelectorAll('.news-item, .featured-card').forEach(i => i.style.display = '');
  removerMensagemBusca();
}

function mostrarMensagemBusca(termo, encontrou) {
  removerMensagemBusca();
  const msg = document.createElement('p');
  msg.id = 'search-msg';
  msg.style.cssText = 'padding:16px 0;color:var(--ink-muted);font-size:14px;';
  msg.textContent = encontrou ? `Resultados para "${termo}"` : `Nenhum resultado para "${termo}"`;
  document.querySelector('.news-grid-section')?.prepend(msg);
}

function removerMensagemBusca() { document.getElementById('search-msg')?.remove(); }

searchBtn?.addEventListener('click', executarBusca);
searchInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter')  executarBusca();
  if (e.key === 'Escape') { searchInput.value = ''; resetarBusca(); }
});


/* ── 5. NEWSLETTER ── */
document.querySelector('.newsletter-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  const email = input?.value.trim();
  if (!email || !email.includes('@')) { mostrarFeedback(e.target, 'Por favor, insira um email válido.', 'erro'); return; }
  mostrarFeedback(e.target, `✓ Obrigado! Você receberá nossas notícias em ${email}`, 'sucesso');
  input.value = '';
});

function mostrarFeedback(form, mensagem, tipo) {
  document.getElementById('newsletter-feedback')?.remove();
  const msg = document.createElement('p');
  msg.id = 'newsletter-feedback';
  msg.textContent = mensagem;
  msg.style.cssText = `margin-top:12px;font-size:13px;text-align:center;animation:fade-in 0.3s ease both;color:${tipo === 'sucesso' ? 'var(--gold-light)' : '#e07070'};`;
  form.after(msg);
  if (tipo === 'sucesso') setTimeout(() => msg.remove(), 5000);
}


/* ── 6. HEADER SHRINK NO SCROLL ── */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (header) header.style.boxShadow = window.scrollY > 60 ? '0 2px 16px rgba(0,0,0,0.10)' : 'none';
}, { passive: true });


/* ── 7. BOTÃO "LER MAIS" NO HERO ── */
document.querySelector('.hero-btn')?.addEventListener('click', () => {
  document.querySelector('.featured-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


/* ── 8. MODAL DE NOTÍCIA ── */
function aplicarEventosCards() {
  document.querySelectorAll('.news-item, .featured-card').forEach(card => {
    card.addEventListener('click', () => {
      abrirModal(
        card.querySelector('h3, h4')?.textContent || '',
        card.querySelector('p')?.textContent      || '',
        card.querySelector('.news-category')?.textContent || '',
        card.querySelector('.news-time')?.textContent    || ''
      );
    });
  });
}

function abrirModal(titulo, descr, cat, tempo) {
  fecharModal();
  const overlay = document.createElement('div');
  overlay.id = 'dh-modal';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;padding:24px;animation:fade-in 0.2s ease both;';
  overlay.innerHTML = `
    <div style="background:var(--cream);border-radius:8px;max-width:560px;width:100%;padding:36px 40px;position:relative;animation:fade-in-up 0.3s ease both;">
      <button id="dh-modal-close" style="position:absolute;top:16px;right:16px;background:none;border:none;cursor:pointer;font-size:20px;color:var(--ink-muted);">✕</button>
      <span style="font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;background:rgba(0,0,0,.07);padding:3px 9px;border-radius:2px;">${cat}</span>
      <h2 style="font-family:var(--font-display);font-size:26px;font-weight:700;line-height:1.2;margin:14px 0 12px;color:var(--ink);">${titulo}</h2>
      <p style="font-size:15px;color:var(--ink-muted);line-height:1.7;">${descr}</p>
      <p style="font-family:var(--font-mono);font-size:11px;color:var(--ink-muted);margin-top:20px;">${tempo}</p>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  overlay.addEventListener('click', e => { if (e.target === overlay) fecharModal(); });
  document.getElementById('dh-modal-close')?.addEventListener('click', fecharModal);
  document.addEventListener('keydown', fecharComEsc);
}

function fecharModal() {
  document.getElementById('dh-modal')?.remove();
  document.body.style.overflow = '';
  document.removeEventListener('keydown', fecharComEsc);
}

function fecharComEsc(e) { if (e.key === 'Escape') fecharModal(); }


/* ── 9. ANIMAÇÃO DE ENTRADA ── */
function aplicarObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fade-in-up 0.5s ease both';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.news-item, .featured-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}


/* ── 10. RELÓGIO NO TICKER ── */
(function injetarRelogio() {
  const ticker = document.querySelector('.ticker-container');
  if (!ticker) return;
  const clock = document.createElement('div');
  clock.id = 'dh-clock';
  clock.style.cssText = 'flex-shrink:0;font-family:var(--font-mono);font-size:11px;color:rgba(255,255,255,.55);padding:0 16px;border-left:1px solid rgba(255,255,255,.12);margin-left:auto;';
  ticker.appendChild(clock);
  const atualizar = () => clock.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  atualizar();
  setInterval(atualizar, 1000);
})();


/* ── 11. BOTÃO VOLTAR AO TOPO ── */
(function criarBotaoTopo() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.textContent = '↑';
  btn.style.cssText = 'position:fixed;bottom:32px;right:32px;width:44px;height:44px;border-radius:50%;background:var(--ink);color:#fff;border:none;font-size:18px;cursor:pointer;opacity:0;pointer-events:none;transition:opacity 0.3s ease,transform 0.2s ease;z-index:800;';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    const v = window.scrollY > 400;
    btn.style.opacity      = v ? '1' : '0';
    btn.style.pointerEvents = v ? 'auto' : 'none';
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-3px)');
  btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
})();


/* ── INICIALIZA ── */
carregarNoticias();