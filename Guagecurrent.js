

window.electronAPI.handlecontroller((event, registerValues) => {
    
  newgauge1 = registerValues[1];
  if(gaugecurrent){
      updatecurrentChart();
  }
  else{
      createcurrentChart();
  }
  
});
  
var gaugecurrent;
var ctxcurrent=document.getElementById('gaugeChartcurrent').getContext('2d');
createcurrentChart();

function createcurrentChart() {
    var datacurrent = {
        datasets: [{ 
            data: [0, 100-0],
            backgroundColor: ['#33FF57','#d6d4d0'],
            borderWidth: 0
        }]
    };
    var currentoptions = {
        aspectRatio: 1.5,
        rotation: 270,
        circumference: 180,
        responsive: true,
        maintainAspectRatio: false,  //Add this line to make the chart responsive
        borderWidth: 1,
        cutout: '85%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        layout: {
          padding: {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20,
          },
        },
        };
        const gaugecurrenttext={
                  id:'gaugecurrenttext',
                  afterDatasetsDraw(chart,args,pluginOptions){
                      const{ctx,data,chartArea:{top,bottom,left,right,width,height},scales:{r}}=chart;
                      ctx.save();
                      const X=chart.getDatasetMeta(0).data[0].x;
                      const Y=chart.getDatasetMeta(0).data[0].y;
                      
                      ctx.font='15px MyCustomFont2';
                      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                      ctx.textBaseLine='bottom';
                      ctx.textAlign='left';
                      ctx.fillText('-1000',left+0.05*width,Y+15);
                      ctx.textAlign='right';
                      ctx.fillText('1000',right-0.07*width,Y+15);

                      ctx.font='35px MyCustomFont2';
                      ctx.textAlign='center';
                      ctx.textBaseLine='top';
                      const score=data.datasets[0].data[0];
                      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                      ctx.fillText(score,X,Y-0.3*height);


                      ctx.font='20px MyCustomFont2';
                      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                      ctx.fillText('Var 2',X,Y)
                      ctx.textAlign='center';
            
              }
              }
              gaugecurrent=new Chart(ctxcurrent, {
                  type: 'doughnut',
                  data: datacurrent,
                  options: currentoptions,
                  plugins:[gaugecurrenttext]
              });


}

function updatecurrentChart() {
    gaugecurrent.data.datasets[0].data = [newgauge1, 100 - newgauge1];
    gaugecurrent.update();
  }



//make changes