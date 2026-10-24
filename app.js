const signInPanel = document.getElementById('signInPanel');
const profilePanel = document.getElementById('profilePanel');
const googleButton = document.getElementById('googleButton');
const authStatus = document.getElementById('authStatus');
const profileStatus = document.getElementById('profileStatus');
const signOutButton = document.getElementById('signOutButton');

function setStatus(target, message, isError) {
  target.textContent = message;
  target.classList.toggle('error', Boolean(isError));
}

function getApiBaseUrl() {
  const value = window.LUMINA_CONFIG?.apiBaseUrl;
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.origin !== value.replace(/\/+$/, '')) return '';
    return url.origin;
  } catch {
    return '';
  }
}

function showSignIn(message, isError) {
  profilePanel.hidden = true;
  signInPanel.hidden = false;
  setStatus(authStatus, message, isError);
}

function showProfile(profile) {
  signInPanel.hidden = true;
  profilePanel.hidden = false;
  document.getElementById('profileInitial').textContent = (profile.displayName || 'Lumina').trim().charAt(0).toUpperCase();
  document.getElementById('welcomeTitle').textContent = `Selamat datang, ${profile.displayName}`;
  document.getElementById('profileEmail').textContent = profile.email;
  document.getElementById('profileRole').textContent = `${profile.role} · ${profile.branchId}`;
  setStatus(profileStatus, 'Identitas dan status akun sudah diverifikasi oleh server.', false);
}

async function handleGoogleCredential(response, apiBaseUrl) {
  if (!response || typeof response.credential !== 'string') {
    showSignIn('Google tidak mengirim kredensial yang dapat diverifikasi. Silakan coba lagi.', true);
    return;
  }

  setStatus(authStatus, 'Memeriksa akun dan izin akses…', false);
  try {
    const result = await fetch(`${apiBaseUrl}/api/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${response.credential}` },
      cache: 'no-store',
      credentials: 'omit',
      redirect: 'error'
    });
    if (result.status === 401) throw new Error('Akun Google tidak dapat diverifikasi. Coba masuk kembali.');
    if (result.status === 403) throw new Error('Akun belum aktif di allowlist Lumina. Hubungi administrator.');
    if (!result.ok) throw new Error('Layanan login belum tersedia. Coba lagi beberapa saat.');

    const profile = await result.json();
    if (!profile.displayName || !profile.role || !profile.branchId) {
      throw new Error('Profil akses belum lengkap. Hubungi administrator Lumina.');
    }
    showProfile(profile);
  } catch (error) {
    showSignIn(error.message || 'Login gagal. Silakan coba lagi.', true);
  }
}

async function initializeSignIn() {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    showSignIn('API Lumina belum dikonfigurasi. Login belum dibuka.', true);
    return;
  }

  try {
    const configResponse = await fetch(`${apiBaseUrl}/config`, {
      cache: 'no-store',
      credentials: 'omit',
      redirect: 'error'
    });
    if (!configResponse.ok) throw new Error('Konfigurasi login tidak tersedia.');
    const config = await configResponse.json();
    if (!config.googleClientId || !window.google?.accounts?.id) {
      throw new Error('Google Sign-In belum siap. Periksa koneksi dan konfigurasi.');
    }

    window.google.accounts.id.initialize({
      client_id: config.googleClientId,
      callback: (response) => handleGoogleCredential(response, apiBaseUrl),
      auto_select: false,
      cancel_on_tap_outside: true
    });
    window.google.accounts.id.renderButton(googleButton, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: 'signin_with',
      locale: 'id'
    });
    setStatus(authStatus, 'Gunakan akun Gmail yang terdaftar di Lumina.', false);
  } catch (error) {
    showSignIn(error.message || 'Login belum dapat disiapkan.', true);
  }
}

signOutButton.addEventListener('click', () => {
  window.google?.accounts?.id?.disableAutoSelect();
  showSignIn('Anda sudah keluar dari Lumina.', false);
});

window.addEventListener('DOMContentLoaded', initializeSignIn, { once: true });
