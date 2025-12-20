export interface Paciente {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
}

export interface Medico {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
}

export interface ServicioMedico {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cita {
  id: number;
  historiaClinicaId: number;
  paciente: Paciente;
  medico: Medico;
  servicioMedico: ServicioMedico;
  fechaCita: string;
  estadoCita: "PROGRAMADA" | "CANCELADA" | "REALIZADA" | string;
  nota: string;
  createdAt: string;
}
