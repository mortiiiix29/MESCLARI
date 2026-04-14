const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
const brandSwitch = document.getElementById('brandSwitch');

const REF_MODE_KEY = 'mesclari-reforma-mode';
const REF_MODE_ON = 'on';
const reformaPage = 'reforma.html';

const setReformaMode = (enabled) => {
  document.body.classList.toggle('reforma-mode', enabled);
  if (brandSwitch) {
    brandSwitch.setAttribute('aria-checked', String(enabled));
  }
};

const goToPage = (url) => {
  if (!window.location.pathname.endsWith(url)) {
    window.location.href = url;
  }
};

if (brandSwitch) {
  const isStoredOn = window.localStorage.getItem(REF_MODE_KEY) === REF_MODE_ON;
  const isReformaPage = window.location.pathname.endsWith(reformaPage);
  setReformaMode(isStoredOn || isReformaPage);

  brandSwitch.addEventListener('click', () => {
    const willEnable = !document.body.classList.contains('reforma-mode');
    setReformaMode(willEnable);
    window.localStorage.setItem(REF_MODE_KEY, willEnable ? REF_MODE_ON : 'off');

    if (willEnable) {
      goToPage(reformaPage);
      return;
    }

    if (window.location.pathname.endsWith(reformaPage)) {
      goToPage('index.html');
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
