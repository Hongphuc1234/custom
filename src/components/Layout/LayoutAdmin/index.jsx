import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from '~/utils/theme/theme';
import Sidebar from '~/pages/Admin/scenes/global/Sidebar';
import Topbar from '~/pages/Admin/scenes/global/Topbar';
import { useState } from 'react';
function LayoutAdmin({ children }) {
    const [theme, colorMode] = useMode();
    const [isSidebar, setIsSidebar] = useState(true);
    return (
        <>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <div style={{ display: 'flex', position: 'relative' }}>
                        <Sidebar isSidebar={isSidebar} />
                        <main style={{width:'100%', height:'100%'}}>
                            <Topbar setIsSidebar={setIsSidebar} />
                            {children}
                        </main>
                    </div>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </>
    );
}

export default LayoutAdmin;
