import API_URL from "./api";

function getErrorMessage(data, defaultMessage) {
  return data?.message || data?.error || data?.details || defaultMessage;
}

export async function getEmployeeById(employeeId) {
  const response = await fetch(`${API_URL}/employees/${employeeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al obtener el empleado"));
  }

  return data;
}

export async function getAllEmployees() {
  // El backend no tiene GET /api/employees.
  // Se obtienen barbers y assistants desde /api/users?role=
  const [barbersRes, assistantsRes] = await Promise.all([
    fetch(`${API_URL}/users?role=barber`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }),
    fetch(`${API_URL}/users?role=assistant`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }),
  ]);

  const [barbersData, assistantsData] = await Promise.all([
    barbersRes.json(),
    assistantsRes.json(),
  ]);

  if (!barbersRes.ok) {
    throw new Error(getErrorMessage(barbersData, "Error al obtener los barberos"));
  }
  if (!assistantsRes.ok) {
    throw new Error(getErrorMessage(assistantsData, "Error al obtener los asistentes"));
  }

  const barbers = Array.isArray(barbersData) ? barbersData : [];
  const assistants = Array.isArray(assistantsData) ? assistantsData : [];

  return [...barbers, ...assistants];
}

export async function updateEmployeeAssignment(
  employeeId,
  barbershopId,
  assignmentData
) {
  const formatTime = (time) => {
    if (!time) return time;
    return time.length === 5 ? `${time}:00` : time;
  };

  const response = await fetch(
    `${API_URL}/employees/${employeeId}/barbershop/${barbershopId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: assignmentData.role,
        startTime: formatTime(assignmentData.startTime),
        endTime: formatTime(assignmentData.endTime),
        workingDays: assignmentData.workingDays.map(Number),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Error al actualizar el empleado"));
  }

  return data;
}

export async function assignExistingEmployee(
  barbershopId,
  employeeId,
  scheduleData
) {
  const formatTime = (time) => {
    if (!time) return time;
    return time.length === 5 ? `${time}:00` : time;
  };

  const response = await fetch(
    `${API_URL}/barbershops/${barbershopId}/employees/${employeeId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startTime: formatTime(scheduleData.startTime),
        endTime: formatTime(scheduleData.endTime),
        workingDays: scheduleData.workingDays.map(Number),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al asignar el empleado a la barbería")
    );
  }

  return data;
}

export async function deleteEmployeePermanently(employeeId) {
  const response = await fetch(`${API_URL}/employees/${employeeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    throw new Error(
      getErrorMessage(data, "Error al eliminar el empleado del sistema")
    );
  }

  return true;
}
