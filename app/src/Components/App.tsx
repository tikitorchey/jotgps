import React from 'react';
import { HashRouter, Route, Link, Routes } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { MainPage }       from './Pages/MainPage';
import { PreferencePage } from './Pages/PreferencePage';
import { HelpPage }       from './Pages/HelpPage';
import { DevPage }        from './Pages/DevPage';

const App : React.FunctionComponent = () => {

  return (
    <div>
      <HashRouter>

        { /** ナビゲーシション（Drawer） */ }
        <div className = 'Navigation'>

          <Grid container>

            <Grid size = {{ xs: 6, sm: 4, md: 3 }}>
              <Link to = '/' style = { { textDecoration: 'none' , fontWeight: 'bold' } }>
                <span>Main</span>
              </Link>
            </Grid>

            <Grid size = {{ xs: 6, sm: 4, md: 3 }}>
              <Link to = '/preference' style = { { textDecoration: 'none' , fontWeight: 'bold' } }>
                <span>Preference</span>
              </Link>
            </Grid>

            <Grid size = {{ xs: 6, sm: 4, md: 3 }}>
              <Link to = '/help' style = { { textDecoration: 'none' , fontWeight: 'bold' } }>
                <span>Help</span>
              </Link>
            </Grid>

            <Grid size = {{ xs: 6, sm: 4, md: 3 }}>
              <Link to = '/dev' style = { { textDecoration: 'none' , fontWeight: 'bold' } }>
                <span>Dev</span>
              </Link>
            </Grid>

          </Grid>

        </div>

        { /** メインコンテンツ URLに応じて表示内容を変更 */ }
        <div className = 'Main'>
          <Routes>
            <Route path = '/'           element = { <MainPage />} />
            <Route path = '/preference' element = { <PreferencePage />} />
            <Route path = '/help'       element = { <HelpPage />} />
            <Route path = '/dev'        element = { <DevPage />} />
          </Routes>
        </div>

      </HashRouter>
    </div>
  );
};

export default App;