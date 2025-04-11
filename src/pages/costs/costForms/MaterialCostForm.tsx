import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Box, TextField, MenuItem, Button } from '@mui/material';
import { CostMaterial, ICost } from '../CostService';
import { IMaterial } from '../../materials/MaterialsService';
import { Api } from '../../../shared/services/api/axios-config';
import { v4 } from 'uuid';
import formatCurrency from '../../../shared/utils/formatCurrency';

interface Props {
  material?: CostMaterial;
  cost: ICost;
  setCost: React.Dispatch<React.SetStateAction<ICost>>;
  onCloseModal: () => void;
  removeMaterial(materialId: string): void;
  handleSubmit(cost: ICost): void;
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
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | undefined>(material?.id);
  const [qt, setQt] = useState<string>(material?.qt || '');
  const [obs, setObs] = useState<string>(material?.obs || '');

  useEffect(() => {
    setLoading(true);
    Api.get('materials')
      .then(res => {
        setMaterials(res.data);
        setLoading(false);
        if (material?.id && res.data.some(item => item.id === material.id)) {
          setSelectedMaterialId(material.id);
        }
      })
      .catch(err => {
        console.log(err);
        setError('Erro ao carregar materiais.');
        setLoading(false);
      });
  }, [material?.id]);

  const selectedMaterial = useMemo((): IMaterial | null => {
    if (!selectedMaterialId) return null;
    return materials.find(item => item.id === selectedMaterialId) || null;
  }, [selectedMaterialId, materials]);

  function handleSubmit(e: any) {
    e.preventDefault();
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
      qt,
      obs,
      uuid: v4(),
      name: selectedMaterial.name ?? 'Material sem nome',
      price: selectedMaterial.price ?? 0,
      unit: selectedMaterial.unit ?? 'unidade padrão',
    };
    setCost(state => ({
      ...state,
      materialsProduct: material
        ? state.materialsProduct.map(m => (m.id === material.id ? newMaterial : m))
        : [...state.materialsProduct, newMaterial],
    }));
    if (!material) {
      setObs('');
      setQt('');
      setSelectedMaterialId(undefined);
    }
    onCloseModal();
  }

  if (loading)
    return (
      <Typography sx={{ textAlign: 'center', py: 3, color: 'grey.600' }}>Carregando...</Typography>
    );
  if (error)
    return (
      <Typography sx={{ textAlign: 'center', py: 3, color: 'error.main' }}>{error}</Typography>
    );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Adicione um material ao Custo
      </Typography>
      <form id="material-form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              label="Materiais"
              value={selectedMaterialId || ''}
              onChange={e => setSelectedMaterialId(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">Selecione um material</MenuItem>
              {materials.map(material => (
                <MenuItem key={material.id} value={material.id}>
                  {material.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#f5f5f5',
                p: 1,
                borderRadius: 1,
              }}
            >
              <Typography sx={{ color: 'grey.700', fontSize: '14px' }}>
                Preço do {selectedMaterial?.unit || 'item'}
              </Typography>
              <Typography
                sx={{
                  color: 'primary.main',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                {selectedMaterial ? formatCurrency(selectedMaterial.price, 'BRL') : ''}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observação"
              name="obs"
              value={obs}
              onChange={e => setObs(e.currentTarget.value.toUpperCase())}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Quantidade"
              name="qt"
              type="number"
              value={qt}
              onChange={e => setQt(e.currentTarget.value)}
              inputProps={{ min: 0 }}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => handleSubmit}
            type="submit"
            variant="contained"
            color="primary"
            form="material-form"
          >
            Salvar
          </Button>
          <Button variant="outlined" color="secondary" onClick={onCloseModal} sx={{ ml: 1 }}>
            Cancelar
          </Button>
        </Box>
      </form>
    </Box>
  );
};
