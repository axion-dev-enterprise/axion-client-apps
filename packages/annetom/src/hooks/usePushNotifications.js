// src/hooks/usePushNotifications.js
import { useCallback, useState } from "react";

export function usePushNotifications() {
  const [permission, setPermission] = useState(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "default";
  });

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Seu navegador não suporta notificações de navegador.");
      return false;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === "granted") {
        new Notification("🍕 Anne & Tom", {
          body: "Notificações ativadas! Você receberá alertas do status da sua pizza.",
          icon: "/logopizzaria.png"
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error("[Push] Erro ao solicitar permissão:", err);
      return false;
    }
  }, []);

  const sendNotification = useCallback((title, body) => {
    if (permission === "granted" && "Notification" in window) {
      try {
        new Notification(title, {
          body,
          icon: "/logopizzaria.png",
        });
      } catch (e) {
        console.warn("[Push] Erro ao enviar notificação:", e);
      }
    }
  }, [permission]);

  return {
    permission,
    isGranted: permission === "granted",
    requestPermission,
    sendNotification,
  };
}
