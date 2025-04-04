import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { CostMaterial, ICost } from '../CostService';
import { Input, SelectOptions } from '../../../shared/components';
import { IMaterial } from '../../materials/MaterialsService';
import { Api } from '../../../shared/services/api/axios-config';
import { v4 } from 'uuid';
import formatCurrency from '../../../shared/utils/formatCurrency';

interface Props {
  material?: CostMaterial;
  cost: ICost;
  setCost: React.Dispatch<React.SetStateAction<ICost>>;
  onCloseModal: () => void; // Função para fechar o modal
  removeMaterial(materialId: string): void;
}

export const MaterialCostForm = ({
  material,
  cost,
  setCost,
  onCloseModal,
  removeMaterial,
}: Props) => {
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMaterialId, setSelectMaterialId] = useState<string | undefined>(material?.id);
  const [qt, setQt] = useState<string>(material?.qt || '');
  const [obs, setObs] = useState<string>(material?.obs || '');

  useEffect(() => {
    setLoading(true);
    Api.get('materials')
      .then(res => {
        setMaterials(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError('Erro ao carregar materiais.');
        setLoading(false);
      });
  }, []);

  const selectedMaterial = useMemo((): IMaterial | null => {
    if (!selectedMaterialId) return null;
    return materials.find(item => item.id === selectedMaterialId) || null;
  }, [selectedMaterialId, materials]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedMaterialId) {
      alert('Por favor, selecione um material.');
      return;
    }

    const quantity = Number(qt);
    if (isNaN(quantity) || quantity <= 0) {
      alert('A quantidade deve ser um número válido e maior que zero.');
      return;
    }

    if (!selectedMaterial) {
      alert('Material selecionado não encontrado.');
      return;
    }

    const totalItemMaterial = quantity * selectedMaterial.price;

    const newMaterial: CostMaterial = {
      ...selectedMaterial,
      totalItemMaterial,
      qt, // Mantém como string para compatibilidade
      obs,
      id: material?.id || v4(),
      name: selectedMaterial.name ?? 'Material sem nome',
      price: selectedMaterial.price ?? 0,
      unit: selectedMaterial.unit ?? 'unidade padrão',
    };

    setCost(state => ({
      ...state,
      materialsProduct: material
        ? state.materialsProduct.map(m => (m.id === material.id ? newMaterial : m)) // Edição
        : [...state.materialsProduct, newMaterial], // Adição
    }));

    // Reseta os campos apenas em caso de adição
    if (!material) {
      setObs('');
      setQt('');
      setSelectMaterialId(undefined);
    }

    onCloseModal(); // Fecha o modal após submissão bem-sucedida
  };

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography>{error}</Typography>;

  return (
    <form id="material-form" onSubmit={handleSubmit}>
      <Grid container spacing={2} display="flex" flexDirection="column">
        <Grid>
          <SelectOptions
            value={selectedMaterialId || ''}
            onChange={e => setSelectMaterialId(e.target.value || undefined)}
            label="Matéria Prima"
          >
            <option value="">Selecione um material</option>
            {materials.map(item => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </SelectOptions>
        </Grid>
        <Grid>
          <Box display="flex" justifyContent="center">
            <Typography>Preço do {selectedMaterial?.unit || 'item'}.....</Typography>
            {selectedMaterial ? formatCurrency(selectedMaterial.price, 'BRL') : 'N/A'}
          </Box>
        </Grid>
        <Grid>
          <Input
            type="text"
            value={obs}
            label="Observação"
            name="obs"
            placeholder="Faça uma observação"
            onChange={e => setObs(e.currentTarget.value.toUpperCase())}
          />
        </Grid>
        <Grid>
          <Input
            type="number"
            value={qt}
            label="Quantidade"
            name="qt"
            placeholder="Informe a quantidade"
            min="0"
            onChange={e => setQt(e.currentTarget.value)}
          />
        </Grid>
      </Grid>
    </form>
  );
};
