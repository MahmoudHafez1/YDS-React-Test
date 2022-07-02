import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  FormHelperText,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const useStyles = makeStyles(() => ({
  form: {
    boxSizing: "border-box",
    margin: "2rem",
    padding: "2rem",
    maxWidth: "50rem",
    backgroundColor: "White",
    borderRadius: "0.5rem",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
  },
  error: {
    color: "red",
    left: "0",
    fontSize: "0.9rem",
  },
}));

const schema = yup
  .object({
    name: yup
      .string()
      .required("Required")
      .max(255, "Enter Valid Name (Max 255 char)"),
    description: yup.string().required("Required"),
    apartment_number: yup
      .number()
      .typeError("Required")
      .required("Required")
      .positive("Apartment Number is not valid")
      .integer("Apartment Number is not valid"),
    floor_number: yup
      .number("Required")
      .typeError("Required")
      .required("Required")
      .integer("Floor Number is not valid"),
    area: yup
      .number()
      .typeError("Required")
      .required("Required")
      .positive()
      .integer("City is not valid"),
  })
  .required();

const Form = ({ formMode, formModeHandler, reloadAddressListHandler }) => {
  const [states, setStates] = useState();
  const [showForm, setShowForm] = useState(formMode === "new" ? false : true);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (formMode === "new") {
        await axios.post("http://127.0.0.1:8000/address/", data);
        alert("Created Successfully");
      } else {
        await axios.patch(`http://127.0.0.1:8000/address/${formMode}/`, data);
        alert("Edited Successfully");
        setShowForm(false);
      }
      formModeHandler();
      reloadAddressListHandler();
    } catch {
      alert("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async () => {
    try {
      setLoading(true);
      if (window.confirm("Are you sure you want to delete this address?")) {
        await axios.delete(`http://127.0.0.1:8000/address/${formMode}`);
        alert("Deleted Successfully");
        setShowForm(false);
        formModeHandler();
        reloadAddressListHandler();
      }
    } catch {
      alert("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/address/states")
      .then((res) => setStates(res.data))
      .catch(() => alert("something went wrong"));
  }, []);

  useEffect(() => {
    if (formMode === "new") {
      reset({
        name: "",
        description: "",
        apartment_number: "",
        floor_number: "",
        area: "",
      });
    } else {
      axios
        .get(`http://127.0.0.1:8000/address/${formMode}`)
        .then((res) => {
          const { name, description, apartment_number, floor_number, area } =
            res.data;
          reset({
            name,
            description,
            apartment_number,
            floor_number,
            area,
          });
          setShowForm(true);
        })
        .catch(() => alert("something went wrong"));
    }
  }, [formMode]);

  return (
    <>
      <Button
        onClick={() => {
          if (showForm && formMode !== "new") {
            formModeHandler();
          }
          setShowForm((state) => !state);
        }}
        variant={showForm ? "outlined" : "contained"}
        color={showForm ? "error" : "success"}
      >
        {showForm ? "cancel" : "Create New Address"}
      </Button>

      <Collapse in={showForm}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                fullWidth
                required
                value={watch("name") ? watch("name") : ""}
                {...register("name")}
                error={errors.name ? true : false}
                helperText={errors.name && errors.name.message}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                id="outlined-basic"
                label="Address"
                variant="outlined"
                fullWidth
                required
                value={watch("description") ? watch("description") : ""}
                {...register("description")}
                error={errors.description ? true : false}
                helperText={errors.description && errors.description.message}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic"
                label="Apartment Number"
                variant="outlined"
                type="number"
                fullWidth
                required
                value={
                  watch("apartment_number") ? watch("apartment_number") : ""
                }
                {...register("apartment_number")}
                error={errors.apartment_number ? true : false}
                helperText={
                  errors.apartment_number && errors.apartment_number.message
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="outlined-basic"
                label="Floor Number"
                variant="outlined"
                type="number"
                fullWidth
                required
                value={watch("floor_number") ? watch("floor_number") : ""}
                {...register("floor_number")}
                error={errors.floor_number ? true : false}
                helperText={errors.floor_number && errors.floor_number.message}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl
                fullWidth
                required
                error={errors.floor_number ? true : false}
              >
                <InputLabel id="select-state">City</InputLabel>
                <Select
                  labelId="select-state"
                  label="state"
                  defaultValue=""
                  value={watch("area") ? watch("area") : ""}
                  {...register("area")}
                >
                  {states &&
                    states.map((state) => (
                      <MenuItem key={state.id} value={state.id}>
                        {state.name}&nbsp;&nbsp;{state.name_ar}
                      </MenuItem>
                    ))}
                </Select>
                {errors.area && (
                  <FormHelperText style={{ color: "#d32f2f" }}>
                    {errors.area.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={formMode === "new" ? 12 : 6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
              >
                {formMode === "new" ? "ADD" : "Edit"}
              </Button>
            </Grid>
            {formMode !== "new" && (
              <Grid item xs={12} md={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  onClick={deleteHandler}
                  disabled={loading}
                >
                  Delete
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </Collapse>
    </>
  );
};

export default Form;
