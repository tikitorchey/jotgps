import React, { useEffect, useRef, useState } from "react";
import { Button, Box, Card, CardContent, Typography, CardActions, CardActionArea, Grid2, Tooltip } from "@mui/material";
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

  // ___ use effect ___ ___ ___ ___ ___
  useEffect( () => { console.log(sampleState) }, [ sampleState ] );

  // ___ event handler ___ ___ ___ ___ ___
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSampleState(newValue);
  };

  // ___ method ___ ___ ___ ___ ___

  const onClickDBSaveButton = async () => {
    const mockFunc = () => { ; }
    JGEngine.iDBCreateJottings(jottingList, mockFunc);
  }

  const onClickDBReadAllButton = async () => {
    JGEngine.iDBReadAllJottings(setJottingList);
  }

  const onClickDBReadTargetButton = async () => {
    const TARGET_KEYS = [ "01JMC2RCVXYPBVVWP824Q46HJZ" ];
    JGEngine.iDBReadTargetJottings(TARGET_KEYS, setJottingList);
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

    </Card>

  );
};

export default DevIDBControl