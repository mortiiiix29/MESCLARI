const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const brandSwitch = document.getElementById('brandSwitch');

const REF_MODE_KEY = 'mesclari-reforma-mode';
const REF_MODE_ON = 'on';
const defaultPage = 'index.html';
const reformaPages = new Set([
  'reforma.html',
  'estat-inicial-local.html',
  'proposta-reforma-adequacio.html',
  'lectura-tecnica-economica.html',
  'estructura-economica.html',
  'viabilitat-economica.html',
  'rendibilitat-dels-menus.html',
  'reforma-pressupost.html',
  'reforma-escenaris.html',
]);
const reformaHomePage = 'estructura-economica.html';

const getCurrentPageName = () => {
  const path = window.location.pathname;
  const lastSegment = path.split('/').pop();
  return lastSegment || defaultPage;
};

const isReformaPage = () => reformaPages.has(getCurrentPageName());

const readModeFromStorage = () => {
  try {
    return window.localStorage.getItem(REF_MODE_KEY) === REF_MODE_ON;
  } catch (error) {
    return false;
  }
};

const writeModeToStorage = (enabled) => {
  try {
    window.localStorage.setItem(REF_MODE_KEY, enabled ? REF_MODE_ON : 'off');
  } catch (error) {
    // Ignore storage failures (private mode / blocked storage)
  }
};

const setReformaMode = (enabled) => {
  document.body.classList.toggle('reforma-mode', enabled);

  if (brandSwitch) {
    brandSwitch.setAttribute('aria-checked', String(enabled));
    brandSwitch.setAttribute('aria-label', enabled ? 'Desactivar mode reforma i números' : 'Activar mode reforma i números');
  }
};

const goToPage = (targetPage) => {
  if (getCurrentPageName() !== targetPage) {
    window.location.assign(new URL(targetPage, window.location.href));
  }
};

if (brandSwitch) {
  const storedModeOn = readModeFromStorage();
  const onReformaPage = isReformaPage();

  setReformaMode(storedModeOn || onReformaPage);

  if (storedModeOn && !onReformaPage) {
    goToPage(reformaHomePage);
  }

  brandSwitch.addEventListener('click', () => {
    const willEnable = !document.body.classList.contains('reforma-mode');
    setReformaMode(willEnable);
    writeModeToStorage(willEnable);

    if (willEnable) {
      goToPage(reformaHomePage);
      return;
    }

    if (isReformaPage()) {
      goToPage(defaultPage);
    }
  });
}

if (menuBtn && menu) {
  const closeMenu = () => {
    menu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('click', (event) => {
    const clickedInsideMenu = menu.contains(event.target);
    const clickedMenuButton = menuBtn.contains(event.target);

    if (!clickedInsideMenu && !clickedMenuButton) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}


const mediaPathRewrites = [
  ['imaguenes i videos/', 'imagenes-y-videos/'],
  ['imagenes-y-videos/', 'imaguenes i videos/'],
];

const buildMediaFallbacks = (src) => {
  if (!src || /^https?:|^data:|^blob:/i.test(src)) {
    return [];
  }

  const candidates = new Set();

  for (const [from, to] of mediaPathRewrites) {
    if (src.includes(from)) {
      candidates.add(src.replace(from, to));
    }
  }

  return [...candidates].filter((candidate) => candidate !== src);
};

const installImageFallbacks = () => {
  document.addEventListener(
    'error',
    (event) => {
      const target = event.target;

      if (!(target instanceof HTMLImageElement)) {
        return;
      }

      const originalSrc = target.getAttribute('src') || '';
      const attempted = target.dataset.fallbackAttempts ? target.dataset.fallbackAttempts.split('||') : [];
      const pending = buildMediaFallbacks(originalSrc).filter((candidate) => !attempted.includes(candidate));
      const nextSrc = pending.shift();

      if (!nextSrc) {
        return;
      }

      attempted.push(nextSrc);
      target.dataset.fallbackAttempts = attempted.join('||');
      target.setAttribute('src', nextSrc);
    },
    true,
  );
};

installImageFallbacks();
