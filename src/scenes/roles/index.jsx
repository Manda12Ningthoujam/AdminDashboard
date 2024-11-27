import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Formik } from 'formik';
import * as yup from 'yup';
import SecurityIcon from '@mui/icons-material/Security';

const roles = ["Admin", "Editor", "Viewer"];
const permissions = ["Read", "Write", "Delete"];

const RoleManagement = () => {
  const [rolesList, setRolesList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editRole, setEditRole] = useState(null);

  const handleFormSubmit = (values) => {
    if (editRole) {
      setRolesList((prev) =>
        prev.map((role) => (role.id === editRole.id ? { ...role, ...values } : role))
      );
    } else {
      setRolesList((prev) => [...prev, { ...values, id: Date.now() }]);
    }
    setOpenModal(false);
    setEditRole(null);
  };

  const openEditModal = (role) => {
    setEditRole(role);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setRolesList((prev) => prev.filter((role) => role.id !== id));
  };

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>Manage Roles and Permissions</Typography>

      <Button
        variant="contained"
        color="primary"
        startIcon={<SecurityIcon />}
        onClick={() => {
          setEditRole(null);
          setOpenModal(true);
        }}
      >
        Add Role
      </Button>

      <Box mt="20px" height="400px">
        <DataGrid
          rows={rolesList}
          columns={[
            { field: 'id', headerName: 'ID', width: 90 },
            { field: 'role', headerName: 'Role', flex: 1 },
            { field: 'permissions', headerName: 'Permissions', flex: 1 },
            {
              field: 'actions',
              headerName: 'Actions',
              renderCell: (params) => (
                <Box display="flex" gap="10px">
                  <Button variant="contained" color="primary" onClick={() => openEditModal(params.row)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(params.row.id)}>
                    Delete
                  </Button>
                </Box>
              ),
              flex: 1,
            },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>{editRole ? 'Edit Role' : 'Add Role'}</Typography>

          <Formik
            initialValues={editRole || { role: '', permissions: [] }}
            validationSchema={roleSchema}
            onSubmit={handleFormSubmit}
          >
            {({ values, handleChange, handleBlur, handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  name="role"
                  label="Role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.role && Boolean(errors.role)}
                  helperText={touched.role && errors.role}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  select
                  name="permissions"
                  label="Permissions"
                  value={values.permissions}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  SelectProps={{ multiple: true }}
                  error={touched.permissions && Boolean(errors.permissions)}
                  helperText={touched.permissions && errors.permissions}
                  margin="normal"
                >
                  {permissions.map((permission) => (
                    <MenuItem key={permission} value={permission}>
                      {permission}
                    </MenuItem>
                  ))}
                </TextField>

                <Button type="submit" variant="contained" color="primary" fullWidth>
                  {editRole ? 'Save Changes' : 'Add Role'}
                </Button>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>
    </Box>
  );
};

const roleSchema = yup.object().shape({
  role: yup.string().required('Role is required'),
  permissions: yup.array().min(1, 'At least one permission is required'),
});

export default RoleManagement;
