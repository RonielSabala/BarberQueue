import { getEmployeeById } from "../services/employeeService";
import { getBarbershopById } from "../services/barbershopService";

function getTodayWorkingDay() {
  const jsDay = new Date().getDay(); // 0=domingo, 1=lunes...6=sábado
  return jsDay === 0 ? 7 : jsDay;
}

function getCurrentTimeMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function timeToMinutes(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Devuelve la lista de barberías donde trabaja el empleado,
 * enriquecida con info de la barbería y si puede trabajar ahora.
 *
 * @param {number} userId
 * @returns {Promise<Array>}
 */
export async function getMyBarbershops(userId) {
  if (!userId) return [];

  const employee = await getEmployeeById(userId);
  const assignments = employee?.assignments || [];

  if (!assignments.length) return [];

  const today = getTodayWorkingDay();
  const nowMinutes = getCurrentTimeMinutes();

  // Enriquecer cada assignment con los datos de la barbería
  const results = await Promise.allSettled(
    assignments.map(async (assignment) => {
      let shop = null;
      try {
        shop = await getBarbershopById(assignment.barbershopId);
      } catch {
        shop = null;
      }

      const worksToday = Array.isArray(assignment.workingDays)
        ? assignment.workingDays.includes(today)
        : false;

      const startMinutes = timeToMinutes(assignment.startTime);
      const endMinutes = timeToMinutes(assignment.endTime);
      const inShift =
        worksToday &&
        startMinutes !== null &&
        endMinutes !== null &&
        nowMinutes >= startMinutes &&
        nowMinutes <= endMinutes;

      const barbershopOpen = shop?.isActive ?? shop?.open ?? false;

      // Puede trabajar solo si: barbería abierta + hoy trabaja + en su horario
      const canWork = barbershopOpen && inShift;

      return {
        barbershopId: assignment.barbershopId,
        name: shop?.name || shop?.barbershopName || `Barbería #${assignment.barbershopId}`,
        address: shop?.address || shop?.barbershopAddress || "",
        image: shop?.image || shop?.photoUrl || null,
        rating: shop?.rating ?? shop?.averageRating ?? null,
        isOpen: barbershopOpen,
        worksToday,
        inShift,
        canWork,
        startTime: assignment.startTime,
        endTime: assignment.endTime,
        workingDays: assignment.workingDays,
        role: assignment.role,
      };
    })
  );

  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);
}
