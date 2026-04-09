import { getEmployeeById } from "../services/employeeService";

function getTodayWorkingDay() {
  const jsDay = new Date().getDay(); // 0 domingo, 1 lunes, ..., 6 sábado
  return jsDay === 0 ? 7 : jsDay; // convertimos domingo a 7
}

export async function getAssignedBarbershopId(userId) {
  if (!userId) return null;

  try {
    const employee = await getEmployeeById(userId);
    const assignments = employee?.assignments || [];

    if (!assignments.length) return null;

    const today = getTodayWorkingDay();

    const todaysAssignment = assignments.find((assignment) =>
      Array.isArray(assignment.workingDays) &&
      assignment.workingDays.includes(today)
    );

    return todaysAssignment?.barbershopId || assignments[0]?.barbershopId || null;
  } catch (error) {
    console.error("Error al obtener barbería asignada del assistant:", error);
    return null;
  }
}
