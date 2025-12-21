"use client";


import type { AntecedentesFamiliares } from "@/interfaces/historiaClinica/AntecedentesFamiliares";

interface AntecedentesFamiliaresProps {
  estructuraFamiliar?: string;
  hayTrastornosFamiliares?: boolean;
  detallesTrastornosFamiliares?: string;
  eventosFamiliaresRelevantes?: string;
  onChange?: (data: AntecedentesFamiliaresData) => void;
  disabled?: boolean;
}

// Adaptar la interfaz para el formulario local
type AntecedentesFamiliaresData = {
  estructuraFamiliar: string;
  hayTrastornosFamiliares: boolean;
  detallesTrastornosFamiliares: string;
  eventosFamiliaresRelevantes: string;
};

export default function AntecedentesFamiliares({
  estructuraFamiliar = "",
  hayTrastornosFamiliares = false,
  detallesTrastornosFamiliares = "",
  eventosFamiliaresRelevantes = "",
  onChange,
  disabled = false,
}: AntecedentesFamiliaresProps) {
  const [formData, setFormData] = useState<AntecedentesFamiliaresData>({
    estructuraFamiliar,
    hayTrastornosFamiliares,
    detallesTrastornosFamiliares,
    eventosFamiliaresRelevantes,
  });

  // Notificar cambios al componente padre
  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleInputChange = (
    field: keyof AntecedentesFamiliaresData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      hayTrastornosFamiliares: checked,
      // Limpiar el detalle si se desmarca el checkbox
      detallesTrastornosFamiliares: checked
        ? prev.detallesTrastornosFamiliares
        : "",
    }));
  };

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        Antecedentes Familiares
      </h2>

      <div className="space-y-6">
        {/* Estructura Familiar Actual */}
        <div>
          <Label htmlFor="estructuraFamiliar">
            Estructura Familiar Actual
          </Label>
          <TextArea
            id="estructuraFamiliar"
            name="estructuraFamiliar"
            placeholder="Describa la estructura familiar actual (miembros del núcleo familiar, dinámica familiar, etc.)"
            value={formData.estructuraFamiliar}
            onChange={(e) =>
              handleInputChange("estructuraFamiliar", e.target.value)
            }
            disabled={disabled}
            className="max-w-full"
            rows={5}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Incluya información sobre miembros de la familia, relaciones y
            dinámica familiar
          </p>
        </div>

        {/* Historia de Trastornos Familiares */}
        <div>
          <Label>Historia de Trastornos Familiares</Label>

          <div className="mt-3">
            <Checkbox
              id="hayTrastornosFamiliares"
              name="hayTrastornosFamiliares"
              label="¿Hay antecedentes de trastornos mentales o enfermedades relevantes en la familia?"
              checked={formData.hayTrastornosFamiliares}
              onChange={(e) => handleCheckboxChange(e.target.checked)}
              disabled={disabled}
            />
          </div>

          {/* TextArea condicional - se muestra solo si está marcado el checkbox */}
          {formData.hayTrastornosFamiliares && (
            <div className="mt-4">
              <Label htmlFor="detallesTrastornosFamiliares">
                Detalles de los Antecedentes
              </Label>
              <TextArea
                id="detallesTrastornosFamiliares"
                name="detallesTrastornosFamiliares"
                placeholder="Describa los antecedentes de trastornos mentales o enfermedades en la familia (tipo de trastorno, familiar afectado, tratamiento recibido, etc.)"
                value={formData.detallesTrastornosFamiliares}
                onChange={(e) =>
                  handleInputChange(
                    "detallesTrastornosFamiliares",
                    e.target.value
                  )
                }
                disabled={disabled}
                className="max-w-full"
                rows={5}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Especifique el tipo de trastorno, qué familiar lo padece, y
                cualquier tratamiento recibido
              </p>
            </div>
          )}
        </div>

        {/* Eventos Familiares Relevantes */}
        <div>
          <Label htmlFor="eventosFamiliaresRelevantes">
            Eventos Familiares Relevantes
          </Label>
          <TextArea
            id="eventosFamiliaresRelevantes"
            name="eventosFamiliaresRelevantes"
            placeholder="Describa eventos familiares significativos que puedan ser relevantes (pérdidas, divorcios, migraciones, traumas, logros importantes, etc.)"
            value={formData.eventosFamiliaresRelevantes}
            onChange={(e) =>
              handleInputChange("eventosFamiliaresRelevantes", e.target.value)
            }
            disabled={disabled}
            className="max-w-full"
            rows={5}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Incluya cualquier evento familiar que haya tenido un impacto
            significativo en el paciente
          </p>
        </div>
      </div>
    </div>
  );
}
