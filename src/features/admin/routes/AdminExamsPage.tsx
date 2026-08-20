import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, MoreHorizontal, Plus } from 'lucide-react';
import { useAdminExams } from '../hooks/useAdminExams';
import { useDeleteExam } from '../hooks/useAdminExamMutations';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { DiplomaActionDropdown } from '../components/DiplomaActionDropdown';
import { ExamSortDropdown } from '../components/ExamSortDropdown';
import { useAdminDiplomas } from '../hooks/useAdminDiplomas';
import slidersIcon from '@/assets/icons/admin/sliders-horizontal.svg';
import hideIcon from '@/assets/icons/admin/Hide.svg';
import chevronsUpDown from '@/assets/icons/admin/chevrons-up-down.svg';
import type { Exam } from '@/features/exams/types/exam.types';
import type { ExamsParams } from '@/features/exams/apis/exams.api';

type ImmutableFilter = 'all' | 'true' | 'false';

export function AdminExamsPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [diplomaFilter, setDiplomaFilter] = useState('');
    const [appliedDiplomaFilter, setAppliedDiplomaFilter] = useState('');
    const [immutableFilter, setImmutableFilter] = useState<ImmutableFilter>('all');
    const [appliedImmutableFilter, setAppliedImmutableFilter] = useState<ImmutableFilter>('all');
    const [sortBy, setSortBy] = useState<'title' | 'questionsCount' | 'createdAt' | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [actionDropdownId, setActionDropdownId] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; exam?: Exam }>({ open: false });

    const deleteMutation = useDeleteExam();
    const { data: diplomasData } = useAdminDiplomas({ page: 1, limit: 100 });
    const diplomas = diplomasData?.data ?? [];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-dropdown]')) {
                setActionDropdownId(null);
                setSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const params: ExamsParams = {
        page,
        limit: 20,
        ...(appliedSearch && { search: appliedSearch }),
        ...(appliedDiplomaFilter && { diplomaId: appliedDiplomaFilter }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
        ...(appliedImmutableFilter !== 'all' && { immutable: appliedImmutableFilter === 'true' }),
    };

    const { data, isLoading, isError, refetch } = useAdminExams(params);
    const exams = data?.data ?? [];
    const metadata = data?.metadata;
    const totalPages = metadata?.totalPages ?? 1;
    const total = metadata?.total ?? 0;
    const startItem = total > 0 ? (page - 1) * 20 + 1 : 0;
    const endItem = Math.min(page * 20, total);

    const handleApplyFilters = useCallback(() => {
        setAppliedSearch(search);
        setAppliedDiplomaFilter(diplomaFilter);
        setAppliedImmutableFilter(immutableFilter);
        setPage(1);
    }, [search, diplomaFilter, immutableFilter]);

    const handleClearFilters = useCallback(() => {
        setSearch('');
        setAppliedSearch('');
        setDiplomaFilter('');
        setAppliedDiplomaFilter('');
        setImmutableFilter('all');
        setAppliedImmutableFilter('all');
        setPage(1);
    }, []);

    const handleSort = (sb: 'title' | 'questionsCount' | 'createdAt', so: 'asc' | 'desc') => {
        setSortBy(sb);
        setSortOrder(so);
        setSortDropdownOpen(false);
        setPage(1);
    };

    const handleDelete = () => {
        if (!deleteModal.exam) return;
        deleteMutation.mutate(deleteModal.exam.id, {
            onSuccess: () => setDeleteModal({ open: false }),
        });
    };

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="px-4 py-3">
                <p className="font-[Geist_Mono] text-base text-gray-400">Exams</p>
            </div>

            {/* Pagination + Create */}
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
                <button type="button" onClick={() => navigate('/admin/exams/new')} className="flex h-[40px] items-center gap-2 bg-[#00BC7D] px-4 font-[Geist_Mono] text-sm font-medium text-white hover:bg-[#00a86f]">
                    <Plus className="h-4 w-4" />
                    Create New Exam
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
                        <div className="flex items-center gap-3">
                            <div className="relative w-[300px]">
                                <select value={diplomaFilter} onChange={(e) => setDiplomaFilter(e.target.value)} className="h-[46px] w-full appearance-none border border-[#E5E7EB] bg-white py-[10px] pr-[40px] pl-[10px] font-[Geist_Mono] text-sm text-gray-500 focus:border-blue-500 focus:outline-none">
                                    <option value="">Diploma</option>
                                    {diplomas.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
                                </select>
                                <img src={chevronsUpDown} alt="" className="pointer-events-none absolute top-1/2 right-[10px] h-5 w-5 -translate-y-1/2" />
                            </div>
                            <div className="relative w-[200px]">
                                <select value={immutableFilter} onChange={(e) => setImmutableFilter(e.target.value as ImmutableFilter)} className="h-[46px] w-full appearance-none border border-[#E5E7EB] bg-white py-[10px] pr-[40px] pl-[10px] font-[Geist_Mono] text-sm text-gray-500 focus:border-blue-500 focus:outline-none">
                                    <option value="all">Immutability</option>
                                    <option value="true">Immutable</option>
                                    <option value="false">Mutable</option>
                                </select>
                                <img src={chevronsUpDown} alt="" className="pointer-events-none absolute top-1/2 right-[10px] h-5 w-5 -translate-y-1/2" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <button type="button" onClick={handleClearFilters} className="px-4 py-2 font-[Geist_Mono] text-sm text-gray-600 hover:text-gray-800">Clear</button>
                            <button type="button" onClick={handleApplyFilters} className="flex h-[36px] w-[100px] items-center justify-center bg-[#E5E7EB] font-[Geist_Mono] text-sm font-medium text-gray-700 hover:bg-gray-300">Apply</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Table header — blue */}
            <div className="grid grid-cols-[90px_1.5fr_1fr_100px_80px] items-center bg-[#155DFC] px-[10px] py-2">
                <span className="font-[Geist_Mono] text-xs font-semibold text-white">Image</span>
                <span className="font-[Geist_Mono] text-xs font-semibold text-white">Title</span>
                <span className="font-[Geist_Mono] text-xs font-semibold text-white">Diploma</span>
                <span className="font-[Geist_Mono] text-xs font-semibold text-white">No. of Questions</span>
                <ExamSortDropdown activeSortBy={sortBy} activeSortOrder={sortOrder} onSort={handleSort} open={sortDropdownOpen} onToggle={() => { setSortDropdownOpen(!sortDropdownOpen); setActionDropdownId(null); }} />
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
                {!isLoading && !isError && exams.length === 0 && <div className="flex items-center justify-center py-20"><p className="font-[Geist_Mono] text-sm text-gray-500">No exams found.</p></div>}
                {!isLoading && !isError && exams.length > 0 && exams.map((exam) => (
                    <div key={exam.id} className="grid grid-cols-[90px_1.5fr_1fr_100px_80px] items-center border-b border-gray-200 px-[10px] py-[10px]">
                        <div className="h-[80px] w-[70px] overflow-hidden bg-gray-100">
                            {exam.image ? <img src={exam.image} alt={exam.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-gray-200 font-[Geist_Mono] text-xs text-gray-400">—</div>}
                        </div>
                        <span className="truncate px-2 font-[Geist_Mono] text-sm text-gray-800">{exam.title}</span>
                        <span className="truncate px-2 font-[Geist_Mono] text-sm text-gray-600">{exam.diploma?.title || '—'}</span>
                        <span className="px-2 font-[Geist_Mono] text-sm text-gray-600">{exam.questionsCount}</span>
                        <div className="relative flex items-center justify-center" data-dropdown>
                            <button type="button" onClick={() => { setActionDropdownId(actionDropdownId === exam.id ? null : exam.id); setSortDropdownOpen(false); }} className="flex h-[30px] w-[30px] items-center justify-center bg-[#E5E7EB] text-gray-700 hover:text-gray-900" aria-label="Actions">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {actionDropdownId === exam.id && <DiplomaActionDropdown onView={() => { setActionDropdownId(null); navigate(`/admin/exams/${exam.id}`); }} onEdit={() => { setActionDropdownId(null); navigate(`/admin/exams/${exam.id}/edit`); }} onDelete={() => { setActionDropdownId(null); setDeleteModal({ open: true, exam }); }} />}
                        </div>
                    </div>
                ))}
            </div>

            {deleteModal.open && deleteModal.exam && <ConfirmDeleteModal title={deleteModal.exam.title} isLoading={deleteMutation.isPending} onConfirm={handleDelete} onClose={() => setDeleteModal({ open: false })} />}
        </div>
    );
}
