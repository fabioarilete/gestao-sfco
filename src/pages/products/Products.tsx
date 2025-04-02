import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from '../../shared/hooks';
import {
  Box,
  Button,
  LinearProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from '@mui/material';
import { Environment } from '../../shared/environments';
import { LayoutBase } from '../../shared/layouts';
import { ToolBarSearch } from '../../shared/components';
import { IProductsList, ProductsService } from './ProductsService';
import { MdDeleteForever } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IProductsList[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      ProductsService.getAll(pagina, busca).then(res => {
        setIsLoading(false);

        if (res instanceof Error) {
          alert(res.message);
        } else {
          console.log(res);
          setTotalCount(res.totalCount);
          setRows(res.data);
        }
      });
    });
  }, [busca, pagina]);

  const handleDelete = (id: string) => {
    if (confirm('Realmente deseja apagar esse registro?')) {
      ProductsService.deleteById(id).then(res => {
        if (res instanceof Error) {
          alert(res.message);
        } else {
          setRows(oldRows => {
            return [...oldRows.filter(oldRow => oldRow.id !== id)];
          });
          alert('Registro apagado com sucesso!');
        }
      });
    }
  };

  return (
    <LayoutBase
      titulo="Produtos"
      toolBar={
        <ToolBarSearch
          showInput={true}
          searchText={busca}
          textNewButton="Novo"
          clickingNewButton={() => navigate('/costs/detalhe/novo')}
          changingText={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Cód</TableCell>
              <TableCell align="center">Descrição do Produto</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.cod}</TableCell>
                <TableCell>{row.name.toUpperCase()}</TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center">
                    <Button
                      title="Apagar o produto"
                      sx={{ color: 'red' }}
                      onClick={() => handleDelete(row.id)}
                    >
                      <MdDeleteForever />
                    </Button>
                    <Button
                      title="Editar o produto"
                      sx={{ color: 'green' }}
                      onClick={() => navigate(`/products/detalhe/${row.id}`)}
                    >
                      <FaEdit />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          {totalCount == 0 && !isLoading && <caption>{Environment.LISTAGEM_VAZIA}</caption>}

          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress variant="indeterminate" />
                </TableCell>
              </TableRow>
            )}
            {totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Pagination
                    page={pagina}
                    onChange={(_, newPage) =>
                      setSearchParams({ busca, pagina: newPage.toString() }, { replace: true })
                    }
                    count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableFooter>
        </Table>
      </TableContainer>
    </LayoutBase>
  );
};
