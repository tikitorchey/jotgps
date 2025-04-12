import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography, CardActions } from "@mui/material";
import { Table, TableBody, TableCell, TableRow, TableHead } from "@mui/material";
import { DataArray, ArrowCircleRight, ArrowCircleLeft } from "@mui/icons-material";
import Jotting from "src/jgEngine/types/jotting";


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

  const displayJottingInfo = (jotting: Jotting | undefined) => {
    window.prompt(
      JSON.stringify(jotting, null , 2),
      JSON.stringify(jotting)
    );
  }

  /**
   * テーブルの各行を生成する関数。
   * Jottingを受け取りセルに各データを表示する。
   * undefinedを受け取った場合にも行を生成する。
   * @param jotting 
   * @returns 
   */
  const provideTableRow = (jotting: Jotting | undefined): React.JSX.Element => {

    const shortenID = (id   : string): string => { return id.slice(-5) };
    const formtDate = (date : number): string => { return (new Date(date)).toString() };

    // Math.random() -> Reactの仕様上、空データ行でもキーが必要なため適当に生成
    const row: React.JSX.Element = 

      <TableRow key = { jotting?.id ? jotting.id : Math.random() }>

        {/** ID */}
        <TableCell>
          <Button onClick = { () => displayJottingInfo(jotting) }>
            { jotting?.id ? shortenID(jotting.id) : "-" }
          </Button>
        </TableCell>

        {/** Date */}
        {/**
        <TableCell>
          { (jotting?.metaData.date.created ? formtDate(jotting.metaData.date.created) : "-" ) }
        </TableCell>
        */}
        <TableCell>
          { (jotting?.metaData.date.updated ? formtDate(jotting.metaData.date.updated) : "-" ) }
        </TableCell>


      </TableRow>

    return row;
  }

  const provideTableRows = (tableSize: number): Array<React.JSX.Element> => {

    const rows = [];

    for(let i = 0; i < tableSize; i++){
      const targetJotting : Jotting | undefined = jottingList[ i + (tableIndex * TABLE_SIZE) ];
      const row           : React.JSX.Element   = provideTableRow(targetJotting);
      rows.push(row);
    }
    
    return rows;
  } 

  return (

    <Card variant = "outlined">
      
      <CardContent>

        <Typography variant = "h5" component = "div">
          <DataArray /> Jotting Records
        </Typography>
        
        <Typography variant = "body2" sx = {{ color: 'text.secondary' }}>
          UI上に読み込まれたレコードの一覧です。
          IndexedDB内に保存されたレコードとは別物です。
        </Typography>

        <Table>

          <TableHead>
            <TableRow>
              <TableCell> ID            </TableCell>
              <TableCell> Updated Date  </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/** jottingList内のデータを一覧表示する */}
            { provideTableRows(TABLE_SIZE) }
          </TableBody>

        </Table>

        <CardActions sx = {{ display: "flex", justifyContent: "flex-end" }}>
          <Typography sx = {{ marginRight: "auto" }}> Number of Records: { jottingList.length } </Typography>
          <Typography> Page: { tableIndex } </Typography>
          <Button size = "small" onClick = { decrementTableIndex } > <ArrowCircleLeft/> </Button>
          <Button size = "small" onClick = { incrementTableIndex } > <ArrowCircleRight/> </Button>
        </CardActions>

      </CardContent>

    </Card>
  );
};

export default DevJottingListViewer