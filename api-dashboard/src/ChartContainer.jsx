import {BarChart} from '@mui/x-charts/BarChart'
import {PieChart} from '@mui/x-charts/PieChart'

export function BarChartContainer (props) {
    return (
        <div className="box shadow" id={props.id}>
            <div className="chart-heading">{props.title}</div>
            <div className="chart-description">{props.description}</div>
            <BarChart
                xAxis={[
                    {
                        id: 'barCategories',
                        data: ['Post', 'Get', 'Put', 'Delete'],
                        scaleType: 'band', 
                        colorMap: {
                        type: 'ordinal', 
                        colors: ['#ced4da', '#364fc7', '#ced4da', '#ced4da' ]
                        }
                    },
                ]}
                series={[
                    {
                        data: props.data
                    },
                ]}
                borderRadius={10}
                leftAxis={null}
                bottomAxis={{
                    disableTicks: true,
                    disableLine: true
                }}
                width={300}
                height={300}
            />
        </div>
    );
}

export function DonutChartContainer(props) {
    return (
        <div className="box shadow" id={props.id}>
            <div className="chart-heading">{props.title}</div>
            <div className="chart-description">{props.description}</div>
            <PieChart
                series={[
                    {
                    data: props.data,
                    innerRadius: 60, 
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    },
                ]}
                slotProps={{
                    legend: { hidden: true },
                  }}
                width={300}
                height={200}
            >
            </PieChart>
        </div>
    );
}