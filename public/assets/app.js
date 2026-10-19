(() => {
  // English lives in the HTML; this table only holds Spanish.
  const es = {
    'nav.features': 'Funciones',
    'nav.security': 'Seguridad',
    'nav.status': 'Estado',
    'hero.badge': 'En desarrollo · Gratis y open source',
    'hero.title': 'Tu VPS, bajo control.<br /><span class="grad">Sin complicaciones.</span>',
    'hero.lead': 'Deneb es un panel de control liviano para tu propio servidor. Sitios, despliegues Git, bases de datos, SSL, DNS y backups cifrados desde una interfaz clara, sin ejecutar el panel como root.',
    'form.label': 'Correo electrónico',
    'form.placeholder': 'vos@ejemplo.com',
    'form.button': 'Avisame del lanzamiento',
    'form.note': 'Un solo email cuando Deneb esté listo para instalar. Sin spam y sin compartir tus datos.',
    'features.title': 'Todo lo que un servidor en producción necesita',
    'features.sub': 'Pensado a partir de despliegues reales: sitios institucionales, frontends Next.js y APIs Laravel en la misma VPS.',
    'f.sites.t': 'Sitios y runtimes',
    'f.sites.d': 'Sitios estáticos, PHP (varias versiones por servidor) y Node.js, con alias, subdominios y un pool PHP-FPM aislado por sitio.',
    'f.git.t': 'Despliegues Git',
    'f.git.d': 'Releases atómicos con rollback en un clic para Laravel y Node.js. Soporta monorepos y repositorios privados.',
    'f.db.t': 'Bases de datos',
    'f.db.d': 'MySQL, MariaDB y PostgreSQL con importación, exportación y backups de seguridad automáticos antes de cambios riesgosos.',
    'f.ssl.t': 'SSL automático',
    'f.ssl.d': 'Certificados Let\'s Encrypt con verificación previa de DNS antes de emitir y renovaciones monitoreadas.',
    'f.dns.t': 'DNS autoritativo',
    'f.dns.d': 'Zonas y registros desde el panel. Los sitios nuevos pueden publicar sus propios registros DNS automáticamente.',
    'f.backup.t': 'Backups cifrados',
    'f.backup.d': 'Snapshots completos programados con checksums, copias cifradas en cualquier almacenamiento compatible con S3 y restauración guiada.',
    'f.laravel.t': 'Listo para Laravel',
    'f.laravel.d': 'Workers de colas, scheduler, bóveda de variables de entorno y visor de logs, por sitio y actualizados en cada despliegue.',
    'f.files.t': 'Archivos, SFTP y cron',
    'f.files.d': 'Gestor de archivos integrado, cuentas SFTP aisladas por sitio compatibles con FileZilla y tareas programadas.',
    'sec.title': 'Seguro desde el diseño',
    'sec.sub': 'Un panel de control tiene las llaves de tu servidor. Deneb está pensado para que un error en la interfaz web no se convierta en acceso root.',
    'sec.1.t': 'Sin daemon root.',
    'sec.1.d': 'El panel corre con una cuenta restringida; las tareas privilegiadas pasan por helpers chicos y con lista de acciones permitidas.',
    'sec.2.t': 'Secretos cifrados.',
    'sec.2.d': 'Variables de entorno, tokens de Git y claves de almacenamiento se guardan cifrados y nunca se vuelven a mostrar.',
    'sec.3.t': 'Actualizaciones seguras.',
    'sec.3.d': 'Cada actualización se compila y prueba antes de activarse, con rollback automático si el panel no responde bien.',
    'sec.4.t': 'Sitios aislados.',
    'sec.4.d': 'Cada sitio tiene su propia identidad PHP, directorios temporales y acceso SFTP enjaulado.',
    'status.title': 'En qué punto está Deneb',
    'status.sub': 'Deneb ya administra sitios reales en producción. Estamos terminando las validaciones antes de abrir el instalador a todos.',
    't.1.t': 'Panel base',
    't.1.d': 'Sitios, bases de datos, SSL, DNS, archivos, SFTP, cron y usuarios.',
    't.2.t': 'Despliegues en producción',
    't.2.d': 'Releases Git, Laravel y Next.js, backups cifrados.',
    't.3.t': 'Lanzamiento público',
    't.3.d': 'Instalador de una línea para Ubuntu 22.04, 24.04 y 26.04, documentación y código abierto.',
    'cta.title': 'Sé de los primeros en instalarlo',
    'cta.sub': 'Dejá tu email y te avisamos cuando Deneb esté listo.',
    'cta.button': 'Sumarme a la lista',
    'foot.made': 'Hecho en Uruguay · Gratis y open source',
  };
  const messages = {
    en: { ok: 'Thanks! We\'ll email you when Deneb launches.', invalid: 'Please enter a valid email address.', error: 'Something went wrong. Please try again later.' },
    es: { ok: '¡Gracias! Te escribimos cuando Deneb se lance.', invalid: 'Ingresá un email válido.', error: 'Algo salió mal. Probá de nuevo más tarde.' },
  };
  const titles = {
    en: document.title,
    es: 'Deneb — Panel de control liviano para tu VPS',
  };

  const nodes = [...document.querySelectorAll('[data-i18n]')];
  const english = new Map(nodes.map(node => [node, node.innerHTML]));
  const placeholders = [...document.querySelectorAll('[data-i18n-placeholder]')];
  const englishPlaceholders = new Map(placeholders.map(node => [node, node.placeholder]));
  const form = document.getElementById('signup');
  const note = document.getElementById('form-note');
  let lang = 'en';

  const store = {
    get() { try { return localStorage.getItem('deneb-lang'); } catch { return null; } },
    set(value) { try { localStorage.setItem('deneb-lang', value); } catch { /* storage unavailable */ } },
  };

  function apply(next) {
    lang = next === 'es' ? 'es' : 'en';
    document.documentElement.lang = lang;
    document.title = titles[lang];
    for (const node of nodes) {
      const key = node.dataset.i18n;
      node.innerHTML = lang === 'es' && es[key] ? es[key] : english.get(node);
    }
    for (const node of placeholders) {
      const key = node.dataset.i18nPlaceholder;
      node.placeholder = lang === 'es' && es[key] ? es[key] : englishPlaceholders.get(node);
    }
    for (const button of document.querySelectorAll('[data-lang]')) {
      button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
    }
    form.elements.lang.value = lang;
    note.classList.remove('ok', 'err');
  }

  for (const button of document.querySelectorAll('[data-lang]')) {
    button.addEventListener('click', () => { apply(button.dataset.lang); store.set(lang); });
  }
  apply(store.get() || ((navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en'));

  document.getElementById('year').textContent = String(new Date().getFullYear());

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const email = form.elements.email.value.trim();
    const show = (key, state) => {
      note.textContent = messages[lang][key];
      note.classList.remove('ok', 'err');
      note.classList.add(state);
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { show('invalid', 'err'); return; }

    const button = form.querySelector('button');
    button.disabled = true;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.ok) {
        show('ok', 'ok');
        form.reset();
        form.elements.lang.value = lang;
      } else {
        show(result.error === 'invalid' ? 'invalid' : 'error', 'err');
      }
    } catch {
      show('error', 'err');
    } finally {
      button.disabled = false;
    }
  });
})();
