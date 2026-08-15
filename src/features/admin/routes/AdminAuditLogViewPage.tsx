import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink } from 'lucide-react';
import { auditApi } from '@/features/audit/apis/audit.api';
import { unwrapPayload } from '@/shared/api/unwrap-response';
import { useDeleteAuditLog } from '@/features/audit/hooks/useAuditLogMutations';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { useState } from 'react';
import trash2Icon from '../../../lucideAdmin/trash-2.svg';
import type { AuditLog } from '@/features/audit/types/audit.types';

export function AdminAuditLogViewPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const deleteMutation = useDeleteAuditLog();
    const [deleteModal, setDeleteModal] = useState(false);

    const { data: log, isLoading, isError } = useQuery({
        queryKey: ['admin-audit-log', id],
        queryFn: async (): Promise<AuditLog> => {
            const res = await auditApi.getById(id!);
            const payload = unwrapPayload<{ auditLog: AuditLog }>(res.data);
            return payload.auditLog;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-6 w-6 animate-spin border-2 border-gray-300 border-t-[#155DFC]" />
            </div>
        );
    }

    if (isError || !log) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="font-[Geist_Mono] text-sm text-gray-600">Audit log entry not found.</p>
                <Link to="/admin/audit-logs" className="mt-3 font-[Geist_Mono] text-sm text-[#155DFC]">
                    Back to Audit Log
                </Link>
            </div>
        );
    }

    const handleDelete = () => {
        deleteMutation.mutate(log.id, {
            onSuccess: () => navigate('/admin/audit-logs'),
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

    const formatDateTime = (dateStr: string) => {
        const d = new Date(dateStr);
        const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
        const date = d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
        return `${time} | ${date}`;
    };

    // Build title like "Diploma Update By Abdulrahman Muhammad"
    const title = `${log.entityType || log.category || ''} ${log.action?.charAt(0) + log.action?.slice(1).toLowerCase()} By ${log.actorUsername || '—'}`;

    // Extract updated fields from metadata
    const metadataObj = log.metadata || {};
    const updatedFields = Object.keys(metadataObj).join(', ');
    const metadataJson = Object.entries(metadataObj)
        .map(([key, value]) => `"${key}": "${value}"`)
        .join(',\n');

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="px-6 py-3">
                <span className="font-[Geist_Mono] text-sm text-gray-400">
                    <Link to="/admin/audit-logs" className="hover:text-gray-300">Audit Log</Link>
                    {' / '}
                    <span className="text-[#155DFC]">{title}</span>
                </span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-[6px]" style={{ minHeight: '72px' }}>
                <div>
                    <h1 className="font-[Geist_Mono] text-[18px] font-semibold text-gray-900">
                        {title}
                    </h1>
                    <div className="flex items-center gap-1">
                        <span className="font-[Geist_Mono] text-xs text-gray-500">
                            Entity: {log.entityType || log.category || '–'}
                        </span>
                        {log.entityId && (
                            <>
                                <span className="font-[Geist_Mono] text-xs text-[#155DFC]">{log.entityId}</span>
                                <ExternalLink className="h-3 w-3 text-[#155DFC]" />
                            </>
                        )}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setDeleteModal(true)}
                    className="flex h-[36px] items-center gap-2 bg-[#DC2626] px-4 font-[Geist_Mono] text-sm text-white hover:bg-red-700"
                >
                    <img src={trash2Icon} alt="" className="h-4 w-4" />
                    Delete
                </button>
            </div>

            {/* Body */}
            <div className="border-t border-gray-200 bg-white px-6 py-6">
                {/* Action */}
                <div className="mb-5">
                    <p className="font-[Geist_Mono] text-xs text-gray-400">Action</p>
                    <p className={`font-[Geist_Mono] text-[14px] font-bold ${getActionColor(log.action)}`}>
                        {log.action}
                    </p>
                </div>

                {/* Method */}
                <div className="mb-5">
                    <p className="font-[Geist_Mono] text-xs text-gray-400">Method</p>
                    <p className="font-[Geist_Mono] text-[14px] font-medium text-gray-800">
                        {log.httpMethod}
                    </p>
                </div>

                {/* User */}
                <div className="mb-5">
                    <p className="font-[Geist_Mono] text-xs text-gray-400">User</p>
                    <p className="font-[Geist_Mono] text-[14px] font-medium text-gray-800">
                        {log.actorUsername || '–'}
                    </p>
                    <p className="font-[Geist_Mono] text-[14px] font-normal text-gray-500">
                        Email: {log.actorEmail || '–'}
                    </p>
                    {log.ipAddress && (
                        <p className="font-[Geist_Mono] text-[14px] font-normal text-gray-500">
                            IP Address: {log.ipAddress}
                        </p>
                    )}
                    <p className={`font-[Geist_Mono] text-[14px] font-medium ${getRoleColor(log.actorRole)}`}>
                        Role: {getRoleLabel(log.actorRole)}
                    </p>
                </div>

                {/* Entity */}
                <div className="mb-5">
                    <p className="font-[Geist_Mono] text-xs text-gray-400">Entity</p>
                    <div className="flex items-center gap-1">
                        <span className="font-[Geist_Mono] text-[14px] font-medium text-gray-800">
                            {log.entityType || log.category || '–'}: {log.entityId}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                </div>

                {/* Date & Time */}
                <div className="mb-5">
                    <p className="font-[Geist_Mono] text-xs text-gray-400">Date & Time</p>
                    <p className="font-[Geist_Mono] text-[14px] font-medium text-gray-800">
                        {formatDateTime(log.createdAt)}
                    </p>
                </div>

                {/* Updated Fields */}
                {updatedFields && (
                    <div className="mb-5">
                        <p className="font-[Geist_Mono] text-xs text-gray-400">Updated Fields</p>
                        <p className="font-[Geist_Mono] text-[14px] font-normal text-gray-800">
                            {updatedFields}
                        </p>
                    </div>
                )}

                {/* Metadata */}
                {metadataJson && (
                    <div className="mb-5">
                        <p className="font-[Geist_Mono] text-xs text-gray-400">Metadata</p>
                        <pre className="mt-1 bg-[#F3F4F6] px-4 py-3 font-[Geist_Mono] text-[14px] font-normal text-gray-700 whitespace-pre-wrap">
                            {metadataJson}
                        </pre>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal && (
                <ConfirmDeleteModal
                    title={title}
                    isLoading={deleteMutation.isPending}
                    onConfirm={handleDelete}
                    onClose={() => setDeleteModal(false)}
                />
            )}
        </div>
    );
}
