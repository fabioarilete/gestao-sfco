import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard, Materials, MaterialsForm, NewCost, Operations, OperationsForm, Products } from '../pages';
import { useSidebarContext } from '../shared/contexts';
import { useEffect } from 'react';

export const AppRoutes = () => {
  const { setSidebarOptions } = useSidebarContext();

  useEffect(() => {
    setSidebarOptions([
      {
        label: 'Home',
        path: '/home',
        icon: 'home',
      },
      {
        label: 'Produtos',
        path: '/products',
        icon: 'inventory',
      },
      {
        label: 'Materiais',
        path: '/materials',
        icon: 'category',
      },
      {
        label: 'Operações',
        path: '/operations',
        icon: 'engineering',
      },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/home" element={<Dashboard />} />
      <Route path="/materials" element={<Materials />} />
      <Route path="/operations" element={<Operations />} />
      <Route path="/products" element={<Products />} />
      <Route path="/materials/detalhe/:id" element={<MaterialsForm />} />
      <Route path="/operations/detalhe/:id" element={<OperationsForm />} />
      <Route path="/costs/detalhe/:id" element={<NewCost />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
