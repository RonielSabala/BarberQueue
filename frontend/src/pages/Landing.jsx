import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/landing.css";
import { useEffect, useRef, useState } from "react";

/* ─── Static data ──────────────────────────────────────────────────────── */
const BARBERS = [
  {
    id: 1,
    initials: "JR",
    name: "Juan Rodríguez",
    color: "from-blue-500 to-blue-700",
    queue: [
      { pos: 1, name: "Carlos M.", status: "service" },
      { pos: 2, name: "Pedro G.", status: "wait", time: "~12 min" },
      { pos: 3, name: "Tú", status: "me" },
    ],
  },
  {
    id: 2,
    initials: "AM",
    name: "Andrés Méndez",
    color: "from-emerald-500 to-emerald-700",
    queue: [
      { pos: 1, name: "Luis V.", status: "service" },
      { pos: 2, name: "Marcos R.", status: "wait", time: "~8 min" },
    ],
  },
  {
    id: 3,
    initials: "KL",
    name: "Kevin López",
    color: "from-violet-500 to-violet-700",
    queue: [
      { pos: 1, name: "Diego H.", status: "service" },
      { pos: 2, name: "Familia Torres", status: "wait", time: "Grupo ×3" },
    ],
  },
];

const FEATURES = [
  {
    icon: "schedule",
    iconColor: "text-blue-500",
    bg: "bg-blue-50",
    title: "Cola en tiempo real",
    desc: "Ve cuántas personas están antes que tú. Los datos se actualizan al instante, sin recargar la página.",
  },
  {
    icon: "location_on",
    iconColor: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "Llega justo a tiempo",
    desc: "Monitorea tu posición desde casa. Sal cuando la cola esté cerca y aprovecha cada minuto.",
  },
  {
    icon: "content_cut",
    iconColor: "text-amber-600",
    bg: "bg-amber-50",
    title: "Elige tu barbero",
    desc: "Selecciona al barbero de tu preferencia al unirte a la cola. Sin sorpresas.",
  },
  {
    icon: "groups",
    iconColor: "text-slate-600",
    bg: "bg-slate-100",
    title: "Turnos en grupo",
    desc: "Registra a toda tu familia o amigos en un solo turno. Grupo, no problema.",
  },
  {
    icon: "pause_circle",
    iconColor: "text-cyan-600",
    bg: "bg-cyan-50",
    title: "Pausa tu turno",
    desc: "¿Necesitas salir un momento? Pausa tu turno temporalmente sin perder tu posición.",
  },
  {
    icon: "star",
    iconColor: "text-red-500",
    bg: "bg-red-50",
    title: "Reseñas y ratings",
    desc: "Evalúa tu experiencia y ayuda a otros clientes a elegir la mejor barbería.",
  },
];

const BARBER_FEATURES = [
  {
    icon: "bar_chart",
    title: "Dashboard en tiempo real",
    desc: "Visualiza clientes activos, colas por barbero y métricas de tu negocio en un solo lugar.",
  },
  {
    icon: "manage_accounts",
    title: "Gestión de barberos",
    desc: "Controla la disponibilidad y estado de tu equipo al instante.",
  },
  {
    icon: "person_add",
    title: "Asistente de registro",
    desc: "Tu asistente registra clientes presenciales directo desde la barbería. Cero papel, cero caos.",
  },
  {
    icon: "lock",
    title: "Control de capacidad",
    desc: "Define el límite máximo de clientes. Si está lleno, el sistema lo indica automáticamente.",
  },
];

