import React, { useEffect, useRef, useState } from "react";
import { Button, Card, CardContent, Grid2, Divider, TextField, Typography, CardActions, Tooltip } from "@mui/material";
import { Storage, Save, BrowserUpdated, DeleteForever } from "@mui/icons-material";
import { JGEngine } from "../../../jgEngine/jgEngine";
import { Jotting } from "../../../jgEngine/types/jotting";

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

  // ___ use ref ___ ___ ___ ___ ___
  const inputRefTargetKey1 = useRef<HTMLInputElement>(null);
  const inputRefTargetKey2 = useRef<HTMLInputElement>(null);
  const inputRefTargetKey3 = useRef<HTMLInputElement>(null);
  
  // ___ use effect ___ ___ ___ ___ ___
  useEffect( () => { console.log(sampleState) }, [ sampleState ] );

  // ___ event handler ___ ___ ___ ___ ___

  // ___ method ___ ___ ___ ___ ___

  const onClickDBSaveButton = async () => {
    const mockFunc = () => { ; }
    JGEngine.iDBCreateJottings(jottingList, mockFunc);
  }

  const onClickDBReadAllButton = async () => {
    JGEngine.iDBReadAllJottings(setJottingList);
  }

  const onClickDBReadTargetButton = async () => {
    const targetKeys: Array<string> = [];
    const push = (ref: React.RefObject<HTMLInputElement | null>) => {
      if(ref.current?.value){ targetKeys.push(ref.current?.value); }
    }
    [inputRefTargetKey1, inputRefTargetKey2, inputRefTargetKey3].forEach( (ref) => { push(ref); } )
    JGEngine.iDBReadJottingsByKey(targetKeys, setJottingList);
  }

  const onClickFactoryResetButton = async () => {
    JGEngine.iDBfactoryReset();
  }

  return (
    <Card variant = "outlined"  sx = {{ height: "100%" }}>

      <CardContent>
        <Typography variant = "h5" component = "div">
          <Storage /> IndexedDB
        </Typography>
        <Typography variant = "body2" sx = {{ color: 'text.secondary' }}>
          UIとIndexedDB間の連携処理を実行します。
          * To check the database directly, go to Developer mode(F12 key) {'>'} Application Tab {`>`} Storage Tab {`>`} IndexedDB (in Chrome environment)
        </Typography>
      </CardContent>

      <Divider />

      <CardActions sx = {{ display: "flex", justifyContent: "flex-end" }}>

        <Tooltip title = "IndexedDBへ保存">
          <Button size = "small" onClick = { onClickDBSaveButton }> <Save /> </Button>
        </Tooltip>

        <Tooltip title = "IndexDBから読み込み">
          <Button size = "small" onClick = { onClickDBReadAllButton }> <BrowserUpdated /> </Button>
        </Tooltip>

        <Tooltip title = "IndexDBをファクトリーリセット">
          <Button onClick = { onClickFactoryResetButton }> <DeleteForever color = "secondary" /> </Button>
        </Tooltip>

      </CardActions>

      <Divider />

      <CardActions sx = {{ display: "flex", justifyContent: "flex-end" }}>

        <Grid2 container spacing = { 1 }>
          <TextField label = "Target ID" variant = "outlined" sx = {{ marginRight: "auto" }} inputRef = { inputRefTargetKey1 }/>
          <TextField label = "Target ID" variant = "outlined" sx = {{ marginRight: "auto" }} inputRef = { inputRefTargetKey2 }/>
          <TextField label = "Target ID" variant = "outlined" sx = {{ marginRight: "auto" }} inputRef = { inputRefTargetKey3 }/>
        </Grid2>
        
        <Divider orientation = "vertical" flexItem />

        <Tooltip title = "IndexDBから読み込み">
          <Button size = "small" onClick = { onClickDBReadTargetButton }> <BrowserUpdated /> </Button>
        </Tooltip>

      </CardActions>

    </Card>

  );
};

export default DevIDBControl