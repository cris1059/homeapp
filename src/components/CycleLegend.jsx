const SUMMARIES = [
  { cycle: 1, wed: "Aldair, Carlos", thu: "Cristopher, Enrique, Manuel, Leticia" },
  { cycle: 2, wed: "Cristopher, Enrique", thu: "Manuel, Leticia, Aldair, Carlos" },
  { cycle: 3, wed: "Manuel, Leticia", thu: "Aldair, Carlos, Cristopher, Enrique" },
];

export function CycleLegend({ currentCycle }) {
  return (
    <section className="legend" aria-label="Leyenda del ciclo">
      <h2 className="legend-title">Rotación</h2>
      <p className="legend-copy">
        Lunes y viernes: todos en casa. Martes: nadie. Miércoles y jueves rotan por ciclo.
      </p>
      <ol className="cycle-list">
        {SUMMARIES.map((s) => (
          <li
            key={s.cycle}
            className={`cycle-item${s.cycle === currentCycle ? " is-current" : ""}`}
            data-cycle={s.cycle}
          >
            <span className="cycle-item-label">Ciclo {s.cycle}</span>
            <span className="cycle-item-detail">Mié · {s.wed}</span>
            <span className="cycle-item-detail">Jue · {s.thu}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
