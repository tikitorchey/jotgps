import React, { useEffect, useState } from "react";
import { Button, Card, CardContent, Typography, CardActions, Grid2, Tooltip } from "@mui/material";
import { DataArray, AddCircleOutline, RemoveCircleOutline, DeleteForever } from "@mui/icons-material";
import { JGEngine } from "../../../core/jgEngine";
import { UXSupport } from "../../../core/uxSupport";
import { Jotting } from "../../../core/types/jotting";
import { JottingFactory } from "../../../core/factories/jottingFactory";


type Props = {
  jottingList   : Array<Jotting>;
  setJottingList: (jottingList: Array<Jotting>) => void;
}

export const DevJottingListControl: React.FC<Props> = ({ jottingList, setJottingList }) => {

  // ___ state ___ ___ ___ ___ ___
  const [ sampleState, setSampleState ] = useState<string>('This is SampleState');

  // ___ use effect ___ ___ ___ ___ ___

  // ___ event handler ___ ___ ___ ___ ___

  // ___ method ___ ___ ___ ___ ___

  const onClickAddButton = () => {

    // GPS機能の許可ステータスをアナウンス
    // 権限要求を拒否した場合の、レスポンス喪失を防ぐために実行する
    UXSupport.handleGPSPermission();

    // GPS座標の取得成功時の処理
    const successCallback: PositionCallback = (geoPos: GeolocationPosition) => {

      const jotting: Jotting = JottingFactory.create();

      JottingFactory.setGPSCoords(jotting, geoPos);

      /** Memo: structuredClone関数によりオブジェクトを複製する理由
       *    Reactはオブジェクト内部の変更を検出できない。
       *    そこで、オブジェクト自体を複製することでオブジェクトIDを変えることで変更を検出させている
       */
      const clonedList = structuredClone(jottingList);
      clonedList.push(jotting);
  
      setJottingList(clonedList);
    }

    // GPS座標を取得・セット
    JGEngine.getGPSCoords(successCallback);

  }

  const onClickClearButton = () => {
    const clearedList: Array<Jotting> = [];
    setJottingList(clearedList);
  }

  const onClickRemoveButton = () => {

    /** Memo: structuredClone関数によりオブジェクトを複製する理由
     *    Reactはオブジェクト内部の変更を検出できない。
     *    そこで、オブジェクト自体を複製することでオブジェクトIDを変えることで変更を検出させている
     */
      const clonedList = structuredClone(jottingList);
      clonedList.pop();
  
      setJottingList(clonedList);
  }

  return (

    <Card variant = "outlined"  sx = {{ height: "100%" }}>

      <CardContent>
        <Typography variant = "h5" component = "div">
          <DataArray /> Jotting Records Control 
        </Typography>
        <Typography variant = "body2" sx = {{ color: 'text.secondary' }}>
          UI上に読み込まれたレコードの 全件削除 / 1件削除 / 新規作成 を行います。
          IndexedDB内に保存されたレコードとは別物です。
        </Typography>
      </CardContent>

      <CardActions sx = {{ display: "flex", justifyContent: "flex-end" }}>

        <Tooltip title = "全件削除">
          <Button size = "small" onClick = { onClickClearButton }> <DeleteForever  color = "secondary"/> </Button>
        </Tooltip>

        <Tooltip title = "1件削除">
          <Button size = "small" onClick = { onClickRemoveButton } > <RemoveCircleOutline/> </Button>
        </Tooltip>

        <Tooltip title = "新規作成">
          <Button size = "small" onClick = { onClickAddButton } > <AddCircleOutline/> </Button>
        </Tooltip>

      </CardActions>

    </Card>

  );
};

export default DevJottingListControl