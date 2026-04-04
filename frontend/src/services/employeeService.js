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
    throw new Error(
      getErrorMessage(data, "Error al obtener el empleado")
    );
  }

  return data;
}

export async function updateEmployeeAssignment(
  employeeId,
  barbershopId,
  assignmentData
) {
  const response = await fetch(
    `${API_URL}/employees/${employeeId}/barbershop/${barbershopId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: assignmentData.role,
        startTime: assignmentData.startTime,
        endTime: assignmentData.endTime,
        workingDays: assignmentData.workingDays.map(Number),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Error al actualizar el empleado")
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
