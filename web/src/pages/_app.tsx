import { ThemeProvider, CSSReset } from '@chakra-ui/core'

import theme from '../theme'
import React from 'react';

function MyApp({ Component, pageProps } : any) {

    // // START remedy to a browser warning: "Warning: Prop className did not match"
    // // this remedy was found in the example provided by the MUI team,
    // // which can be found here: material-ui/examples/nextjs
    // React.useEffect(() => {
    //     // Remove the server-side injected CSS.
    //     const jssStyles = document.querySelector('#jss-server-side');
    //     if (jssStyles) {
    //         jssStyles.parentElement.removeChild(jssStyles);
    //     }
    // }, []);
    // // END remedy to a browser error

  return (
        <ThemeProvider theme={theme}>
            <CSSReset />
            <Component {...pageProps} />
        </ThemeProvider>
  )
}

export default MyApp
