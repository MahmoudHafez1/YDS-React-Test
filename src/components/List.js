import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const List = () => {
  const [addressList, setAddressList] = useState();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/address/")
      .then((res) => console.log(res.data))
      .catch(() => alert("something went wrong"));
  }, []);

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Apartment</TableCell>
            <TableCell>Floor</TableCell>
            <TableCell>City</TableCell>
          </TableRow>
        </TableHead>
        <TableBody></TableBody>
      </Table>
    </>
  );
};

export default List;
