import Floater from "react-floater";
import React from 'react';
import { Theme } from '../store/connections/types'

type FloaterProps = {
    text: string | JSX.Element;
    title: string | JSX.Element;
    item: JSX.Element;
    theme: Theme
}

class DescriptionFloater extends React.PureComponent<FloaterProps> {
    selectStyle() {
        var initStyle = {
            // wrapper: {
            //   cursor: 'help',
            //   display: 'inline-flex',
            //   flexDirection: 'column',
            //   zIndex: options.zIndex,
            // },
            // wrapperPosition: {
            //   left: -1000,
            //   position: 'absolute',
            //   top: -1000,
            //   visibility: 'hidden',
            // },
            floater: {
              display: 'inline-block',
              filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))',
              maxWidth: "100%",
              opacity: 0,
            //   position: 'relative',
              transition: 'opacity 0.3s',
            //   visibility: 'hidden',
            //   zIndex: options.zIndex,
            },
            // floaterOpening: {
            //   opacity: 1,
            //   visibility: 'visible',
            // },
            // floaterWithAnimation: {
            //   opacity: 1,
            //   transition: 'opacity 0.3s, transform 0.2s',
            //   visibility: 'visible',
            // },
            // floaterWithComponent: {
            //   maxWidth: '100%',
            // },
            // floaterClosing: {
            //   opacity: 0,
            //   visibility: 'visible',
            // },
            // floaterCentered: {
            //   left: '50%',
            //   position: 'fixed',
            //   top: '50%',
            //   transform: 'translate(-50%, -50%)',
            // },
            container: {
                backgroundColor: '#fff',
                color: '#666',
                minHeight: 60,
                minWidth: '100%',
                width: '100%',
                padding: 20,
                //   position: 'relative',
                //   zIndex: 10,
                border: '1px solid #fff'
            },
            title: {
                borderBottom: '1px solid #555',
                color: '#555',
                fontSize: 18,
                marginBottom: 5,
                paddingBottom: 6,
                paddingRight: 18,
            },
            content: {
                fontSize: 15,
            },
            // close: {
            //   backgroundColor: 'transparent',
            //   border: 0,
            //   borderRadius: 0,
            //   color: '#555',
            //   fontSize: 0,
            //   height: 15,
            //   outline: 'none',
            //   padding: 10,
            //   position: 'absolute',
            //   right: 0,
            //   top: 0,
            //   width: 15,
            //   WebkitAppearance: 'none',
            // },
            footer: {
                borderTop: '1px solid #ccc',
                fontSize: 13,
                marginTop: 10,
                paddingTop: 5,
            },
            arrow: {
                color: '#fff',
                display: 'inline-flex',
                length: 16,
                margin: 8,
                //   position: 'absolute',
                spread: 32,
            },
        };
        if (['dark-theme', 'blackwhite-theme', 'oled-theme'].indexOf(this.props.theme) !== -1) {
            const textcolor= '#fff'
            // console.log('Changing to dark')
            const backgroundColor= '#000'
            initStyle.container.backgroundColor= backgroundColor
            initStyle.container.color = textcolor
            initStyle.title.borderBottom = '1px solid #bbb'
            initStyle.footer.borderTop = '1px solid #bbb'
            initStyle.title.color = textcolor
            initStyle.arrow.color = backgroundColor

        }

        return initStyle
    }

    render() {
        const style = this.selectStyle()
        return (
            <Floater
                // callback={}
                title={this.props.title}
                content={this.props.text}
                event="hover"
                placement="top"
                eventDelay={.4}
                showCloseButton={true}
                autoOpen={false}
                styles={style}
            >
                {this.props.item}
            </Floater>
        )
    }
}

export default DescriptionFloater