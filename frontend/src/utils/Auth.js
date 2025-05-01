import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);

  // Inicializa isLoggedIn solo si el token es válido
  function initialize() {
    const token = localStorage.getItem('log_token');
    if (!token) return;

    try {
      const decoded = decodedToken(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded && (!decoded.exp || decoded.exp > now)) {
        isLoggedIn.value = true;
      } else {
        console.log("[!WARN]: You shouldn't be doing this");
        localStorage.removeItem('log_token');
      }
    } catch (error) {
      console.log('Token inválido:', error);
      localStorage.removeItem('log_token');
    }
  };

  initialize(); 

  function login(token) {
    localStorage.setItem('log_token', token);
    isLoggedIn.value = true;
  }

  function logout() {
    localStorage.removeItem('log_token');
    isLoggedIn.value = false;
  }

  function isAdmin() {
    if (!isLoggedIn.value) return false;
    const decoded = decodedToken(localStorage.getItem('log_token'));
    return decoded.role === 'admin';  
  }

  function getName() {
    const decoded = decodedToken(localStorage.getItem('log_token'));
    return decoded.nombre;
  }

  return { isLoggedIn, login, logout, isAdmin, getName };
});

/**
 * Esta función permite decodificar un token para obtener sus valores del payload (parte del token que se refiere al contenido)
 * @param { Token a decodificar } token 
 * @returns 
 */
export const decodedToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) throw new Error("You are not allowed to do this");
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    return decoded;
  } catch (error) {
    return null;
  }
};
