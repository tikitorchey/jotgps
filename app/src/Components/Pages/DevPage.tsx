import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import JGEngine from "../../jgEngine/JGEngine";
import { LatLng } from "../../jgEngine/Types";

type Props = {
  sampleProp ?: any;
}

export const DevPage: React.FC<Props> = ({ sampleProp }) => {

  // ___ state ___ ___ ___ ___ ___
  const [ sampleState,  setSampleState ]  = useState<string>('This is SampleState');
  const [ gpsCoords,    setGPSCoords ]    = useState<LatLng>();

  // ___ use effect ___ ___ ___ ___ ___
  useEffect( () => { console.log(sampleState) }, [ sampleState ] );

  // ___ event handler ___ ___ ___ ___ ___
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
  };

  const onClickDevbutton = () => {
    const gpsCoord: LatLng = JGEngine.getGPSCoords();
    setGPSCoords(gpsCoord);
  }

  // ___ method ___ ___ ___ ___ ___
  const test = () => {
    console.log('test');
  }

  return (
    <div>
      <h2>{ DevPage.name }</h2>
      <Button onClick = { onClickDevbutton } variant="outlined" size = "small"> Get GPS Coord </Button>

      {/** GPS座標が取得されていない場合、ハイフンを表示する */}
      <p> { "Lat: " + (gpsCoords?.lat ? gpsCoords?.lat : "-" ) } </p>
      <p> { "Lng: " + (gpsCoords?.lng ? gpsCoords?.lng : "-" ) } </p>

    </div>
  );
};

export default DevPage