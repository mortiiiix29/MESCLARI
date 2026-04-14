const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const brandSwitch = document.getElementById('brandSwitch');

const REF_MODE_KEY = 'mesclari-reforma-mode';
const REF_MODE_ON = 'on';
const reformaPage = 'reforma.html';
const defaultPage = 'index.html';

const getCurrentPageName = () => {
  const path = window.location.pathname;
  const lastSegment = path.split('/').pop();
  return lastSegment || defaultPage;
};

const readModeFromStorage = () => {
  try {
    return window.localStorage.getItem(REF_MODE_KEY) === REF_MODE_ON;
  } catch {
    return false;
  }
};

const writeModeToStorage = (enabled) => {
  try {
    window.localStorage.setItem(REF_MODE_KEY, enabled ? REF_MODE_ON : 'off');
  } catch {
    // Ignore storage failures (private mode / blocked storage)
  }
};

const setReformaMode = (enabled) => {
  document.body.classList.toggle('reforma-mode', enabled);

  if (brandSwitch) {
    brandSwitch.setAttribute('aria-checked', String(enabled));
    brandSwitch.setAttribute(
      'aria-label',
      enabled ? 'Desactivar mode reforma i números' : 'Activar mode reforma i números',
    );
  }
};

const goToPage = (targetPage) => {
  if (getCurrentPageName() !== targetPage) {
    window.location.assign(new URL(targetPage, window.location.href));
  }
};

if (brandSwitch) {
  const isStoredOn = readModeFromStorage();
  const isReformaPage = getCurrentPageName() === reformaPage;
  setReformaMode(isStoredOn || isReformaPage);

  brandSwitch.addEventListener('click', () => {
    const willEnable = !document.body.classList.contains('reforma-mode');
    setReformaMode(willEnable);
    writeModeToStorage(willEnable);

    if (willEnable) {
      goToPage(reformaPage);
      return;
    }

    if (getCurrentPageName() === reformaPage) {
      goToPage(defaultPage);
    }
  });
}

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
