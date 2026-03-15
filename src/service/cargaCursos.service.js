const parseCsvLine = (line) => {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }

  result.push(current.trim());
  return result;
};

const parseCsv = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());
  const rows = lines.slice(1).map((line) => parseCsvLine(line));
  return { headers, rows };
};

const readStore = (key) => {
  if (globalThis.window === undefined) return [];
  const raw = globalThis.window.localStorage.getItem(key) || "[]";
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const writeStore = (key, value) => {
  if (globalThis.window === undefined) return;
  globalThis.window.localStorage.setItem(key, JSON.stringify(value));
};

const withId = (items, row) => {
  const maxId = items.reduce((acc, item) => Math.max(acc, Number(item.id || 0)), 0);
  return {
    ...row,
    id: maxId + 1,
  };
};

const importCursos = (parsed) => {
  const required = ["nombre", "código", "carrera", "semestre", "sección", "tipo"];
  const missing = required.filter((field) => !parsed.headers.includes(field));
  if (missing.length > 0) {
    throw new Error(`Encabezados faltantes: ${missing.join(", ")}`);
  }

  const cursos = readStore("demo:cursos");
  const errors = [];
  let imported = 0;

  parsed.rows.forEach((row, index) => {
    const [nombre, codigo, carrera, semestre, seccion, tipo] = row;
    if (!nombre || !codigo || !carrera || !semestre || !tipo) {
      errors.push(`Fila ${index + 2}: campos obligatorios incompletos`);
      return;
    }

    const duplicate = cursos.find((curso) => String(curso.codigo).toUpperCase() === String(codigo).toUpperCase());
    if (duplicate) {
      errors.push(`Fila ${index + 2}: código de curso duplicado (${codigo})`);
      return;
    }

    const payload = withId(cursos, {
      nombre,
      codigo: String(codigo).toUpperCase(),
      carrerasSemestres: [
        {
          carrera,
          semestre: Number(semestre),
          seccion,
          tipo: String(tipo).toUpperCase() === "OBLIGATORIO" ? "OBLIGATORIO" : "OPTATIVO",
        },
      ],
      tipoHorario: "AMBOS",
      tieneLab: false,
      esAreaComun: false,
      periodos: 1,
      usadoEnHorario: false,
    });

    cursos.push(payload);
    imported += 1;
  });

  writeStore("demo:cursos", cursos);
  return { imported, errors };
};

const importSalones = (parsed) => {
  const required = ["nombre del salón", "id"];
  const missing = required.filter((field) => !parsed.headers.includes(field));
  if (missing.length > 0) {
    throw new Error(`Encabezados faltantes: ${missing.join(", ")}`);
  }

  const salones = readStore("demo:salones");
  const errors = [];
  let imported = 0;

  parsed.rows.forEach((row, index) => {
    const [nombre, id] = row;
    if (!nombre || !id) {
      errors.push(`Fila ${index + 2}: nombre o id incompleto`);
      return;
    }

    const duplicate = salones.find((salon) => salon.nombre.toLowerCase() === String(nombre).toLowerCase());
    if (duplicate) {
      errors.push(`Fila ${index + 2}: salón duplicado (${nombre})`);
      return;
    }

    salones.push({
      id: Number(id),
      nombre,
      codigoInterno: `CSV-${id}`,
      tipo: "CURSO",
      capacidad: 40,
      tipoHorario: "AMBOS",
      usadoEnHorario: false,
      ubicacion: "Sin ubicación",
      recursos: "",
      estado: "ACTIVO",
    });
    imported += 1;
  });

  writeStore("demo:salones", salones);
  return { imported, errors };
};

const importDocentes = (parsed) => {
  const required = ["nombre", "registro de personal", "hora de entrada y salida"];
  const missing = required.filter((field) => !parsed.headers.includes(field));
  if (missing.length > 0) {
    throw new Error(`Encabezados faltantes: ${missing.join(", ")}`);
  }

  const docentes = readStore("demo:docentes");
  const errors = [];
  let imported = 0;

  parsed.rows.forEach((row, index) => {
    const [nombre, registroPersonal, horas] = row;
    if (!nombre || !registroPersonal || !horas) {
      errors.push(`Fila ${index + 2}: campos incompletos`);
      return;
    }

    const duplicate = docentes.find(
      (docente) => docente.registroPersonal.toUpperCase() === String(registroPersonal).toUpperCase()
    );
    if (duplicate) {
      errors.push(`Fila ${index + 2}: docente duplicado (${registroPersonal})`);
      return;
    }

    const [horaEntrada, horaSalida] = String(horas).split("-").map((value) => value?.trim());

    docentes.push(
      withId(docentes, {
        nombre,
        registroPersonal: String(registroPersonal).toUpperCase(),
        horaEntrada: horaEntrada || "07:00",
        horaSalida: horaSalida || "13:00",
        cursosPreferidos: [],
      })
    );
    imported += 1;
  });

  writeStore("demo:docentes", docentes);
  return { imported, errors };
};

export const cargaCursosApi = {
  parseCsv,
  importCursos,
  importSalones,
  importDocentes,
};

export default cargaCursosApi;
