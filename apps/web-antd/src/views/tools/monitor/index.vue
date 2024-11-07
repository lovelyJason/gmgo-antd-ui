<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Col, Progress, Row, Tag } from 'ant-design-vue';

import { getServerMonitor } from '#/api/core/monitor';
import Cell from '#/components/Cell/index.vue';

defineOptions({
  name: 'ServerMonitor',
});

const info = ref({
  os: '',
  cpu: { cpuInfo: [] },
  mem: '',
  swap: '',
  net: '',
  disk: {},
});

const getServerInfo = async () => {
  const data = await getServerMonitor();
  info.value = data;
};

onMounted(() => {
  setInterval(() => {
    getServerInfo();
  }, 1000);
});
</script>

<template>
  <Page>
    <Row :gutter="10">
      <Col :md="8" :sm="24">
        <Card>
          <Row class="mb-4">
            <Col :md="8" :sm="24">
              <Tag
                class="flex h-[28px] w-[60px] items-center text-center"
                color="#87d068"
              >
                Runing
              </Tag>
            </Col>
            <Col :md="8" :sm="24"> Aliyun </Col>
          </Row>
          <div class="monitor" style="padding-top: 0">
            <div class="monitor-content">
              <Row :gutter="10">
                <Col :md="12" :sm="24">
                  <Cell :value="info.os.goOs" border label="系统" />
                  <Cell
                    :value="`${info.mem.used}MB/${info.mem.total}MB`"
                    border
                    label="内存"
                  />
                  <Cell
                    :value="`${info.swap.used}/${info.swap.total}`"
                    border
                    label="交换"
                  />
                </Col>
                <Col :md="12" :sm="24">
                  <Cell :value="info.os.time" border label="时间" />
                  <Cell :value="`${info.bootTime}小时`" border label="在线" />
                  <Cell
                    :value="`${info.disk.used}GB/${info.disk.total}GB`"
                    border
                    label="硬盘"
                  />
                </Col>
              </Row>
              <Row :gutter="10" class="flex h-[50px] items-center">
                <Col :md="12" :sm="12" class="line">
                  <Row>
                    <Col :md="8" :sm="8" span="12" xs="12">
                      下载<i class="el-icon-caret-bottom"></i>
                    </Col>
                    <Col :md="16" :sm="16" class="line-value" span="12" xs="12">
                      {{ info.net.in }} KB
                    </Col>
                  </Row>
                </Col>
                <Col :md="12" :sm="12" class="line">
                  <Row border>
                    <Col :md="8" :sm="6" span="12">
                      上传<i class="el-icon-caret-top"></i>
                    </Col>
                    <Col :md="16" :sm="6" class="line-value" span="12">
                      {{ info.net.out }} KB
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div style="border-bottom: 1px solid #e6ebf5"></div>
              <Row :gutter="10" class="monitor-progress">
                <Col :md="4" :sm="24"> CPU </Col>
                <Col :md="20" :sm="24">
                  <Progress
                    :percent="info.cpu.percent"
                    :stroke-color="{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }"
                  />
                </Col>
              </Row>
              <Row :gutter="10" class="monitor-progress">
                <Col :md="4" :sm="24"> RAM </Col>
                <Col :md="20" :sm="24">
                  <Progress
                    :percent="info.mem.percent"
                    :stroke-color="{
                      '0%': '#e6a23c',
                      '100%': '#e6a23c',
                    }"
                  />
                </Col>
              </Row>
              <Row :gutter="10" class="monitor-progress">
                <Col :md="4" :sm="24"> 硬盘 </Col>
                <Col :md="20" :sm="24">
                  <Progress
                    :percent="info.disk.percent"
                    :stroke-color="{
                      '0%': '#e6a23c',
                      '100%': '#e6a23c',
                    }"
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      </Col>
      <Col :md="16" :sm="24">
        <Card>
          <template #title>
            <div class="clearfix">
              <span>服务器信息</span>
            </div>
          </template>
          <div class="monitor">
            <Cell :value="info.os.hostName" border label="主机名称" />
            <Cell :value="info.os.goOs" border label="操作系统" />
            <Cell :value="info.os.ip" border label="服务器IP" />
            <Cell :value="info.os.arch" border label="系统架构" />
            <Cell :value="info.cpu.cpuInfo[0]?.modelName" border label="CPU" />
            <Cell :value="info.os.time" label="当前时间" />
          </div>
        </Card>
      </Col>
    </Row>
  </Page>
</template>

<style scoped lang="scss">
.monitor {
  .monitor-header {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .monitor-progress {
    padding-top: 15px;
  }
}
</style>
