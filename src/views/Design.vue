<template>
    <div class="container">
        <div class="header-title">参数调优</div>

        <div class="content_container">

            <div class="center_content_container" style="width: 80%">

                <div style="display: flex; flex-direction: row">
                    <div class="content_item_container" style="width: 20%; margin-right: 2%">
                        <div class="content_item_title_container">选择负载</div>
                        <div class="select_container" style="width: 100%">
                            <div class="select_title">负载:</div>
                            <el-select
                                    style="min-width: 120px; width: 60%"
                                    clearable
                                    filterable
                                    placeholder="请选择负载"
                                    v-model="queriesSelectCondition"
                            >
                                <el-option
                                        v-for="item in queriesSelects"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                        </div>
                        <div class="select_container" style="width: 100%">
                            <div class="select_title">数据集:</div>
                            <el-select
                                    style="min-width: 120px; width: 60%"
                                    clearable
                                    filterable
                                    placeholder="请选择数据集"
                                    v-model="dataSelectCondition"
                            >
                                <el-option
                                        v-for="item in dataSelects"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                        </div>
                    </div>


                    <div class="content_item_container" style="width: 76%; min-width: 400px; margin-right: 2%">
                        <div class="content_item_title_container">分片示意</div>
                        <div class="table_container">
                            <el-table :data="keyParameter" border header-align="center" style="min-width: 400px">
                                <el-table-column prop="key" label="关键运行参数" align="center">
                                </el-table-column>
                                <el-table-column prop="before" label="优化前的值" align="center">
                                </el-table-column>
                                <el-table-column prop="after" label="优化后的值" align="center">
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="table_btns_container">
                            <div class="table_btns_item_container">
                                <el-button type="primary" @click="parameterOptimization()">参数优化</el-button>
                            </div>
                            <div class="table_btns_item_container">
                                <el-button type="primary">提交修改</el-button>
                            </div>
                            <div class="table_btns_item_container">
                                <el-button type="primary" @click="resetParameterOptimization()">恢复默认</el-button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="content_item_container" style="margin-top: 30px; width: 98%">
                    <div class="content_item_title_container">调参报告</div>
                    <div class="table_container">
                        <el-table :data="reportData" border style="width: 100%" header-align="center">
                            <el-table-column prop="training_time" label="训练时间" min-width="120" align="center">
                            </el-table-column>
                            <el-table-column prop="throughput" label="吞吐量" min-width="120" align="center">
                            </el-table-column>
                            <el-table-column prop="adapt_time" label="延迟" min-width="120" align="center">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>

            <div class="content_item_container" style="height: 100%; width: 20%; min-width: 200px">
                <div class="content_item_title_container">效果监控</div>
                <div class="chart_container">
                    <div class="chart_title">吞吐量</div>
                    <div id="ioThroughputChart" style="width:90%; height:200px"></div>
                </div>
                <div class="chart_container" style="margin-top: 30px; margin-bottom: 30px">
                    <div class="chart_title">延迟表</div>
                    <div id="delayChart" style="width:90%; height:200px"></div>
                </div>
            </div>

        </div>

    </div>
</template>

