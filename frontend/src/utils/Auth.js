import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import ExtendSessionToast from "@/components/auths/ExtendToast.vue"; // Lo crearemos luego
import axios from "axios";

export const useAuthStore = defineStore("auth", () => {
  const isLoggedIn = ref(false);
  const router = useRouter();
  const toast = useToast();

  function initialize() {
    const token = localStorage.getItem("log_token");
    if (!token) return;

    try {
      const decoded = decodedToken(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded && (!decoded.exp || decoded.exp > now)) {
        isLoggedIn.value = true;
        checkTokenExpiry(decoded.exp, now);
      } else {
        console.log("[!WARN]: You shouldn't be doing this");
        localStorage.removeItem("log_token");
      }
    } catch (error) {
      console.log("Token inválido:", error);
      localStorage.removeItem("log_token");
      router.push("/");
    }
  }

  // Nuevo método para comprobar expiración y mostrar toast
  function checkTokenExpiry(exp, now) {
    const timeLeft = exp - now;

    if (timeLeft <= 300 && timeLeft > 0) {
      // Mostrar toast con opción para extender
      toast(
        {
          component: ExtendSessionToast,
          props: {
            onExtend: extendSession,
            onLogout: logout,
            toastId: "extend-toast"
          }
        },
        {
          id: "extend-toast", 
          timeout: false,
          closeOnClick: false,
          draggable: false,
          component: true,
          position: "top-right",
          toastClassName: "toast-extend-session"
        }
      );
    } else if (timeLeft <= 0) {
      // Token expirado
      toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      logout();
      router.push("/");
    }
  }

  async function extendSession() {
    try {
      const response = await axios.post("http://localhost:8081/refresh-token", {}, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      const data = response.data;
      login(data.token);
      toast.success("Sesión extendida correctamente");
    } catch (error) {
      console.error("Error al extender la sesión:", error);
      toast.error("No se pudo extender la sesión");
      logout();
      router.push("/");
    }
  }

  initialize();

  function login(token) {
    localStorage.setItem("log_token", token);
    isLoggedIn.value = true;
  }

  /**
   * Función para cerrar sesión, elimina el token y cambia el estado de log
   */
  function logout() {
    localStorage.removeItem("log_token");
    isLoggedIn.value = false;
  }

  /**
   * Función para saber si el usuario es admin
   * @returns -> boolean - Si el usuario es admin devuelve true sino false
   */
  function isAdmin() {
    if (!isLoggedIn.value) return false;
    const decoded = decodedToken(localStorage.getItem("log_token"));
    return decoded.role === "admin";
  }

  /**
   * Función para saber si el usuario es un entrenador
   * @returns -> boolean - Si el usuario es trainer devuelve true sino false
   */
  function isTrainer() {
    if (!isLoggedIn.value) return false;
    const decoded = decodedToken(localStorage.getItem("log_token"));
    return decoded.role === "entrenador";
  }

  /**
   * Función para obtener el nombre del usuario
   * @returns -> string - Nombre del usuario
   */
  function getName() {
    const decoded = decodedToken(localStorage.getItem("log_token"));
    return decoded.nombre;
  }

  /**
   * Función para obtener el id del usuario
   * @returns -> string - Id del usuario
   */
  function getId() {
    const decoded = decodedToken(localStorage.getItem("log_token"));
    return decoded.id;
  }

  /**
   * Función para obtener el rol del usuario
   * @returns -> string - Rol del usuario
   */
  function getRole() {
    const decoded = decodedToken(localStorage.getItem("log_token"));
    console.log(decoded.role);
    return decoded.role;
  }

  /**
   * Función para obtener el token
   * @returns -> string - Token
   */
  function getToken() {
    return localStorage.getItem("log_token");
  }

  function getImage() {
    const decoded = decodedToken(localStorage.getItem("log_token"));
    return decoded.profile_img;
  }

  initialize();

  return {
    isLoggedIn,
    login,
    logout,
    isAdmin,
    isTrainer,
    getName,
    getId,
    getToken,
    getRole,
    getImage,
    isTokenValid,
    checkTokenExpiry,
    extendSession
  };
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

export function isTokenValid() {
  const token = localStorage.getItem("log_token");
  if (!token) return false;

  try {
    const decoded = decodedToken(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded && (!decoded.exp || decoded.exp > now);
  } catch (error) {
    return false;
  }
}
