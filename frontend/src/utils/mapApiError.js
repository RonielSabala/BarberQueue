/**
 * Traduce mensajes de error del backend al español.
 * Basado en BarberQueue API Error Reference.
 */

// ── Patrones con variables ─────────────────────────────────────────────────
const PATTERNS = [
  {
    regex: /^'(.+)' length must be >= (\d+) \(got (\d+)\)$/,
    msg: (_, field, min) => `El campo '${field}' es demasiado corto (mínimo ${min} caracteres).`,
  },
  {
    regex: /^'(.+)' length must be <= (\d+) \(got (\d+)\)$/,
    msg: (_, field, max) => `El campo '${field}' es demasiado largo (máximo ${max} caracteres).`,
  },
  {
    regex: /^'(.+)' must be >= (.+) \(got (.+)\)$/,
    msg: (_, field, min) => `El campo '${field}' debe ser mayor o igual a ${min}.`,
  },
  {
    regex: /^'(.+)' must be <= (.+) \(got (.+)\)$/,
    msg: (_, field, max) => `El campo '${field}' debe ser menor o igual a ${max}.`,
  },
  {
    regex: /^'(.+)' must be one of: (.+)$/,
    msg: (_, field, allowed) => `El campo '${field}' debe ser uno de: ${allowed}.`,
  },
  {
    regex: /^'(.+)' must start with a letter or underscore and contain only letters, numbers, underscores or spaces$/,
    msg: (_, field) => `El campo '${field}' debe comenzar con una letra o guion bajo y solo puede contener letras, números, guiones bajos o espacios.`,
  },
  {
    regex: /^'(.+)' must be a valid email/,
    msg: (_, field) => `El campo '${field}' debe ser un correo electrónico válido.`,
  },
  {
    regex: /^'(.+)' must contain exactly 10 digits$/,
    msg: (_, field) => `El campo '${field}' debe contener exactamente 10 dígitos.`,
  },
  {
    regex: /^'(.+)' must be a valid http or https url$/,
    msg: (_, field) => `El campo '${field}' debe ser una URL válida (http o https).`,
  },
  {
    regex: /^'(.+)' must be a valid time/,
    msg: (_, field) => `El campo '${field}' debe ser una hora válida (HH:MM:SS).`,
  },
  {
    regex: /^Field '(.+)' is required$/,
    msg: (_, field) => `El campo '${field}' es requerido.`,
  },
  {
    regex: /^Field '(.+)' cannot be null$/,
    msg: (_, field) => `El campo '${field}' no puede ser nulo.`,
  },
  {
    regex: /^Unexpected field\(s\): (.+)$/,
    msg: (_, fields) => `Campo(s) inesperado(s): ${fields}.`,
  },
  {
    regex: /already has an overlapping schedule on (.+)$/,
    msg: (_, days) => `El empleado ya tiene un horario que se superpone los días: ${days}.`,
  },
];

