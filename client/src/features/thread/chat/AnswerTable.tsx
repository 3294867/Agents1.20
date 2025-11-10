import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender
} from '@tanstack/react-table';
import utils from 'src/utils';
import Table from 'src/components/table';
import Button from 'src/components/button';
import Dropdown from 'src/components/dropdown';
import Icons from 'src/assets/icons';
import constants from 'src/constants';

interface Props<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const AnswerTable = <TData, TValue>({ columns, data }: Props<TData, TValue>) => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Table.Root>
      {table.getHeaderGroups().map((headerGroup) => (
        <Table.Header key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <Table.Head key={header.id}>
              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
            </Table.Head>
          ))}
        </Table.Header>
      ))}
      <Table.Body>
        {table.getRowModel().rows.map((row) => (
          <Table.Row key={row.id} data-state={row.getIsSelected() && 'selected'}>
            {row.getVisibleCells().map((cell) => {
              const buttonBackgroundColor = cell.getValue() === 'admin'
                ? 'orange'
                : cell.getValue() === 'editor'
                ? 'blue'
                : 'green';
              
              return cell.column.id === 'member_role'
                ? (
                  <Table.Cell key={cell.id}>
                    <Dropdown.Root >
                      <Dropdown.Trigger asChild>
                        <Button style={{
                          width: '5rem',
                          backgroundColor: buttonBackgroundColor || ''
                        }}>
                          {utils.capitalizeFirstLetter(cell.getValue() as string)}
                          <Icons.ChevronDown style={{ marginLeft: '0.5rem', marginRight: '-0.5rem' }} />
                        </Button>
                      </Dropdown.Trigger>
                      <Dropdown.Content sideOffset={8} align='end'>
                        {constants.userRoles
                          .filter(i => i !== utils.capitalizeFirstLetter(cell.getValue() as string))
                          .map(i => (
                            <Button
                              key={i}
                              onClick={() => {}}
                              variant='dropdown'
                              style={{ width: '4.5rem' }}
                            >
                              {utils.capitalizeFirstLetter(i)}
                            </Button>
                          ))
                        }
                      </Dropdown.Content>
                    </Dropdown.Root>
                  </Table.Cell>
                ) : (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ); 
            })}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
AnswerTable.displayName = 'WorkspaceMembersTable';

export default AnswerTable;
