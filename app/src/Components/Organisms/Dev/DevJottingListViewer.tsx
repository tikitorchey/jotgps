import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography, CardActions } from "@mui/material";
import { Table, TableBody, TableCell, TableRow, TableHead } from "@mui/material";
import { ArrowCircleRight, ArrowCircleLeft } from "@mui/icons-material";
import Jotting from "src/jgEngine/models/jotting";

/**
 * Outline	: XXXするComponent
 * Logic		: - AAAをBBBにする
 *            - 親ComponentからCCCを受け取り、DDDとしたものを子Componentに渡す
 * View			: - KKKをリスト表示する
 */

// Type Declaration of Props
type Props = {
  jottingList: Array<Jotting>;
}

export const DevJottingListViewer: React.FC<Props> = ({ jottingList }) => {

  const TABLE_SIZE: number = 5;

  // ___ state ___ ___ ___ ___ ___
  const [ sampleState, setSampleState ] = useState<string>('This is SampleState');
  const [ tableIndex, setTableIndex ] = useState<number>(0);

  // ___ use effect ___ ___ ___ ___ ___
  useEffect( () => { console.log(sampleState) }, [ sampleState ] );

  // ___ event handler ___ ___ ___ ___ ___
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSampleState(newValue);
  };

  // ___ method ___ ___ ___ ___ ___
  const test = () => {
    console.log('test');
  }
  
  const onClickResetButton = () => {
    const initialVal = 'This is SampleState';
    setSampleState(initialVal);
  }

  const incrementTableIndex = () => {
    setTableIndex(tableIndex + 1);
  }

  const decrementTableIndex = () => {
    if(tableIndex > 1){
      setTableIndex(tableIndex - 1);
    } else {
      setTableIndex(0);
    }
  }

  const provideRow = (jotting: Jotting) => {
    const row = 
      <TableRow key = { jotting?.id }>
        <TableCell> { jotting?.id }                                              </TableCell>
        <TableCell> { (jotting?.metaData.date ? jotting.metaData.date : "-" ) }  </TableCell>
        <TableCell> { (jotting?.gpsCoords.lat ? jotting.gpsCoords.lat : "-" ) }  </TableCell>
        <TableCell> { (jotting?.gpsCoords.lng ? jotting.gpsCoords.lng : "-" ) }  </TableCell>
      </TableRow>
    return row;
  }

  return (

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
          { provideRow(jottingList[ 0 + (tableIndex * TABLE_SIZE) ]) }
          { provideRow(jottingList[ 1 + (tableIndex * TABLE_SIZE) ]) }
          { provideRow(jottingList[ 2 + (tableIndex * TABLE_SIZE) ]) }
          { provideRow(jottingList[ 3 + (tableIndex * TABLE_SIZE) ]) }
          { provideRow(jottingList[ 4 + (tableIndex * TABLE_SIZE) ]) }
        </TableBody>

      </Table>

      <CardActions sx = {{ display: "flex", justifyContent: "flex-end" }}>
        <Typography> Page: { tableIndex } </Typography>
        <Button size = "small" onClick = { decrementTableIndex } > <ArrowCircleLeft/> </Button>
        <Button size = "small" onClick = { incrementTableIndex } > <ArrowCircleRight/> </Button>
      </CardActions>

    </Card>
  );
};

export default DevJottingListViewer