import React, { useEffect, useRef, useState } from "react";
import { Button, Card, CardContent, Tooltip, Typography, CardActions } from "@mui/material";
import { ImportExport, FileUpload, FileDownload } from "@mui/icons-material";
import { JGEngine } from "../../../jgEngine/jgEngine";
import Jotting from "../../../jgEngine/models/jotting";


const FILE_NAME: string = "jotgps";

type Props = {
  jottingList: Array<Jotting>,
  setJottingList: any
}

export const DevExpImpControl: React.FC<Props> = ({ jottingList, setJottingList }) => {

  // ___ state ___ ___ ___ ___ ___
  const [ sampleState, setSampleState ] = useState<string>('This is SampleState');

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

  const onClickImportButton = async () => {
    const importedJSON      = await JGEngine.importJSON();
    const importedJottings  = importedJSON as Array<Jotting>;
    setJottingList(importedJottings);
  }

  const onClickExportButton = async () => {
    await JGEngine.exportJSON(jottingList, FILE_NAME);
  }

  return (

    <Card variant = "outlined"  sx = {{ height: "100%" }}>

      <CardContent>
        <Typography variant = "h5" component = "div">
          <ImportExport /> Export / Import 
        </Typography>
        <Typography variant = "body2" sx = {{ color: 'text.secondary' }}>
          UI上に読み込まれたレコードをJSONファイルに出力します。また、JSONファイルからレコードを読み込みUI上に復元します。
        </Typography>
      </CardContent>

      <CardActions sx = {{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title = "JSONファイルに出力">
          <Button size = "small" onClick = { onClickExportButton }> <FileUpload /> </Button>
        </Tooltip>
        <Tooltip title = "JSONファイルから読み込み">
          <Button size = "small" onClick = { onClickImportButton } > <FileDownload /> </Button>
        </Tooltip>
      </CardActions>

    </Card>
    
  );
};

export default DevExpImpControl