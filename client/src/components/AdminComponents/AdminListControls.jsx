import Select from '../ui/Select'
import { ADMIN_PAGE_SIZES } from '../../utils/adminList'

// Sort + "Show N" selects for admin lists. Rendered inside a list's
// .admin-filters row. Changing either value sends the list back to page 1.
export default function AdminListControls({ sortOptions, order, onOrder, pageSize, onPageSize, onPageChange }) {
    return (
        <>
            <Select
                variant='status'
                className='bff-select'
                aria-label='Sort by'
                value={order}
                onChange={(e) => { onOrder(e.target.value); onPageChange(1) }}
            >
                {sortOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </Select>
            <Select
                variant='status'
                className='bff-select'
                aria-label='Results per page'
                value={pageSize}
                onChange={(e) => { onPageSize(Number(e.target.value)); onPageChange(1) }}
            >
                {ADMIN_PAGE_SIZES.map(size => (
                    <option key={size} value={size}>Show {size}</option>
                ))}
            </Select>
        </>
    )
}
