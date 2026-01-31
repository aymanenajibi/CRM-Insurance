// // import React, { useState, useEffect } from 'react';
// // import { vehiculeService } from '../../services/vehiculeService';
// // import { Vehicule } from '../../types/vehicule';

// // interface Props {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   onSuccess: () => void;
// //   initialData?: Vehicule | null;
// // }

// // const VehiculeModal = ({ isOpen, onClose, onSuccess, initialData }: Props) => {
// //   const [formData, setFormData] = useState({
// //     matricule: '',
// //     marque: '',
// //     model: '',
// //     date_mise_circulation: '',
// //     valeur_venale: 0,
// //     puissance_fiscale: 0
// //   });

// //   useEffect(() => {
// //     if (initialData) {
// //       setFormData(initialData);
// //     } else {
// //       // Reset form if opening for a "New" vehicle
// //       setFormData({
// //         matricule: '', marque: '', model: '',
// //         date_mise_circulation: '', valeur_venale: 0, puissance_fiscale: 0
// //       });
// //     }
// //   }, [initialData, isOpen]);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       if (initialData) {
// //         await vehiculeService.update(initialData.id, formData);
// //       } else {
// //         await vehiculeService.create(formData);
// //       }
// //       onSuccess();
// //       onClose();
// //     } catch (error) {
// //       alert("Erreur: Vérifiez si le matricule existe déjà.");
// //     }
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
// //       <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
// //         <h2 className="text-2xl font-bold text-gray-800 mb-6">
// //           {initialData ? '📝 Modifier le véhicule' : '🚗 Nouveau véhicule'}
// //         </h2>
        
// //         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
// //           <div className="col-span-2">
// //             <label className="block text-sm font-medium text-gray-700">Matricule</label>
// //             <input required className="w-full mt-1 border p-2 rounded-md" 
// //               value={formData.matricule} onChange={e => setFormData({...formData, matricule: e.target.value})} />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Marque</label>
// //             <input required className="w-full mt-1 border p-2 rounded-md" 
// //               value={formData.marque} onChange={e => setFormData({...formData, marque: e.target.value})} />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Modèle</label>
// //             <input required className="w-full mt-1 border p-2 rounded-md" 
// //               value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
// //           </div>

// //           <div className="col-span-2">
// //             <label className="block text-sm font-medium text-gray-700">Date Mise en Circulation</label>
// //             <input required type="date" className="w-full mt-1 border p-2 rounded-md" 
// //               value={formData.date_mise_circulation} onChange={e => setFormData({...formData, date_mise_circulation: e.target.value})} />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Valeur Vénale</label>
// //             <input required type="number" className="w-full mt-1 border p-2 rounded-md" 
// //               value={formData.valeur_venale} onChange={e => setFormData({...formData, valeur_venale: Number(e.target.value)})} />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Puissance Fiscale</label>
// //             <input required type="number" className="w-full mt-1 border p-2 rounded-md" 
// //               value={formData.puissance_fiscale} onChange={e => setFormData({...formData, puissance_fiscale: Number(e.target.value)})} />
// //           </div>

// //           <div className="col-span-2 flex justify-end gap-3 mt-6">
// //             <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">Annuler</button>
// //             <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md">
// //               {initialData ? 'Mettre à jour' : 'Ajouter'}
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default VehiculeModal;


// import React, { useEffect } from 'react';
// import { Modal, Form, Input, InputNumber, DatePicker, message, Row, Col } from 'antd';
// import dayjs from 'dayjs';
// import { vehiculeService } from '../../services/vehiculeService';
// import { Vehicule } from '../../types/vehicule';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   initialData?: Vehicule | null;
// }

// const VehiculeModal = ({ isOpen, onClose, onSuccess, initialData }: Props) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (isOpen) {
//       if (initialData) {
//         form.setFieldsValue({
//           ...initialData,
//           date_mise_circulation: initialData.date_mise_circulation ? dayjs(initialData.date_mise_circulation) : null,
//         });
//       } else {
//         form.resetFields();
//       }
//     }
//   }, [initialData, isOpen, form]);

//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       const formattedData = {
//         ...values,
//         date_mise_circulation: values.date_mise_circulation.format('YYYY-MM-DD'),
//       };

//       if (initialData) {
//         await vehiculeService.update(initialData.id, formattedData);
//         message.success("Véhicule modifié !");
//       } else {
//         await vehiculeService.create(formattedData);
//         message.success("Véhicule créé !");
//       }
//       onSuccess();
//       onClose();
//     } catch (error) {
//       message.error("Erreur: Le matricule existe peut-être déjà.");
//     }
//   };

