import React, { useEffect, useRef, useState } from "react";
import { Button, Box, Card, CardContent, Typography, CardActions, CardActionArea, Grid2 } from "@mui/material";
import { Table, TableBody, TableCell, TableRow, TableHead } from "@mui/material";
import { JGEngine } from "../../jgEngine/jgEngine";
import { LatLng, Jotter } from "../../jgEngine/types";
import { Jotting } from "../../jgEngine/models/jotting";
import { DevJottingListViewer } from "../Organisms/Dev/DevJottingListViewer";
import { DevGPSViewer } from "../Organisms/Dev/DevGPSViewer";

export const DevPage: React.FC = () => {

  // ___ state ___ ___ ___ ___ ___
  // const [ sampleState,  setSampleState ]  = useState<string>('This is SampleState');
  const [ jottingList,  setJottingList ]  = useState<Array<Jotting>>([]);

  // ___ use ref ___ ___ ___ ___ ___

  // ___ use effect ___ ___ ___ ___ ___

  // ___ event handler ___ ___ ___ ___ ___
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
  };

  const onClickAddJottingToListButton = async () => {

    const jotting: Jotting = new Jotting();

    // GPS座標を取得・セット
    const geoPos: GeolocationPosition = await JGEngine.getGPSCoords();
    jotting.initialize(geoPos);

    /** Memo: structuredClone関数によりオブジェクトを複製する理由
     *    Reactはオブジェクト内部の変更を検出できない。
     *    そこで、オブジェクト自体を複製することでオブジェクトIDを変えることで変更を検出させている
     */
    const clonedJottingList = structuredClone(jottingList);
    clonedJottingList.push(jotting);

    setJottingList(clonedJottingList);

  }

  const onClickClearJottingListButton = () => {
    setJottingList([]);
  }

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

      {/** 基本機能の開発用 */}
      <Grid2 container spacing = { 2 }>

        {/** UI State */}
        <Grid2 size = { 12 }>
          <DevJottingListViewer jottingList = { jottingList } />
        </Grid2>

        <Grid2>
          <Card variant = "outlined">
            <CardContent>
              <button onClick = { onClickAddJottingToListButton }> Add Jotting To List </button>
              <button onClick = { onClickClearJottingListButton }> Clear Jottings List </button>
            </CardContent>
          </Card>
        </Grid2>
      
        {/** IndexedDBの開発用 */}
        <Grid2>
          <Card variant = "outlined">
            <CardContent>
              <button onClick = { onClickDBTestButton }> DB Test </button>
              <button onClick = { onClickDBSaveTestButton }> DB Save Test </button>
              <button onClick = { onClickDBReadAllTestButton }> DB Read All Test </button>
              <button onClick = { onClickDBReadTargetTestButton }> DB Read Target Test </button>
            </CardContent>
          </Card>
        </Grid2>

       {/** Import/Exportの開発用 */}
        <Grid2>
          <Card variant = "outlined">
            <CardContent>
              <button onClick = { onClickExportJSONButton }> Export JSON </button>
              <button onClick = { onClickImportJSONButton }> Import JSON </button>
            </CardContent>
          </Card>
        </Grid2>

        {/** Geolocation APIの開発用 */}
        <Grid2>
          <DevGPSViewer />
        </Grid2>

      </Grid2>

    </div>
  );
};

export default DevPage