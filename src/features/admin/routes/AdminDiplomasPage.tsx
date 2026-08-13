import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, MoreHorizontal, Plus } from 'lucide-react';
import { useAdminDiplomas } from '../hooks/useAdminDiplomas';
import { useDeleteDiploma } from '../hooks/useAdminDiplomaMutations';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { DiplomaActionDropdown } from '../components/DiplomaActionDropdown';
import { DiplomaSortDropdown } from '../components/DiplomaSortDropdown';
import slidersIcon from '../../../lucideAdmin/sliders-horizontal.svg';
import hideIcon from '../../../lucideAdmin/Hide.svg';
import chevronsUpDown from '../../../lucideAdmin/chevrons-up-down.svg';
import type { Diploma } from '@/features/diplomas/types/diploma.types';
import type { DiplomasParams } from '@/features/diplomas/apis/diplomas.api';

type ImmutableFilter = 'all' | 'true' | 'false';

export function AdminDiplomasPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [immutableFilter, setImmutableFilter] = useState<ImmutableFilter>('all');
    const [appliedImmutableFilter, setAppliedImmutableFilter] = useState<ImmutableFilter>('all');
    const [sortBy, setSortBy] = useState<'title' | 'createdAt' | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [actionDropdownId, setActionDropdownId] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; diploma?: Diploma }>({ open: false });

    const deleteMutation = useDeleteDiploma();

    const params: DiplomasParams = {
        page,
        limit: 20,
        ...(appliedSearch && { search: appliedSearch }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
        ...(appliedImmutableFilter !== 'all' && { immutable: appliedImmutableFilter === 'true' }),
    };

    const { data, isLoading, isError, refetch } = useAdminDiplomas(params);
    const diplomas = data?.data ?? [];
    const metadata = data?.metadata;
    const totalPages = metadata?.totalPages ?? 1;
    const total = metadata?.total ?? 0;
    const startItem = total > 0 ? (page - 1) * 20 + 1 : 0;
    const endItem = Math.min(page * 20, total);

    const handleApplyFilters = useCallback(() => {
        setAppliedSearch(search);
        setAppliedImmutableFilter(immutableFilter);
        setPage(1);
    }, [search, immutableFilter]);

    const handleClearFilters = useCallback(() => {
        setSearch('');
        setAppliedSearch('');
        setImmutableFilter('all');
        setAppliedImmutableFilter('all');
        setPage(1);
    }, []);

    const handleSort = (sb: 'title' | 'createdAt', so: 'asc' | 'desc') => {
        setSortBy(sb);
        setSortOrder(so);
        setSortDropdownOpen(false);
        setPage(1);
    };

    const handleDelete = () => {
        if (!deleteModal.diploma) return;
        deleteMutation.mutate(deleteModal.diploma.id, {
            onSuccess: () => setDeleteModal({ open: false }),
        });
    };

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="px-4 py-3">
                <p className="font-[Geist_Mono] text-base text-gray-400">Diplomas</p>
            </div>

            {/* Pagination + Add New Diploma */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                    <span className="font-[Geist_Mono] text-sm text-gray-600">
                        {total > 0 ? `${startItem} - ${endItem} of ${total}` : '0 results'}
                    </span>
                    <div className="flex items-center">
                        <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="flex h-[30px] w-[30px] items-center justify-center border border-gray-300 bg-gray-100 text-gray-600 disabled:opacity-40">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="flex h-[30px] items-center border-y border-gray-300 bg-gray-100 px-3 font-[Geist_Mono] text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="flex h-[30px] w-[30px] items-center justify-center border border-gray-300 bg-gray-100 text-gray-600 disabled:opacity-40">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <button type="button" onClick={() => navigate('/admin/diplomas/new')} className="flex h-[40px] items-center gap-2 bg-[#00BC7D] px-4 font-[Geist_Mono] text-sm font-medium text-white hover:bg-[#00a86f]">
                    <Plus className="h-4 w-4" />
                    Add New Diploma
                </button>
            </div>

            {/* Search & Filters */}
            <div>
                <button type="button" onClick={() => setFiltersVisible(!filtersVisible)} className="flex h-[40px] w-full items-center justify-between bg-[#155DFC] px-[10px]">
                    <span className="flex items-center gap-2 font-[Geist_Mono] text-sm font-medium text-white">
                        <img src={slidersIcon} alt="" className="h-5 w-5" />
                        Search & Filters
                    </span>
                    {filtersVisible
                        ? <img src={hideIcon} alt="Hide" className="h-[17px]" />
                        : <span className="font-[Geist_Mono] text-sm text-white">Show</span>
                    }
                </button>
                {filtersVisible && (
                    <div className="flex flex-col gap-3 bg-white px-4 py-4">
                        <div className="relative">
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters(); }} placeholder="Search by title" className="h-[46px] w-full border border-[#E5E7EB] bg-white px-[10px] font-[Geist_Mono] text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none" />
                            <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="relative w-[326px]">
                            <select value={immutableFilter} onChange={(e) => setImmutableFilter(e.target.value as ImmutableFilter)} className="h-[46px] w-full appearance-none border border-[#E5E7EB] bg-white py-[10px] pr-[40px] pl-[10px] font-[Geist_Mono] text-sm text-gray-500 focus:border-blue-500 focus:outline-none">
                                <option value="all">Immutability</option>
                                <option value="true">Immutable</option>
                                <option value="false">Mutable</option>
                            </select>
                            <img src={chevronsUpDown} alt="" className="pointer-events-none absolute top-1/2 right-[10px] h-5 w-5 -translate-y-1/2" />
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <button type="button" onClick={handleClearFilters} className="px-4 py-2 font-[Geist_Mono] text-sm text-gray-600 hover:text-gray-800">Clear</button>
                            <button type="button" onClick={handleApplyFilters} className="flex h-[36px] w-[100px] items-center justify-center border border-[#E5E7EB] bg-[#E5E7EB] font-[Geist_Mono] text-sm font-medium text-gray-700 hover:bg-gray-300">Apply</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Table header — blue */}
            <div className="grid grid-cols-[90px_1fr_2fr_80px] items-center bg-[#155DFC] px-[10px] py-2">
                <span className="font-[Geist_Mono] text-xs font-semibold text-white">Image</span>
                <span className="font-[Geist_Mono] text-xs font-semibold text-white">Title</span>
                <span className="font-[Geist_Mono] text-xs font-semibold text-white">Description</span>
                <DiplomaSortDropdown activeSortBy={sortBy} activeSortOrder={sortOrder} onSort={handleSort} open={sortDropdownOpen} onToggle={() => setSortDropdownOpen(!sortDropdownOpen)} />
            </div>

            {/* Table body */}
            <div className="bg-white">
                {isLoading && <div className="flex items-center justify-center py-20"><div className="h-6 w-6 animate-spin border-2 border-gray-300 border-t-[#155DFC]" /></div>}
                {isError && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="font-[Geist_Mono] text-sm text-gray-600">Something went wrong.</p>
                        <button type="button" onClick={() => refetch()} className="mt-3 bg-[#155DFC] px-4 py-2 font-[Geist_Mono] text-sm text-white hover:bg-blue-700">Try Again</button>
                    </div>
                )}
                {!isLoading && !isError && diplomas.length === 0 && <div className="flex items-center justify-center py-20"><p className="font-[Geist_Mono] text-sm text-gray-500">No diplomas found.</p></div>}
                {!isLoading && !isError && diplomas.length > 0 && diplomas.map((diploma) => (
                    <div key={diploma.id} className="grid grid-cols-[90px_1fr_2fr_80px] items-center border-b border-gray-200 px-[10px] py-[10px]">
                        <div className="h-[100px] w-[90px] overflow-hidden bg-gray-100 p-[10px]">
                            {diploma.image ? <img src={diploma.image} alt={diploma.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-gray-200 font-[Geist_Mono] text-xs text-gray-400">—</div>}
                        </div>
                        <span className="truncate px-2 font-[Geist_Mono] text-sm font-medium text-gray-800">{diploma.title}</span>
                        <span className="line-clamp-3 px-2 font-[Geist_Mono] text-sm text-gray-600">{diploma.description || '—'}</span>
                        <div className="relative flex h-[36px] w-[80px] items-center justify-center">
                            <button type="button" onClick={() => setActionDropdownId(actionDropdownId === diploma.id ? null : diploma.id)} className="flex h-[30px] w-[30px] items-center justify-center bg-[#E5E7EB] text-gray-700 hover:text-gray-900" aria-label="Actions">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {actionDropdownId === diploma.id && <DiplomaActionDropdown onView={() => { setActionDropdownId(null); navigate(`/admin/diplomas/${diploma.id}`); }} onEdit={() => { setActionDropdownId(null); navigate(`/admin/diplomas/${diploma.id}/edit`); }} onDelete={() => { setActionDropdownId(null); setDeleteModal({ open: true, diploma }); }} />}
                        </div>
                    </div>
                ))}
            </div>

            {deleteModal.open && deleteModal.diploma && <ConfirmDeleteModal title={deleteModal.diploma.title} isLoading={deleteMutation.isPending} onConfirm={handleDelete} onClose={() => setDeleteModal({ open: false })} />}
        </div>
    );
}
