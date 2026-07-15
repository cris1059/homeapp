import { PEOPLE } from "../lib/schedule.js";

export function PersonPicker({ person, favoritePersonId, onPersonChange, onFavoriteChange }) {
  return (
    <section className="person-picker" aria-label="Filtrar por integrante">
      <button
        type="button"
        className={`person${person === "all" ? " is-active" : ""}`}
        onClick={() => onPersonChange("all")}
      >
        Todos
      </button>
      {PEOPLE.map((p) => {
        const isFav = favoritePersonId === p.id;
        return (
          <button
            key={p.id}
            type="button"
            className={`person tone-${p.tone}${person === p.id ? " is-active" : ""}${isFav ? " is-favorite" : ""}`}
            onClick={() => {
              onPersonChange(p.id);
              onFavoriteChange(p.id);
            }}
            aria-pressed={person === p.id}
            title={isFav ? `${p.name} (favorito · avisos)` : `Ver a ${p.name} y fijar como favorito`}
          >
            {isFav && (
              <span className="fav-mark" aria-hidden="true">
                ★
              </span>
            )}
            {p.name}
          </button>
        );
      })}
    </section>
  );
}
