import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useExamDetails } from '@/features/exams/hooks/useExamDetails';
import { useQuestions } from '@/features/questions/hooks/useQuestions';
import { useCreateQuestion } from '@/features/questions/hooks/useQuestionMutations';
import { useAdminDiplomas } from '../hooks/useAdminDiplomas';
import { useCreateExam, useUpdateExam } from '../hooks/useAdminExamMutations';
import chevronsUpDown from '@/assets/icons/admin/chevrons-up-down.svg';
import saveIcon from '@/assets/icons/admin/save.svg';
import xIcon from '@/assets/icons/admin/x.svg';
import trash2Icon from '@/assets/icons/admin/trash-2-red.svg';
import downloadIcon from '@/assets/icons/admin/download.svg';

export function AdminExamFormPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { data: exam, isLoading: examLoading } = useExamDetails(id ?? '');
    const { data: questions = [] } = useQuestions(id ?? '');
    const { data: diplomasData } = useAdminDiplomas({ page: 1, limit: 100 });
    const diplomas = diplomasData?.data ?? [];

    const createMutation = useCreateExam();
    const updateMutation = useUpdateExam();
    const createQuestionMutation = useCreateQuestion();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [diplomaId, setDiplomaId] = useState('');
    const [duration, setDuration] = useState<number>(20);
    const [image, setImage] = useState('');
    const [imageFileName, setImageFileName] = useState('');
    const [imageFileSize, setImageFileSize] = useState('');
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [newQuestionText, setNewQuestionText] = useState('');
    const [saveError, setSaveError] = useState('');
    const [newAnswers, setNewAnswers] = useState([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
    ]);

    useEffect(() => {
        if (exam && isEdit) {
            setTitle(exam.title);
            setDescription(exam.description || '');
            setDiplomaId(exam.diplomaId);
            setDuration(exam.duration);
            setImage(exam.image || '');
            if (exam.image) {
                const fileName = exam.image.split('/').pop() || '';
                setImageFileName(fileName);
                // Try to get image size via XMLHttpRequest (supports more CORS scenarios)
                const xhr = new XMLHttpRequest();
                xhr.open('GET', exam.image, true);
                xhr.responseType = 'blob';
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        const mb = (xhr.response.size / 1024 / 1024).toFixed(2);
                        setImageFileSize(`${mb} MB`);
                    }
                };
                xhr.onerror = () => setImageFileSize('');
                xhr.send();
            }
        }
    }, [exam, isEdit]);

    const handleSave = () => {
        if (!title.trim()) return;
        setSaveError('');

        // Don't send base64 image to API - only send URL or undefined
        const imageToSend = image && !image.startsWith('data:') ? image : undefined;

        if (isEdit && id) {
            updateMutation.mutate(
                { id, body: { title: title.trim(), description: description.trim() || undefined, diplomaId, duration, image: imageToSend } },
                {
                    onSuccess: () => navigate(`/admin/exams/${id}`),
                    onError: (err: unknown) => setSaveError((err as { message?: string }).message || 'Failed to save'),
                }
            );
        } else {
            if (!diplomaId) return;
            createMutation.mutate(
                { title: title.trim(), description: description.trim() || undefined, diplomaId, duration, image: imageToSend },
                {
                    onSuccess: () => navigate('/admin/exams'),
                    onError: (err: unknown) => setSaveError((err as { message?: string }).message || 'Failed to create'),
                }
            );
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFileName(file.name);
            const mb = (file.size / 1024 / 1024).toFixed(2);
            setImageFileSize(`${mb} MB`);
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleAddQuestion = () => {
        if (!newQuestionText.trim() || !id) return;
        const validAnswers = newAnswers.filter(a => a.text.trim());
        if (validAnswers.length < 2) return;

        createQuestionMutation.mutate(
            { text: newQuestionText, examId: id, answers: validAnswers },
            {
                onSuccess: () => {
                    setNewQuestionText('');
                    setNewAnswers([
                        { text: '', isCorrect: true },
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false },
                    ]);
                    setShowAddQuestion(false);
                },
            }
        );
    };

    if (isEdit && examLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-6 w-6 animate-spin border-2 border-gray-300 border-t-[#155DFC]" />
            </div>
        );
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <div className="px-6 py-3">
                <span className="font-[Geist_Mono] text-sm text-gray-400">
                    <Link to="/admin/exams" className="hover:text-gray-300">Exams</Link>
                    {isEdit && exam && (
                        <>
                            {' / '}
                            <Link to={`/admin/exams/${id}`} className="hover:text-gray-300">{exam.title}</Link>
                        </>
                    )}
                    {' / '}
                    <span className="text-[#155DFC]">{isEdit ? 'Edit' : 'Add'}</span>
                </span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-[6px]" style={{ minHeight: '72px' }}>
                <div>
                    <h1 className="font-[Inter] text-[18px] font-semibold text-gray-900">
                        {isEdit ? exam?.title : 'New Exam'}
                    </h1>
                    {isEdit && exam?.diploma && (
                        <span className="font-[Geist_Mono] text-xs text-gray-500">
                            Diploma: <Link to={`/admin/diplomas/${exam.diplomaId}`} className="text-[#155DFC] underline hover:text-blue-700">{exam.diploma.title} ↗</Link>
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(isEdit ? `/admin/exams/${id}` : '/admin/exams')}
                        className="flex h-[36px] cursor-pointer items-center gap-2 border border-gray-300 bg-white px-4 font-[Geist_Mono] text-sm text-gray-700 hover:bg-gray-50"
                    >
                        <img src={xIcon} alt="" className="h-4 w-4" />
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || !title.trim()}
                        className="flex h-[36px] cursor-pointer items-center gap-2 bg-[#00BC7D] px-4 font-[Geist_Mono] text-sm text-white hover:bg-[#00a86f] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <img src={saveIcon} alt="" className="h-4 w-4" />
                        Save
                    </button>
                </div>
            </div>

            {/* Exam Information Section */}
            <div className="border-t border-gray-200">
                {saveError && (
                    <div className="bg-red-50 px-6 py-2">
                        <p className="font-[Geist_Mono] text-sm text-red-600">{saveError}</p>
                    </div>
                )}
                {/* Section header — blue */}
                <div className="bg-[#155DFC] px-[10px] py-2">
                    <span className="font-[Geist_Mono] text-sm font-semibold text-white">Exam Information</span>
                </div>

                {/* Form */}
                <div className="bg-white px-6 py-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                            <label className="mb-1 block font-[Geist_Mono] text-xs font-semibold text-gray-700">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Exam title"
                                className="h-[46px] w-full border border-[#E5E7EB] bg-white px-[10px] font-[Geist_Mono] text-[16px] font-medium text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Diploma */}
                        <div>
                            <label className="mb-1 block font-[Geist_Mono] text-xs text-gray-500">Diploma</label>
                            <div className="relative">
                                <select
                                    value={diplomaId}
                                    onChange={(e) => setDiplomaId(e.target.value)}
                                    className="h-[46px] w-full appearance-none border border-[#E5E7EB] bg-white py-[10px] pr-[40px] pl-[10px] font-[Geist_Mono] text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">Select Diploma</option>
                                    {diplomas.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
                                </select>
                                <img src={chevronsUpDown} alt="" className="pointer-events-none absolute top-1/2 right-[10px] h-5 w-5 -translate-y-1/2" />
                            </div>
                        </div>

                        {/* Image */}
                        <div>
                            <label className="mb-1 block font-[Geist_Mono] text-xs font-semibold text-gray-700">Image</label>
                            <div className="flex h-[80px] items-center border border-[#E5E7EB] bg-white px-[10px]">
                                {image && (
                                    <div className="mr-3 h-[65px] w-[80px] flex-shrink-0 overflow-hidden border border-[#E5E7EB]">
                                        <img src={image} alt="" className="h-full w-full object-cover" />
                                    </div>
                                )}
                                <span className="flex-1 truncate font-[Geist_Mono] text-sm text-gray-700">
                                    {imageFileName || 'No file selected'}
                                </span>
                                <span className="px-3 font-[Geist_Mono] text-xs text-gray-400">
                                    {imageFileSize || ''}
                                </span>
                                <div className="flex items-center gap-3 pl-2">
                                    <label className="flex cursor-pointer items-center text-[#2B7FFF] hover:text-blue-700">
                                        <img src={downloadIcon} alt="Download" className="h-[18px] w-[18px]" />
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                    <button type="button" onClick={() => { setImage(''); setImageFileName(''); setImageFileSize(''); }} className="text-[#DC2626] hover:text-red-700">
                                        <img src={trash2Icon} alt="Delete" className="h-[18px] w-[18px]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="mb-1 block font-[Geist_Mono] text-xs text-gray-500">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Exam description"
                                rows={3}
                                className="w-full border border-[#E5E7EB] bg-white px-[10px] py-[10px] font-[Geist_Mono] text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="mt-6">
                        <label className="mb-1 block font-[Geist_Mono] text-xs font-semibold text-gray-700">Duration (min)</label>
                        <div className="relative w-full max-w-[50%]">
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                min={1}
                                className="h-[46px] w-full appearance-none border border-[#E5E7EB] bg-white px-[10px] pr-[40px] font-[Geist_Mono] text-sm text-gray-700 focus:border-blue-500 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <div className="absolute top-0 right-[10px] flex h-full flex-col items-center justify-center">
                                <button type="button" onClick={() => setDuration(d => d + 1)} className="text-gray-400 hover:text-gray-600">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 7.5L6 4.5L9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                                <button type="button" onClick={() => setDuration(d => Math.max(1, d - 1))} className="text-gray-400 hover:text-gray-600">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exam Questions Section (only in edit mode) */}
            {isEdit && (
                <div className="mt-2">
                    {/* Section header — blue */}
                    <div className="flex items-center justify-between bg-[#155DFC] px-[10px] py-2">
                        <span className="font-[Geist_Mono] text-sm font-semibold text-white">Exam Questions</span>
                        <button
                            type="button"
                            onClick={() => navigate(`/admin/exams/${id}/questions/new`)}
                            className="font-[Geist_Mono] text-sm text-white hover:underline"
                        >
                            + Add Questions
                        </button>
                    </div>

                    {/* Add Question Form */}
                    {showAddQuestion && (
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="mb-3">
                                <label className="mb-1 block font-[Geist_Mono] text-xs font-semibold text-gray-700">Question Text</label>
                                <input
                                    type="text"
                                    value={newQuestionText}
                                    onChange={(e) => setNewQuestionText(e.target.value)}
                                    placeholder="Enter question text"
                                    className="h-[46px] w-full border border-[#E5E7EB] bg-white px-[10px] font-[Geist_Mono] text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="mb-1 block font-[Geist_Mono] text-xs font-semibold text-gray-700">Answers (mark correct one)</label>
                                {newAnswers.map((answer, idx) => (
                                    <div key={idx} className="mb-2 flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={answer.isCorrect}
                                            onChange={() => setNewAnswers(newAnswers.map((a, i) => ({ ...a, isCorrect: i === idx })))}
                                            className="h-4 w-4 accent-[#155DFC]"
                                        />
                                        <input
                                            type="text"
                                            value={answer.text}
                                            onChange={(e) => setNewAnswers(newAnswers.map((a, i) => i === idx ? { ...a, text: e.target.value } : a))}
                                            placeholder={`Answer ${idx + 1}`}
                                            className="h-[36px] flex-1 border border-[#E5E7EB] bg-white px-[10px] font-[Geist_Mono] text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleAddQuestion}
                                    disabled={createQuestionMutation.isPending || !newQuestionText.trim()}
                                    className="flex h-[36px] items-center gap-2 bg-[#00BC7D] px-4 font-[Geist_Mono] text-sm text-white hover:bg-[#00a86f] disabled:opacity-50"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddQuestion(false)}
                                    className="flex h-[36px] items-center px-4 font-[Geist_Mono] text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Questions table header */}
                    <div className="flex items-center border-b border-gray-200 bg-gray-50 px-[10px] py-2">
                        <span className="font-[Geist_Mono] text-xs font-semibold text-gray-700">Title</span>
                    </div>

                    {/* Questions list */}
                    <div className="bg-white">
                        {questions.length === 0 && (
                            <div className="flex items-center justify-center py-10">
                                <p className="font-[Geist_Mono] text-sm text-gray-500">No questions yet.</p>
                            </div>
                        )}
                        {questions.map((question) => (
                            <div key={question.id} className="grid grid-cols-[1fr_80px] items-center border-b border-gray-200 px-[10px] py-3">
                                <span className="font-[Geist_Mono] text-[14px] font-medium text-gray-800">{question.text}</span>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/admin/exams/${id}/questions/${question.id}`)}
                                        className="flex h-[30px] w-[30px] items-center justify-center border border-[#E5E7EB] bg-[#E5E7EB] text-gray-700 hover:text-gray-900"
                                        aria-label="View question"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
