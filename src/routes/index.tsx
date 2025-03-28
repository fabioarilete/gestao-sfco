import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard, Materials, MaterialsForm } from '../pages';
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
      <Route path="/materials/detalhe/:id" element={<MaterialsForm />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
