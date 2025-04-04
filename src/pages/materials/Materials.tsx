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
import { IMaterialsList, MaterialsService } from './MaterialsService';
import { LayoutBase } from '../../shared/layouts';
import { ToolBarSearch } from '../../shared/components';
import formatCurrency from '../../shared/utils/formatCurrency';

export const Materials: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IMaterialsList[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const busca = useMemo(() => {
    return searchParams.get('busca') || '';
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina') || '1');
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);

    debounce(() => {
      MaterialsService.getAll(pagina, busca).then(res => {
        setIsLoading(false);
        console.log(res);

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
      MaterialsService.deleteById(id).then(res => {
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
      titulo="Materiais"
      toolBar={
        <ToolBarSearch
          showInput={true}
          searchText={busca}
          textNewButton="Novo"
          clickingNewButton={() => navigate('/materials/detalhe/novo')}
          changingText={texto => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: 'indigo' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }} align="center">
                Descrição do Material
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Preço
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Unidade
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.name.toUpperCase()}</TableCell>
                <TableCell align="right" sx={{ paddingRight: 4 }}>
                  {formatCurrency(row.price, 'BRL')}
                </TableCell>
                <TableCell align="center">{row.unit}</TableCell>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center">
                    <Button sx={{ color: 'red' }} onClick={() => handleDelete(row.id)}>
                      Apagar
                    </Button>
                    <Button
                      sx={{ color: 'green' }}
                      onClick={() => navigate(`/materials/detalhe/${row.id}`)}
                    >
                      Editar
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
