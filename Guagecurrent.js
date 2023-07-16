

window.electronAPI.handlecontroller((event, registerValues) => {
    
    newgauge1 = registerValues[1];
    if(guagecurrent){
        updatecurrentChart();
    }
    else{
        createcurrentChart();
    }
    
  });
  var guagecurrent;
var ctxcurrent=document.getElementById('gaugeChartcurrent').getContext('2d');


function createcurrentChart() {
    var datacurrent = {
        datasets: [{ 
            data: [newgauge1, 100-newgauge1],
            backgroundColor: ['#329da8','#d6d4d0'],
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
        const guagecurrenttext={
                  id:'guagecurrenttext',
                  afterDatasetsDraw(chart,args,pluginOptions){
                      const{ctx,data,chartArea:{top,bottom,left,right,width,height},scales:{r}}=chart;
                      ctx.save();
                      const X=chart.getDatasetMeta(0).data[0].x;
                      const Y=chart.getDatasetMeta(0).data[0].y;
                      ctx.font='15px MyCustomFont2';
                      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
            
                      ctx.textBaseLine='bottom';
                      ctx.textAlign='left';
                      ctx.fillText('0',left+24,Y+15);
                      ctx.textAlign='right';
                      ctx.fillText('100',right-15,Y+15);
                      ctx.font='35px MyCustomFont2';
                      ctx.textAlign='center';
                      ctx.textBaseLine='top';
                      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                      const score=data.datasets[0].data[0];
                      ctx.fillText(score,X,Y-5);
                      ctx.font='25px MyCustomFont2';
                      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                      ctx.fillText('Current',X,Y-55);
            
              }
              }
              guagecurrent=new Chart(ctxcurrent, {
                  type: 'doughnut',
                  data: datacurrent,
                  options: currentoptions,
                  plugins:[guagecurrenttext]
              });


}

function updatecurrentChart() {
    guagecurrent.data.datasets[0].data = [newgauge1, 100 - newgauge1];
    guagecurrent.update();
  }



