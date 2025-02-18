import React, { useEffect, useRef, useState } from "react";
import { Button, Box, Card, CardContent, Typography, CardActions, CardActionArea, Grid2 } from "@mui/material";
import { Table, TableBody, TableCell, TableRow, TableHead } from "@mui/material";
import { JGEngine } from "../../jgEngine/jgEngine";
import { LatLng, Jotter } from "../../jgEngine/types";
import { Jotting } from "../../jgEngine/models/jotting";

type Props = {
  sampleProp ?: any;
}

export const DevPage: React.FC<Props> = ({ sampleProp }) => {

  // ___ state ___ ___ ___ ___ ___
  const [ sampleState,  setSampleState ]  = useState<string>('This is SampleState');
  const [ gpsCoords,    setGPSCoords ]    = useState<LatLng>({ lat: null, lng: null });
  const [ jottingList,  setJottingList ]  = useState<Array<Jotting>>([]);

  // ___ use ref ___ ___ ___ ___ ___
  // const inputRef = useRef<HTMLInputElement | null>(null);

  // ___ use effect ___ ___ ___ ___ ___
  useEffect( () => { console.log(sampleState) }, [ sampleState ] );

  // ___ event handler ___ ___ ___ ___ ___
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
  };

  const onClickGetGPSCoordsButton = async () => {

    const geoPos: GeolocationPosition = await JGEngine.getGPSCoords();
    const gpsCoords: LatLng = { lat: geoPos.coords.latitude, lng: geoPos.coords.longitude }
    setGPSCoords(gpsCoords);
    
  }

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
          <Card variant = "outlined">

            <Table>

              <TableHead>
                <TableRow>
                  <TableCell> ID         </TableCell>
                  <TableCell> Date       </TableCell>
                  <TableCell> Latitude   </TableCell>
                  <TableCell> Longitude  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {/** jottingList内のデータを一覧表示する */}
                { jottingList.map( (jotting: Jotting) => (
                  <TableRow key = { jotting.id }>
                    <TableCell> { jotting.id }                                              </TableCell>
                    <TableCell> { (jotting.metaData.date ? jotting.metaData.date : "-" ) }  </TableCell>
                    <TableCell> { (jotting.gpsCoords.lat ? jotting.gpsCoords.lat : "-" ) }  </TableCell>
                    <TableCell> { (jotting.gpsCoords.lng ? jotting.gpsCoords.lng : "-" ) }  </TableCell>
                  </TableRow>
                )) }
              </TableBody>

            </Table>

          </Card>
        </Grid2>

        <Grid2>

          {/** Geolocation APIの開発用 */}
          <Card variant = "outlined">

            <CardContent>

              <CardActionArea onClick = { onClickGetGPSCoordsButton }>
                <Typography variant = "h5" component = "div">
                  Get GPS Coordinates
                </Typography>
                <Typography variant = "body2" sx = {{ color: 'text.secondary' }}>
                  Get the location coordinates of the device from the browser's geolocation API.
                </Typography>
              </CardActionArea>

              <CardContent>
                {/** 取得したgpsCoordsを表示する */}
                {/** GPS座標が取得されていない場合、ハイフンを表示する */}
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell> Latitude </TableCell>
                      <TableCell> { (gpsCoords?.lat ? gpsCoords?.lat : "-" ) } </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell> Longitude </TableCell>
                      <TableCell> { (gpsCoords?.lng ? gpsCoords?.lng : "-" ) } </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>

            </CardContent>

          </Card>

        </Grid2>

        <Grid2>
          <Card variant = "outlined">
            <CardContent>
              <button onClick = { onClickAddJottingToListButton }> Add Jotting To List </button>
              <button onClick = { onClickClearJottingListButton }> Clear Jottings List </button>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2>
          <Card variant = "outlined">
            <button onClick = { onClickExportJSONButton }> Export JSON </button>
            <button onClick = { onClickImportJSONButton }> Import JSON </button>
          </Card>
        </Grid2>

      </Grid2>
      
      {/** IndexedDBの開発用 */}
      <Grid2 container spacing = { 2 }>
        <Card variant = "outlined">
          <button onClick = { onClickDBTestButton }> DB Test </button>
          <button onClick = { onClickDBSaveTestButton }> DB Save Test </button>
          <button onClick = { onClickDBReadAllTestButton }> DB Read All Test </button>
          <button onClick = { onClickDBReadTargetTestButton }> DB Read Target Test </button>
        </Card>
      </Grid2>

    </div>
  );
};

export default DevPage