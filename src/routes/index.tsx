import { Navigate, Route, Routes } from 'react-router-dom';
import {
  Dashboard,
  InfoProducts,
  InfoProductsForm,
  MarkUps,
  MarkUpsForm,
  Materials,
  MaterialsForm,
  NewCost,
  Operations,
  OperationsForm,
  Products,
} from '../pages';
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
      {
        label: 'Mark Ups',
        path: '/markUps',
        icon: 'percent',
      },
      {
        label: 'Informações',
        path: '/infoProducts',
        icon: 'info',
      },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/home" element={<Dashboard />} />
      <Route path="/materials" element={<Materials />} />
      <Route path="/operations" element={<Operations />} />
      <Route path="/markUps" element={<MarkUps />} />
      <Route path="/infoProducts" element={<InfoProducts />} />
      <Route path="/products" element={<Products />} />
      <Route path="/materials/detalhe/:id" element={<MaterialsForm />} />
      <Route path="/operations/detalhe/:id" element={<OperationsForm />} />
      <Route path="/markUps/detalhe/:id" element={<MarkUpsForm />} />
      <Route path="/infoProducts/detalhe/:id" element={<InfoProductsForm />} />
      <Route path="/costs/detalhe/:id" element={<NewCost />} />
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
};
