import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MoreHorizontal, ExternalLink } from 'lucide-react';
import { useAuditLogs } from '@/features/audit/hooks/useAuditLogs';
import { useDeleteAuditLog, useClearAllAuditLogs } from '@/features/audit/hooks/useAuditLogMutations';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { ClearAllLogsModal } from '@/features/audit/components/ClearAllLogsModal';
import { AuditLogActionDropdown } from '@/features/audit/components/AuditLogActionDropdown';
import { AuditLogSortDropdown } from '@/features/audit/components/AuditLogSortDropdown';
import slidersIcon from '@/assets/icons/admin/sliders-horizontal.svg';
import hideIcon from '@/assets/icons/admin/Hide.svg';
import chevronsUpDown from '@/assets/icons/admin/chevrons-up-down.svg';
import shredderIcon from '@/assets/icons/admin/shredder.svg';
import type { AuditLog, AuditLogsParams } from '@/features/audit/types/audit.types';

type SortByField = 'action' | 'user' | 'entity' | 'createdAt';

export function AdminAuditLogsPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [appliedCategory, setAppliedCategory] = useState('');
    const [appliedAction, setAppliedAction] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [sortBy, setSortBy] = useState<SortByField | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);
    const [filtersVisible, setFiltersVisible] = useState(true);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [actionDropdownId, setActionDropdownId] = useState<string | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; log?: AuditLog }>({ open: false });
    const [clearAllModal, setClearAllModal] = useState(false);

    const deleteMutation = useDeleteAuditLog();
    const clearAllMutation = useClearAllAuditLogs();

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

    const params: AuditLogsParams = {
        page,
        limit: 20,
        ...(appliedCategory && { category: appliedCategory }),
        ...(appliedAction && { action: appliedAction }),
        ...(appliedSearch && { search: appliedSearch }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
    };

    const { data, isLoading, isError, refetch } = useAuditLogs(params);
    const logs = data?.data ?? [];
    const metadata = data?.metadata;
    const totalPages = metadata?.totalPages ?? 1;
    const total = metadata?.total ?? 0;
    const startItem = total > 0 ? (page - 1) * 20 + 1 : 0;
    const endItem = Math.min(page * 20, total);

    const handleApplyFilters = useCallback(() => {
        setAppliedCategory(categoryFilter);
        setAppliedAction(actionFilter);
        setAppliedSearch(searchFilter);
        setPage(1);
    }, [categoryFilter, actionFilter, searchFilter]);

    const handleClearFilters = useCallback(() => {
        setCategoryFilter('');
        setActionFilter('');
        setSearchFilter('');
        setAppliedCategory('');
        setAppliedAction('');
        setAppliedSearch('');
        setPage(1);
    }, []);

    const handleSort = (sb: SortByField, so: 'asc' | 'desc') => {
        setSortBy(sb);
        setSortOrder(so);
        setSortDropdownOpen(false);
        setPage(1);
    };

    const handleDelete = () => {
        if (!deleteModal.log) return;
        deleteMutation.mutate(deleteModal.log.id, {
            onSuccess: () => setDeleteModal({ open: false }),
        });
    };

    const handleClearAll = () => {
        clearAllMutation.mutate(undefined, {
            onSuccess: () => {
                setClearAllModal(false);
                setPage(1);
            },
        });
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'text-[#16A34A]';
            case 'UPDATE': return 'text-[#D97706]';
            case 'DELETE': return 'text-[#DC2626]';
            case 'SET_IMMUTABLE': return 'text-[#7C3AED]';
            case 'SEED_DATA': return 'text-[#155DFC]';
            default: return 'text-gray-700';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'text-[#DC2626]';
            case 'ADMIN': return 'text-[#155DFC]';
            default: return 'text-gray-600';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'SUPER_ADMIN': return 'Super Admin';
            case 'ADMIN': return 'Admin';
            case 'USER': return 'User';
            default: return role;
        }
    };

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
        const date = d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
        return { time, date };
    };

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="px-4 py-3">
                <p className="font-[Geist_Mono] text-base text-gray-400">Audit Log</p>
            </div>

            {/* Pagination + Clear All */}
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
                <button type="button" onClick={() => setClearAllModal(true)} className="flex h-[40px] items-center gap-[10px] bg-[#EF4444] px-4 font-[Geist_Mono] text-[14px] font-medium text-white hover:bg-red-600">
                    <img src={shredderIcon} alt="" className="h-[18px] w-[18px]" />
                    Clear All Logs
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
                        <div className="flex items-center gap-3">
                            {/* Category dropdown */}
                            <div className="relative flex-1">
                                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-[46px] w-full appearance-none border border-[#E5E7EB] bg-white py-[10px] pr-[40px] pl-[10px] font-[Geist_Mono] text-sm text-gray-500 focus:border-blue-500 focus:outline-none">
                                    <option value="">Category</option>
                                    <option value="DIPLOMA">Diploma</option>
                                    <option value="EXAM">Exam</option>
                                    <option value="QUESTION">Question</option>
                                    <option value="USER">User</option>
                                    <option value="SYSTEM">System</option>
                                </select>
                                <img src={chevronsUpDown} alt="" className="pointer-events-none absolute top-1/2 right-[10px] h-5 w-5 -translate-y-1/2" />
                            </div>

                            {/* Action dropdown */}
                            <div className="relative flex-1">
                                <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="h-[46px] w-full appearance-none border border-[#E5E7EB] bg-white py-[10px] pr-[40px] pl-[10px] font-[Geist_Mono] text-sm text-gray-500 focus:border-blue-500 focus:outline-none">
                                    <option value="">Action</option>
                                    <option value="CREATE">Create</option>
                                    <option value="UPDATE">Update</option>
                                    <option value="DELETE">Delete</option>
                                    <option value="SET_IMMUTABLE">Set Immutable</option>
                                    <option value="SEED_DATA">Seed Data</option>
                                </select>
                                <img src={chevronsUpDown} alt="" className="pointer-events-none absolute top-1/2 right-[10px] h-5 w-5 -translate-y-1/2" />
                            </div>

                            {/* User/Search input */}
                            <div className="relative flex-1">
                                <input type="text" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleApplyFilters(); }} placeholder="User" className="h-[46px] w-full border border-[#E5E7EB] bg-white px-[10px] pr-[40px] font-[Geist_Mono] text-sm text-gray-700 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none" />
                                <img src={chevronsUpDown} alt="" className="pointer-events-none absolute top-1/2 right-[10px] h-5 w-5 -translate-y-1/2" />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button type="button" onClick={handleClearFilters} className="px-4 py-2 font-[Geist_Mono] text-sm text-gray-600 hover:text-gray-800">Clear</button>
                            <button type="button" onClick={handleApplyFilters} className="flex h-[36px] w-[100px] items-center justify-center border border-[#E5E7EB] bg-[#E5E7EB] font-[Geist_Mono] text-sm font-medium text-gray-700 hover:bg-gray-300">Apply</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Table header — blue */}
            <div className="grid grid-cols-[1.2fr_1.5fr_1.5fr_1fr_80px] items-center bg-[#155DFC] px-[10px] py-2">
                <span className="font-[Geist_Mono] text-[14px] font-medium text-white">Action</span>
                <span className="font-[Geist_Mono] text-[14px] font-medium text-white">User</span>
                <span className="font-[Geist_Mono] text-[14px] font-medium text-white">Entity</span>
                <span className="font-[Geist_Mono] text-[14px] font-medium text-white">Time</span>
                <AuditLogSortDropdown activeSortBy={sortBy} activeSortOrder={sortOrder} onSort={handleSort} open={sortDropdownOpen} onToggle={() => { setSortDropdownOpen(!sortDropdownOpen); setActionDropdownId(null); }} />
            </div>

            {/* Table body */}
            <div className="bg-white">
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-6 w-6 animate-spin border-2 border-gray-300 border-t-[#155DFC]" />
                    </div>
                )}
                {isError && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="font-[Geist_Mono] text-sm text-gray-600">Something went wrong.</p>
                        <button type="button" onClick={() => refetch()} className="mt-3 bg-[#155DFC] px-4 py-2 font-[Geist_Mono] text-sm text-white hover:bg-blue-700">Try Again</button>
                    </div>
                )}
                {!isLoading && !isError && logs.length === 0 && (
                    <div className="flex items-center justify-center py-20">
                        <p className="font-[Geist_Mono] text-sm text-gray-500">No audit logs found.</p>
                    </div>
                )}
                {!isLoading && !isError && logs.length > 0 && logs.map((log) => {
                    const { time, date } = formatTime(log.createdAt);
                    return (
                        <div key={log.id} className="grid grid-cols-[1.2fr_1.5fr_1.5fr_1fr_80px] items-center border-b border-gray-200 px-[10px] py-[10px]">
                            {/* Action column */}
                            <div className="flex flex-col gap-0.5">
                                <span className={`font-[Geist_Mono] text-[14px] font-bold ${getActionColor(log.action)}`}>
                                    {log.action}
                                </span>
                                <span className="font-[Geist_Mono] text-[14px] font-normal text-gray-500">
                                    Method: {log.httpMethod}
                                </span>
                            </div>

                            {/* User column */}
                            <div className="flex flex-col gap-0.5">
                                <span className="font-[Geist_Mono] text-[14px] font-medium text-gray-800">
                                    {log.actorUsername || '–'}
                                </span>
                                <span className="font-[Geist_Mono] text-[14px] font-normal text-gray-500">
                                    {log.actorEmail || '–'}
                                </span>
                                <span className={`font-[Geist_Mono] text-[14px] font-medium ${getRoleColor(log.actorRole)}`}>
                                    {getRoleLabel(log.actorRole)}
                                </span>
                            </div>

                            {/* Entity column */}
                            <div className="flex flex-col gap-0.5">
                                <span className="font-[Geist_Mono] text-[14px] font-medium text-gray-800">
                                    {log.entityType || log.category || '–'}
                                </span>
                                <div className="flex items-center gap-1">
                                    <span className="font-[Geist_Mono] text-[14px] font-normal text-gray-500">
                                        {log.entityId}
                                    </span>
                                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                </div>
                            </div>

                            {/* Time column */}
                            <div className="flex flex-col gap-0.5">
                                <span className="font-[Geist_Mono] text-[14px] font-normal text-gray-800">{time}</span>
                                <span className="font-[Geist_Mono] text-[14px] font-normal text-gray-500">{date}</span>
                            </div>

                            {/* Action menu */}
                            <div className="relative flex h-[36px] w-[80px] items-center justify-center" data-dropdown>
                                <button type="button" onClick={() => { setActionDropdownId(actionDropdownId === log.id ? null : log.id); setSortDropdownOpen(false); }} className="flex h-[30px] w-[30px] items-center justify-center bg-[#E5E7EB] text-gray-700 hover:text-gray-900" aria-label="Actions">
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                                {actionDropdownId === log.id && (
                                    <AuditLogActionDropdown
                                        onView={() => { setActionDropdownId(null); navigate(`/admin/audit-logs/${log.id}`); }}
                                        onDelete={() => { setActionDropdownId(null); setDeleteModal({ open: true, log }); }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delete single log modal */}
            {deleteModal.open && deleteModal.log && (
                <ConfirmDeleteModal
                    title={`${deleteModal.log.action} - ${deleteModal.log.entityType || deleteModal.log.category}`}
                    isLoading={deleteMutation.isPending}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteModal({ open: false })}
                />
            )}

            {/* Clear all logs modal */}
            {clearAllModal && (
                <ClearAllLogsModal
                    isLoading={clearAllMutation.isPending}
                    onConfirm={handleClearAll}
                    onClose={() => setClearAllModal(false)}
                />
            )}
        </div>
    );
}
