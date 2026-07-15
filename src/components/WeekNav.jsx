export function WeekNav({ weekRange, cycle, onPrev, onNext }) {
  return (
    <section className="week-nav" aria-label="Navegación de semana">
      <button type="button" className="nav-btn" onClick={onPrev} aria-label="Semana anterior">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M12.5 4.5L7 10l5.5 5.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="week-meta">
        <p className="week-range">{weekRange}</p>
        <p className="cycle-badge" data-cycle={cycle}>
          Ciclo {cycle}
        </p>
      </div>
      <button type="button" className="nav-btn" onClick={onNext} aria-label="Semana siguiente">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M7.5 4.5L13 10l-5.5 5.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}
