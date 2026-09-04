/* ECharts React 包装（core 引入，按需重建 option） */
import * as echarts from "echarts";
import ReactEChartsCore from "echarts-for-react/lib/core";

interface ChartProps {
  option: echarts.EChartsOption;
  className?: string;
  style?: React.CSSProperties;
  onEvents?: Record<string, any>;
}

export function Chart({ option, className, style, onEvents }: ChartProps) {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      notMerge={true}
      lazyUpdate={true}
      className={className}
      style={{ width: "100%", height: "100%", ...style }}
      onEvents={onEvents}
    />
  );
}
