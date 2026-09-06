import React, { useState } from 'react';

const OTMARY = {
  name: 'Otmary',
  colorBg: 'bg-[#A88AED]/15 print:bg-[#A88AED]/40',
  colorText: 'text-[#5B3CB0] print:text-[#38206E] print:font-bold',
  dotColor: 'bg-[#A88AED] print:bg-[#38206E]',
  border: 'border-[#A88AED]/30 print:border-[#38206E]'
};

const ROBNAIDY = {
  name: 'Robnaidy',
  colorBg: 'bg-[#A6C261]/20 print:bg-[#A6C261]/40',
  colorText: 'text-[#4F6914] print:text-[#32430C] print:font-bold',
  dotColor: 'bg-[#A6C261] print:bg-[#32430C]',
  border: 'border-[#A6C261]/40 print:border-[#32430C]'
};

const FREE = {
  name: 'Libre',
  colorBg: 'bg-stone-100 print:bg-stone-200',
  colorText: 'text-stone-400 print:text-stone-700 print:font-bold',
  dotColor: 'bg-stone-300 print:bg-stone-500',
  border: 'border-stone-200 print:border-stone-400'
};

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekInMonth, setWeekInMonth] = useState(1);
  const [morningHours, setMorningHours] = useState('9:00 AM - 12:00 PM');
  const [afternoonHours, setAfternoonHours] = useState('3:00 PM - 6:00 PM');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempMorning, setTempMorning] = useState('');
  const [tempAfternoon, setTempAfternoon] = useState('');

  const calculateMonthWeeks = (year, month) => {
    const weeks = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let currentMonday = new Date(firstDay);
    let dayOfWeek = currentMonday.getDay();
    let diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentMonday.setDate(currentMonday.getDate() + diffToMonday);

    while (currentMonday <= lastDay) {
      weeks.push(new Date(currentMonday));
      currentMonday = new Date(currentMonday);
      currentMonday.setDate(currentMonday.getDate() + 7);
    }
    return weeks;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthWeeks = calculateMonthWeeks(year, month);
  const activeWeekIndex = Math.min(Math.max(weekInMonth - 1, 0), monthWeeks.length - 1);
  const selectedMonday = monthWeeks[activeWeekIndex] || new Date();

  // Cambiamos el cálculo global basado en sábado. 
  // Al avanzar al sábado, tomamos la fecha del sábado (selectedMonday + 5 días) para calcular la semana de rotación automáticamente.
  const saturdayOfSelectedWeek = new Date(selectedMonday);
  saturdayOfSelectedWeek.setDate(selectedMonday.getDate() + 5);

  const epoch = new Date(2024, 0, 6); // Usamos un sábado base conocido
  const diffTime = Math.abs(saturdayOfSelectedWeek - epoch);
  const weekNumberGlobal = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  const isOddWeek = weekNumberGlobal % 2 !== 0;

  // Secuencias exactas solicitadas:
  // Mañana: Lunes a Viernes -> [Robnaidy, Otmary, Robnaidy, Otmary, Robnaidy] (Semana Impar) o alternada (Semana Par)
  // Tarde: Lunes a Viernes -> [Otmary, Robnaidy, Otmary, [Otmary, Robnaidy] (Libre el jueves tarde), Robnaidy, Otmary] (Ajustado según orden exacto)
  
  const morningShift = [];
  const afternoonShift = [];

  if (isOddWeek) {
    // Semana tipo A (Impar)
    morningShift.push(ROBNAIDY, OTMARY, ROBNAIDY, OTMARY, ROBNAIDY);
    afternoonShift.push(OTMARY, ROBNAIDY, OTMARY, [OTMARY, ROBNAIDY], ROBNAIDY);
  } else {
    // Semana tipo B (Par - rotadas)
    morningShift.push(OTMARY, ROBNAIDY, OTMARY, ROBNAIDY, OTMARY);
    afternoonShift.push(ROBNAIDY, OTMARY, ROBNAIDY, [ROBNAIDY, OTMARY], OTMARY);
  }

  const nextWeek = () => {
    if (weekInMonth < monthWeeks.length) {
      setWeekInMonth(prev => prev + 1);
    } else {
      setWeekInMonth(1);
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }
  };

  const prevWeek = () => {
    if (weekInMonth > 1) {
      setWeekInMonth(prev => prev - 1);
    } else {
      const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const prevWeeks = calculateMonthWeeks(prevDate.getFullYear(), prevDate.getMonth());
      setCurrentDate(prevDate);
      setWeekInMonth(prevWeeks.length);
    }
  };

  const changeMonth = (delta) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    setWeekInMonth(1);
  };

  const openModal = () => {
    setTempMorning(morningHours);
    setTempAfternoon(afternoonHours);
    setIsModalOpen(true);
  };

  const saveShiftHours = () => {
    if (tempMorning.trim()) setMorningHours(tempMorning.trim());
    if (tempAfternoon.trim()) setAfternoonHours(tempAfternoon.trim());
    setIsModalOpen(false);
  };

  const renderEmployeeBadge = (emp) => {
    if (Array.isArray(emp)) {
      return (
        <div className="flex flex-col gap-1.5">
          {emp.map((e, idx) => (
            <div key={idx} className={`${e.colorBg} ${e.colorText} ${e.border} border py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 font-medium text-xs`}>
              <span className={`w-2 h-2 rounded-full ${e.dotColor} shrink-0`}></span>
              <span>{e.name}</span>
            </div>
          ))}
        </div>
      );
    }

    if (emp === FREE) {
      return (
        <div className={`${FREE.colorBg} ${FREE.colorText} ${FREE.border} border py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-medium text-xs sm:text-sm`}>
          <span className={`w-2 h-2 rounded-full ${FREE.dotColor} shrink-0`}></span>
          <span>{FREE.name}</span>
        </div>
      );
    }

    return (
      <div className={`${emp.colorBg} ${emp.colorText} ${emp.border} border py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 font-medium text-xs sm:text-sm`}>
        <span className={`w-2 h-2 rounded-full ${emp.dotColor} shrink-0`}></span>
        <span>{emp.name}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between antialiased">
      <div className="w-full">
        <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/60 sticky top-0 z-10 no-print">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-indigo flex items-center justify-center text-white shadow-sm">
                <i className="fa-solid fa-calendar-week text-sm"></i>
              </div>
              <div>
                <h1 className="text-base font-bold text-brand-textDark leading-none">Horario de Turnos</h1>
                <p className="text-xs text-stone-500 mt-1">Gestión de rotación de empleados</p>
              </div>
            </div>
            <button onClick={() => window.print()} className="bg-brand-indigo hover:bg-brand-indigoDark text-white px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm flex items-center gap-2">
              <i className="fa-solid fa-print"></i>
              <span>Imprimir Semana</span>
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-12">
          <div className="hidden print:flex mb-6 flex-col items-center justify-center text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-indigo text-white mb-2">
              <i className="fa-solid fa-calendar-week text-base"></i>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Horario Laboral de Turnos</h1>
            <p className="text-brand-indigo font-extrabold text-sm mt-1 uppercase tracking-widest bg-brand-beige/50 px-4 py-1 rounded-full border border-stone-400 inline-block">
              Mes de {monthNames[month]} {year}
            </p>
            <p className="text-stone-700 text-xs font-bold mt-1">
              Cuadro de Horario - Semana {activeWeekIndex + 1} de {monthWeeks.length}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4 no-print">
            <button onClick={() => changeMonth(-1)} className="text-stone-400 hover:text-stone-700 text-xs px-2 py-1 rounded transition">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 bg-brand-beige/60 border border-brand-beige px-4 py-1.5 rounded-full inline-block shadow-sm">
              <i className="fa-regular fa-calendar me-1.5 text-brand-indigoDark"></i> Mes de {monthNames[month]} {year}
            </span>
            <button onClick={() => changeMonth(1)} className="text-stone-400 hover:text-stone-700 text-xs px-2 py-1 rounded transition">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-stone-200/70 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
            <div className="flex items-center gap-2 bg-brand-bgSoft p-1.5 px-2 rounded-full border border-stone-200/60">
              <button onClick={prevWeek} className="h-8 px-3 rounded-full bg-white hover:bg-stone-100 text-stone-600 transition flex items-center gap-1.5 shadow-sm text-xs font-semibold">
                <i className="fa-solid fa-chevron-left text-[10px]"></i>
                <span>Anterior</span>
              </button>
              <span className="font-bold text-stone-700 text-xs tracking-wide px-2 min-w-[90px] text-center">
                SEMANA {activeWeekIndex + 1} DE {monthWeeks.length}
              </span>
              <button onClick={nextWeek} className="h-8 px-3 rounded-full bg-white hover:bg-stone-100 text-stone-600 transition flex items-center gap-1.5 shadow-sm text-xs font-semibold">
                <span>Siguiente</span>
                <i className="fa-solid fa-chevron-right text-[10px]"></i>
              </button>
            </div>

            <div className="flex items-center gap-6 text-xs bg-brand-bgSoft px-5 py-2.5 rounded-full border border-stone-200/60">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-indigo inline-block"></span>
                <span className="font-semibold text-stone-700">Otmary</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-celery inline-block"></span>
                <span className="font-semibold text-stone-700">Robnaidy</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 overflow-hidden print:border-2 print:border-stone-500">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-brand-beige/50 print:bg-stone-200 border-b border-stone-200/60 print:border-stone-400 text-stone-600 print:text-stone-900">
                    <th className="py-4 px-4 sm:px-6 font-semibold print:font-bold uppercase tracking-wider text-[11px] text-center w-36 sm:w-40">Turno</th>
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day, idx) => {
                      const d = new Date(selectedMonday);
                      d.setDate(selectedMonday.getDate() + idx);
                      return (
                        <th key={day} className="py-3 px-2 sm:px-4 font-semibold print:font-bold text-stone-700 print:text-stone-900 text-center">
                          <div>{day}</div>
                          <div className="text-[11px] font-normal print:font-semibold text-stone-400 print:text-stone-600 mt-0.5">
                            {d.getDate()} {monthNames[d.getMonth()].substring(0, 3)}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 print:divide-stone-400">
                  <tr>
                    <td className="py-5 px-4 font-semibold print:font-bold text-stone-600 print:text-stone-900 bg-brand-bgSoft/60 print:bg-stone-100 border-r border-stone-100 print:border-stone-400 text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="flex items-center justify-center gap-1.5 text-stone-700 print:text-stone-900 font-bold w-full">
                          <i className="fa-regular fa-sun text-amber-500 print:text-amber-600 text-sm"></i>
                          <span className="text-xs">Mañana</span>
                          <button onClick={openModal} className="text-stone-400 hover:text-brand-indigo transition no-print ml-1">
                            <i className="fa-solid fa-pencil text-[10px]"></i>
                          </button>
                        </div>
                        <span className="text-[10px] text-stone-500 print:text-stone-700 print:font-bold bg-stone-200/50 print:bg-stone-300 px-2 py-0.5 rounded-full">{morningHours}</span>
                      </div>
                    </td>
                    {morningShift.map((emp, i) => (
                      <td key={i} className="py-4 px-2 sm:px-3 text-center">
                        {renderEmployeeBadge(emp)}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="py-5 px-4 font-semibold print:font-bold text-stone-600 print:text-stone-900 bg-brand-bgSoft/60 print:bg-stone-100 border-r border-stone-100 print:border-stone-400 text-center">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="flex items-center justify-center gap-1.5 text-stone-700 print:text-stone-900 font-bold w-full">
                          <i className="fa-regular fa-moon text-indigo-400 print:text-indigo-600 text-sm"></i>
                          <span className="text-xs">Tarde</span>
                          <button onClick={openModal} className="text-stone-400 hover:text-brand-indigo transition no-print ml-1">
                            <i className="fa-solid fa-pencil text-[10px]"></i>
                          </button>
                        </div>
                        <span className="text-[10px] text-stone-500 print:text-stone-700 print:font-bold bg-stone-200/50 print:bg-stone-300 px-2 py-0.5 rounded-full">{afternoonHours}</span>
                      </div>
                    </td>
                    {afternoonShift.map((emp, i) => (
                      <td key={i} className="py-4 px-2 sm:px-3 text-center">
                        {renderEmployeeBadge(emp)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-md p-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-indigo/20 flex items-center justify-center text-brand-indigoDark">
                  <i className="fa-solid fa-pen text-xs"></i>
                </div>
                <h3 className="font-bold text-stone-800 text-base">Editar Horarios de Trabajo</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-1 rounded-lg transition">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 flex items-center gap-1.5">
                  <i className="fa-regular fa-sun text-amber-500"></i> Turno de la Mañana
                </label>
                <input
                  type="text"
                  value={tempMorning}
                  onChange={(e) => setTempMorning(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-medium focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5 flex items-center gap-1.5">
                  <i className="fa-regular fa-moon text-indigo-400"></i> Turno de la Tarde
                </label>
                <input
                  type="text"
                  value={tempAfternoon}
                  onChange={(e) => setTempAfternoon(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-medium focus:outline-none focus:border-brand-indigo focus:ring-2 focus:ring-brand-indigo/20 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-stone-100">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-full text-xs font-semibold text-stone-500 hover:bg-stone-100 transition">
                Cancelar
              </button>
              <button onClick={saveShiftHours} className="px-5 py-2 rounded-full text-xs font-semibold bg-brand-indigo hover:bg-brand-indigoDark text-white transition shadow-sm">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
