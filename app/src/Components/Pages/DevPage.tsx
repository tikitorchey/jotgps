import React, { useEffect, useRef, useState } from "react";
import { Button, Box, Card, CardContent, Typography, CardActions, CardActionArea, Grid2 } from "@mui/material";
import { Table, TableBody, TableCell, TableRow, TableHead } from "@mui/material";
import { JGEngine } from "../../jgEngine/jgEngine";
import { LatLng, Jotter } from "../../jgEngine/types";
import { Jotting } from "../../jgEngine/models/jotting";
import { DevJottingListViewer } from "../Organisms/Dev/DevJottingListViewer";
import { DevGPSViewer } from "../Organisms/Dev/DevGPSViewer";
import DevJottingListControl from "../Organisms/Dev/DevJottingListControl";
import DevExpImpControl from "../Organisms/Dev/DevExpImpControl";

export const DevPage: React.FC = () => {

  // ___ state ___ ___ ___ ___ ___
  // const [ sampleState,  setSampleState ]  = useState<string>('This is SampleState');
  const [ jottingList,  setJottingList ]  = useState<Array<Jotting>>([]);

  // ___ use ref ___ ___ ___ ___ ___

  // ___ use effect ___ ___ ___ ___ ___

  // ___ event handler ___ ___ ___ ___ ___
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
  };

  const onClickImportJSONButton = async () => {
    const importedJSON      = await JGEngine.importJSON();
    const importedJottings  = importedJSON as Array<Jotting>;
    setJottingList(importedJottings);
  }

  const onClickExportJSONButton = async () => {
    const fileName: string = "jotgps";
    await JGEngine.exportJSON(jottingList, fileName);
  }

  const onClickDBTestButton = async () => {
    JGEngine.iDBTest();
  }

  const onClickDBSaveTestButton = async () => {
    JGEngine.iDBCreateTest(jottingList);
  }

  const onClickDBReadAllTestButton = async () => {
    JGEngine.iDBReadAllTest(setJottingList);
  }

  const onClickDBReadTargetTestButton = async () => {
    JGEngine.iDBReadTargetTest(setJottingList);
  }


  // ___ method ___ ___ ___ ___ ___
  const test = () => {
    console.log('test');
  }

  return (

    <div>

      <h2>{ DevPage.name }</h2>

      <Grid2 container spacing = { 2 }>

        {/** 基本機能の開発用エリア */}
        <Grid2 container size = { 12 } spacing = { 2 }>

          {/** UI State */}
          <Grid2 size = { 12 } >
            <DevJottingListViewer jottingList = { jottingList } />
          </Grid2>

          {/** Jottingの管理用 */}
          <Grid2 size = {{ sm: 6 }}>
            <DevJottingListControl jottingList = { jottingList } setJottingList = { setJottingList } />
          </Grid2>

          {/** Import/Exportの開発用 */}
          <Grid2 size = {{ sm: 6 }}>
            <DevExpImpControl jottingList = { jottingList } setJottingList = { setJottingList }/>
          </Grid2>

        </Grid2>

        {/** 追加機能の開発用エリア */}
        <Grid2 container size = { 12 } spacing = { 2 } >

          {/** IndexedDBの開発用 */}
          <Grid2>
            <Card variant = "outlined">
              <CardContent>
                <button onClick = { onClickDBTestButton }>            DB Test             </button>
                <button onClick = { onClickDBSaveTestButton }>        DB Save Test        </button>
                <button onClick = { onClickDBReadAllTestButton }>     DB Read All Test    </button>
                <button onClick = { onClickDBReadTargetTestButton }>  DB Read Target Test </button>
              </CardContent>
            </Card>
          </Grid2>

        </Grid2>

        {/** 単体の小機能の開発用 */}
        <Grid2 container size = { 12 } spacing = { 2 } >

          {/** Geolocation APIの開発用 */}
          <Grid2>
            <DevGPSViewer />
          </Grid2>

        </Grid2>

      </Grid2>

    </div>
  );
};

export default DevPage