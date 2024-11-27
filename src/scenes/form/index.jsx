import { useState } from "react";
import { Box, Button, TextField, Typography, Modal, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";

const roles = ["Admin", "Editor", "Viewer"];
const statuses = ["Active", "Inactive"];

const Form = () => {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const handleFormSubmit = (values) => {
    if (editUser) {
      setUsers((prev) =>
        prev.map((user) => (user.id === editUser.id ? { ...user, ...values } : user))
      );
    } else {
      setUsers((prev) => [...prev, { ...values, id: Date.now() }]);
    }
    setOpenModal(false);
    setEditUser(null);
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setOpenModal(true);
  };

  return (
    <Box m="20px">
      <Header title="USER MANAGEMENT" subtitle="Manage Users, Roles, and Status" />

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditUser(null);
          setOpenModal(true);
        }}
      >
        Add User
      </Button>

      {/* Updated User Table with horizontal scroll */}
      <Box 
        mt="20px" 
        height="400px" 
        >
        <DataGrid
          rows={users}
          columns={[
            { field: "id", headerName: "ID", width: 90 },
            { field: "firstName", headerName: "First Name", flex: 1 },
            { field: "lastName", headerName: "Last Name", flex: 1 },
            { field: "email", headerName: "Email", flex: 1 },
            { field: "contact", headerName: "Contact", flex: 1 },
            { field: "role", headerName: "Role", flex: 1 },
            { field: "status", headerName: "Status", flex: 1 },
            {
              field: "actions",
              headerName: "Actions",
              renderCell: (params) => (
                <Box display="flex" gap="10px">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openEditModal(params.row)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.id)}
                  >
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
        sx={{
          backdropFilter: "blur(4px)", // Background blur
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            bgcolor: "background.paper",
            color: "text.primary",
            borderRadius: "8px",
            boxShadow: 24,
            p: "20px",
          }}
        >
          <Typography variant="h5" align="center" mb="20px">
            {editUser ? "Edit User" : "Add User"}
          </Typography>

          <Formik
            onSubmit={handleFormSubmit}
            initialValues={editUser || initialValues}
            validationSchema={userSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={!!touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={!!touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Contact"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.contact}
                  name="contact"
                  error={!!touched.contact && !!errors.contact}
                  helperText={touched.contact && errors.contact}
                  margin="dense"
                />
                <TextField
                  fullWidth
                  variant="filled"
                  select
                  label="Role"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  margin="dense"
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  variant="filled"
                  select
                  label="Status"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  margin="dense"
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
                <Box display="flex" justifyContent="flex-end" mt="20px">
                  <Button type="submit" variant="contained" color="primary">
                    {editUser ? "Save Changes" : "Add User"}
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>
    </Box>
  );
};

const userSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  contact: yup.string().matches(/^[0-9]+$/, "Must be a valid number").required("Required"),
  role: yup.string().required("Required"),
  status: yup.string().required("Required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  role: "Viewer",
  status: "Active",
};

export default Form;