// ── Mapa exacto ────────────────────────────────────────────────────────────
const ERROR_MAP = {
  // Generic
  "Route not found":              "Ruta no encontrada.",
  "Service unavailable":          "El servicio no está disponible. Intenta más tarde.",
  "An unexpected error occurred": "Ocurrió un error inesperado. Intenta de nuevo.",

  // Field validation
  "At least one field must be provided for update": "Debes proporcionar al menos un campo para actualizar.",

  // Auth
  "Invalid credentials":              "Correo o contraseña incorrectos.",
  "Invalid or expired code":          "El código es inválido o ha expirado.",
  "Current password is incorrect":    "La contraseña actual es incorrecta.",
  "New password must differ from the current one": "La nueva contraseña debe ser diferente a la actual.",
  "Error authenticating with Google": "Error al autenticar con Google. Intenta de nuevo.",
  "Mail could not be sent":           "No se pudo enviar el correo. Intenta más tarde.",

  // Users
  "User not found":        "Usuario no encontrado.",
  "User email already in use": "Este correo ya está registrado.",

  // Employees
  "Employee not found":            "Empleado no encontrado.",
  "Employee assignment not found": "Asignación de empleado no encontrada.",
  "This user is not an employee":  "Este usuario no es un empleado.",
  "Only barbers and assistants can be employees": "Solo barberos y asistentes pueden ser empleados.",
  "Start time must be different from end time":   "La hora de inicio debe ser diferente a la de fin.",
  "Start time must be earlier than end time":     "La hora de inicio debe ser antes que la de fin.",
  "Start time cannot be earlier than the barbershop opening time": "La hora de inicio no puede ser antes de la apertura de la barbería.",
  "End time cannot be later than the barbershop closing time":     "La hora de fin no puede ser después del cierre de la barbería.",
  "Employee is already assigned to this barbershop": "Este empleado ya está asignado a esta barbería.",

  // Clients
  "Client not found in barbershop":         "Cliente no encontrado en la barbería.",
  "The client is not currently checked into any barbershop": "El cliente no está registrado en ninguna barbería.",
  "The client is registered at a different barbershop location": "El cliente ya está registrado en otra barbería.",
  "Client is already active in a barbershop": "El cliente ya está activo en una barbería.",
  "Only clients can check in to a barbershop": "Solo los clientes pueden registrar su llegada.",
  "Only 'at_barbershop' or 'paid' clients can check out": "Solo puedes salir si estás registrado en la barbería o ya pagaste.",
  "Only 'at_barbershop' clients can join to a queue": "Debes registrar tu llegada antes de unirte a una cola.",
  "Only clients can leave reviews to barbers":     "Solo los clientes pueden dejar reseñas a barberos.",
  "Only clients can leave reviews to barbershops": "Solo los clientes pueden dejar reseñas a barberías.",

  // Group members
  "Member turns cannot be paid independently. The group leader must pay": "Los turnos de miembros no se pueden pagar individualmente. El líder del grupo debe pagar.",
  "All group members must have status 'attended' before the group can pay": "Todos los miembros del grupo deben ser atendidos antes de pagar.",

  // Barbers
  "Barber not found":                  "Barbero no encontrado.",
  "Barber not found in this barbershop": "El barbero no está en esta barbería.",
  "Barber review not found":           "Reseña del barbero no encontrada.",
  "This user is not a barber":         "Este usuario no es un barbero.",
  "Barber is not active":              "El barbero no está activo.",
  "Barber is not accepting new clients": "El barbero no está aceptando clientes nuevos.",
  "Cannot change status while there are active turns in your queue": "No puedes cambiar el estado mientras hay turnos activos en tu cola.",

  // Admins
  "Only admins can own barbershops": "Solo los administradores pueden ser dueños de barberías.",

  // Barbershops
  "Barbershop is full":       "La barbería está llena.",
  "Barbershop is not open":   "La barbería no está abierta en este momento.",
  "Barbershop not found":     "Barbería no encontrada.",
  "Barbershop email already in use": "Este correo ya está registrado en otra barbería.",

  // Turns
  "Turn not found":           "Turno no encontrado.",
  "No active turn found for this client":       "No se encontró un turno activo para este cliente.",
  "No active turn found for this group member": "No se encontró un turno activo para este miembro del grupo.",
  "The client currently has no turn despite being in a barbershop": "El cliente está en la barbería pero no tiene turno activo.",
  "Cannot delete a turn that has been completed": "No se puede cancelar un turno que ya fue completado.",
  "Cannot cancel group because service has already started for some members": "No se puede cancelar el grupo porque el servicio ya comenzó para algunos miembros.",
};

/**
 * @param {string} message — mensaje de error del backend
 * @param {string} fallback — mensaje por defecto si no hay traducción
 */
export function mapApiError(message, fallback = "Ocurrió un error. Intenta de nuevo.") {
  if (!message) return fallback;

  // 1. Patrones con variables (tienen prioridad)
  for (const { regex, msg } of PATTERNS) {
    const match = message.match(regex);
    if (match) return msg(...match);
  }

  // 2. Coincidencia exacta
  if (ERROR_MAP[message]) return ERROR_MAP[message];

  // 3. Coincidencia parcial para errores con prefijos conocidos
  for (const [key, val] of Object.entries(ERROR_MAP)) {
    if (!key.includes("{") && message.startsWith(key)) return val;
  }

  return message;
}
