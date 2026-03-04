import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function Users() {
  const { t } = useTranslation();
  const { users, deleteUser, user } = useAuth();

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
      <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('users.usersAdminOnly')}</h2>

      <DataGrid
        rows={users}
        columns={columns}
        autoHeight
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </div>
  );
}