//   return (
//     <Modal
//       title={<span className="text-xl font-bold">{initialData ? '📝 Modifier le véhicule' : '🚗 Nouveau véhicule'}</span>}
//       open={isOpen}
//       onCancel={onClose}
//       onOk={handleSave}
//       okText={initialData ? "Mettre à jour" : "Ajouter"}
//       cancelText="Annuler"
//       width={600}
//       okButtonProps={{ className: "bg-blue-600 hover:bg-blue-700" }}
//     >
//       <Form form={form} layout="vertical" className="mt-6">
//         <Form.Item name="matricule" label="Matricule" rules={[{ required: true }]}>
//           <Input placeholder="Ex: 12345-A-6" className="rounded-md" />
//         </Form.Item>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item name="marque" label="Marque" rules={[{ required: true }]}>
//               <Input placeholder="Ex: Renault" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item name="model" label="Modèle" rules={[{ required: true }]}>
//               <Input placeholder="Ex: Clio" />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Form.Item name="date_mise_circulation" label="Date de Mise en Circulation" rules={[{ required: true }]}>
//           <DatePicker className="w-full" />
//         </Form.Item>

//         <Row gutter={16}>
//           <Col span={12}>
//             <Form.Item name="valeur_venale" label="Valeur Vénale (DH)" rules={[{ required: true }]}>
//               <InputNumber className="w-full" />
//             </Form.Item>
//           </Col>
//           <Col span={12}>
//             <Form.Item name="puissance_fiscale" label="Puissance Fiscale" rules={[{ required: true }]}>
//               <InputNumber className="w-full" />
//             </Form.Item>
//           </Col>
//         </Row>
//       </Form>
//     </Modal>
//   );
// };

// export default VehiculeModal;



import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, message, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { vehiculeService } from '../../services/vehiculeService';
import { Vehicule } from '../../types/vehicule';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Vehicule | null;
}

const VehiculeModal = ({ isOpen, onClose, onSuccess, initialData }: Props) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          date_mise_circulation: initialData.date_mise_circulation ? dayjs(initialData.date_mise_circulation) : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [initialData, isOpen, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      const formattedData = {
        ...values,
        date_mise_circulation: values.date_mise_circulation.format('YYYY-MM-DD'),
      };

      if (initialData) {
        await vehiculeService.update(initialData.id, formattedData);
        message.success("Véhicule mis à jour avec succès");
      } else {
        await vehiculeService.create(formattedData);
        message.success("Nouveau véhicule ajouté");
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      // Check if it's a validation error or API error
      if (error.errorFields) return; 
      message.error("Erreur: Le matricule existe peut-être déjà ou session expirée.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={<span className="text-xl font-bold dark:text-white">{initialData ? '📝 Modifier le véhicule' : '🚗 Nouveau véhicule'}</span>}
      open={isOpen}
      onCancel={onClose}
      onOk={handleSave}
      confirmLoading={submitting}
      okText={initialData ? "Mettre à jour" : "Ajouter"}
      cancelText="Annuler"
      width={600}
      zIndex={2000} // Fix: Overlay above Navbar
      centered
      okButtonProps={{ className: "bg-blue-600 hover:bg-blue-700 border-none h-10 px-6" }}
      cancelButtonProps={{ className: "h-10 px-6" }}
    >
      <Form form={form} layout="vertical" className="mt-6">
        <Form.Item name="matricule" label="Matricule" rules={[{ required: true, message: 'Requis' }]}>
          <Input placeholder="Ex: 12345-A-6" className="h-10" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="marque" label="Marque" rules={[{ required: true, message: 'Requis' }]}>
              <Input placeholder="Ex: Renault" className="h-10" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="model" label="Modèle" rules={[{ required: true, message: 'Requis' }]}>
              <Input placeholder="Ex: Clio" className="h-10" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="date_mise_circulation" label="Date de Mise en Circulation" rules={[{ required: true, message: 'Requis' }]}>
          <DatePicker className="w-full h-10" placeholder="Sélectionner une date" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="valeur_venale" label="Valeur Vénale (DH)" rules={[{ required: true, message: 'Requis' }]}>
              <InputNumber className="w-full h-10 flex items-center" min={0} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="puissance_fiscale" label="Puissance Fiscale (CV)" rules={[{ required: true, message: 'Requis' }]}>
              <InputNumber className="w-full h-10 flex items-center" min={0} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default VehiculeModal;