import React, { useEffect, useRef, useState } from "react";
import { Button, Box, Card, CardContent, Typography, CardActions, CardActionArea, Grid2 } from "@mui/material";
import { Table, TableBody, TableCell, TableRow, TableHead } from "@mui/material";
import { JGEngine } from "../../jgEngine/jgEngine";
import { LatLng, Jotter } from "../../jgEngine/types/types";
import { Jotting } from "../../jgEngine/types/jotting";
import { DevJottingListViewer } from "../Organisms/Dev/DevJottingListViewer";
import { DevGPSViewer } from "../Organisms/Dev/DevGPSViewer";
import DevJottingListControl from "../Organisms/Dev/DevJottingListControl";
import DevExpImpControl from "../Organisms/Dev/DevExpImpControl";
import DevIDBControl from "../Organisms/Dev/DevIDBControl";

export const DevPage: React.FC = () => {

  // ___ state ___ ___ ___ ___ ___
  // const [ sampleState,  setSampleState ]  = useState<string>('This is SampleState');
  const [ jottingList,  setJottingList ]  = useState<Array<Jotting>>([]);

  // ___ use ref ___ ___ ___ ___ ___

  // ___ use effect ___ ___ ___ ___ ___

  // ___ event handler ___ ___ ___ ___ ___
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
  };

  // ___ method ___ ___ ___ ___ ___
  const test = () => {
    console.log('test');
  }

  return (

    <Grid2 container spacing = { 2 }>

      {/** UI(State)に読み込まれているレコードの表示系 */}
      <Grid2 container size = { 12 } spacing = { 2 }>

        <Grid2 size = { 12 } >
          <DevJottingListViewer jottingList = { jottingList } />
        </Grid2>

      </Grid2>

      {/** レコードのコントロール系 */}
      <Grid2 container size = { 12 } spacing = { 2 }>

        {/** Jotting */}
        <Grid2 size = {{ sm: 6 }}>
          <DevJottingListControl jottingList = { jottingList } setJottingList = { setJottingList } />
        </Grid2>

        {/** Import/Export */}
        <Grid2 size = {{ sm: 6 }}>
          <DevExpImpControl jottingList = { jottingList } setJottingList = { setJottingList }/>
        </Grid2>

        {/** IndexedDB */}
        <Grid2 size = {{ sm: 6 }}>
          <DevIDBControl jottingList = { jottingList } setJottingList = { setJottingList }  />
        </Grid2>

        {/** Geolocation API */}
        <Grid2 size = {{ sm: 6 }}>
          <DevGPSViewer />
        </Grid2>

      </Grid2>

    </Grid2>
  );
};

export default DevPage