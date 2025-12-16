"use client";

import React, { useState, useEffect } from "react";
import SearchableSelect from "@/components/form/SearchableSelect";
import { useUser } from "@/hooks/useUser";

export default function EmployeeSearchExample() {
  const { users, fetchUsers } = useUser();
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // Transformar usuarios a opciones para el select
  const userOptions = users.map((user) => ({
    value: String(user.id),
    label: `${user.firstname} ${user.lastname}`,
    searchText: `DPI: ${user.dpi || 'N/A'} - Email: ${user.email}`, // Información adicional para búsqueda
  }));

  return (
    <div className="p-6">
      <SearchableSelect
        label="Seleccionar Empleado"
        options={userOptions}
        placeholder="Buscar por nombre, DPI o email..."
        searchPlaceholder="Escribe para buscar..."
        value={selectedUserId}
        onChange={(value) => setSelectedUserId(value)}
      />

      {selectedUserId && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Usuario seleccionado ID: {selectedUserId}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Nombre: {users.find((u) => String(u.id) === selectedUserId)?.firstname}{" "}
            {users.find((u) => String(u.id) === selectedUserId)?.lastname}
          </p>
        </div>
      )}
    </div>
  );
}
