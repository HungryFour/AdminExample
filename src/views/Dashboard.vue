<template>
    <div class="container">
        <el-form ref="form" :inline="true" label-position="left" size="mini">
            <el-form-item label="Database Instance:">
                <el-select
                        style="min-width: 260px"
                        clearable
                        filterable
                        placeholder="请选择"
                        v-model="dbSelectCondition"
                >
                    <el-option
                            v-for="item in dbSelecteds"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="日期选择:">
                <el-date-picker
                        style="width: 160px"
                        v-model="dateSelectCondition"
                        type="date"
                        placeholder="选择日期"
                >
                </el-date-picker>
            </el-form-item>

            <el-form-item label="Analyze Type:">
                <el-select
                        style="min-width: 160px"
                        clearable
                        filterable
                        placeholder="请选择"
                        v-model="analyzeTypeSelectCondition"
                >
                    <el-option
                            v-for="item in analyzeTypeSelects"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary">触发异常</el-button>
                <el-button type="primary">Confirm</el-button>
            </el-form-item>
        </el-form>
        <div class="main_data_container">

            <div class="main_data_item_container">
                <div class="main_data_item_title">CPU Usage Rate</div>
                <div id="cpuChart" :style="{ width: '80%', height: '300px', left: '10%' }"></div>
            </div>

            <div class="main_data_item_container">
                <div class="main_data_item_title">Network Speed</div>

                <div class="main_data_item_chart_container">
                    <div class="main_data_item_chart_title">upload</div>
                    <div id="networkSpeedUploadChart" :style="{ width: '80%', height: '80px' }"></div>
                </div>

                <div class="main_data_item_chart_container" style="margin-top: 10px">
                    <div class="main_data_item_chart_title">download</div>
                    <div id="networkSpeedDownloadChart" :style="{ width: '80%', height: '80px'}"></div>
                </div>
            </div>

            <div class="main_data_item_container">
                <div class="main_data_item_title">I/O Throughput</div>

                <div class="main_data_item_chart_container">
                    <div class="main_data_item_chart_title">input</div>
                    <div id="ioThroughputInputChart" :style="{ width: '80%', height: '80px' }"></div>
                </div>

                <div class="main_data_item_chart_container" style="margin-top: 10px">
                    <div class="main_data_item_chart_title">output</div>
                    <div id="ioThroughputOutputChart" :style="{ width: '80%', height: '80px'}"></div>
                </div>

            </div>

            <div class="main_data_item_container">
                <div class="main_data_item_title">Disk Usage Rate</div>
                <div id="diskChart" :style="{ width: '80%', height: '300px', left: '10%'}"></div>
            </div>
        </div>
    </div>
</template>

