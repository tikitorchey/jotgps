import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography, CardActionArea } from "@mui/material";
import { Table, TableBody, TableCell, TableRow, TableHead } from "@mui/material";
import { JGEngine } from "../../../jgEngine/jgEngine";
import { LatLng, Jotter } from "../../../jgEngine/types";

/**
 * Outline	: XXXするComponent
 * Logic		: - AAAをBBBにする
 *            - 親ComponentからCCCを受け取り、DDDとしたものを子Componentに渡す
 * View			: - KKKをリスト表示する
 */

export const DevGPSViewer: React.FC = () => {

  // ___ state ___ ___ ___ ___ ___
  const [ gpsCoords,    setGPSCoords ]    = useState<LatLng>({ lat: null, lng: null });

  // ___ use effect ___ ___ ___ ___ ___

  // ___ event handler ___ ___ ___ ___ ___

  // ___ method ___ ___ ___ ___ ___
  const test = () => {
    console.log('test');
  }
  
  const onClickGetGPSCoordsButton = async () => {

    const geoPos: GeolocationPosition = await JGEngine.getGPSCoords();
    const gpsCoords: LatLng = { lat: geoPos.coords.latitude, lng: geoPos.coords.longitude }
    setGPSCoords(gpsCoords);
    
  }

  return (
    <div>
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

    </div>
  );
};

export default DevGPSViewer