import { useState } from "react";
import avatar from "./assets/avatar_kmus.png";

type Priority = "alta" | "media" | "baja";

type Task = {
  id: number;
  text: string;
  done: boolean;
  priority: Priority;
};

const priorityConfig: Record<
  Priority,
  { label: string; color: string; dot: string }
> = {
  alta: { label: "Alta", color: "text-red-400", dot: "bg-red-400" },
  media: { label: "Media", color: "text-yellow-400", dot: "bg-yellow-400" },
  baja: { label: "Baja", color: "text-green-400", dot: "bg-green-400" },
};

const filters = ["todas", "pendientes", "completadas"] as const;
type Filter = (typeof filters)[number];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("media");
  const [filter, setFilter] = useState<Filter>("todas");

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text: input.trim(), done: false, priority },
    ]);
    setInput("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearDone = () => {
    setTasks((prev) => prev.filter((t) => !t.done));
  };

  const filtered = tasks.filter((t) => {
    if (filter === "pendientes") return !t.done;
    if (filter === "completadas") return t.done;
    return true;
  });

  const doneCount = tasks.filter((t) => t.done).length;
  const pendingCount = tasks.filter((t) => !t.done).length;

  return (
    <div
      className="
      min-h-screen flex items-center justify-center
      bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950
      px-4 py-12 font-sans
    "
    >
      <div className="w-full max-w-md flex flex-col gap-6">


        <div className="relative flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Lista de tareas
            <span
              className="
              ml-2 text-transparent bg-clip-text
              bg-gradient-to-r from-rose-300 to-red-400
            "
            >
              ✦
            </span>
          </h1>
          <p className="text-sm text-zinc-500">
            {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""} ·{" "}
            {doneCount} completada{doneCount !== 1 ? "s" : ""}
          </p>

          <img
            src={avatar}
            alt="avatar"
            className="
            absolute -bottom-6 right-0
            w-24 h-20 object-contain
            drop-shadow-xl
          "
          />
        </div>

        <div
          className="
          flex flex-col gap-3 p-4 rounded-2xl
          bg-zinc-800/60 border border-zinc-700/60
          backdrop-blur-sm
        "
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Nueva tarea..."
            className="
              w-full px-4 py-3 rounded-xl text-sm
              bg-zinc-900/80 border border-zinc-700
              text-white placeholder:text-zinc-500
              focus:outline-none focus:ring-2 focus:ring-rose-400/50
              transition-all duration-200
            "
          />

          <div className="flex items-center gap-2">
            {(["alta", "media", "baja"] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                  border transition-all duration-200
                  ${
                    priority === p
                      ? "bg-zinc-700 border-zinc-500 text-white"
                      : "bg-transparent border-zinc-700 text-zinc-500 hover:border-zinc-500"
                  }
                `}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${priorityConfig[p].dot}`}
                />
                {priorityConfig[p].label}
              </button>
            ))}

            <button
              onClick={addTask}
              className="
                ml-auto px-4 py-1.5 rounded-lg text-sm font-semibold
                bg-rose-400 hover:bg-rose-500 text-white
                transition-all duration-200 shadow-lg shadow-rose-400/20
              "
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* ── Filtros ── */}
        <div className="flex gap-1 p-1 rounded-xl bg-zinc-800/60 border border-zinc-700/60">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                flex-1 py-2 rounded-lg text-xs font-semibold capitalize
                transition-all duration-200
                ${
                  filter === f
                    ? "bg-rose-400 text-white shadow-md"
                    : "text-zinc-400 hover:text-white"
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Lista ── */}
        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <div
              className="
              py-12 flex flex-col items-center gap-2
              text-zinc-600 text-sm
            "
            >
              <span className="text-3xl">📭</span>
              <p>No hay tareas agregadas</p>
            </div>
          )}

          {filtered.map((task) => (
            <div
              key={task.id}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl
                border transition-all duration-200
                ${
                  task.done
                    ? "bg-zinc-800/30 border-zinc-800"
                    : "bg-zinc-800/60 border-zinc-700/60 hover:border-zinc-600"
                }
              `}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task.id)}
                className={`
                  shrink-0 w-5 h-5 rounded-full border-2
                  flex items-center justify-center
                  transition-all duration-200
                  ${
                    task.done
                      ? "bg-rose-400 border-rose-400"
                      : "border-zinc-600 hover:border-rose-300"
                  }
                `}
              >
                {task.done && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              {/* Texto */}
              <span
                className={`
                flex-1 text-sm transition-all duration-200
                ${task.done ? "line-through text-zinc-600" : "text-zinc-200"}
              `}
              >
                {task.text}
              </span>

              {/* Prioridad */}
              <span
                className={`
                shrink-0 text-xs font-medium
                ${priorityConfig[task.priority].color}
              `}
              >
                <span
                  className={`
                  inline-block w-1.5 h-1.5 rounded-full mr-1
                  ${priorityConfig[task.priority].dot}
                `}
                />
                {priorityConfig[task.priority].label}
              </span>

              {/* Eliminar */}
              <button
                onClick={() => deleteTask(task.id)}
                className="
                  text-rose-500 hover:text-rose-600
                  transition-all duration-200 text-lg leading-none
                "
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* ── Limpiar completadas ── */}
        {doneCount > 0 && (
          <button
            onClick={clearDone}
            className="
              self-center text-xs text-zinc-600
              hover:text-rose-400 transition-colors duration-200
              underline underline-offset-2
            "
          >
            Limpiar {doneCount} completada{doneCount !== 1 ? "s" : ""}
          </button>
        )}

        {/* ── Footer ── */}
        <p className="text-center text-xs text-zinc-600 pt-4 border-t border-zinc-800">
          Creado y diseñado por{" "}
          <span
            className="
              text-transparent bg-clip-text
              bg-gradient-to-r from-rose-300 to-red-400
              font-semibold
            "
          >
            KmusDev
          </span>
        </p>
      </div>
    </div>
  );
}