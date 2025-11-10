import { ColumnDef } from '@tanstack/react-table';
import Icons from 'src/assets/icons';
import Checkbox from 'src/components/checkbox';
import styles from 'src/features/workspace-members-table/Columns.module.css';

const createColumns = <T extends string>({ columns }: { columns: T[]}): ColumnDef<Record<T, string>>[] => {
  type RowType = Record<T, string>;

  const tableColumns: ColumnDef<RowType>[] = [];

  tableColumns.push({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? 'indeterminate'
            : false
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(value === true)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(value === true)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  });

  for (const column of columns) {
    tableColumns.push({
      id: column,
      accessorKey: column,
      header: ({ column }) => (
        <button
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
          className={styles.headerButton}
        >
          {column.id} 
          <Icons.ChevronUpDown
            style={{
              width: '1rem',
              height: '1rem',
              marginLeft: '0.5rem',
              opacity: '50%',
            }}
          />
        </button>
      ),
    });
  }

  return tableColumns;
};

export default createColumns;