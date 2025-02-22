import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography, CardActions } from "@mui/material";
import { Table, TableBody, TableCell, TableRow, TableHead } from "@mui/material";
import { DataArray, ArrowCircleRight, ArrowCircleLeft } from "@mui/icons-material";
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
  const [ tableIndex, setTableIndex ] = useState<number>(0);

  // ___ use effect ___ ___ ___ ___ ___

  // ___ event handler ___ ___ ___ ___ ___

  // ___ method ___ ___ ___ ___ ___
  const test = () => {
    console.log('test');
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

  const provideTableCells = (tableSize: number): Array<React.JSX.Element> => {

    const table = [];

    const provideRow = (jotting: Jotting) => {
      const row: React.JSX.Element = 
        <TableRow key = { jotting?.id }>
          <TableCell> { jotting?.id }                                              </TableCell>
          <TableCell> { (jotting?.metaData.date ? jotting.metaData.date : "-" ) }  </TableCell>
          <TableCell> { (jotting?.gpsCoords.lat ? jotting.gpsCoords.lat : "-" ) }  </TableCell>
          <TableCell> { (jotting?.gpsCoords.lng ? jotting.gpsCoords.lng : "-" ) }  </TableCell>
        </TableRow>
      return row;
    }

    for(let i = 0; i < tableSize; i++){
      const targetJotting = jottingList[ i + (tableIndex * TABLE_SIZE) ];
      const row = provideRow(targetJotting)
      table.push(row);
    }
    
    return table;
  } 

  return (

    <Card variant = "outlined">
      
      <CardContent>

        <Typography variant = "h5" component = "div">
          <DataArray /> Records Loaded on UI 
        </Typography>
        <Typography variant = "body2" sx = {{ color: 'text.secondary' }}>
          This is a list of records loaded on React's State (different from the data saved on IndexedDB).
        </Typography>

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
            { provideTableCells(TABLE_SIZE) }
          </TableBody>

        </Table>

        <CardActions sx = {{ display: "flex", justifyContent: "flex-end" }}>
          <Typography> Page: { tableIndex } </Typography>
          <Button size = "small" onClick = { decrementTableIndex } > <ArrowCircleLeft/> </Button>
          <Button size = "small" onClick = { incrementTableIndex } > <ArrowCircleRight/> </Button>
        </CardActions>

      </CardContent>

    </Card>
  );
};

export default DevJottingListViewer