const TESTIMONIALS = [
  {
    stars: 5,
    text: "Antes perdía 45 minutos esperando. Ahora llego exacto cuando es mi turno. Increíble.",
    name: "Carlos Martínez",
    role: "Cliente frecuente · Santiago",
    initials: "CM",
    color: "from-blue-500 to-blue-700",
    featured: false,
  },
  {
    stars: 5,
    text: "Como dueño de barbería, el orden mejoró 100%. Menos caos, más clientes atendidos. Lo recomiendo sin dudar.",
    name: "Roberto Luna",
    role: "Dueño · Barbería Style Pro",
    initials: "RL",
    color: "from-emerald-500 to-emerald-700",
    featured: true,
  },
  {
    stars: 5,
    text: "Llevo a mis hijos y antes era una tortura esperar. Ahora llegamos justo a tiempo. Mis hijos aman la app.",
    name: "María Pérez",
    role: "Mamá de 3 · Cliente mensual",
    initials: "MP",
    color: "from-violet-500 to-violet-700",
    featured: false,
  },
];

const CHART_BARS = [30, 50, 40, 80, 100, 70, 60, 45];

/* ─── Sub-components ───────────────────────────────────────────────────── */

function LiveDot() {
  return (
    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
  );
}

function QueueStatusBadge({ status, time }) {
  if (status === "service")
    return (
      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
        En servicio
      </span>
    );
  if (status === "me")
    return (
      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
        Mi turno
      </span>
    );
  return <span className="text-[10px] text-slate-400">{time}</span>;
}

