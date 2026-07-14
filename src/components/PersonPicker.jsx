import { PEOPLE } from "../lib/schedule.js";

export function PersonPicker({ person, onPersonChange }) {
  return (
    <section className="person-picker" aria-label="Filtrar por integrante">
      <button
        type="button"
        className={`person${person === "all" ? " is-active" : ""}`}
        onClick={() => onPersonChange("all")}
      >
        Todos
      </button>
      {PEOPLE.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`person tone-${p.tone}${person === p.id ? " is-active" : ""}`}
          onClick={() => onPersonChange(p.id)}
        >
          {p.name}
        </button>
      ))}
    </section>
  );
}
