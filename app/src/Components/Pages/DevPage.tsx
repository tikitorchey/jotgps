import React, { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
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
    JGEngine.iDBReadAllTest();
  }

  const onClickDBReadTargetTestButton = async () => {
    JGEngine.iDBReadTargetTest();
  }


  // ___ method ___ ___ ___ ___ ___
  const test = () => {
    console.log('test');
  }

  return (

    <div>

      <h2>{ DevPage.name }</h2>

      {/** 基本機能の開発用 */}
      <div>
        <div>
          <button onClick = { onClickGetGPSCoordsButton }> Get GPS Coords </button>
        </div>
        <div>
          <button onClick = { onClickAddJottingToListButton }> Add Jotting To List </button>
          <button onClick = { onClickClearJottingListButton }> Clear Jottings List </button>
        </div>
        <div>
          <button onClick = { onClickExportJSONButton }> Export JSON </button>
        </div>
        <div>
          <button onClick = { onClickImportJSONButton }> Import JSON </button>
        </div>

        {/** 取得したgpsCoordsを表示する */}
        {/** GPS座標が取得されていない場合、ハイフンを表示する */}
        <p> { "Lat: " + (gpsCoords?.lat ? gpsCoords?.lat : "-" ) } </p>
        <p> { "Lng: " + (gpsCoords?.lng ? gpsCoords?.lng : "-" ) } </p>

        <table>
          <thead>
            <tr>
              <th scope = "col"> ID         </th>
              <th scope = "col"> Date       </th>
              <th scope = "col"> Latitude   </th>
              <th scope = "col"> Longitude  </th>
            </tr>
          </thead>
          <tbody>
            {/** jottingList内のデータを一覧表示する */}
            { jottingList.map( (jotting: Jotting) => (
              <tr key = { jotting.id }>
                <th scope = "row"> { jotting.id } </th>
                <th> { (jotting.metaData.date ? jotting.metaData.date : "-" ) } </th>
                <th> { (jotting.gpsCoords.lat ? jotting.gpsCoords.lat : "-" ) } </th>
                <th> { (jotting.gpsCoords.lng ? jotting.gpsCoords.lng : "-" ) } </th>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
      
      {/** IndexedDBの開発用 */}
      <div>
        <button onClick = { onClickDBTestButton }> DB Test </button>
        <button onClick = { onClickDBSaveTestButton }> DB Save Test </button>
        <button onClick = { onClickDBReadAllTestButton }> DB Read All Test </button>
        <button onClick = { onClickDBReadTargetTestButton }> DB Read Target Test </button>
      </div>

    </div>
  );
};

export default DevPage