function QueueRow({ item }) {
  const isService = item.status === "service";
  const isMe = item.status === "me";

  return (
    <div
      className={`flex items-center gap-2 px-2.5 py-2 rounded-xl mb-1.5
        ${isService ? "bg-blue-50" : isMe ? "bg-emerald-50 border border-emerald-200" : "bg-slate-100"}`}
    >
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 text-white
          ${isService ? "bg-blue-500" : isMe ? "bg-emerald-500" : "bg-slate-300 text-slate-600"}`}
      >
        {item.pos}
      </div>
      <span
        className={`text-xs font-medium flex-1
          ${isMe ? "text-emerald-700 font-bold" : "text-slate-800"}`}
      >
        {item.name}
      </span>
      <QueueStatusBadge status={item.status} time={item.time} />
    </div>
  );
}

/* Phone mockup */
/* Phone mockup - Replica de la imagen proporcionada */
function PhoneMockup() {
  return (
    <div
      className="w-[320px] bg-[#0B1F3A] rounded-[40px] p-2.5 shadow-2xl relative"
      style={{
        boxShadow:
          "0 40px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05)",
        animation: "floatPhone 6s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes floatPhone {
          0%,100%{transform: translateY(0) rotate(-1deg)}
          50%{transform: translateY(-15px) rotate(1deg)}
        }
      `}</style>

      {/* Inner Screen */}
      <div className="bg-[#F8FAFC] rounded-[32px] overflow-hidden h-[600px] flex flex-col font-sans">
        {/* Top App Bar */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <span className="material-icons-round text-slate-400 text-xl">
            notes
          </span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-icons-round text-slate-400 text-xl">
                notifications
              </span>
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
              <img
                src="https://i.pravatar.cc/100?img=11"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          {/* Header Section */}
          <div className="mb-2">
            <h2 className="text-2xl font-black text-[#0B1F3A] tracking-tight leading-tight">
              Cola en tiempo real
            </h2>
            <p className="text-sm text-slate-400">BarberKing Santo Domingo</p>
          </div>

          {/* Clientes Activos Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Clientes Activos
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-blue-500">2</span>
                <span className="text-xl font-bold text-slate-300">/ 3</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
              <span className="material-icons-round text-slate-400 text-2xl">
                groups
              </span>
            </div>
          </div>

          {/* Barber Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-black mb-3 shadow-lg shadow-blue-500/20">
              B
            </div>
            <h3 className="text-lg font-bold text-[#0B1F3A] mb-2">
              barber_felix
            </h3>
            <div className="flex gap-2">
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Activo
              </span>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Aceptando
              </span>
            </div>
          </div>

          {/* Queue Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-blue-50/50 px-4 py-3 flex items-center gap-2 border-b border-blue-50">
              <span className="material-icons-round text-blue-500 text-sm">
                content_cut
              </span>
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                Siendo Atendido
              </span>
            </div>
            <div className="p-4 space-y-4">
              {/* Row 1 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                  1
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-black">
                  C
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-700">
                    cliente_victor
                  </p>
                  <p className="text-[10px] text-slate-400">En servicio</p>
                </div>
              </div>
              <div className="border-t border-dashed border-slate-100" />
              {/* Row 2 */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                  2
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-black">
                  C
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-700">
                    cliente_paola
                  </p>
                  <p className="text-[10px] text-slate-400">En cola</p>
                </div>
              </div>
            </div>
          </div>

          {/* Espera General */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-icons-round text-blue-500">
                hourglass_empty
              </span>
              <h4 className="font-bold text-[#0B1F3A]">Espera General</h4>
            </div>
            <p className="text-xs text-slate-300 italic text-center py-2">
              No hay clientes registrados en espera general.
            </p>
          </div>

          {/* Descansando */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-icons-round text-slate-400">hotel</span>
              <h4 className="font-bold text-[#0B1F3A]">Descansando</h4>
            </div>
            <p className="text-xs text-slate-300 italic text-center py-2">
              Ningún barbero descansando
            </p>
          </div>

          {/* Clientes en barberia */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-icons-round text-slate-400">
                storefront
              </span>
              <h4 className="font-bold text-[#0B1F3A]">Clientes en barbería</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Registra tu llegada para aparecer en la espera general de la
              barbería.
            </p>
            <button className="w-full bg-blue-500 text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-500/25 text-sm transition-transform active:scale-[0.98]">
              Registrar llegada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Desktop preview — replica fiel del layout QueueLive + MainLayout */
function DesktopPreview() {
  const MOCK_BARBERS = [
    {
      id: 1,
      initial: "F",
      name: "barber_felix",
      color: "bg-[#429ebd]",
      queue: [
        {
          pos: 1,
          initial: "V",
          name: "cliente_victor",
          status: "En servicio",
          isService: true,
        },
        {
          pos: 2,
          initial: "P",
          name: "cliente_paola",
          status: "En cola",
          isService: false,
        },
        { pos: 3, initial: "T", name: "Tú", status: "Mi turno", isMe: true },
      ],
    },
    {
      id: 2,
      initial: "A",
      name: "barber_andres",
      color: "bg-violet-500",
      queue: [
        {
          pos: 1,
          initial: "L",
          name: "luis_vega",
          status: "En servicio",
          isService: true,
        },
        {
          pos: 2,
          initial: "M",
          name: "marcos_r",
          status: "En cola",
          isService: false,
        },
      ],
    },
    {
      id: 3,
      initial: "K",
      name: "barber_kevin",
      color: "bg-emerald-500",
      queue: [
        {
          pos: 1,
          initial: "D",
          name: "diego_h",
          status: "En servicio",
          isService: true,
        },
      ],
    },
  ];

  const WAITING_CLIENTS = [
    { initial: "R", color: "bg-amber-500", name: "rafael_m" },
    { initial: "S", color: "bg-pink-500", name: "sofia_r" },
    { initial: "N", color: "bg-cyan-500", name: "nicolas_v" },
  ];

  return (
    <div className="bg-[#1C2333] rounded-2xl p-3 shadow-2xl overflow-hidden">
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5 mb-2.5 px-1">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="text-[11px] text-white/30 ml-2 font-mono">
          barberqueue.app/queue/live
        </span>
      </div>

      {/* App shell — exact MainLayout structure */}
      <div
        className="flex rounded-xl overflow-hidden"
        style={{ height: "640px" }}
      >
        {/* ── SIDEBAR (MainLayout aside) ── */}
        <div className="w-[140px] bg-slate-900 flex flex-col flex-shrink-0">
          <div className="p-3">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="material-icons-round text-[#429ebd] text-[16px]">
                  content_cut
                </span>
              </div>
            </div>
            <p className="text-[7px] font-bold uppercase tracking-widest text-slate-500 mb-4 mt-3">
              Gestión de turnos
            </p>
            {/* Nav items */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-[#429ebd]/20">
                <span className="material-icons-round text-[#429ebd] text-[14px]">
                  home
                </span>
                <span className="text-[11px] font-bold text-[#429ebd]">
                  Inicio
                </span>
              </div>
              <div className="flex items-center gap-2 px-2 py-2 rounded-xl">
                <span className="material-icons-round text-slate-500 text-[14px]">
                  person
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  Perfil
                </span>
              </div>
            </div>
          </div>
          {/* Logout */}
          <div className="mt-auto p-3 border-t border-slate-800">
            <div className="flex items-center gap-2 px-2 py-2 rounded-xl bg-red-500/10 border border-transparent">
              <span className="material-icons-round text-red-500 text-[13px]">
                logout
              </span>
              <span className="text-[10px] font-semibold text-red-500">
                Cerrar Sesión
              </span>
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT AREA ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-slate-50">
          {/* TOPBAR (MainLayout header) */}
          <div className="h-12 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 flex-shrink-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <span className="material-icons-round text-[12px]">home</span>
              <span className="material-icons-round text-[11px]">
                chevron_right
              </span>
              <span className="text-slate-800 font-semibold text-[12px]">
                Cola en tiempo real
              </span>
            </div>
            {/* Right: clientes activos + bell + user */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="material-icons-round text-slate-400 text-[17px]">
                  notifications
                </span>
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
              </div>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#429ebd] to-blue-600 flex items-center justify-center text-white text-[9px] font-bold">
                  J
                </div>
                <span className="text-[11px] font-medium text-slate-700">
                  Jheinel
                </span>
                <span className="material-icons-round text-slate-400 text-[13px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* PAGE CONTENT (QueueLive main) */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex flex-1 overflow-hidden">
              {/* ── MAIN SCROLLABLE AREA ── */}
              <div className="flex-1 overflow-auto p-4 min-w-0">
                {/* Page header (QueueLive header block) */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-[15px] font-extrabold text-slate-900 tracking-tight leading-none mb-0.5">
                      Cola en tiempo real
                    </h1>
                    <p className="text-[10px] text-slate-400">
                      BarberKing Santo Domingo
                    </p>
                  </div>
                </div>

                {/* Barber columns grid (QueueLive grid lg:grid-cols-3) */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {MOCK_BARBERS.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                    >
                      {/* Barber header */}
                      <div className="pt-3 pb-2 px-3 flex flex-col items-center text-center border-b border-slate-100">
                        <div
                          className={`w-10 h-10 rounded-full ${b.color} flex items-center justify-center text-white text-[13px] font-black mb-1.5`}
                        >
                          {b.initial}
                        </div>
                        <p className="text-[11px] font-bold text-slate-800 mb-1.5">
                          {b.name}
                        </p>
                        <div className="flex gap-1">
                          <span className="text-[8px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                            Activo
                          </span>
                          <span className="text-[8px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                            Aceptando
                          </span>
                        </div>
                      </div>
                      {/* Being served label */}
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 border-b border-blue-100">
                        <span className="material-icons-round text-[#429ebd] text-[11px]">
                          content_cut
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-[#429ebd]">
                          Siendo Atendido
                        </span>
                      </div>
                      {/* Queue rows */}
                      <div className="px-2.5 py-2 space-y-1">
                        {b.queue.map((item, idx) => (
                          <div key={item.pos}>
                            <div
                              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl ${item.isService ? "bg-blue-50" : item.isMe ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50"}`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 text-white ${item.isService ? "bg-blue-500" : item.isMe ? "bg-emerald-500" : "bg-slate-300"}`}
                              >
                                {item.pos}
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold flex-shrink-0 ${item.isMe ? "bg-emerald-500" : "bg-[#429ebd]"}`}
                              >
                                {item.initial}
                              </div>
                              <p
                                className={`text-[9px] font-semibold flex-1 truncate ${item.isMe ? "text-emerald-700" : "text-slate-700"}`}
                              >
                                {item.name}
                              </p>
                              {item.isService && (
                                <span className="text-[8px] bg-blue-100 text-blue-700 font-semibold px-1 py-0.5 rounded">
                                  Servicio
                                </span>
                              )}
                              {item.isMe && (
                                <span className="text-[8px] bg-emerald-100 text-emerald-700 font-semibold px-1 py-0.5 rounded">
                                  Yo
                                </span>
                              )}
                            </div>
                            {idx < b.queue.length - 1 && (
                              <div className="border-t border-dashed border-slate-100 my-0.5" />
                            )}
                          </div>
                        ))}
                        <div className="pt-1 border-t border-slate-100 mt-1">
                          <button className="w-full bg-[#429ebd]/10 text-[#429ebd] text-[9px] font-bold rounded-lg py-1.5">
                            Entrar a esta cola
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Espera General (QueueLive espera general block) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-icons-round text-[#429ebd] text-[14px]">
                      hourglass_empty
                    </span>
                    <span className="text-[12px] font-bold text-slate-800">
                      Espera General
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {WAITING_CLIENTS.map((c) => (
                      <div
                        key={c.name}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center text-white text-[10px] font-bold`}
                        >
                          {c.initial}
                        </div>
                        <span className="text-[8px] text-slate-400 font-medium">
                          {c.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── RIGHT SIDEBAR (QueueLive xl:w-80 sidebar) ── */}
              <div className="w-[175px] flex-shrink-0 flex flex-col gap-2.5 p-3 border-l border-slate-200 overflow-auto bg-slate-50">
                {/* Descansando card */}
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-sm">
                  <div className="text-right">
                    <p className="text-[7px] text-slate-400 uppercase tracking-widest font-semibold leading-none">
                      Clientes Activos
                    </p>
                    <p className="text-[14px] font-extrabold text-[#429ebd] leading-tight tracking-tighter">
                      5{" "}
                      <span className="text-slate-300 text-[10px] font-normal">
                        / 20
                      </span>
                    </p>
                  </div>
                  <div className="w-px h-6 bg-slate-200" />
                  <span className="material-icons-round text-slate-400 text-[17px]">
                    groups
                  </span>
                </div>

                {/* Descansando card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <span className="material-icons-round text-slate-400 text-[13px]">
                      hotel
                    </span>
                    <span className="text-[11px] font-bold text-slate-800">
                      Descansando
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center grayscale opacity-60">
                        <span className="material-icons-round text-slate-400 text-[16px]">
                          face
                        </span>
                      </div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-yellow-400 border-2 border-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400">
                        barber_luis
                      </p>
                      <p className="text-[9px] text-slate-400">
                        Regreso pendiente...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clientes en barbería (client panel) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="material-icons-round text-slate-400 text-[13px]">
                      storefront
                    </span>
                    <span className="text-[11px] font-bold text-slate-800">
                      Clientes en barbería
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-500 leading-relaxed mb-2.5">
                    Registra tu llegada para aparecer en la espera general de la
                    barbería.
                  </p>
                  <button className="w-full bg-[#429ebd] text-white text-[10px] font-bold rounded-xl py-2 mb-1.5">
                    Registrar llegada
                  </button>
                  <button className="w-full border border-slate-200 text-slate-600 text-[10px] font-bold rounded-xl py-2">
                    Ver mi turno
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Dashboard preview for barbers section */
function DashboardPreview() {
  return (
    <div className="bg-[#152D4F] rounded-2xl p-5 border border-white/8 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: "Hoy atendidos",
            value: "34",
            change: "↑ +8 vs ayer",
            changeColor: "text-emerald-400",
          },
          {
            label: "En cola ahora",
            value: "7",
            change: "● En vivo",
            changeColor: "text-cyan-400",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-white/5 border border-white/8 rounded-2xl p-4"
          >
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
              {c.label}
            </p>
            <p className="text-3xl font-extrabold text-white tracking-tighter mt-1">
              {c.value}
            </p>
            <p className={`text-xs mt-1 ${c.changeColor}`}>{c.change}</p>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-3">
          Clientes por hora
        </p>
        <div className="flex items-end gap-1.5 h-20">
          {CHART_BARS.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t ${i === 4 ? "bg-blue-500" : "bg-blue-500/25"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          {["9am", "11am", "1pm", "3pm", "Ahora", "5pm", "6pm", "7pm"].map(
            (l, i) => (
              <span
                key={i}
                className={`text-[10px] ${i === 4 ? "text-white font-semibold" : "text-white/30"}`}
              >
                {l}
              </span>
            ),
          )}
        </div>
      </div>
      {/* Barbers */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-4 space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
          Barberos activos
        </p>
        {[
          {
            initials: "JR",
            name: "Juan Rodríguez",
            count: "3 en cola",
            color: "from-blue-500 to-blue-700",
          },
          {
            initials: "AM",
            name: "Andrés Méndez",
            count: "2 en cola",
            color: "from-emerald-500 to-emerald-700",
          },
          {
            initials: "KL",
            name: "Kevin López",
            count: "2 en cola",
            color: "from-violet-500 to-violet-700",
          },
        ].map((b) => (
          <div key={b.initials} className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-full bg-gradient-to-br ${b.color} flex items-center justify-center text-white text-[11px] font-bold`}
            >
              {b.initials}
            </div>
            <span className="text-white text-[12px] font-semibold flex-1">
              {b.name}
            </span>
            <span className="text-white/50 text-[12px]">{b.count}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────────────────── */
export default function Landing() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-white text-slate-800 overflow-x-hidden font-sans">
      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] h-[68px] border-b border-slate-200 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl"
            : "bg-white/85 backdrop-blur-xl"
        }`}
      >
        <Link to="/" className="flex items-center">
          <img src={logo} alt="BarberQueue" className="h-10 w-auto" />
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Cómo funciona", href: "#como-funciona" },
            { label: "La app", href: "#preview" },
            { label: "Para barberías", href: "#barberias" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-500 hover:text-[#0B1F3A] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-500 hover:text-[#0B1F3A] px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold text-white bg-[#0B1F3A] px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Crear cuenta
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="pt-[68px] min-h-screen flex flex-col relative overflow-hidden bg-white">
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
        {/* Blobs */}
        <div className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full bg-blue-500/[0.07] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.06] blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-[5%] py-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full">
          {/* Left */}
          <div className="flex flex-col gap-7">
            {/* Badge */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span className="text-[13px] font-semibold text-emerald-800">
                Cola en tiempo real · Sin esperas
              </span>
            </div>
            {/* Title */}
            <h1 className="font-extrabold text-[clamp(40px,5vw,62px)] leading-[1.08] tracking-[-2.5px] text-[#0B1F3A]">
              Tu turno,
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                donde estés.
              </span>
            </h1>
            <p className="text-[17px] text-slate-500 leading-relaxed max-w-[460px]">
              BarberQueue digitaliza las barberías. Consulta colas en tiempo
              real, escoge tu barbero favorito y llega justo cuando te toca.
            </p>
            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                to="/register"
                className="text-[15px] font-bold text-white bg-[#0B1F3A] px-7 py-3.5 rounded-xl hover:bg-blue-600 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/25 no-underline"
              >
                Empezar gratis
              </Link>
              <a
                href="#como-funciona"
                className="text-[15px] font-medium text-[#0B1F3A] bg-white border border-slate-200 px-7 py-3.5 rounded-xl hover:border-[#0B1F3A] transition-all hover:-translate-y-0.5 no-underline"
              >
                Ver cómo funciona
              </a>
            </div>
            {/* Stats */}
            <div className="flex items-center gap-8 pt-2 border-t border-slate-200">
              {[
                { num: "0", label: "Minutos perdidos" },
                { num: "100%", label: "Tiempo real" },
                { num: "3 pasos", label: "Para tu turno" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="font-extrabold text-[22px] text-[#0B1F3A] tracking-tight">
                    {s.num}
                  </span>
                  <span className="text-[13px] text-slate-400">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="hidden lg:flex justify-center items-center">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ───────────────────────────────────────── */}
      <section id="como-funciona" className="py-24 px-[5%]">
        <div className="max-w-[1200px] mx-auto">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-blue-500 mb-4 before:content-[''] before:w-4 before:h-0.5 before:bg-blue-500 before:rounded">
            Proceso simple
          </p>
          <h2 className="font-extrabold text-[clamp(32px,4vw,48px)] tracking-[-1.5px] text-[#0B1F3A] leading-[1.1] mb-4">
            En 3 pasos, en la silla.
          </h2>
          <p className="text-[17px] text-slate-500 leading-relaxed max-w-[520px] mb-14">
            Sin descargas, sin complicaciones. Solo entra, escoge y llega justo
            a tiempo.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                n: "1",
                title: "Regístrate en segundos",
                desc: "Crea tu cuenta solo con correo y contraseña. Sin apps que descargar.",
              },
              {
                n: "2",
                title: "Escoge barbería y barbero",
                desc: "Ve la cola en tiempo real y únete al barbero de tu preferencia.",
              },
              {
                n: "3",
                title: "Llega justo cuando toca",
                desc: "Sigue tu posición desde donde estés y aparece en el momento exacto.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="flex flex-col gap-4 relative z-10 group"
              >
                <div className="w-[72px] h-[72px] rounded-full bg-white border-2 border-slate-200 flex items-center justify-center font-extrabold text-2xl text-[#0B1F3A] shadow-md transition-all group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white">
                  {s.n}
                </div>
                <p className="font-bold text-[18px] text-[#0B1F3A] tracking-tight">
                  {s.title}
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT PREVIEW ─────────────────────────────────────── */}
      <section id="preview" className="py-24 px-[5%] bg-slate-100">
        <div className="max-w-[1200px] mx-auto">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-blue-500 mb-4 before:content-[''] before:w-4 before:h-0.5 before:bg-blue-500 before:rounded">
            Vista de la plataforma
          </p>
          <h2 className="font-extrabold text-[clamp(32px,4vw,48px)] tracking-[-1.5px] text-[#0B1F3A] leading-[1.1] mb-4">
            La cola, en tiempo real.
          </h2>
          <p className="text-[17px] text-slate-500 leading-relaxed max-w-[520px] mb-12">
            Así se ve BarberQueue en acción. Cola por barbero, estado en vivo, y
            tus acciones al instante.
          </p>
          <div className="hidden lg:block">
            <DesktopPreview />
          </div>
          <div className="lg:hidden flex justify-center">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS ──────────────────────────────────────────── */}
      <section className="py-24 px-[5%]">
        <div className="max-w-[1200px] mx-auto">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-blue-500 mb-4 before:content-[''] before:w-4 before:h-0.5 before:bg-blue-500 before:rounded">
            Beneficios
          </p>
          <h2 className="font-extrabold text-[clamp(32px,4vw,48px)] tracking-[-1.5px] text-[#0B1F3A] leading-[1.1] mb-4">
            Diseñado para todos.
          </h2>
          <p className="text-[17px] text-slate-500 leading-relaxed max-w-[520px] mb-14">
            Cada funcionalidad fue pensada para que clientes y barberos ganen
            tiempo y experiencia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-slate-200 rounded-2xl p-8 transition-all duration-300 hover:border-blue-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100 cursor-default"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5`}
                >
                  <span
                    className={`material-icons-round text-2xl ${f.iconColor}`}
                  >
                    {f.icon}
                  </span>
                </div>
                <p className="font-bold text-[18px] text-[#0B1F3A] tracking-tight mb-2">
                  {f.title}
                </p>
                <p className="text-[14px] text-slate-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA BARBERÍAS ──────────────────────────────────────── */}
      <section id="barberias" className="py-24 px-[5%] bg-[#0B1F3A]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-cyan-400 mb-4 before:content-[''] before:w-4 before:h-0.5 before:bg-cyan-400 before:rounded">
              Para negocios
            </p>
            <h2 className="font-extrabold text-[clamp(32px,3.5vw,46px)] tracking-[-1.5px] text-white leading-[1.1] mb-5">
              Tu barbería,
              <br />
              organizada.
            </h2>
            <p className="text-[16px] text-white/55 leading-relaxed mb-10">
              Olvida el caos. BarberQueue le da a tu negocio un sistema de
              gestión de clientes moderno, sin papel y sin confusiones.
            </p>
            <div className="flex flex-col gap-5">
              {BARBER_FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                    <span className="material-icons-round text-xl text-white/70">
                      {f.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-white mb-1">
                      {f.title}
                    </p>
                    <p className="text-[13px] text-white/50 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-24 px-[5%] bg-slate-100">
        <div className="max-w-[1200px] mx-auto">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-widest text-blue-500 mb-4 before:content-[''] before:w-4 before:h-0.5 before:bg-blue-500 before:rounded">
            Social proof
          </p>
          <h2 className="font-extrabold text-[clamp(32px,4vw,48px)] tracking-[-1.5px] text-[#0B1F3A] leading-[1.1] mb-4">
            Lo que dicen nuestros usuarios.
          </h2>
          <p className="text-[17px] text-slate-500 leading-relaxed max-w-[520px] mb-14">
            Clientes y dueños de barberías ya transformaron su experiencia con
            BarberQueue.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className={`bg-white rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                  t.featured
                    ? "border-2 border-blue-500 shadow-xl shadow-blue-100"
                    : "border border-slate-200"
                }`}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">
                      ⭐
                    </span>
                  ))}
                </div>
                <p className="text-[15px] text-slate-500 leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0B1F3A]">
                      {t.name}
                    </p>
                    <p className="text-[12px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────── */}
      <section className="py-32 px-[5%] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-cyan-500/[0.04]" />
        <div className="relative max-w-[680px] mx-auto">
          <h2 className="font-extrabold text-[clamp(36px,5vw,58px)] tracking-[-2px] text-[#0B1F3A] leading-[1.1] mb-5">
            Listo para olvidar
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              las filas?
            </span>
          </h2>
          <p className="text-[17px] text-slate-500 leading-relaxed mb-10">
            Únete a BarberQueue hoy. Gratis para clientes, potente para
            barberías. La barbería del futuro empieza aquí.
          </p>
          <div className="flex justify-center items-center gap-3 flex-wrap">
            <Link
              to="/register"
              className="text-[16px] font-bold text-white bg-[#0B1F3A] px-9 py-4 rounded-2xl hover:bg-blue-600 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-500/30 no-underline"
            >
              Crear cuenta gratis
            </Link>
            <Link
              to="/login"
              className="text-[16px] font-medium text-[#0B1F3A] bg-white border border-slate-200 px-9 py-4 rounded-2xl hover:border-[#0B1F3A] transition-all hover:-translate-y-0.5 no-underline"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-[#0B1F3A] px-[5%] py-12 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 font-extrabold text-[18px] text-white tracking-tight">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          BarberQueue
        </div>
        <p className="text-[13px] text-white/40">
          © {new Date().getFullYear()} BarberQueue · Todos los derechos
          reservados
        </p>
      </footer>
    </div>
  );
}
