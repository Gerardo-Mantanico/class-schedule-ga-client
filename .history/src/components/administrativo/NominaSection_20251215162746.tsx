import React from 'react';
import Button from '@/components/ui/button/Button';

interface NominaItem {
  id: number | string;
  tipoDescripcion: string;
  monto: number;
}

interface NominaSectionProps {
  title: string;
  icon: React.ReactNode;
  items: NominaItem[];
  colorClass: string;
  itemColorClass: string;
  emptyMessage: string;
  onItemAdd?: () => void;
  onItemDelete?: (id: number | string) => Promise<void>;
  opLoading?: boolean;
}

export const NominaSection: React.FC<NominaSectionProps> = ({
  title,
  icon,
  items,
  colorClass,
  itemColorClass,
  emptyMessage,
  onItemAdd,
  onItemDelete,
  opLoading,
}) => {
  return (
    <div className={`${colorClass} rounded-xl shadow p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        {onItemAdd && (
          <Button
            size="sm"
            variant="outline"
            onClick={onItemAdd}
            disabled={opLoading}
            className="text-blue-600"
          >
            +
          </Button>
        )}
      </div>

      {items?.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`${itemColorClass} rounded-xl p-3 flex justify-between items-center`}
            >
              <div>
                <p className="font-medium">{item.tipoDescripcion}</p>
                <p>GTQ {Number(item.monto).toFixed(2)}</p>
              </div>
              {onItemDelete && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600"
                  onClick={() => onItemDelete(item.id)}
                  disabled={opLoading}
                >
                  -
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm">{emptyMessage}</p>
      )}
    </div>
  );
};