<script>
  import echarts from "echarts";
  import moment from "moment";
  var xAxisData = [];
  const timeSpace = 2000;
  var networkUploadSpeedData = [];
  var networkDownloadSpeedData = [];
  var ioThroughputInData = [];
  var ioThroughputOutData = [];

  export default {
    data() {
      return {
        dbSelecteds: [
          {label: "数据库实例1 | DNMind_testing | id:23i", value: "0"}
        ],
        analyzeTypeSelects: [
          {label: "I/O资源抢占", value: "0"},
          {label: "CPU资源抢占", value: "1"},
          {label: "数据库备份", value: "2"},
          {label: "数据表导入", value: "3"},
          {label: "错误的物理设计", value: "4"},
          {label: "网络阻塞", value: "5"},
          {label: "VACUUM ANALYZE", value: "6"}
        ],
        changeCount: 0,
        changeRandom: 5,
        analyzeTypeSelectCondition: "0",
        dbSelectCondition: "0",
        dateSelectCondition: "",
        cpuChart: undefined,
        diskChart: undefined,
        networkSpeedUploadChart: undefined,
        networkSpeedDownloadChart: undefined,
        ioThroughputInputChart: undefined,
        ioThroughputOutputChart: undefined,
        cpuOption: {
          title: {show: false},
          tooltip: {},
          series: [
            {
              name: "",
              type: "gauge",
              min: 0,
              max: 100,
              splitNumber: 10,
              radius: "100%",
              axisLine: {
                // 坐标轴线
                lineStyle: {
                  // 属性lineStyle控制线条样式
                  color: [
                    [0.8, "#67C23A"],
                    [0.9, "#FF8C00"],
                    [1, "#FF0000"]
                  ],
                  width: 2,
                  shadowColor: "#fff", //默认透明
                  shadowBlur: 50
                }
              },
              axisLabel: {
                // 坐标轴小标记
                fontWeight: "400",
                color: "auto",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              },
              axisTick: {
                // 坐标轴小标记
                length: 10, // 属性length控制线长
                lineStyle: {
                  // 属性lineStyle控制线条样式
                  color: "auto",
                  shadowColor: "#fff", //默认透明
                  shadowBlur: 10
                }
              },
              splitLine: {
                // 分隔线
                length: 14, // 属性length控制线长
                lineStyle: {
                  // 属性lineStyle（详见lineStyle）控制线条样式
                  width: 3,
                  color: "auto",
                  shadowColor: "#fff", //默认透明
                  shadowBlur: 10
                }
              },
              pointer: {
                // 分隔线
                width: 2,
                length: "90%",
                color: "auto",
                radius: 10,
                shadowColor: "#409EFF", //默认透明
                shadowBlur: 50
              },
              detail: {
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 5,
                offsetCenter: [0, "50%"], // x, y，单位px
                textStyle: {
                  // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  fontWeight: "600",
                  color: "auto",
                  fontSize: 36
                }
              },
              data: [{value: 0, name: ""}]
            }
          ]
        },
        diskOption: {
          title: {show: false},
          tooltip: {},
          series: [
            {
              name: "",
              type: "gauge",
              min: 0,
              max: 100,
              splitNumber: 10,
              radius: "100%",
              axisLine: {
                // 坐标轴线
                lineStyle: {
                  // 属性lineStyle控制线条样式
                  color: [
                    [0.8, "#67C23A"],
                    [0.9, "#FF8C00"],
                    [1, "#FF0000"]
                  ],
                  width: 2,
                  shadowColor: "#fff", //默认透明
                  shadowBlur: 50
                }
              },
              axisLabel: {
                // 坐标轴小标记
                fontWeight: "400",
                color: "auto",
                shadowColor: "#fff", //默认透明
                shadowBlur: 10
              },
              axisTick: {
                // 坐标轴小标记
                length: 10, // 属性length控制线长
                lineStyle: {
                  // 属性lineStyle控制线条样式
                  color: "auto",
                  shadowColor: "#fff", //默认透明
                  shadowBlur: 10
                }
              },
              splitLine: {
                // 分隔线
                length: 14, // 属性length控制线长
                lineStyle: {
                  // 属性lineStyle（详见lineStyle）控制线条样式
                  width: 3,
                  color: "auto",
                  shadowColor: "#fff", //默认透明
                  shadowBlur: 10
                }
              },
              pointer: {
                // 分隔线
                width: 2,
                length: "90%",
                color: "auto",
                radius: 10,
                shadowColor: "#409EFF", //默认透明
                shadowBlur: 50
              },
              detail: {
                backgroundColor: "#fff",
                borderWidth: 1,
                borderColor: "#fff",
                shadowColor: "#fff", //默认透明
                shadowBlur: 5,
                offsetCenter: [0, "50%"], // x, y，单位px
                textStyle: {
                  // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                  fontWeight: "600",
                  color: "auto",
                  fontSize: 36
                }
              },
              data: [{value: 0, name: ""}]
            }
          ]
        },
        networkUploadSpeedOption: {
          title: {show: false},
          grid: {
            top: 5,
            bottom: 20
          },
          xAxis: {
            type: "category",
            nameTextStyle: {
              color: "#666666",
            },
            axisLabel: {
              show: true,
              length: 2,
              color: "#999999",
              shadowColor: "#fff", //默认透明
              shadowBlur: 0
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 0.5,
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 10
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              // 坐标轴小标记
              show: false,
              length: 2,
              lineStyle: {
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 1
              }
            },
            data: xAxisData
          },
          yAxis: {
            type: "value",
            nameTextStyle: {
              color: "#666666",
            },
            axisLabel: {
              show: true,
              length: 2,
              color: "#999999",
              shadowColor: "#fff", //默认透明
              shadowBlur: 10
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 0.5,
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 1
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              // 坐标轴小标记
              show: false,
              length: 2,
              fontWeight: "200",
              lineStyle: {
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 1
              }
            },
          },
          series: [
            {
              lineStyle: {
                color: '#67C23A',
                width: 2
              },
              nameTextStyle: {
                color: "#666666",
              },
              name: '',
              data: networkUploadSpeedData,
              type: "line",
              smooth: true,
              showSymbol: false,
              hoverAnimation: true,
            }
          ]
        },
        networkDownloadSpeedOption: {
          title: {show: false},
          grid: {
            top: 5,
            bottom: 20
          },
          xAxis: {
            type: "category",
            nameTextStyle: {
              color: "#666666",
            },
            axisLabel: {
              show: true,
              length: 2,
              color: "#999999",
              shadowColor: "#fff", //默认透明
              shadowBlur: 0
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 0.5,
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 10
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              // 坐标轴小标记
              show: false,
              length: 2,
              lineStyle: {
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 1
              }
            },
            data: xAxisData
          },
          yAxis: {
            type: "value",
            nameTextStyle: {
              color: "#666666",
            },
            axisLabel: {
              show: true,
              length: 2,
              color: "#999999",
              shadowColor: "#fff", //默认透明
              shadowBlur: 10
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 0.5,
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 1
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              // 坐标轴小标记
              show: false,
              length: 2,
              fontWeight: "200",
              lineStyle: {
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 1
              }
            },
          },
          series: [
            {
              lineStyle: {
                color: '#67C23A',
                width: 2
              },
              nameTextStyle: {
                color: "#666666",
              },
              name: '',
              data: networkDownloadSpeedData,
              type: "line",
              smooth: true,
              showSymbol: false,
              hoverAnimation: true,
            }
          ]
        },
        ioThroughputInOption: {
          title: {show: false},
          grid: {
            top: 5,
            bottom: 20
          },
          xAxis: {
            type: "category",
            nameTextStyle: {
              color: "#666666",
            },
            axisLabel: {
              show: true,
              length: 2,
              color: "#999999",
              shadowColor: "#fff", //默认透明
              shadowBlur: 0
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 0.5,
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 10
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              // 坐标轴小标记
              show: false,
              length: 2,
              lineStyle: {
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 1
              }
            },
            data: xAxisData
          },
          yAxis: {
            type: "value",
            nameTextStyle: {
              color: "#666666",
            },
            axisLabel: {
              show: true,
              length: 2,
              color: "#999999",
              shadowColor: "#fff", //默认透明
              shadowBlur: 10
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 0.5,
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 1
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              // 坐标轴小标记
              show: false,
              length: 2,
              fontWeight: "200",
              lineStyle: {
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 1
              }
            },
          },
          series: [
            {
              lineStyle: {
                color: '#67C23A',
                width: 2
              },
              nameTextStyle: {
                color: "#666666",
              },
              name: '',
              data: ioThroughputInData,
              type: "line",
              smooth: true,
              showSymbol: false,
              hoverAnimation: true,
            }
          ]
        },
        ioThroughputOutOption: {
          title: {show: false},
          grid: {
            top: 5,
            bottom: 20
          },
          xAxis: {
            type: "category",
            nameTextStyle: {
              color: "#666666",
            },
            axisLabel: {
              show: true,
              length: 2,
              color: "#999999",
              shadowColor: "#fff", //默认透明
              shadowBlur: 0
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 0.5,
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 10
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              // 坐标轴小标记
              show: false,
              length: 2,
              lineStyle: {
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 1
              }
            },
            data: xAxisData
          },
          yAxis: {
            type: "value",
            nameTextStyle: {
              color: "#666666",
            },
            axisLabel: {
              show: true,
              length: 2,
              color: "#999999",
              shadowColor: "#fff", //默认透明
              shadowBlur: 10
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 0.5,
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 1
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              // 坐标轴小标记
              show: false,
              length: 2,
              fontWeight: "200",
              lineStyle: {
                color: "#999999",
                shadowColor: "#fff",
                shadowBlur: 1
              }
            },
          },
          series: [
            {
              lineStyle: {
                color: '#67C23A',
                width: 2
              },
              nameTextStyle: {
                color: "#666666",
              },
              name: '',
              data: ioThroughputOutData,
              type: "line",
              smooth: true,
              showSymbol: false,
              hoverAnimation: true,
            }
          ]
        },
      };
    },
    mounted() {
      this.drawLine();
      let that = this;
      setInterval(function () {
        that.cpuOption.series[0].data[0].value =
          (Math.random() * 10).toFixed(2) - 0;
        that.diskOption.series[0].data[0].value =
          (Math.random() * 10).toFixed(2) - 0;
        that.cpuChart.setOption(that.cpuOption);
        that.diskChart.setOption(that.diskOption);
      }, 3000);

      setInterval(function () {
        that.random();
      }, timeSpace);

      window.onresize = function() {
        that.cpuChart.resize();
        that.networkSpeedUploadChart.resize();
        that.networkSpeedDownloadChart.resize();
        that.ioThroughputInputChart.resize();
        that.ioThroughputOutputChart.resize();
        that.diskChart.resize();
      }
    },
    destroyed(){
      window.onresize = null;
    },

    methods: {
      random() {
        this.changeCount += 1;
        if(this.changeCount >= 30) {
          xAxisData.shift(0);
          networkUploadSpeedData.shift(0);
          networkDownloadSpeedData.shift(0);
          ioThroughputInData.shift(0);
          ioThroughputOutData.shift(0);
        }

        xAxisData.push(moment().add(timeSpace, 'ms').format('HH:mm:ss'));
        networkUploadSpeedData.push(Math.floor((Math.random() * this.changeRandom) + 5));
        networkDownloadSpeedData.push(Math.floor((Math.random() * this.changeRandom) + 5));
        ioThroughputInData.push(Math.floor((Math.random() * this.changeRandom) + 5));
        ioThroughputOutData.push(Math.floor((Math.random() * this.changeRandom) + 5));

        this.networkSpeedUploadChart.setOption(this.networkUploadSpeedOption);
        this.networkSpeedDownloadChart.setOption(this.networkDownloadSpeedOption);
        this.ioThroughputInputChart.setOption(this.ioThroughputInOption);
        this.ioThroughputOutputChart.setOption(this.ioThroughputOutOption);
      },
      drawLine() {
        this.cpuChart = echarts.init(document.getElementById("cpuChart"));
        this.cpuChart.setOption(this.cpuOption);

        this.networkSpeedUploadChart = echarts.init(document.getElementById("networkSpeedUploadChart"));
        this.networkSpeedUploadChart.setOption(this.networkUploadSpeedOption);

        this.networkSpeedDownloadChart = echarts.init(document.getElementById("networkSpeedDownloadChart"));
        this.networkSpeedDownloadChart.setOption(this.networkDownloadSpeedOption);

        this.ioThroughputInputChart = echarts.init(document.getElementById("ioThroughputInputChart"));
        this.ioThroughputInputChart.setOption(this.ioThroughputInOption);

        this.ioThroughputOutputChart = echarts.init(document.getElementById("ioThroughputOutputChart"));
        this.ioThroughputOutputChart.setOption(this.ioThroughputOutOption);

        this.diskChart = echarts.init(document.getElementById("diskChart"));
        this.diskChart.setOption(this.diskOption);


      }
    }
  };
</script>

<style lang="scss" scoped>
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .main_data_container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: space-between;
        background: #FFFFFF;
        margin-top: 40px;
        width: 100%;
    }

    .main_data_item_container {
        display: flex;
        justify-content: center;
        width: 20%;
        height: 320px;
        margin-right: 5%;
        flex-direction: column;
        border-radius: 2px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08);
    }

    .main_data_item_title {
        width: 100%;
        height: 60px;
        font-size: 20px;
        font-weight: bold;
        color: #666666;
        text-align: center;
        line-height: 60px;
    }

    .main_data_item_chart_container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .main_data_item_chart_title {
        font-weight: 200;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        color: #888888;
    }

    .os_data_container {
        display: flex;
        flex-direction: column;
        background: #FFFFFF;
        margin-top: 40px;
        width: 100%;
    }

</style>