<script>

  import echarts from "echarts";
  import moment from "moment";

  var xAxisData = [];
  var delayBeforeData = [];
  var delayDoneData = [];

  var ioThroughputBeforeData = [];
  var ioThroughputDoneData = [];

  const timeSpace = 4000;

  export default {
    name: "Design",
    data() {
      return {
        changeCount: 0,
        ioThroughputRandom: 15,
        delayRandom: 15,
        dbSelecteds: [
          {label: "数据库实例1 | DNMind_testing | id:23i", value: "0"}
        ],
        queriesSelectCondition: undefined,
        dataSelectCondition: undefined,
        queriesSelects: [
          {label: "当前负载", value: "0"},
          {label: "TPC-H", value: "1"},
          {label: "TPC-C", value: "2"},
          {label: "JOB", value: "3"}
        ],
        dataSelects: [
          {label: "当前数据集", value: "0"},
          {label: "TPC-H", value: "1"},
          {label: "TPC-C", value: "2"},
          {label: "JOB", value: "3"}
        ],
        keyParameter: [
          {key: "work_mem", before: "", after: ""},
          {key: "commit_delay", before: "", after: ""},
          {key: "deadlock_timeout", before: "", after: ""},
          {key: "lock_timeout", before: "", after: ""},
          {key: "join_collapse_limit", before: "", after: ""},
          {key: "max connections", before: "", after: ""}
        ],
        reportData: [],
        ioThroughputChart: undefined,
        delayChart: undefined,
        delayOption: {
          title: {show: false},
          color:["#999999", "#409EFF"],
          legend: {
            icon: 'roundRect',
            show:true,
            data:['预测表现', '实际表现']
          },
          grid: {
            top: 50,
            bottom: 50
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
                color: '#999999',
                width: 2
              },
              nameTextStyle: {
                color: "#666666",
              },
              name: '预测表现',
              data: delayBeforeData,
              type: "line",
              smooth: true,
              showSymbol: false,
              hoverAnimation: true,
            }, {
              lineStyle: {
                color: '#409EFF',
                width: 2
              },
              nameTextStyle: {
                color: "red",
              },
              label: {
                color: "auto"
              },
              name: '实际表现',
              data: delayDoneData,
              type: "line",
              smooth: true,
              showSymbol: false,
              hoverAnimation: true,
            }

          ]
        },
        ioThroughputOption: {
          title: {show: false},
          color:["#999999", "#409EFF"],
          legend: {
            icon: 'roundRect',
            show:true,
            data:['预测表现', '实际表现']
          },
          grid: {
            top: 50,
            bottom: 50
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
                color: '#999999',
                width: 2
              },
              nameTextStyle: {
                color: "#666666",
              },
              name: '预测表现',
              data: ioThroughputBeforeData,
              type: "line",
              smooth: true,
              showSymbol: false,
              hoverAnimation: true,
            }, {
              lineStyle: {
                color: '#409EFF',
                width: 2
              },
              nameTextStyle: {
                color: "red",
              },
              label: {
                color: "auto"
              },
              name: '实际表现',
              data: ioThroughputDoneData,
              type: "line",
              smooth: true,
              showSymbol: false,
              hoverAnimation: true,
            }

          ]
        }
      };
    },
    mounted() {
      this.drawLine();
      let that = this;
      that.random();
      setInterval(function () {
        that.random();
      }, timeSpace);
    },
    methods: {
      random() {
        this.changeCount += 1;
        if(this.changeCount >= 30) {
          xAxisData.shift(0);
          delayBeforeData.shift(0);
          delayDoneData.shift(0);
          ioThroughputBeforeData.shift(0);
          ioThroughputDoneData.shift(0);
        }

        xAxisData.push(moment().add(timeSpace, 'ms').format('HH:mm:ss'));

        let delayBefor = Math.floor((Math.random() * this.delayRandom) + 5);
        let delayDone = delayBefor - Math.floor((Math.random() * 5) + 1);
        delayBeforeData.push(delayBefor);
        delayDoneData.push(delayDone);

        this.delayChart.setOption(this.delayOption);

        let ioThroughputBefor = Math.floor((Math.random() * this.ioThroughputRandom) + 5);
        let ioThroughputDone = ioThroughputBefor + Math.floor((Math.random() * 5) + 1);
        ioThroughputBeforeData.push(ioThroughputBefor);
        ioThroughputDoneData.push(ioThroughputDone);
        this.ioThroughputChart.setOption(this.ioThroughputOption);
      },
      drawLine() {
        this.ioThroughputChart = echarts.init(document.getElementById("ioThroughputChart"));
        this.ioThroughputChart.setOption(this.ioThroughputOption);
        this.delayChart = echarts.init(document.getElementById("delayChart"));
        this.delayChart.setOption(this.delayOption);
      },
      parameterOptimization() {
        const loading = this.$loading({
          lock: true,
          text: '优化中，请等待.',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        setTimeout(() => {
          loading.close();
          this.delayRandom = 5;
          this.ioThroughputRandom = 30;
          this.keyParameter = [
            {key: "work_mem", before: "4096KB", after: "6GB"},
            {key: "commit_delay", before: "0", after: "10"},
            {key: "deadlock_timeout", before: "1000", after: "10"},
            {key: "lock_timeout", before: "0", after: "1min"},
            {key: "join_collapse_limit", before: "8", after: "1000"},
            {key: "max connections", before: "8", after: "1000"}
          ];
          this.reportData.push({adapt_time: "na/-91.1%", throughput: "+72.60%/-9.39%", training_time: "2秒"});
        }, 2000);
      },
      resetParameterOptimization() {
        this.delayRandom = 15;
        this.ioThroughputRandom = 15;
        this.reportData = [];
        this.keyParameter = [
          {key: "work_mem", before: "", after: ""},
          {key: "commit_delay", before: "", after: ""},
          {key: "deadlock_timeout", before: "", after: ""},
          {key: "lock_timeout", before: "", after: ""},
          {key: "join_collapse_limit", before: "", after: ""},
          {key: "max connections", before: "", after: ""}
        ];
      }
    }
  };
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
    }

    .header-title {
        font-size: 30px;
        color: #333333;
    }

    .content_container {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        align-content: space-between;
    }

    .content_item_container {
        display: flex;
        flex-direction: column;
        border-radius: 2px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08);
    }

    .content_item_title_container {
        background: #409EFF;
        font-size: 16px;
        color: #FFFFFF;
        padding: 10px;
    }

    .select_container {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 40px;
        margin-right: 40px;
        align-content: space-between;
    }

    .select_title {
        font-size: 14px;
        color: #666666;
        width: 50px;
        min-width: 50px;
        text-align: center;
        margin-right: 10px;
    }

    .center_content_container {
        display: flex;
        flex-direction: column;
    }

    .table_container {
        padding: 20px;
    }

    .table_btns_container {
        display: flex;
        flex-direction: row;
        align-content: space-around;
        height: 40px;
        line-height: 40px;
        margin: 0 auto 20px auto;
        width: 100%;
    }

    .table_btns_item_container {
        flex: 0 0 33.333%;
        display: flex;
        justify-content: center;
    }

    .chart_title {
        width: 100%;
        height: 60px;
        font-size: 16px;
        font-weight: bold;
        color: #666666;
        text-align: center;
        line-height: 60px;
    }

    .chart_container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }
</style>
