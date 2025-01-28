import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { JGEngine } from "../../jgEngine/JGEngine";
import { LatLng, Jotter } from "../../jgEngine/Types";
import { Jotting } from "../../jgEngine/Models/Jotting";

type Props = {
  sampleProp ?: any;
}

export const DevPage: React.FC<Props> = ({ sampleProp }) => {

  // ___ state ___ ___ ___ ___ ___
  const [ sampleState,  setSampleState ]  = useState<string>('This is SampleState');
  const [ gpsCoords,    setGPSCoords ]    = useState<LatLng>({ lat: null, lng: null });
  const [ jottingList,  setJottingList ]  = useState<Array<Jotting>>([]);

  // ___ use effect ___ ___ ___ ___ ___
  useEffect( () => { console.log(sampleState) }, [ sampleState ] );

  // ___ event handler ___ ___ ___ ___ ___
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
  };

  const onClickGetGPSCoordsButton = async () => {

    const geoPos: GeolocationPosition = await JGEngine.getGPSCoords();
    const gpsCoords: LatLng = { 
      lat: geoPos.coords.latitude,
      lng: geoPos.coords.longitude
    }
    setGPSCoords(gpsCoords);
    
  }

  const onClickAddJottingToListButton = async () => {

    const jotting: Jotting = new Jotting();

    // GPS座標を取得・セット
    const gpsCoords: GeolocationPosition = await JGEngine.getGPSCoords();
    jotting.gpsCoords.lat = gpsCoords.coords.latitude;
    jotting.gpsCoords.lng = gpsCoords.coords.longitude;

    /** Memo: structuredClone関数によりオブジェクトを複製する理由
     *    Reactはオブジェクト内部の変更を検出できない。
     *    そこで、オブジェクト自体を複製することでオブジェクトIDを変えることで変更を検出させている
     */
    const clonedJottingList = structuredClone(jottingList);
    clonedJottingList.push(jotting);

    setJottingList(clonedJottingList);

  }

  // ___ method ___ ___ ___ ___ ___
  const test = () => {
    console.log('test');
  }

  return (

    <div>

      <h2>{ DevPage.name }</h2>

      <Button onClick = { onClickGetGPSCoordsButton }     variant = "outlined" size = "small"> Get GPS Coords </Button>
      <Button onClick = { onClickAddJottingToListButton } variant = "outlined" size = "small"> Add Jotting To List </Button>

      {/** 取得したgpsCoordsを表示する */}
      {/** GPS座標が取得されていない場合、ハイフンを表示する */}
      <p> { "Lat: " + (gpsCoords?.lat ? gpsCoords?.lat : "-" ) } </p>
      <p> { "Lng: " + (gpsCoords?.lng ? gpsCoords?.lng : "-" ) } </p>

      <table>
        <caption>
          Jotting Records
        </caption>
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
              <th> { (jotting.metaData.date ? jotting.metaData.date.toDateString() : "-" ) } </th>
              <th> { (jotting.gpsCoords.lat ? jotting.gpsCoords.lat : "-" ) } </th>
              <th> { (jotting.gpsCoords.lng ? jotting.gpsCoords.lng : "-" ) } </th>
            </tr>
          )) }
        </tbody>
      </table>

    </div>
  );
};

export default DevPage