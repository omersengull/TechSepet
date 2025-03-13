import React from 'react';
import AdminSideBar from '../components/admin/AdminSideBar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminSideBar />
      {/* Menü sabit olduğundan, içerik menü altına gelmesi için üst boşluğu ayarlıyoruz */}
      <main >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
