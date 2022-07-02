import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  container: {
    width: "90%",
    marginBottom: "2rem",
  },
  tableRow: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#DADADA",
    },
  },
}));

const tableHeadStyle = {
  color: "#fff",
  backgroundColor: "#28282B",
  fontSize: "1.1rem",
  fontWeight: "400",
};

const List = ({ formModeHandler, reloadAddressList }) => {
  const [addressList, setAddressList] = useState();
  const [stateList, setStateList] = useState();
  const [loading, setLoading] = useState();

  const classes = useStyles();

  const fetchAddressAndStateList = async () => {
    try {
      setLoading(true);
      const addRes = await axios.get("http://127.0.0.1:8000/address/");
      setAddressList(addRes.data);
      if (!stateList) {
        const stateRes = await axios.get(
          "http://127.0.0.1:8000/address/states"
        );
        setStateList(stateRes.data);
      }
    } catch {
      alert("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddressAndStateList();
  }, [reloadAddressList]);

  const getStateName = (stateId) => {
    const state = stateList.find((st) => st.id === stateId);
    return state.name;
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (addressList?.length > 0)
    return (
      <div className={classes.container}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={tableHeadStyle}>
                  #
                </TableCell>
                <TableCell align="center" sx={tableHeadStyle}>
                  Name
                </TableCell>
                <TableCell align="center" sx={tableHeadStyle}>
                  Address
                </TableCell>
                <TableCell align="center" sx={tableHeadStyle}>
                  Apartment
                </TableCell>
                <TableCell align="center" sx={tableHeadStyle}>
                  Floor
                </TableCell>
                <TableCell align="center" sx={tableHeadStyle}>
                  City
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stateList &&
                addressList.map((addr, index) => (
                  <TableRow
                    key={addr.id}
                    className={classes.tableRow}
                    onClick={() => {
                      formModeHandler(addr.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{addr.name}</TableCell>
                    <TableCell align="center">{addr.description}</TableCell>
                    <TableCell align="center">
                      {addr.apartment_number}
                    </TableCell>
                    <TableCell align="center">{addr.floor_number}</TableCell>
                    <TableCell align="center">
                      {getStateName(addr.area)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
};

export default List;
