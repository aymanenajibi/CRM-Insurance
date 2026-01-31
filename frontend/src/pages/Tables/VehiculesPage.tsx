// import React, { useState, useEffect } from 'react';
// import { vehiculeService } from '../../services/vehiculeService';
// import { Vehicule } from '../../types/vehicule';
// import VehiculeModal from '../../components/Vehicules/VehiculeModal';
// import { Trash2, Edit, Car, Plus } from 'lucide-react'; 
// import { Modal, message } from 'antd';
// import { ExclamationCircleFilled } from '@ant-design/icons';


// const VehiculesPage = () => {
//   const [vehicules, setVehicules] = useState<Vehicule[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedVehicule, setSelectedVehicule] = useState<Vehicule | null>(null);

//   // Load vehicles from backend
//   const fetchVehicules = async () => {
//     try {
//       setLoading(true);
//       const response = await vehiculeService.getAll();
//       setVehicules(response.data);
//     } catch (error) {
//       console.error("Erreur lors du chargement des véhicules", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVehicules();
//   }, []);

//   const handleEdit = (v: Vehicule) => {
//     setSelectedVehicule(v);
//     setIsModalOpen(true);
//   };

//   const handleAdd = () => {
//     setSelectedVehicule(null);
//     setIsModalOpen(true);
//   };

// const { confirm } = Modal;

// const handleDelete = (id: number) => {
//   confirm({
//     title: 'Êtes-vous sûr de vouloir supprimer ce véhicule ?',
//     icon: <ExclamationCircleFilled />,
//     content: 'Cette action est irréversible.',
//     okText: 'Supprimer',
//     okType: 'danger',
//     cancelText: 'Annuler',
//     zIndex: 3000,
//     async onOk() {
//       try {
//         await vehiculeService.delete(id);
//         message.success('Véhicule supprimé');
//         fetchVehicules(); // Refresh your custom Tailwind table
//       } catch (e) {
//         message.error('Erreur lors de la suppression');
//       }
//     },
//   });
// };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Gestion des Véhicules</h1>
//           <p className="text-sm text-gray-500">{vehicules.length} véhicules au total</p>
//         </div>
//         <button 
//           onClick={handleAdd}
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           <Plus size={18} /> Nouvel véhicule
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//         <table className="w-full text-left border-collapse">
//           <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
//             <tr>
//               <th className="p-4 font-semibold">Matricule</th>
//               <th className="p-4 font-semibold">Marque & Modèle</th>
//               <th className="p-4 font-semibold">Mise en Circulation</th>
//               <th className="p-4 font-semibold">Valeur Vénale</th>
//               <th className="p-4 font-semibold">Puissance</th>
//               <th className="p-4 font-semibold text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {vehicules.map((v) => (
//               <tr key={v.id} className="hover:bg-gray-50 transition">
//                 <td className="p-4 font-medium text-blue-600">{v.matricule}</td>
//                 <td className="p-4">
//                   <div className="font-semibold">{v.marque}</div>
//                   <div className="text-xs text-gray-400">{v.model}</div>
//                 </td>
//                 <td className="p-4">{new Date(v.date_mise_circulation).toLocaleDateString()}</td>
//                 <td className="p-4 font-mono text-green-600">{v.valeur_venale.toLocaleString()} DH</td>
//                 <td className="p-4">{v.puissance_fiscale} CV</td>
//                 <td className="p-4">
//                   <div className="flex justify-center gap-3">
//                     <button onClick={() => handleEdit(v)} className="text-gray-400 hover:text-blue-600">
//                       <Edit size={18} />
//                     </button>
//                     <button onClick={() => handleDelete(v.id)} className="text-gray-400 hover:text-red-600">
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
        
//         {loading && <div className="p-10 text-center text-gray-500">Chargement...</div>}
//         {!loading && vehicules.length === 0 && (
//           <div className="p-10 text-center text-gray-500 flex flex-col items-center">
//             <Car size={48} className="mb-2 opacity-20" />
//             Aucun véhicule trouvé.
//           </div>
//         )}
//       </div>

//       <VehiculeModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         onSuccess={fetchVehicules}
//         initialData={selectedVehicule}
//       />
//     </div>
//   );
// };

// export default VehiculesPage;


import React, { useState, useEffect } from 'react';
import { vehiculeService } from '../../services/vehiculeService';
import { Vehicule } from '../../types/vehicule';
import VehiculeModal from '../../components/Vehicules/VehiculeModal';
import { Trash2, Edit, Car, Plus } from 'lucide-react'; 
import { Modal, message, Empty, Spin } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

const VehiculesPage = () => {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState<Vehicule | null>(null);

  // 1. Hook for the message toast
  const [messageApi, contextHolder] = message.useMessage();

  const fetchVehicules = async () => {
    try {
      setLoading(true);
      const response = await vehiculeService.getAll();
      setVehicules(response.data);
    } catch (error) {
      messageApi.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehicules(); }, []);

  const handleDelete = (id: number) => {
    confirm({
      title: 'Supprimer ce véhicule ?',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: 'Cette action est irréversible.',
      okText: 'Supprimer',
      okType: 'danger',
      cancelText: 'Annuler',
      zIndex: 3000, 
      centered: true,
      async onOk() {
        try {
          await vehiculeService.delete(id);
          messageApi.success('Véhicule supprimé avec succès');
          fetchVehicules();
        } catch (e) {
          messageApi.error('Erreur: Action non autorisée');
        }
      },
    });
  };

  return (
    <div className="p-4 sm:p-8">
      {/* 2. IMPORTANT: Render the context holder here */}
      {contextHolder}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion du Parc</h1>
          <p className="text-gray-500">{vehicules.length} véhicules au total</p>
        </div>
        <button 
          onClick={() => { setSelectedVehicule(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus size={18} /> Nouveau Véhicule
        </button>
      </div>

      <div className="bg-white dark:bg-[#141414] rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-[#1d1d1d] text-gray-500 text-[12px] uppercase">
              <tr>
                <th className="p-4 font-semibold">Matricule</th>
                <th className="p-4 font-semibold">Véhicule</th>
                <th className="p-4 font-semibold">Mise en Circulation</th>
                <th className="p-4 font-semibold">Valeur Vénale</th>
                <th className="p-4 font-semibold">Puissance</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {vehicules.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition">
                  <td className="p-4 font-bold text-blue-600 dark:text-blue-400 font-mono">{v.matricule}</td>
                  <td className="p-4">
                    <div className="font-semibold dark:text-gray-200">{v.marque}</div>
                    <div className="text-xs text-gray-400 uppercase">{v.model}</div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {new Date(v.date_mise_circulation).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {v.valeur_venale.toLocaleString()} DH
                  </td>
                  <td className="p-4">
                    <span className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-bold px-2 py-1 rounded">
                      {v.puissance_fiscale} CV
                    </span>
                  </td>
                  <td className="p-4">
                    {/* FIXED: Icons are now visible normally (removed group-hover logic) */}
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => { setSelectedVehicule(v); setIsModalOpen(true); }}
                        className="text-gray-400 hover:text-blue-600 transition"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(v.id)}
                        className="text-gray-400 hover:text-red-600 transition"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && <div className="p-12 text-center"><Spin /></div>}
        {!loading && vehicules.length === 0 && (
          <div className="p-20 text-center"><Empty description="Aucun véhicule" /></div>
        )}
      </div>

      <VehiculeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchVehicules}
        initialData={selectedVehicule}
      />
    </div>
  );
};

export default VehiculesPage;