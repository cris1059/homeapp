export function ConnectionStatus({ online }) {
  return (
    <div
      className={`net-status${online ? " is-online" : " is-offline"}`}
      role="status"
      aria-live="polite"
      title={online ? "En línea" : "Sin conexión"}
    >
      <span className="net-status-dot" aria-hidden="true" />
      <span className="net-status-label">{online ? "En línea" : "Sin conexión"}</span>
    </div>
  );
}
