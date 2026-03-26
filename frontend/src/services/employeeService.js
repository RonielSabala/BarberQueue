const mockEmployees = [
  {
    id: 1,
    name: "Juan Valdez",
    email: "juan@email.com",
    phone: "809-111-1111",
    role: "barber",
    address: "Santiago",
    birthDate: "1998-03-12",
    photoUrl: "",
  },
  {
    id: 2,
    name: "María Montez",
    email: "maria@email.com",
    phone: "809-222-2222",
    role: "assistant",
    address: "Santo Domingo",
    birthDate: "1996-07-20",
    photoUrl: "",
  },
];

const mockAssignments = [
  {
    staffId: 1,
    barbershopId: 1,
    startTime: "08:00",
    endTime: "17:00",
  },
  {
    staffId: 2,
    barbershopId: 1,
    startTime: "08:00",
    endTime: "17:00",
  },
];

export async function getEmployees() {
  return Promise.resolve(mockEmployees);
}

export async function createEmployee(employeeData) {
  const newEmployee = {
    id: Date.now(),
    name: employeeData.name,
    email: employeeData.email,
    phone: employeeData.phone,
    role: employeeData.role,
    address: employeeData.address,
    birthDate: employeeData.birthDate,
    photoUrl: employeeData.photoPreview || "",
  };

  mockEmployees.push(newEmployee);

  return Promise.resolve(newEmployee);
}

export async function assignEmployeeToBarbershop({
  staffId,
  barbershopId,
  startTime = "08:00",
  endTime = "17:00",
}) {
  const newAssignment = {
    staffId,
    barbershopId: Number(barbershopId),
    startTime,
    endTime,
  };

  mockAssignments.push(newAssignment);

  return Promise.resolve(newAssignment);
}

export async function createEmployeeWithAssignment(employeeData) {
  const newEmployee = await createEmployee(employeeData);

  const assignment = await assignEmployeeToBarbershop({
    staffId: newEmployee.id,
    barbershopId: employeeData.barbershopId,
  });

  return {
    employee: newEmployee,
    assignment,
  };
}
