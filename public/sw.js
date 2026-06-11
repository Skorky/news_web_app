self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  self.registration.showNotification(data.title || "Skorky News", {
    body: data.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
  });
});
