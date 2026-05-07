import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import OrganizationGraph3D from "../components/OrganizationGraph3D";

export default function Users() {
  const { t } = useTranslation();
  const { users, deleteUser, user } = useAuth();
  const [viewMode, setViewMode] = useState('list');

  const handleDelete = (id) => {
    if (!window.confirm(t('users.deleteConfirm'))) return;
    deleteUser(id);
  };

  const columns = [
    { field: "name", headerName: t('reports.name'), flex: 1 },
    { field: "email", headerName: t('reports.email'), flex: 1 },
    { field: "role", headerName: t('reports.role'), flex: 1 },
    {
      field: "actions",
      headerName: t('users.actions'),
      width: 150,
      sortable: false,
      renderCell: (params) =>
        user.role === "Admin" && params.row.role !== "Admin" ? (
          <button
            onClick={() => handleDelete(params.row.id)}
            className="text-red-600 font-semibold hover:underline"
          >
            {t('users.delete')}
          </button>
        ) : null,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow dark:bg-slate-800 dark:border dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">{t('users.usersAdminOnly', 'User Directory')}</h2>
        
        <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
          <button 
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            Table View
          </button>
          <button 
            onClick={() => setViewMode('graph')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'graph' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            3D Graph View
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <DataGrid
          rows={users}
          columns={columns}
          autoHeight
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          className="dark:text-white"
          sx={{
            border: 'none',
            '.dark &': {
              color: '#f8fafc',
              backgroundColor: '#1e293b', // slate-800
              borderColor: '#334155', // slate-700
              
              // Force all text to white
              '& *': {
                color: '#f8fafc',
              },

              // Cell borders
              '& .MuiDataGrid-cell': {
                borderColor: '#334155',
              },
              
              // Header styling
              '& .MuiDataGrid-columnHeaders': {
                borderColor: '#334155',
                backgroundColor: '#0f172a !important', // slate-900
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#0f172a !important',
              },
              '& .MuiDataGrid-filler': {
                backgroundColor: '#0f172a !important',
              },

              // Footer styling
              '& .MuiDataGrid-footerContainer': {
                borderColor: '#334155',
                backgroundColor: '#0f172a !important',
              },

              // Row styling
              '& .MuiDataGrid-row': {
                backgroundColor: '#1e293b !important', // slate-800
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#334155 !important', // slate-700
              },

              // Icons and pagination
              '& .MuiIconButton-root': {
                color: '#94a3b8 !important', // slate-400
                backgroundColor: 'transparent !important', // Prevent white background when column header is hovered
              },
              '& .MuiIconButton-root:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1) !important', // Prevent solid white circle on hover
              },
              '& .MuiTablePagination-root': {
                color: '#f8fafc !important',
              }
            }
          }}
        />
      ) : (
        <OrganizationGraph3D />
      )}
    </div>
  );
}
