import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  SelectChangeEvent, // Importar o tipo SelectChangeEvent
} from '@mui/material';
import { Controller, FieldValues, Control, Path } from 'react-hook-form';

// Interface para os dados retornados pelo JSON Server
interface SelectOption {
  id: string;
  name: string;
}

// Interface para as props do componente Select
interface SelectOptionsProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  endpoint: string; // Endpoint do JSON Server (ex.: "units", "categories")
  rules?: object; // Regras de validação do react-hook-form
  disabled?: boolean;
  tooltip?: string;
  returnValue?: 'id' | 'name';
  onChange?: (e: SelectChangeEvent<string | number>) => void; // Ajustar o tipo do onChange
}

// Cache para armazenar as opções buscadas
const optionsCache = new Map<string, SelectOption[]>();

export const SelectOptions = <T extends FieldValues>({
  control,
  name,
  label,
  endpoint,
  rules,
  disabled = false,
  tooltip,
  returnValue = 'name',
  onChange,
}: SelectOptionsProps<T>) => {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Buscar os dados do JSON Server
  useEffect(() => {
    const fetchOptions = async () => {
      // Verificar se as opções já estão no cache
      if (optionsCache.has(endpoint)) {
        setOptions(optionsCache.get(endpoint)!);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/${endpoint}`);
        if (!response.ok) throw new Error(`Falha ao buscar ${endpoint}`);
        const data: SelectOption[] = await response.json();
        setOptions(data);
        // Armazenar no cache
        optionsCache.set(endpoint, data);
      } catch (error) {
        console.error(`Erro ao buscar ${endpoint}:`, error);
        setFetchError(`Erro ao carregar ${label.toLowerCase()}. Tente novamente.`);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [endpoint, label]);

  return (
    <div className="tooltip-wrapper">
      <FormControl fullWidth variant="outlined" error={fetchError !== null}>
        <InputLabel id={`${String(name)}-label`}>{label}</InputLabel>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState: { error } }) => (
            <>
              <MuiSelect
                labelId={`${String(name)}-label`}
                label={label}
                {...field}
                disabled={disabled || loading}
                onChange={e => {
                  field.onChange(e); // Atualizar o valor no react-hook-form
                  if (onChange) onChange(e); // Chamar o onChange personalizado
                }}
                value={field.value || ''} // Garantir que o valor inicial seja uma string vazia
              >
                <MenuItem value="">
                  <em>{loading ? 'Carregando...' : `Selecione ${label.toLowerCase()}`}</em>
                </MenuItem>
                {options.map(option => (
                  <MenuItem key={option.id} value={returnValue === 'id' ? option.id : option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </MuiSelect>
              {error && <FormHelperText>{error.message}</FormHelperText>}
              {fetchError && <FormHelperText>{fetchError}</FormHelperText>}
            </>
          )}
        />
      </FormControl>
      {tooltip && <span className="tooltip-text">{tooltip}</span>}
    </div>
  );
};
