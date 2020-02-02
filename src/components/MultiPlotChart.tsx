import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import {IonCard } from '@ionic/react';

// import {
//   Chart,
//   Series,
//   ArgumentAxis,
//   ValueAxis,
//   ZoomAndPan,
//   Legend,
//   Tooltip,
// } from 'devextreme-react/chart';
import { withTranslation, WithTranslation } from 'react-i18next';


type Props = typeof mapDispatchToProps & ReturnType<typeof mapStateToProps> & {
  height: any;
  width: any;
  signals: any;
};

export function modifySignalData(signals: any) {
  var series = [];
  var xkey: string;
  var ykey: string;
  for (var i = 0; i < signals.length; i++) {
    for (var j = 0; j < signals[i].x.length; j++) {
      xkey = 'x' + i;
      ykey = 'y' + i;
      series.push({ [xkey]: new Date(signals[i].x[j] * 1000), [ykey]: signals[i].y[j] });
    }
  }
  return series;
}

const MultiPlotChart: FunctionComponent<Props & WithTranslation> = ({ height, width, signals, t }) => {
    var signalidxs = Array.from(Array(signals.length).keys())
    var data = modifySignalData(signals)
    return (
      <>
      <IonCard>
        {/* <Chart dataSource={data} width='100%' height='100%'>
          <ArgumentAxis grid={{ opacity: 0.2, visible: true }} title={{ text: t("Time") }} />
          <ValueAxis grid={{ opacity: 0.2, visible: true }} />
          {signalidxs.map((idx: number) =>
            <Series key={idx} valueField={"y" + idx} argumentField={"x" + idx} point={{ visible: false }} name={signals[idx].sname + ' [' + signals[0].unit + ']'} />
          )
          }
          <Legend visible='true' position='outside' horizontalAlignment='center' verticalAlignment='bottom'></Legend>
          <ZoomAndPan
            allowTouchGestures={true}
            allowMouseWheel={true}
            // dragToZoom={true}
            valueAxis='zoom'
            argumentAxis='none'
          />
          <Tooltip
            enabled={true}
          />
        </Chart> */}
        </IonCard>
      </>
    );
}

const mapStateToProps = (state: RootState) => ({
});

const mapDispatchToProps = {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(MultiPlotChart));