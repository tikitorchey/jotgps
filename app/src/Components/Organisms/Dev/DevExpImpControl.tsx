import React, { useEffect, useRef, useState } from "react";
import { Button, Box, Card, CardContent, Typography, CardActions, CardActionArea, Grid2 } from "@mui/material";
import { ImportExport, FileUpload, FileDownload } from "@mui/icons-material";
import { JGEngine } from "../../../jgEngine/jgEngine";
import Jotting from "../../../jgEngine/models/jotting";


const FILE_NAME: string = "jotgps";

/**
 * Outline	: XXXするComponent
 * Logic		: - AAAをBBBにする
 *            - 親ComponentからCCCを受け取り、DDDとしたものを子Componentに渡す
 * View			: - KKKをリスト表示する
 */

// Type Declaration of Props
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
          <ImportExport /> Control Records Loaded on The UI
        </Typography>
        <Typography variant = "body2" sx = {{ color: 'text.secondary' }}>
          Import records from a JSON file and load them on the UI.
          Export the records on the UI to a JSON file and save it to the device.
        </Typography>
      </CardContent>

      <CardActions sx = {{ display: "flex", justifyContent: "flex-end" }}>
        <Button size = "small" onClick = { onClickExportButton }>   <FileUpload />    </Button>
        <Button size = "small" onClick = { onClickImportButton } >  <FileDownload />  </Button>
      </CardActions>

    </Card>
    
  );
};

export default DevExpImpControl