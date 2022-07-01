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
      .max(5, "Enter Valid Name (Max 255 char)"),
    description: yup.string().required("Required"),
    apartment_number: yup
      .number()
      .typeError("Required")
      .required("Required")
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

const Form = () => {
  const [states, setStates] = useState();
  const [showForm, setShowForm] = useState(false);

  const classes = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post("http://127.0.0.1:8000/address/", data);
      alert("Created Successfully");
    } catch {
      alert("something went wrong");
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/address/states")
      .then((res) => setStates(res.data))
      .catch(() => alert("something went wrong"));
  }, []);

  return (
    <>
      <Button
        onClick={() => setShowForm((state) => !state)}
        variant="contained"
        color={showForm ? "error" : "success"}
      >
        {showForm ? "Close" : "Create New Address"}
      </Button>
      <Collapse in={showForm}>
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          <Grid container spacing={2} marginBottom={2}>
            <Grid item xs={12} md={12}>
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                fullWidth
                required
                {...register("name")}
                error={errors.name ? true : false}
                helperText={errors.name ? errors.name.message : null}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                id="outlined-basic"
                label="Address"
                variant="outlined"
                fullWidth
                required
                {...register("description")}
                error={errors.description ? true : false}
                helperText={
                  errors.description ? errors.description.message : null
                }
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
                {...register("apartment_number")}
                error={errors.apartment_number ? true : false}
                helperText={
                  errors.apartment_number
                    ? errors.apartment_number.message
                    : null
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
                {...register("floor_number")}
                error={errors.floor_number ? true : false}
                helperText={
                  errors.floor_number ? errors.floor_number.message : null
                }
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
          </Grid>
          <Button type="submit" fullWidth variant="contained">
            Submit
          </Button>
        </form>
      </Collapse>
    </>
  );
};

export default Form;
