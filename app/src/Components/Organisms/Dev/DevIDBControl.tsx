import React, { useEffect, useRef, useState } from "react";
import { Button, Box, Card, CardContent, Typography, CardActions, CardActionArea, Grid2, Tooltip } from "@mui/material";
import { ImportExport, FileUpload, FileDownload } from "@mui/icons-material";
import { JGEngine } from "../../../jgEngine/jgEngine";
import { Jotting } from "../../../jgEngine/models/jotting";

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

export const DevIDBControl: React.FC<Props> = ({ jottingList, setJottingList }) => {

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
    const TARGET_KEYS = ["01JMC2RCVXYPBVVWP824Q46HJZ"];
    JGEngine.iDBReadTargetTest(TARGET_KEYS, setJottingList);
  }


  return (
    <Card variant = "outlined"  sx = {{ height: "100%" }}>

      <CardContent>
        <Typography variant = "h5" component = "div">
          <ImportExport /> Export / Import Records Loaded on The UI
        </Typography>
        <Typography variant = "body2" sx = {{ color: 'text.secondary' }}>

          * To check the database directly, go to Developer mode(F12 key) {'>'} Application Tab {`>`} Storage Tab {`>`} IndexedDB (in Chrome environment)
        </Typography>
      </CardContent>

      <CardActions sx = {{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title = "Initialize the IndexedDB">
          <Button size = "small" onClick = { onClickDBTestButton }> <FileUpload /> </Button> 
        </Tooltip>
        <Tooltip title = "Save Data on the UI to the IndexedDB">
          <Button size = "small" onClick = { onClickDBSaveTestButton }> <FileUpload /> </Button>
        </Tooltip>
        <Tooltip title = "Load Data on the IndexDB to the UI">
          <Button size = "small" onClick = { onClickDBReadAllTestButton }> <FileUpload /> </Button>
        </Tooltip>
        <Tooltip title = "Load Target Data on the IndexDB to the UI">
          <Button size = "small" onClick = { onClickDBReadTargetTestButton }> <FileUpload /> </Button>
        </Tooltip>

      </CardActions>

    </Card>

  );
};

export default DevIDBControl