import { useState, useEffect } from 'react';
import { X, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getUsers } from '../../services/authService';

const ShareBudgetModal = ({ isOpen, onClose, onShare, presupuesto }) => {
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [sharing, setSharing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadUsers();
        }
    }, [isOpen]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            // Filtrar el usuario actual si es necesario, aunque el backend podría manejarlo
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const filteredUsers = data.filter(u => u.id !== currentUser?.id);
            setUsers(filteredUsers);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (!selectedUserId) return;
        
        setSharing(true);
        try {
            await onShare(presupuesto.id, selectedUserId);
            onClose();
        } catch (error) {
            console.error(error);
            // El error se maneja en el padre o aquí
        } finally {
            setSharing(false);
            setSelectedUserId('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6 pb-2 border-b">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <UserPlus size={24} className="text-blue-600" />
                        Compartir Presupuesto
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">
                        Vas a prestar una copia del presupuesto:
                        <br/>
                        <span className="font-semibold text-gray-900">{presupuesto?.nombre_proyecto}</span>
                    </p>
                    
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar colaborador
                    </label>
                    
                    {loading ? (
                        <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        >
                            <option value="">Selecciona un usuario...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name || user.username} ({user.email})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                        disabled={sharing}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleShare}
                        disabled={!selectedUserId || sharing}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sharing ? 'Compartiendo...' : 'Compartir'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareBudgetModal;
