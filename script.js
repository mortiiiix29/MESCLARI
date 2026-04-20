const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const brandSwitch = document.getElementById('brandSwitch');

const REF_MODE_KEY = 'mesclari-reforma-mode';
const REF_MODE_ON = 'on';
const defaultPage = 'index.html';
const reformaPages = new Set([
  'reforma.html',
  'marc-economic.html',
  'pressupost-obertura.html',
  'costos-operatius.html',
  'ingressos-temporalitat.html',
  'punt-mort.html',
  'rendibilitat-oferta.html',
  'tresoreria-seguretat.html',
  'conclusio-economica.html',
  'reforma-pressupost.html',
  'reforma-escenaris.html',
]);
const reformaHomePage = 'reforma.html';

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
